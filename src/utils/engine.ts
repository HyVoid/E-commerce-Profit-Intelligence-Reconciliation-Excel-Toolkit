import {
  EngineDataStore,
  CalculatedOrderProfit,
  CalculatedShippingAudit,
  CalculatedReconciliation,
  ShippingTierType,
  TrustScoreType,
  ReconciliationStatus,
  CurrencyCode,
} from '../types';

/**
 * Point-in-Time FX lookup
 */
export function getPointInTimeFx(
  currency: CurrencyCode,
  orderDate: string,
  store: EngineDataStore
): number {
  if (currency === store.parameters.baseCurrency) {
    return 1.0;
  }
  const key = `${currency}_${store.parameters.baseCurrency}`;
  const match = store.rateHistory.find(
    (r) =>
      r.type === 'FX' &&
      r.key === key &&
      r.startDate <= orderDate &&
      r.endDate >= orderDate
  );

  if (match) {
    return match.rateOrCost;
  }

  // Sensible defaults if unlisted
  switch (currency) {
    case 'USD': return 0.93;
    case 'GBP': return 1.185;
    case 'DKK': return 0.134;
    default: return 1.0;
  }
}

/**
 * Point-in-Time COGS calculation for an order SKU with Bundle unpacking
 */
export function calculateSkuCogsEur(
  sku: string,
  qty: number,
  orderDate: string,
  store: EngineDataStore
): number {
  // Check if sku is a bundle
  const bundleComponents = store.bundleRules.filter((b) => b.bundleSku === sku);

  if (bundleComponents.length > 0) {
    // Unpack bundle components
    let totalBundleCogs = 0;
    for (const comp of bundleComponents) {
      const compCogs = lookupSingleSkuCogs(comp.componentSku, orderDate, store);
      totalBundleCogs += comp.componentQty * qty * compCogs;
    }
    return totalBundleCogs;
  } else {
    // Single SKU
    const singleCogs = lookupSingleSkuCogs(sku, orderDate, store);
    return qty * singleCogs;
  }
}

function lookupSingleSkuCogs(sku: string, orderDate: string, store: EngineDataStore): number {
  const match = store.rateHistory.find(
    (r) =>
      r.type === 'COGS' &&
      r.key === sku &&
      r.startDate <= orderDate &&
      r.endDate >= orderDate
  );

  if (!match) return 0;

  const fx = getPointInTimeFx(match.currency, orderDate, store);
  return match.rateOrCost * fx;
}

/**
 * Calculate 4-Tier Shipping Fallback for an order
 */
export function calculateShippingTier(
  orderId: string,
  orderSkus: string[],
  store: EngineDataStore
): { costEur: number; tier: ShippingTierType; trust: TrustScoreType } {
  const surcharge = 1 + store.parameters.shippingSurcharge;

  // Tier 1: Exact 3PL Invoice
  const invoice3PL = store.invoices3PL.find((inv) => inv.orderId === orderId);
  if (invoice3PL) {
    const cost = (invoice3PL.actualShippingFee || 0) + (invoice3PL.packagingFee || 0);
    return {
      costEur: Number(cost.toFixed(2)),
      tier: 'Tier 1: Exact 3PL',
      trust: 'HIGH (Exact)',
    };
  }

  // Tier 2: Combination Rule
  const combKey = [...orderSkus].sort().join('+');
  const combMatch = store.rateHistory.find(
    (r) => r.type === 'SHIP_RATE' && r.key === combKey
  );

  if (combMatch) {
    const cost = combMatch.rateOrCost * surcharge;
    return {
      costEur: Number(cost.toFixed(2)),
      tier: 'Tier 2: Combination',
      trust: 'MEDIUM (Rule)',
    };
  }

  // Tier 4: Channel Avg Fallback
  const defaultBaseCost = 6.50;
  const cost = defaultBaseCost * surcharge;
  return {
    costEur: Number(cost.toFixed(2)),
    tier: 'Tier 4: Channel Avg',
    trust: 'LOW (Estimate)',
  };
}

/**
 * Calculate Platform Commission
 */
export function calculatePlatformCommission(
  channel: string,
  orderDate: string,
  netRevenueEur: number,
  store: EngineDataStore
): number {
  const match = store.rateHistory.find(
    (r) =>
      r.type === 'PLATFORM_FEE' &&
      r.key === channel &&
      r.startDate <= orderDate &&
      r.endDate >= orderDate
  );

  const rate = match ? match.rateOrCost : 0.15; // default 15%
  return Number((netRevenueEur * rate).toFixed(2));
}

/**
 * Calculate Profit Engine results for all unique orders
 */
