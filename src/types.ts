/**
 * Core Data Models for E-commerce Profit & Reconciliation Engine
 */

export type ChannelType = 'Shopify' | 'Amazon' | 'bol.com' | 'TikTok Shop' | 'eBay';

export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'DKK';

// 1. SYS_Parameters
export interface SystemParameters {
  baseCurrency: CurrencyCode;          // PAR_BASE_CURRENCY (e.g., 'EUR')
  defaultVatEuRate: number;            // PAR_DEFAULT_VAT_EU (e.g., 0.21)
  defaultPaymentRate: number;          // PAR_DEFAULT_PAYMENT_RATE (e.g., 0.019)
  defaultPaymentFlat: number;          // PAR_DEFAULT_PAYMENT_FLAT (e.g., 0.30 EUR)
  recToleranceAmt: number;             // PAR_REC_TOLERANCE_AMT (e.g., 2.00 EUR)
  recTolerancePct: number;             // PAR_REC_TOLERANCE_PCT (e.g., 0.02 = 2.0%)
  shippingSurcharge: number;           // PAR_SHIPPING_SURCHARGE (e.g., 0.05 = 5.0%)
}

// 2. SYS_Rate_History
export type RateType = 'COGS' | 'FX' | 'SHIP_RATE' | 'PLATFORM_FEE';

export interface RateHistoryItem {
  id: string;
  type: RateType;
  key: string;                         // SKU name, Currency pair 'USD_EUR', Channel name, or Zone key
  startDate: string;                   // YYYY-MM-DD
  endDate: string;                     // YYYY-MM-DD
  rateOrCost: number;                  // Numeric value
  currency: CurrencyCode;              // CCY
  notes?: string;
}

// 3. MAP_Bundle_Rules
export interface BundleRuleItem {
  id: string;
  bundleSku: string;                   // Main Virtual SKU
  componentSku: string;                // Physical SKU
  componentQty: number;                // Quantity in bundle
  costSharePct: number;                // Weight share e.g. 0.80
}

// 4. RAW_Orders
export interface RawOrderRow {
  id: string;
  orderId: string;                     // Order_ID
  channel: ChannelType;                // Channel
  orderDate: string;                   // Order_Date (YYYY-MM-DD)
  lineSku: string;                     // Line_SKU
  lineQty: number;                     // Line_Qty
  lineGrossAmount: number;             // Line_Gross_Amount (In original currency)
  originalCurrency: CurrencyCode;      // Original_Currency
  customerCountry: string;             // Customer_Country (ISO code like DE, NL, US)
  paymentMethod: string;               // Payment_Method (Credit Card, PayPal, Ideal)
}

// 5. RAW_Payouts
export interface RawPayoutRow {
  id: string;
  payoutId: string;                    // Payout_ID
  orderId: string;                     // Order_ID
  payoutDate: string;                  // Payout_Date
  actualPaymentFee: number;            // Actual_Payment_Fee (EUR)
  netPayoutAmount: number;             // Net_Payout_Amount (EUR)
}

// 6. RAW_3PL_Invoices
export interface Raw3PLInvoiceRow {
  id: string;
  trackingNo: string;                  // Tracking_No
  orderId: string;                     // Order_ID
  actualShippingFee: number;           // Actual_Shipping_Fee (EUR)
  packagingFee: number;                // Packaging_Fee (EUR)
}

// 7. RAW_Refunds
export interface RawRefundRow {
  id: string;
  refundId: string;                    // Refund_ID
  originalOrderId: string;             // Original_Order_ID
  refundDate: string;                  // Refund_Date
  refundAmountGross: number;           // Refund_Amount_Gross (Original Currency)
}

// 8. RAW_AdSpend
export interface RawAdSpendRow {
  id: string;
  spendDate: string;                   // Spend_Date (YYYY-MM-DD)
  channel: string;                     // Meta / Google / TikTok / Amazon Ads
  dailySpendAmount: number;            // Daily_Spend_Amount (Original Currency)
  currency: CurrencyCode;
}

// Calculated Output Types
export type ShippingTierType = 'Tier 1: Exact 3PL' | 'Tier 2: Combination' | 'Tier 4: Channel Avg';
export type TrustScoreType = 'HIGH (Exact)' | 'MEDIUM (Rule)' | 'LOW (Estimate)';
export type ReconciliationStatus = 'MATCHED' | 'DISCREPANCY';

// 9. ENG_Profit_Engine Row
export interface CalculatedOrderProfit {
  orderId: string;
  orderDate: string;
  channel: ChannelType;
  originalCurrency: CurrencyCode;
  grossRevenueOrig: number;
  pointInTimeFx: number;               // Order-date FX conversion rate to EUR
  grossRevenueEur: number;
  vatRate: number;
  netRevenueEur: number;               // Net Revenue (EUR) after VAT
  pitCogsEur: number;                  // Point-in-time COGS (EUR)
  allocatedShippingEur: number;        // Calculated shipping cost (EUR)
  shippingTierUsed: ShippingTierType;  // Tier source
  dataTrustScore: TrustScoreType;      // Data trust score
  actualOrEstPayFeeEur: number;        // Actual or estimated payment fee (EUR)
  platformCommissionEur: number;       // Platform commission (EUR)
  refundLossEur: number;               // Cross-period refund loss (EUR)
  orderNetProfitEur: number;           // Final order net profit (EUR)
  netMarginPct: number;                // Net profit margin percentage
  itemSkus: string[];
}

// 10. AUD_Shipping_Tier Row
export interface CalculatedShippingAudit {
  orderId: string;
  channel: ChannelType;
  itemSkus: string;
  shippingTierUsed: ShippingTierType;
  finalShippingCostEur: number;
  dataTrustScore: TrustScoreType;
  auditNotes: string;
}

// 11. REC_Reconciliation Row
export interface CalculatedReconciliation {
  orderId: string;
  orderDate: string;
  channel: ChannelType;
  orderGrossEur: number;
  payoutNetEur: number;
  paymentDiffEur: number;
  recStatusFlag: ReconciliationStatus;
  hasActualPayout: boolean;
  notes: string;
}

// Complete Full Store State
export interface EngineDataStore {
  lastSaved: string;
  parameters: SystemParameters;
  rateHistory: RateHistoryItem[];
  bundleRules: BundleRuleItem[];
  orders: RawOrderRow[];
  payouts: RawPayoutRow[];
  invoices3PL: Raw3PLInvoiceRow[];
  refunds: RawRefundRow[];
  adSpend: RawAdSpendRow[];
}

export type ActiveTab =
  | 'DASH_Executive_Board'
  | 'ENG_Profit_Engine'
  | 'AUD_Shipping_Tier'
  | 'REC_Reconciliation'
  | 'RAW_Orders'
  | 'RAW_Payouts'
  | 'RAW_3PL_Invoices'
  | 'RAW_Refunds'
  | 'RAW_AdSpend'
  | 'SYS_Parameters'
  | 'SYS_Rate_History'
  | 'MAP_Bundle_Rules';
