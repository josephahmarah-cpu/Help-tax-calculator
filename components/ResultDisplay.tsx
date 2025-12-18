
import React from 'react';
import { TaxCalculationResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface ResultDisplayProps {
  result: TaxCalculationResult;
  onSave: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onSave }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  const chartData = [
    { name: 'Net Income', value: result.netMonthlyIncome, color: '#10b981' },
    { name: 'Tax', value: result.monthlyTax, color: '#f43f5e' }
  ];

  // We filter out bands where no taxable amount fell into, 
  // but we show bands where tax is 0 if there was income in that band (the tax-free band)
  const bandData = result.bands
    .filter(b => b.taxableAmount > 0)
    .map(b => ({
      name: b.label.includes('(') ? b.label.split(' ')[0] + ' ' + b.label.split(' ')[1] : b.label,
      Tax: b.taxPayable / 12,
      Income: b.taxableAmount / 12
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-bold text-slate-800">Your Summary</h2>
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Calculation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
          <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">Monthly Take Home</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">{formatCurrency(result.netMonthlyIncome)}</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl">
          <p className="text-sm font-medium text-rose-600 uppercase tracking-wide">Monthly Tax</p>
          <p className="text-2xl font-bold text-rose-900 mt-1">{formatCurrency(result.monthlyTax)}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
          <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">Tax Percentage</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {result.annualGross > 0 ? ((result.annualTax / result.annualGross) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Monthly Income Split</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tax Per Band (Monthly)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bandData}>
                <XAxis dataKey="name" fontSize={10} tick={{fill: '#64748b'}} interval={0} angle={-15} textAnchor="end" />
                <YAxis hide />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="Tax" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Annual Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs uppercase text-slate-500 bg-slate-50">
              <tr>
                <th className="px-6 py-3 font-semibold">Description</th>
                <th className="px-6 py-3 font-semibold text-right">Amount (Annual)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-6 py-4">Total Gross Income</td>
                <td className="px-6 py-4 text-right font-medium">{formatCurrency(result.annualGross)}</td>
              </tr>
              <tr>
                <td className="px-6 py-4">Consolidated Relief (CRA)</td>
                <td className="px-6 py-4 text-right font-medium text-rose-500">-{formatCurrency(result.cra)}</td>
              </tr>
              <tr>
                <td className="px-6 py-4">Statutory Deductions (Pension, NHF, etc.)</td>
                <td className="px-6 py-4 text-right font-medium text-rose-500">-{formatCurrency(result.allowableDeductions)}</td>
              </tr>
              <tr className="bg-emerald-50/30">
                <td className="px-6 py-4 font-bold">Total Taxable Income</td>
                <td className="px-6 py-4 text-right font-bold text-emerald-700">{formatCurrency(result.taxableIncome)}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold">Total Annual Tax</td>
                <td className="px-6 py-4 text-right font-bold text-rose-600">{formatCurrency(result.annualTax)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