export function calculateProfitEngine(
  store: EngineDataStore
): CalculatedOrderProfit[] {
  // Extract unique order IDs
  const uniqueOrderIds = Array.from(new Set(store.orders.map((o) => o.orderId)));

  const results: CalculatedOrderProfit[] = [];

  for (const orderId of uniqueOrderIds) {
    const orderLines = store.orders.filter((o) => o.orderId === orderId);
    if (orderLines.length === 0) continue;

    const headOrder = orderLines[0];
    const orderDate = headOrder.orderDate;
    const channel = headOrder.channel;
    const originalCurrency = headOrder.originalCurrency;

    // Gross Revenue Orig
    const grossRevenueOrig = orderLines.reduce((acc, l) => acc + (l.lineGrossAmount || 0), 0);

    // Point in time FX
    const pointInTimeFx = getPointInTimeFx(originalCurrency, orderDate, store);

    // Gross Revenue EUR
    const grossRevenueEur = grossRevenueOrig * pointInTimeFx;

    // Net Revenue EUR (after VAT)
    const vatRate = store.parameters.defaultVatEuRate;
    const netRevenueEur = grossRevenueEur / (1 + vatRate);

    // PIT COGS EUR
    let pitCogsEur = 0;
    const itemSkus: string[] = [];
    for (const line of orderLines) {
      itemSkus.push(line.lineSku);
      pitCogsEur += calculateSkuCogsEur(line.lineSku, line.lineQty, orderDate, store);
    }

    // Shipping Tier
    const shippingRes = calculateShippingTier(orderId, itemSkus, store);

    // Payment Fee (Actual vs Estimated)
    const payout = store.payouts.find((p) => p.orderId === orderId);
    let actualOrEstPayFeeEur = 0;
    if (payout && payout.actualPaymentFee >= 0) {
      actualOrEstPayFeeEur = payout.actualPaymentFee;
    } else {
      actualOrEstPayFeeEur =
        netRevenueEur * store.parameters.defaultPaymentRate + store.parameters.defaultPaymentFlat;
    }

    // Platform Commission
    const platformCommissionEur = calculatePlatformCommission(channel, orderDate, netRevenueEur, store);

    // Cross-period Refund Loss
    const refundsForOrder = store.refunds.filter((r) => r.originalOrderId === orderId);
    const refundLossOrig = refundsForOrder.reduce((acc, r) => acc + (r.refundAmountGross || 0), 0);
    const refundLossEur = refundLossOrig * pointInTimeFx;

    // Final Order Net Profit EUR
    const orderNetProfitEur =
      netRevenueEur -
      pitCogsEur -
      shippingRes.costEur -
      actualOrEstPayFeeEur -
      platformCommissionEur -
      refundLossEur;

    const netMarginPct = netRevenueEur > 0 ? orderNetProfitEur / netRevenueEur : 0;

    results.push({
      orderId,
      orderDate,
      channel,
      originalCurrency,
      grossRevenueOrig: Number(grossRevenueOrig.toFixed(2)),
      pointInTimeFx: Number(pointInTimeFx.toFixed(4)),
      grossRevenueEur: Number(grossRevenueEur.toFixed(2)),
      vatRate,
      netRevenueEur: Number(netRevenueEur.toFixed(2)),
      pitCogsEur: Number(pitCogsEur.toFixed(2)),
      allocatedShippingEur: Number(shippingRes.costEur.toFixed(2)),
      shippingTierUsed: shippingRes.tier,
      dataTrustScore: shippingRes.trust,
      actualOrEstPayFeeEur: Number(actualOrEstPayFeeEur.toFixed(2)),
      platformCommissionEur: Number(platformCommissionEur.toFixed(2)),
      refundLossEur: Number(refundLossEur.toFixed(2)),
      orderNetProfitEur: Number(orderNetProfitEur.toFixed(2)),
      netMarginPct: Number(netMarginPct.toFixed(4)),
      itemSkus,
    });
  }

  // Sort descending by order date
  return results.sort((a, b) => b.orderDate.localeCompare(a.orderDate));
}

/**
 * Calculate AUD Shipping Tier audit sheet
 */
export function calculateShippingAudits(
  store: EngineDataStore,
  profitResults: CalculatedOrderProfit[]
): CalculatedShippingAudit[] {
  return profitResults.map((p) => {
    return {
      orderId: p.orderId,
      channel: p.channel,
      itemSkus: p.itemSkus.join(', '),
      shippingTierUsed: p.shippingTierUsed,
      finalShippingCostEur: p.allocatedShippingEur,
      dataTrustScore: p.dataTrustScore,
      auditNotes:
        p.shippingTierUsed === 'Tier 1: Exact 3PL'
          ? 'Matched with 3PL invoice'
          : p.shippingTierUsed === 'Tier 2: Combination'
          ? 'Combination rule applied'
          : 'Channel fallback average',
    };
  });
}

/**
 * Calculate REC Reconciliation sheet
 */
export function calculateReconciliation(
  store: EngineDataStore,
  profitResults: CalculatedOrderProfit[]
): CalculatedReconciliation[] {
  const { recToleranceAmt, recTolerancePct } = store.parameters;

  return profitResults.map((p) => {
    const payout = store.payouts.find((pay) => pay.orderId === p.orderId);
    const orderGrossEur = p.grossRevenueEur;
    const payoutNetEur = payout ? payout.netPayoutAmount : 0;
    const paymentDiffEur = Number((orderGrossEur - payoutNetEur).toFixed(2));

    const absDiff = Math.abs(paymentDiffEur);
    const relDiff = orderGrossEur > 0 ? absDiff / orderGrossEur : 0;

    const isDiscrepancy = payout
      ? absDiff > recToleranceAmt || relDiff > recTolerancePct
      : true;

    const statusFlag: ReconciliationStatus = isDiscrepancy ? 'DISCREPANCY' : 'MATCHED';

    return {
      orderId: p.orderId,
      orderDate: p.orderDate,
      channel: p.channel,
      orderGrossEur,
      payoutNetEur,
      paymentDiffEur,
      recStatusFlag: statusFlag,
      hasActualPayout: !!payout,
      notes: !payout
        ? 'Unsettled: Missing Payout Statement'
        : statusFlag === 'DISCREPANCY'
        ? `Variance €${paymentDiffEur.toFixed(2)} exceeds tolerance`
        : 'Reconciled within tolerance',
    };
  });
}
