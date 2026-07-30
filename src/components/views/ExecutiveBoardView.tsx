import React from 'react';
import {
  CalculatedOrderProfit,
  CalculatedReconciliation,
  EngineDataStore,
} from '../../types';
import { StatusBadge } from '../StatusBadge';
import { InsightBlock } from '../InsightBlock';
import {
  Euro,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
} from 'lucide-react';

interface ExecutiveBoardViewProps {
  store: EngineDataStore;
  profits: CalculatedOrderProfit[];
  reconciliations: CalculatedReconciliation[];
  onNavigateTab: (tab: any) => void;
}

export const ExecutiveBoardView: React.FC<ExecutiveBoardViewProps> = ({
  store,
  profits,
  reconciliations,
  onNavigateTab,
}) => {
  // Aggregate KPIs
  const totalNetRevenueEur = profits.reduce((acc, p) => acc + p.netRevenueEur, 0);
  const totalNetProfitEur = profits.reduce((acc, p) => acc + p.orderNetProfitEur, 0);
  const totalGrossRevenueEur = profits.reduce((acc, p) => acc + p.grossRevenueEur, 0);
  const totalCogsEur = profits.reduce((acc, p) => acc + p.pitCogsEur, 0);
  const totalShippingEur = profits.reduce((acc, p) => acc + p.allocatedShippingEur, 0);
  const totalPaymentFeeEur = profits.reduce((acc, p) => acc + p.actualOrEstPayFeeEur, 0);
  const totalCommissionEur = profits.reduce((acc, p) => acc + p.platformCommissionEur, 0);
  const totalRefundLossEur = profits.reduce((acc, p) => acc + p.refundLossEur, 0);

  const overallMargin = totalNetRevenueEur > 0 ? totalNetProfitEur / totalNetRevenueEur : 0;

  // Data Trust Ratios
  const highTrustCount = profits.filter((p) => p.dataTrustScore === 'HIGH (Exact)').length;
  const mediumTrustCount = profits.filter((p) => p.dataTrustScore === 'MEDIUM (Rule)').length;
  const lowTrustCount = profits.filter((p) => p.dataTrustScore === 'LOW (Estimate)').length;
  const totalOrders = profits.length;
  const highTrustPct = totalOrders > 0 ? (highTrustCount / totalOrders) * 100 : 0;

  // Reconciliation Discrepancies
  const discrepancies = reconciliations.filter((r) => r.recStatusFlag === 'DISCREPANCY');
  const discrepancyCount = discrepancies.length;
  const discrepancyTotalVal = discrepancies.reduce((acc, r) => acc + Math.abs(r.paymentDiffEur), 0);

  // Channel Breakdown
  const channelStats = React.useMemo(() => {
    const map = new Map<string, { revenue: number; profit: number; orders: number }>();
    for (const p of profits) {
      const cur = map.get(p.channel) || { revenue: 0, profit: 0, orders: 0 };
      map.set(p.channel, {
        revenue: cur.revenue + p.netRevenueEur,
        profit: cur.profit + p.orderNetProfitEur,
        orders: cur.orders + 1,
      });
    }
    return Array.from(map.entries()).map(([channel, data]) => ({
      channel,
      revenue: data.revenue,
      profit: data.profit,
      margin: data.revenue > 0 ? data.profit / data.revenue : 0,
      orders: data.orders,
    }));
  }, [profits]);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Insight Callout */}
      {discrepancyCount > 0 ? (
        <InsightBlock
          type="warning"
          title={`Action Required: ${discrepancyCount} Order Reconciliation Discrepancies Detected`}
          description={`There are ${discrepancyCount} orders with payment variances exceeding your tolerance thresholds (±€${store.parameters.recToleranceAmt.toFixed(
            2
          )} or ${(store.parameters.recTolerancePct * 100).toFixed(
            1
          )}%). Total variance is €${discrepancyTotalVal.toFixed(2)}.`}
          actionText="Audit Reconciliation"
          onAction={() => onNavigateTab('REC_Reconciliation')}
        />
      ) : (
        <InsightBlock
          type="success"
          title="All Order Settlements Reconciled"
          description="100% of order payouts match registered gross receipts within set tolerance limits."
        />
      )}

      {/* Hero KPI Grid (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Net Revenue */}
        <div className="bg-white p-5 card-elevation-sm">
          <div className="flex items-center justify-between text-[#888888] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Net Revenue (Excl. VAT)
            </span>
            <Euro className="w-4 h-4 text-[#2251FF]" />
          </div>
          <div className="font-heading text-[32px] font-bold text-[#051C2C] tracking-tight">
            €{totalNetRevenueEur.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#888888] mt-2 border-t border-[#E8E8E6] pt-2">
            <span>Gross Revenue: €{totalGrossRevenueEur.toFixed(2)}</span>
            <span className="font-medium text-[#051C2C]">VAT: {(store.parameters.defaultVatEuRate * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* KPI 2: Net Profit & Margin */}
        <div className="bg-white p-5 card-elevation-sm">
          <div className="flex items-center justify-between text-[#888888] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Operating Net Profit
            </span>
            <TrendingUp className="w-4 h-4 text-[#2251FF]" />
          </div>
          <div className="font-heading text-[32px] font-bold text-[#051C2C] tracking-tight flex items-baseline gap-2">
            <span>€{totalNetProfitEur.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={`text-[15px] font-sans font-semibold px-2 py-0.5 rounded ${overallMargin >= 0 ? 'bg-[#00C853]/10 text-[#008035]' : 'bg-[#D32F2F]/10 text-[#D32F2F]'}`}>
              {(overallMargin * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-[11px] text-[#888888] mt-2 border-t border-[#E8E8E6] pt-2 flex justify-between">
            <span>Total Orders: {totalOrders}</span>
            <span>Avg Profit/Ord: €{totalOrders > 0 ? (totalNetProfitEur / totalOrders).toFixed(2) : '0.00'}</span>
          </div>
        </div>

        {/* KPI 3: Data Trust Ratio */}
        <div className="bg-white p-5 card-elevation-sm">
          <div className="flex items-center justify-between text-[#888888] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Exact Shipping Ratio
            </span>
            <ShieldCheck className="w-4 h-4 text-[#2251FF]" />
          </div>
          <div className="font-heading text-[32px] font-bold text-[#051C2C] tracking-tight">
            {highTrustPct.toFixed(1)}%
          </div>
          <div className="text-[11px] text-[#888888] mt-2 border-t border-[#E8E8E6] pt-2 flex justify-between">
            <span>Exact 3PL: {highTrustCount}</span>
            <span>Rule: {mediumTrustCount}</span>
            <span>Est: {lowTrustCount}</span>
          </div>
        </div>

        {/* KPI 4: Reconciliation Health */}
        <div className="bg-white p-5 card-elevation-sm">
          <div className="flex items-center justify-between text-[#888888] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Reconciliation Health
            </span>
            <AlertTriangle className={`w-4 h-4 ${discrepancyCount > 0 ? 'text-[#D32F2F]' : 'text-[#00C853]'}`} />
          </div>
          <div className="font-heading text-[32px] font-bold text-[#051C2C] tracking-tight flex items-baseline gap-2">
            <span>{discrepancyCount}</span>
            <span className="text-[13px] font-sans text-[#888888]">Discrepancies</span>
          </div>
          <div className="text-[11px] text-[#888888] mt-2 border-t border-[#E8E8E6] pt-2 flex justify-between">
            <span>Total Variance:</span>
            <span className={`font-semibold ${discrepancyCount > 0 ? 'text-[#D32F2F]' : 'text-[#008035]'}`}>
              €{discrepancyTotalVal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Profit Waterfall & Channel Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waterfall Cost Structure (2 Columns) */}
        <div className="lg:col-span-2 bg-white p-6 card-elevation-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E8E6] pb-3">
            <div>
              <h3 className="font-heading font-bold text-[18px] text-[#051C2C]">
                Full-Factor Order Cost Waterfall
              </h3>
              <p className="text-[12px] text-[#888888]">
                Net Revenue to Operating Profit deduction breakdown (EUR)
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('ENG_Profit_Engine')}
              className="text-[12px] font-semibold text-[#2251FF] hover:underline flex items-center gap-1"
            >
              <span>View Profit Engine</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {/* Waterfall Row 1: Net Revenue */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-semibold text-[#051C2C]">1. Net Revenue (Excl. VAT)</span>
              <span className="font-mono font-bold text-[#051C2C]">€{totalNetRevenueEur.toFixed(2)}</span>
            </div>
            <div className="w-full bg-[#051C2C]/10 h-2 rounded-full overflow-hidden">
              <div className="bg-[#051C2C] h-full" style={{ width: '100%' }} />
            </div>

            {/* Waterfall Row 2: COGS */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#888888] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#2251FF]" />
                Less: Point-in-Time COGS
              </span>
              <span className="font-mono text-[#D32F2F]">− €{totalCogsEur.toFixed(2)} ({totalNetRevenueEur > 0 ? ((totalCogsEur/totalNetRevenueEur)*100).toFixed(1) : 0}%)</span>
            </div>

            {/* Waterfall Row 3: Shipping */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#888888] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#2251FF]" />
                Less: Allocated Shipping & Packaging
              </span>
              <span className="font-mono text-[#D32F2F]">− €{totalShippingEur.toFixed(2)} ({totalNetRevenueEur > 0 ? ((totalShippingEur/totalNetRevenueEur)*100).toFixed(1) : 0}%)</span>
            </div>

            {/* Waterfall Row 4: Payment Fees */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#888888] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#2251FF]" />
                Less: Payment Gateways Processing Fee
              </span>
              <span className="font-mono text-[#D32F2F]">− €{totalPaymentFeeEur.toFixed(2)} ({totalNetRevenueEur > 0 ? ((totalPaymentFeeEur/totalNetRevenueEur)*100).toFixed(1) : 0}%)</span>
            </div>

            {/* Waterfall Row 5: Platform Commission */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#888888] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#2251FF]" />
                Less: Marketplace Platform Commissions
              </span>
              <span className="font-mono text-[#D32F2F]">− €{totalCommissionEur.toFixed(2)} ({totalNetRevenueEur > 0 ? ((totalCommissionEur/totalNetRevenueEur)*100).toFixed(1) : 0}%)</span>
            </div>

            {/* Waterfall Row 6: Refunds */}
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#888888] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#D32F2F]" />
                Less: Refund Losses (Attributed to Orig Order)
              </span>
              <span className="font-mono text-[#D32F2F]">− €{totalRefundLossEur.toFixed(2)} ({totalNetRevenueEur > 0 ? ((totalRefundLossEur/totalNetRevenueEur)*100).toFixed(1) : 0}%)</span>
            </div>

            <div className="border-t-2 border-[#051C2C] pt-3 mt-2 flex items-center justify-between text-[14px]">
              <span className="font-bold text-[#051C2C]">Final Order Net Profit (EUR)</span>
              <span className="font-mono font-bold text-[#008035] text-[16px]">€{totalNetProfitEur.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Channel Performance Card (1 Column) */}
        <div className="bg-white p-6 card-elevation-md space-y-4">
          <div className="border-b border-[#E8E8E6] pb-3">
            <h3 className="font-heading font-bold text-[18px] text-[#051C2C]">
              Channel Profitability
            </h3>
            <p className="text-[12px] text-[#888888]">
              Breakdown by Sales Channel
            </p>
          </div>

          <div className="space-y-4">
            {channelStats.map((ch) => (
              <div key={ch.channel} className="p-3 bg-[#F5F5F2] rounded-lg border border-[#E8E8E6]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#051C2C]">{ch.channel}</span>
                  <span className="text-[11px] text-[#888888]">{ch.orders} orders</span>
                </div>
                <div className="flex justify-between items-baseline font-mono text-[12px]">
                  <span>Net Rev: €{ch.revenue.toFixed(2)}</span>
                  <span className={`font-semibold ${ch.profit >= 0 ? 'text-[#008035]' : 'text-[#D32F2F]'}`}>
                    Profit: €{ch.profit.toFixed(2)} ({ (ch.margin * 100).toFixed(1) }%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discrepancy Action List Preview */}
      {discrepancies.length > 0 && (
        <div className="bg-white p-6 card-elevation-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E8E6] pb-3">
            <div>
              <h3 className="font-heading font-bold text-[18px] text-[#051C2C] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#D32F2F]" />
                Top Priority Reconciliation Discrepancies
              </h3>
              <p className="text-[12px] text-[#888888]">
                Settlements with variance exceeding tolerance limits
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('REC_Reconciliation')}
              className="text-[12px] font-semibold text-[#2251FF] hover:underline"
            >
              Resolve All ({discrepancyCount}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#051C2C]/5 text-[#051C2C] font-semibold uppercase text-[11px] tracking-wider border-b border-[#E8E8E6]">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Order Date</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3 text-right">Order Gross (EUR)</th>
                  <th className="py-2.5 px-3 text-right">Payout Net (EUR)</th>
                  <th className="py-2.5 px-3 text-right">Variance (EUR)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {discrepancies.slice(0, 5).map((d) => (
                  <tr key={d.orderId} className="border-b border-[#E8E8E6] hover:bg-[#F5F5F2]">
                    <td className="py-2.5 px-3 font-mono font-medium text-[#051C2C]">{d.orderId}</td>
                    <td className="py-2.5 px-3 text-[#888888]">{d.orderDate}</td>
                    <td className="py-2.5 px-3 text-[#051C2C]">{d.channel}</td>
                    <td className="py-2.5 px-3 text-right font-mono">€{d.orderGrossEur.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">€{d.payoutNetEur.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#D32F2F]">
                      €{d.paymentDiffEur.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge type="rec" value={d.recStatusFlag} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
