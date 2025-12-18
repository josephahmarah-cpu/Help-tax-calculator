
import React, { useState, useMemo } from 'react';
import { TaxHistoryRecord, TaxInputs } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HistoryTrackerProps {
  history: TaxHistoryRecord[];
  onDelete: (id: string) => void;
  onLoad: (inputs: TaxInputs) => void;
  onClear: () => void;
}

const HistoryTracker: React.FC<HistoryTrackerProps> = ({ history, onDelete, onLoad, onClear }) => {
  const [viewMode, setViewMode] = useState<'list' | 'trends'>('list');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (timestamp: number, short = false) => {
    return new Date(timestamp).toLocaleDateString('en-NG', {
      month: 'short',
      day: short ? undefined : 'numeric',
      year: short ? '2-digit' : 'numeric',
    });
  };

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => a.timestamp - b.timestamp);
  }, [history]);

  const trendData = useMemo(() => {
    return sortedHistory.map(record => ({
      date: `${record.inputs.year} (${formatDate(record.timestamp, true)})`,
      Gross: record.summary.monthlyGross,
      Net: record.summary.monthlyNet,
      Tax: record.summary.monthlyTax,
      originalTimestamp: record.timestamp
    }));
  }, [sortedHistory, formatDate]);

  const exportToCSV = () => {
    if (history.length === 0) return;
    
    const headers = ['Saved At', 'Tax Year', 'Monthly Gross', 'Pension', 'NHF', 'Other Deductions', 'Monthly Tax', 'Monthly Net'];
    const rows = history.map(r => [
      new Date(r.timestamp).toISOString(),
      r.inputs.year,
      r.summary.monthlyGross,
      r.inputs.pensionContribution,
      r.inputs.nhfContribution,
      r.inputs.otherDeductions,
      r.summary.monthlyTax,
      r.summary.monthlyNet
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `naijatax_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (history.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">Your tax timeline is empty</h3>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">
          Save your calculations to track your monthly income progression and visualize tax trends over time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between bg-slate-50/50 gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-slate-800">History & Analysis</h3>
          <div className="flex p-1 bg-slate-200 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('trends')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'trends' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Trends
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
          <button 
            onClick={onClear}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 px-2 py-1 transition-colors uppercase tracking-wider"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="p-6">
        {viewMode === 'trends' ? (
          <div className="h-80 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" fontSize={11} tick={{fill: '#94a3b8'}} />
                <YAxis fontSize={11} tick={{fill: '#94a3b8'}} hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
                <Line type="monotone" dataKey="Gross" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Net" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Tax" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest">Income Progression Over Time (₦)</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left">
              <thead className="text-xs uppercase text-slate-500 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 font-semibold">Tax Year</th>
                  <th className="px-6 py-3 font-semibold">Monthly Gross</th>
                  <th className="px-6 py-3 font-semibold">Monthly Tax</th>
                  <th className="px-6 py-3 font-semibold">Monthly Net</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[...history].sort((a,b) => b.timestamp - a.timestamp).map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm block text-slate-900 font-bold">
                        {record.inputs.year}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Saved: {new Date(record.timestamp).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{formatCurrency(record.summary.monthlyGross)}</td>
                    <td className="px-6 py-4 text-sm text-rose-500">-{formatCurrency(record.summary.monthlyTax)}</td>
                    <td className="px-6 py-4 text-sm text-emerald-600 font-bold">{formatCurrency(record.summary.monthlyNet)}</td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <button
                        onClick={() => onLoad(record.inputs)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Reload this configuration"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete entry"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTracker;
