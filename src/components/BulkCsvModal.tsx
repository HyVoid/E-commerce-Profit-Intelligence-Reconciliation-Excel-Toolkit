import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { EngineDataStore } from '../types';
import { parseCsvString } from '../utils/csv';

interface BulkCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: EngineDataStore;
  onUpdateStore: (newStore: EngineDataStore) => void;
}

type TargetTable =
  | 'RAW_Orders'
  | 'RAW_Payouts'
  | 'RAW_3PL_Invoices'
  | 'RAW_Refunds'
  | 'RAW_AdSpend'
  | 'SYS_Rate_History'
  | 'MAP_Bundle_Rules';

export const BulkCsvModal: React.FC<BulkCsvModalProps> = ({
  isOpen,
  onClose,
  store,
  onUpdateStore,
}) => {
  const [targetTable, setTargetTable] = useState<TargetTable>('RAW_Orders');
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCsvText(content);
        const rows = parseCsvString(content);
        setParsedRows(rows);
        setErrorMessage(rows.length === 0 ? 'No valid CSV rows parsed.' : '');
      }
    };
    reader.readAsText(file);
  };

  const handleTextChange = (text: string) => {
    setCsvText(text);
    if (text.trim().length > 0) {
      const rows = parseCsvString(text);
      setParsedRows(rows);
      setErrorMessage(rows.length === 0 ? 'No valid CSV rows found in text.' : '');
    } else {
      setParsedRows([]);
      setErrorMessage('');
    }
  };

  const handleCommitImport = () => {
    if (parsedRows.length === 0) return;

    const updated = { ...store };

    try {
      if (targetTable === 'RAW_Orders') {
        const newOrders = parsedRows.map((r, idx) => ({
          id: `ord-imported-${Date.now()}-${idx}`,
          orderId: r['Order_ID'] || r['orderId'] || `ORD-${Date.now()}-${idx}`,
          channel: (r['Channel'] || r['channel'] || 'Shopify') as any,
          orderDate: r['Order_Date'] || r['orderDate'] || new Date().toISOString().split('T')[0],
          lineSku: r['Line_SKU'] || r['lineSku'] || 'SKU-UNKNOWN',
          lineQty: Number(r['Line_Qty'] || r['lineQty'] || 1),
          lineGrossAmount: Number(r['Line_Gross_Amount'] || r['lineGrossAmount'] || 0),
          originalCurrency: (r['Original_Currency'] || r['originalCurrency'] || 'EUR') as any,
          customerCountry: r['Customer_Country'] || r['customerCountry'] || 'DE',
          paymentMethod: r['Payment_Method'] || r['paymentMethod'] || 'Credit Card',
        }));
        updated.orders = [...updated.orders, ...newOrders];
      } else if (targetTable === 'RAW_Payouts') {
        const newPayouts = parsedRows.map((r, idx) => ({
          id: `pay-imported-${Date.now()}-${idx}`,
          payoutId: r['Payout_ID'] || r['payoutId'] || `PAY-${Date.now()}-${idx}`,
          orderId: r['Order_ID'] || r['orderId'] || '',
          payoutDate: r['Payout_Date'] || r['payoutDate'] || new Date().toISOString().split('T')[0],
          actualPaymentFee: Number(r['Actual_Payment_Fee'] || r['actualPaymentFee'] || 0),
          netPayoutAmount: Number(r['Net_Payout_Amount'] || r['netPayoutAmount'] || 0),
        }));
        updated.payouts = [...updated.payouts, ...newPayouts];
      } else if (targetTable === 'RAW_3PL_Invoices') {
        const newInvoices = parsedRows.map((r, idx) => ({
          id: `inv-imported-${Date.now()}-${idx}`,
          trackingNo: r['Tracking_No'] || r['trackingNo'] || `TRK-${Date.now()}-${idx}`,
          orderId: r['Order_ID'] || r['orderId'] || '',
          actualShippingFee: Number(r['Actual_Shipping_Fee'] || r['actualShippingFee'] || 0),
          packagingFee: Number(r['Packaging_Fee'] || r['packagingFee'] || 0),
        }));
        updated.invoices3PL = [...updated.invoices3PL, ...newInvoices];
      } else if (targetTable === 'RAW_Refunds') {
        const newRefunds = parsedRows.map((r, idx) => ({
          id: `ref-imported-${Date.now()}-${idx}`,
          refundId: r['Refund_ID'] || r['refundId'] || `RFD-${Date.now()}-${idx}`,
          originalOrderId: r['Original_Order_ID'] || r['originalOrderId'] || '',
          refundDate: r['Refund_Date'] || r['refundDate'] || new Date().toISOString().split('T')[0],
          refundAmountGross: Number(r['Refund_Amount_Gross'] || r['refundAmountGross'] || 0),
        }));
        updated.refunds = [...updated.refunds, ...newRefunds];
      } else if (targetTable === 'RAW_AdSpend') {
        const newAdSpends = parsedRows.map((r, idx) => ({
          id: `ad-imported-${Date.now()}-${idx}`,
          spendDate: r['Spend_Date'] || r['spendDate'] || new Date().toISOString().split('T')[0],
          channel: r['Channel'] || r['channel'] || 'Meta Ads',
          dailySpendAmount: Number(r['Daily_Spend_Amount'] || r['dailySpendAmount'] || 0),
          currency: (r['Currency'] || r['currency'] || 'EUR') as any,
        }));
        updated.adSpend = [...updated.adSpend, ...newAdSpends];
      }

      onUpdateStore(updated);
      alert(`Successfully imported ${parsedRows.length} rows into ${targetTable}!`);
      onClose();
    } catch (err: any) {
      setErrorMessage(`Import error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#051C2C]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden border border-[#E8E8E6] animate-fade-up">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E8E6] flex items-center justify-between bg-[#F5F5F2]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#2251FF]" />
            <h3 className="font-heading font-bold text-lg text-[#051C2C]">
              Bulk CSV Import
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#888888] hover:text-[#051C2C] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-[13px]">
          {/* Target Table Selector */}
          <div>
            <label className="block font-semibold text-[#051C2C] mb-1.5">
              Select Target Data Table
            </label>
            <select
              value={targetTable}
              onChange={(e) => setTargetTable(e.target.value as TargetTable)}
              className="w-full input-editable h-9 font-medium"
            >
              <option value="RAW_Orders">RAW_Orders (Multi-Channel Orders)</option>
              <option value="RAW_Payouts">RAW_Payouts (Settlement Statements)</option>
              <option value="RAW_3PL_Invoices">RAW_3PL_Invoices (Logistics Bills)</option>
              <option value="RAW_Refunds">RAW_Refunds (Refund Details)</option>
              <option value="RAW_AdSpend">RAW_AdSpend (Advertising Spend)</option>
            </select>
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block font-semibold text-[#051C2C] mb-1.5">
              Upload CSV File or Paste Raw CSV
            </label>
            <div className="flex gap-3 items-center">
              <label className="flex items-center gap-2 px-4 py-2 bg-[#2251FF]/10 text-[#2251FF] font-medium rounded-md hover:bg-[#2251FF]/20 cursor-pointer border border-[#2251FF]/20 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Browse File...</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[12px] text-[#888888]">.csv files supported</span>
            </div>
          </div>

          {/* Text Area Input */}
          <div>
            <textarea
              rows={5}
              value={csvText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={`Header1,Header2,Header3\nVal1,Val2,Val3`}
              className="w-full font-mono text-[12px] input-editable p-3"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-[#D32F2F] text-[12px] bg-[#D32F2F]/10 p-2.5 rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Preview Parsed Rows */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#008035] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Parsed {parsedRows.length} rows successfully
                </span>
                <span className="text-[11px] text-[#888888]">
                  Columns detected: {Object.keys(parsedRows[0]).join(', ')}
                </span>
              </div>
              <div className="overflow-x-auto max-h-36 border border-[#E8E8E6] rounded-md">
                <table className="w-full text-[11px]">
                  <thead className="bg-[#051C2C]/5 text-[#051C2C] font-semibold uppercase">
                    <tr>
                      {Object.keys(parsedRows[0]).map((h) => (
                        <th key={h} className="p-1.5 text-left border-b border-[#E8E8E6]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="border-b border-[#E8E8E6]">
                        {Object.values(row).map((val, cIdx) => (
                          <td key={cIdx} className="p-1.5 font-mono text-[#051C2C]">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 5 && (
                <p className="text-[11px] text-[#888888] italic">
                  Showing first 5 rows preview of {parsedRows.length} total.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#F5F5F2] border-t border-[#E8E8E6] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-[#E8E8E6] rounded-md text-[#051C2C] hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCommitImport}
            disabled={parsedRows.length === 0}
            className="px-4 py-1.5 bg-[#2251FF] text-white rounded-md font-medium hover:bg-[#1a41cc] disabled:opacity-50 transition-colors shadow-xs"
          >
            Append {parsedRows.length} Rows
          </button>
        </div>
      </div>
    </div>
  );
};
