import React, { useState, useMemo } from 'react';
import { CalculatedOrderProfit, EngineDataStore } from '../../types';
import { DataBar } from '../DataBar';
import { StatusBadge } from '../StatusBadge';
import { exportToCsv } from '../../utils/csv';
import { Search, Download, Calculator, Info, ChevronRight, X } from 'lucide-react';

interface ProfitEngineViewProps {
  store: EngineDataStore;
  profits: CalculatedOrderProfit[];
}

export const ProfitEngineView: React.FC<ProfitEngineViewProps> = ({ store, profits }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<CalculatedOrderProfit | null>(null);

  const filteredProfits = useMemo(() => {
    return profits.filter((p) => {
      const matchSearch =
        p.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.itemSkus.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchChannel = channelFilter === 'ALL' || p.channel === channelFilter;

      return matchSearch && matchChannel;
    });
  }, [profits, searchTerm, channelFilter]);

  const maxNetRevenue = useMemo(() => {
    return Math.max(...profits.map((p) => p.netRevenueEur), 1);
  }, [profits]);

  const maxProfitVal = useMemo(() => {
    return Math.max(...profits.map((p) => Math.abs(p.orderNetProfitEur)), 1);
  }, [profits]);

  const handleExportCsv = () => {
    const exportData = filteredProfits.map((p) => ({
      Order_ID: p.orderId,
      Order_Date: p.orderDate,
      Channel: p.channel,
      Original_Currency: p.originalCurrency,
      Gross_Revenue_Orig: p.grossRevenueOrig,
      Point_In_Time_FX: p.pointInTimeFx,
      Net_Revenue_EUR: p.netRevenueEur,
      PIT_COGS_EUR: p.pitCogsEur,
      Allocated_Shipping_EUR: p.allocatedShippingEur,
      Shipping_Tier_Used: p.shippingTierUsed,
      Data_Trust_Score: p.dataTrustScore,
      Actual_Or_Est_PayFee_EUR: p.actualOrEstPayFeeEur,
      Platform_Commission_EUR: p.platformCommissionEur,
      Refund_Loss_EUR: p.refundLossEur,
      Order_Net_Profit_EUR: p.orderNetProfitEur,
      Net_Margin_Pct: (p.netMarginPct * 100).toFixed(2) + '%',
      SKUs: p.itemSkus.join('; '),
    }));

    exportToCsv(exportData, `ENG_Profit_Engine_Export_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header & Controls Bar */}
      <div className="bg-white p-5 card-elevation-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-[22px] text-[#051C2C] flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#2251FF]" />
            ENG_Profit_Engine (Order-Level Full-Factor Calculation Engine)
          </h2>
          <p className="text-[12px] text-[#888888] mt-0.5">
            Real-time frontend calculation engine with point-in-time COGS, FX rates, VAT deduction, and 4-tier shipping fallback.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-[#888888] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Order ID, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full input-editable pl-9 h-9 text-[12px]"
            />
          </div>

          {/* Channel Filter */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="input-editable h-9 font-medium text-[12px]"
          >
            <option value="ALL">All Channels</option>
            <option value="Shopify">Shopify</option>
            <option value="Amazon">Amazon</option>
            <option value="bol.com">bol.com</option>
            <option value="TikTok Shop">TikTok Shop</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E8E8E6] text-[#051C2C] rounded-md hover:bg-[#F5F5F2] transition-colors text-[12px] font-semibold shrink-0"
          >
            <Download className="w-4 h-4 text-[#2251FF]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Calculation Table */}
      <div className="bg-white card-elevation-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#051C2C]/5 text-[#051C2C] th-styled border-b border-[#E8E8E6]">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Channel</th>
                <th className="py-3 px-3 text-right">PIT FX</th>
                <th className="py-3 px-3 text-right">Net Rev (EUR)</th>
                <th className="py-3 px-3 text-right">PIT COGS (EUR)</th>
                <th className="py-3 px-3 text-right">Shipping (EUR)</th>
                <th className="py-3 px-3 text-right">Pay Fee (EUR)</th>
                <th className="py-3 px-3 text-right">Platform Fee</th>
                <th className="py-3 px-3 text-right">Refund Loss</th>
                <th className="py-3 px-3 text-right w-40">Net Profit (EUR)</th>
                <th className="py-3 px-3 text-right">Margin</th>
                <th className="py-3 px-2 text-center">Audit</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfits.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-[#888888] italic">
                    No orders match current search filters.
                  </td>
                </tr>
              ) : (
                filteredProfits.map((p, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={p.orderId}
                      className={`border-b border-[#E8E8E6] transition-colors hover:bg-[#2251FF]/[0.02] cursor-pointer ${
                        isEven ? 'bg-white' : 'bg-[#F5F5F2]/60'
                      }`}
                      onClick={() => setSelectedOrder(p)}
                    >
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#051C2C]">
                        {p.orderId}
                      </td>
                      <td className="py-2.5 px-3 text-[#888888] whitespace-nowrap">
                        {p.orderDate}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-[#051C2C]">
                        {p.channel}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#888888]">
                        {p.pointInTimeFx.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        €{p.netRevenueEur.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#D32F2F]">
                        −€{p.pitCogsEur.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#D32F2F]">
                        <div className="flex flex-col items-end">
                          <span>−€{p.allocatedShippingEur.toFixed(2)}</span>
                          <StatusBadge type="trust" value={p.dataTrustScore} />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#D32F2F]">
                        −€{p.actualOrEstPayFeeEur.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#D32F2F]">
                        −€{p.platformCommissionEur.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#D32F2F]">
                        {p.refundLossEur > 0 ? `−€${p.refundLossEur.toFixed(2)}` : '€0.00'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <DataBar
                          value={p.orderNetProfitEur}
                          maxVal={maxProfitVal}
                          formattedText={`€${p.orderNetProfitEur.toFixed(2)}`}
                          isNegative={p.orderNetProfitEur < 0}
                        />
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-mono font-bold ${
                          p.netMarginPct >= 0 ? 'text-[#008035]' : 'text-[#D32F2F]'
                        }`}
                      >
                        {(p.netMarginPct * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-2 text-center text-[#888888]">
                        <ChevronRight className="w-4 h-4 inline-block" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#051C2C]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xl overflow-hidden border border-[#E8E8E6] animate-fade-up">
            <div className="px-6 py-4 border-b border-[#E8E8E6] bg-[#F5F5F2] flex justify-between items-center">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#051C2C] flex items-center gap-2">
                  <span>Order Audit: {selectedOrder.orderId}</span>
                  <StatusBadge type="trust" value={selectedOrder.dataTrustScore} />
                </h3>
                <p className="text-[12px] text-[#888888]">
                  Date: {selectedOrder.orderDate} • Channel: {selectedOrder.channel}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-[#888888] hover:text-[#051C2C] rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-[13px]">
              <div className="grid grid-cols-2 gap-3 bg-[#F5F5F2] p-3 rounded-lg font-mono">
                <div>
                  <span className="text-[#888888] block text-[11px]">Original Gross:</span>
                  <span className="font-bold text-[#051C2C]">
                    {selectedOrder.originalCurrency} {selectedOrder.grossRevenueOrig.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[#888888] block text-[11px]">PIT Exchange Rate:</span>
                  <span className="font-bold text-[#051C2C]">
                    1 {selectedOrder.originalCurrency} = {selectedOrder.pointInTimeFx} EUR
                  </span>
                </div>
                <div>
                  <span className="text-[#888888] block text-[11px]">VAT Rate Applied:</span>
                  <span className="font-bold text-[#051C2C]">
                    {(selectedOrder.vatRate * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  <span className="text-[#888888] block text-[11px]">Net Revenue (EUR):</span>
                  <span className="font-bold text-[#008035]">
                    €{selectedOrder.netRevenueEur.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#E8E8E6] pt-3 space-y-2">
                <h4 className="font-semibold text-[#051C2C] text-[13px]">Cost Deduction Items</h4>
                <div className="flex justify-between py-1 border-b border-[#E8E8E6]">
                  <span>Point-In-Time COGS ({selectedOrder.itemSkus.join(', ')}):</span>
                  <span className="font-mono text-[#D32F2F]">−€{selectedOrder.pitCogsEur.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8E8E6]">
                  <span>Shipping Cost ({selectedOrder.shippingTierUsed}):</span>
                  <span className="font-mono text-[#D32F2F]">−€{selectedOrder.allocatedShippingEur.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8E8E6]">
                  <span>Payment Gateway Processing Fee:</span>
                  <span className="font-mono text-[#D32F2F]">−€{selectedOrder.actualOrEstPayFeeEur.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8E8E6]">
                  <span>Platform Marketplace Commission:</span>
                  <span className="font-mono text-[#D32F2F]">−€{selectedOrder.platformCommissionEur.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8E8E6]">
                  <span>Refund Cross-Period Loss:</span>
                  <span className="font-mono text-[#D32F2F]">−€{selectedOrder.refundLossEur.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-[15px] font-bold">
                  <span>Net Operating Profit (EUR):</span>
                  <span className={`font-mono ${selectedOrder.orderNetProfitEur >= 0 ? 'text-[#008035]' : 'text-[#D32F2F]'}`}>
                    €{selectedOrder.orderNetProfitEur.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-[#F5F5F2] border-t border-[#E8E8E6] text-right">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 bg-[#051C2C] text-white rounded-md text-[12px] font-medium"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
