import { EngineDataStore } from '../types';

export const INITIAL_SEED_DATA: EngineDataStore = {
  lastSaved: new Date().toISOString(),
  parameters: {
    baseCurrency: 'EUR',
    defaultVatEuRate: 0.21,           // 21%
    defaultPaymentRate: 0.019,        // 1.9%
    defaultPaymentFlat: 0.30,         // €0.30
    recToleranceAmt: 2.00,            // €2.00
    recTolerancePct: 0.02,            // 2.0%
    shippingSurcharge: 0.05,          // 5.0%
  },
  rateHistory: [
    // COGS
    { id: 'rh-1', type: 'COGS', key: 'SKU-MAIN-A', startDate: '2025-01-01', endDate: '2026-03-31', rateOrCost: 12.50, currency: 'USD', notes: 'H1 2025/26 Batch Cost' },
    { id: 'rh-2', type: 'COGS', key: 'SKU-MAIN-A', startDate: '2026-04-01', endDate: '2099-12-31', rateOrCost: 14.00, currency: 'USD', notes: 'New Supplier Price Q2 2026' },
    { id: 'rh-3', type: 'COGS', key: 'SKU-PRO-B', startDate: '2025-01-01', endDate: '2099-12-31', rateOrCost: 22.00, currency: 'EUR', notes: 'Stable EU Production Cost' },
    { id: 'rh-4', type: 'COGS', key: 'SKU-ACC-B', startDate: '2025-01-01', endDate: '2099-12-31', rateOrCost: 3.50, currency: 'EUR', notes: 'Accessory Unit Cost' },
    { id: 'rh-5', type: 'COGS', key: 'SKU-LITE-C', startDate: '2025-01-01', endDate: '2099-12-31', rateOrCost: 8.00, currency: 'EUR', notes: 'Entry SKU Cost' },

    // FX Rates to EUR
    { id: 'rh-fx-1', type: 'FX', key: 'USD_EUR', startDate: '2026-01-01', endDate: '2026-03-31', rateOrCost: 0.9200, currency: 'EUR', notes: 'USD to EUR Q1 2026' },
    { id: 'rh-fx-2', type: 'FX', key: 'USD_EUR', startDate: '2026-04-01', endDate: '2026-07-31', rateOrCost: 0.9450, currency: 'EUR', notes: 'USD to EUR Q2 2026' },
    { id: 'rh-fx-3', type: 'FX', key: 'GBP_EUR', startDate: '2026-01-01', endDate: '2099-12-31', rateOrCost: 1.1850, currency: 'EUR', notes: 'GBP to EUR' },
    { id: 'rh-fx-4', type: 'FX', key: 'DKK_EUR', startDate: '2026-01-01', endDate: '2099-12-31', rateOrCost: 0.1340, currency: 'EUR', notes: 'DKK to EUR' },

    // Shipping Rates (Combination rules)
    { id: 'rh-sh-1', type: 'SHIP_RATE', key: 'SKU-MAIN-A', startDate: '2025-01-01', endDate: '2099-12-31', rateOrCost: 4.80, currency: 'EUR', notes: 'Standard 1-Unit Standard Box' },
    { id: 'rh-sh-2', type: 'SHIP_RATE', key: 'SKU-MAIN-A+SKU-ACC-B', startDate: '2025-01-01', endDate: '2099-12-31', rateOrCost: 5.40, currency: 'EUR', notes: 'Main + Accessory Bundle Shipping' },
    { id: 'rh-sh-3', type: 'SHIP_RATE', key: 'SKU-PRO-B', startDate: '2025-01-01', endDate: '2099-12-31', rateOrCost: 6.20, currency: 'EUR', notes: 'Pro heavy parcel' },

    // Platform Fees
    { id: 'rh-pl-1', type: 'PLATFORM_FEE', key: 'Amazon', startDate: '2025-01-01', endDate: '2099-12-31', rateOrCost: 0.1500, currency: 'EUR', notes: 'Amazon 15% Category Fee' },
    { id: 'rh-pl-2', type: 'PLATFORM_FEE', key: 'bol.com', startDate: '2025-01-01', endDate: '2099-12-31', rateOrCost: 0.1250, currency: 'EUR', notes: 'bol.com 12.5% Commission' },
    { id: 'rh-pl-3', type: 'PLATFORM_FEE', key: 'Shopify', startDate: '2025-01-01', endDate: '2099-12-31', rateOrCost: 0.0200, currency: 'EUR', notes: 'Shopify 2% App Fee' },
    { id: 'rh-pl-4', type: 'PLATFORM_FEE', key: 'TikTok Shop', startDate: '2025-01-01', endDate: '2099-12-31', rateOrCost: 0.0500, currency: 'EUR', notes: 'TikTok Shop 5% Fee' },
  ],
  bundleRules: [
    { id: 'br-1', bundleSku: 'BUNDLE-GIFT-01', componentSku: 'SKU-MAIN-A', componentQty: 1, costSharePct: 0.80 },
    { id: 'br-2', bundleSku: 'BUNDLE-GIFT-01', componentSku: 'SKU-ACC-B', componentQty: 1, costSharePct: 0.20 },
    { id: 'br-3', bundleSku: 'BUNDLE-PRO-PACK', componentSku: 'SKU-PRO-B', componentQty: 1, costSharePct: 0.85 },
    { id: 'br-4', bundleSku: 'BUNDLE-PRO-PACK', componentSku: 'SKU-ACC-B', componentQty: 2, costSharePct: 0.15 },
  ],
  orders: [
    { id: 'ord-101', orderId: 'ORD-2026-1001', channel: 'Shopify', orderDate: '2026-02-14', lineSku: 'SKU-MAIN-A', lineQty: 1, lineGrossAmount: 59.99, originalCurrency: 'EUR', customerCountry: 'DE', paymentMethod: 'Credit Card' },
    { id: 'ord-102', orderId: 'ORD-2026-1002', channel: 'Amazon', orderDate: '2026-02-15', lineSku: 'SKU-PRO-B', lineQty: 1, lineGrossAmount: 99.00, originalCurrency: 'EUR', customerCountry: 'NL', paymentMethod: 'Amazon Pay' },
    { id: 'ord-103', orderId: 'ORD-2026-1003', channel: 'Shopify', orderDate: '2026-03-01', lineSku: 'BUNDLE-GIFT-01', lineQty: 1, lineGrossAmount: 69.99, originalCurrency: 'EUR', customerCountry: 'FR', paymentMethod: 'PayPal' },
    { id: 'ord-104', orderId: 'ORD-2026-1004', channel: 'bol.com', orderDate: '2026-03-10', lineSku: 'SKU-MAIN-A', lineQty: 2, lineGrossAmount: 110.00, originalCurrency: 'EUR', customerCountry: 'NL', paymentMethod: 'iDEAL' },
    { id: 'ord-105', orderId: 'ORD-2026-1005', channel: 'Amazon', orderDate: '2026-04-05', lineSku: 'SKU-MAIN-A', lineQty: 1, lineGrossAmount: 65.00, originalCurrency: 'USD', customerCountry: 'US', paymentMethod: 'Credit Card' },
    { id: 'ord-106', orderId: 'ORD-2026-1006', channel: 'Shopify', orderDate: '2026-04-12', lineSku: 'BUNDLE-PRO-PACK', lineQty: 1, lineGrossAmount: 129.00, originalCurrency: 'EUR', customerCountry: 'DE', paymentMethod: 'Klarna' },
    { id: 'ord-107', orderId: 'ORD-2026-1007', channel: 'TikTok Shop', orderDate: '2026-05-01', lineSku: 'SKU-LITE-C', lineQty: 1, lineGrossAmount: 29.99, originalCurrency: 'GBP', customerCountry: 'GB', paymentMethod: 'TikTok Pay' },
    { id: 'ord-108', orderId: 'ORD-2026-1008', channel: 'Shopify', orderDate: '2026-05-18', lineSku: 'SKU-PRO-B', lineQty: 2, lineGrossAmount: 198.00, originalCurrency: 'EUR', customerCountry: 'BE', paymentMethod: 'Credit Card' },
    { id: 'ord-109', orderId: 'ORD-2026-1009', channel: 'Amazon', orderDate: '2026-06-02', lineSku: 'SKU-MAIN-A', lineQty: 1, lineGrossAmount: 59.99, originalCurrency: 'EUR', customerCountry: 'DE', paymentMethod: 'Amazon Pay' },
    { id: 'ord-110', orderId: 'ORD-2026-1010', channel: 'bol.com', orderDate: '2026-06-15', lineSku: 'SKU-ACC-B', lineQty: 3, lineGrossAmount: 45.00, originalCurrency: 'EUR', customerCountry: 'NL', paymentMethod: 'iDEAL' },
    { id: 'ord-111', orderId: 'ORD-2026-1011', channel: 'Shopify', orderDate: '2026-07-01', lineSku: 'SKU-MAIN-A', lineQty: 1, lineGrossAmount: 450.00, originalCurrency: 'DKK', customerCountry: 'DK', paymentMethod: 'MobilePay' },
    { id: 'ord-112', orderId: 'ORD-2026-1012', channel: 'Amazon', orderDate: '2026-07-10', lineSku: 'SKU-PRO-B', lineQty: 1, lineGrossAmount: 99.00, originalCurrency: 'EUR', customerCountry: 'IT', paymentMethod: 'Credit Card' },
  ],
  payouts: [
    { id: 'pay-1', payoutId: 'PAY-SP-8821', orderId: 'ORD-2026-1001', payoutDate: '2026-02-16', actualPaymentFee: 1.44, netPayoutAmount: 58.55 },
    { id: 'pay-2', payoutId: 'PAY-AMZ-9931', orderId: 'ORD-2026-1002', payoutDate: '2026-02-18', actualPaymentFee: 14.85, netPayoutAmount: 84.15 },
    { id: 'pay-3', payoutId: 'PAY-SP-8832', orderId: 'ORD-2026-1003', payoutDate: '2026-03-03', actualPaymentFee: 2.10, netPayoutAmount: 67.89 },
    { id: 'pay-4', payoutId: 'PAY-BOL-0012', orderId: 'ORD-2026-1004', payoutDate: '2026-03-12', actualPaymentFee: 13.75, netPayoutAmount: 96.25 },
    { id: 'pay-5', payoutId: 'PAY-AMZ-9940', orderId: 'ORD-2026-1005', payoutDate: '2026-04-07', actualPaymentFee: 9.75, netPayoutAmount: 51.68 },
    { id: 'pay-6', payoutId: 'PAY-SP-8845', orderId: 'ORD-2026-1006', payoutDate: '2026-04-14', actualPaymentFee: 2.75, netPayoutAmount: 126.25 },
    { id: 'pay-7', payoutId: 'PAY-TT-1102', orderId: 'ORD-2026-1007', payoutDate: '2026-05-03', actualPaymentFee: 1.50, netPayoutAmount: 34.04 },
    { id: 'pay-8', payoutId: 'PAY-SP-8850', orderId: 'ORD-2026-1008', payoutDate: '2026-05-20', actualPaymentFee: 4.06, netPayoutAmount: 193.94 },
    // ORD-2026-1009 has a discrepancy for audit testing
    { id: 'pay-9', payoutId: 'PAY-AMZ-9952', orderId: 'ORD-2026-1009', payoutDate: '2026-06-05', actualPaymentFee: 12.50, netPayoutAmount: 42.49 },
    { id: 'pay-10', payoutId: 'PAY-BOL-0020', orderId: 'ORD-2026-1010', payoutDate: '2026-06-18', actualPaymentFee: 5.63, netPayoutAmount: 39.37 },
  ],
  invoices3PL: [
    { id: 'inv-1', trackingNo: 'TRK-DHL-0091', orderId: 'ORD-2026-1001', actualShippingFee: 4.80, packagingFee: 0.60 },
    { id: 'inv-2', trackingNo: 'TRK-DPD-0092', orderId: 'ORD-2026-1002', actualShippingFee: 6.20, packagingFee: 0.80 },
    { id: 'inv-3', trackingNo: 'TRK-DHL-0093', orderId: 'ORD-2026-1003', actualShippingFee: 5.40, packagingFee: 0.70 },
    { id: 'inv-4', trackingNo: 'TRK-POSTNL-004', orderId: 'ORD-2026-1004', actualShippingFee: 7.10, packagingFee: 0.90 },
    { id: 'inv-5', trackingNo: 'TRK-DHL-0098', orderId: 'ORD-2026-1008', actualShippingFee: 9.80, packagingFee: 1.20 },
    { id: 'inv-6', trackingNo: 'TRK-UPS-0101', orderId: 'ORD-2026-1012', actualShippingFee: 6.50, packagingFee: 0.80 },
  ],
  refunds: [
    { id: 'ref-1', refundId: 'RFD-2026-01', originalOrderId: 'ORD-2026-1002', refundDate: '2026-02-28', refundAmountGross: 99.00 },
    { id: 'ref-2', refundId: 'RFD-2026-02', originalOrderId: 'ORD-2026-1007', refundDate: '2026-05-10', refundAmountGross: 29.99 },
  ],
  adSpend: [
    { id: 'ad-1', spendDate: '2026-02-14', channel: 'Meta Ads', dailySpendAmount: 45.00, currency: 'EUR' },
    { id: 'ad-2', spendDate: '2026-02-15', channel: 'Google Ads', dailySpendAmount: 30.00, currency: 'EUR' },
    { id: 'ad-3', spendDate: '2026-03-01', channel: 'Meta Ads', dailySpendAmount: 50.00, currency: 'EUR' },
    { id: 'ad-4', spendDate: '2026-03-10', channel: 'Google Ads', dailySpendAmount: 25.00, currency: 'EUR' },
    { id: 'ad-5', spendDate: '2026-04-05', channel: 'Amazon Ads', dailySpendAmount: 40.00, currency: 'USD' },
    { id: 'ad-6', spendDate: '2026-04-12', channel: 'Meta Ads', dailySpendAmount: 60.00, currency: 'EUR' },
    { id: 'ad-7', spendDate: '2026-05-01', channel: 'TikTok Ads', dailySpendAmount: 35.00, currency: 'GBP' },
    { id: 'ad-8', spendDate: '2026-06-02', channel: 'Google Ads', dailySpendAmount: 40.00, currency: 'EUR' },
  ],
};
