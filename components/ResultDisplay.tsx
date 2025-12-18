
import React, { useRef, useState } from 'react';
import { TaxCalculationResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultDisplayProps {
  result: TaxCalculationResult;
  onSave: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onSave }) => {
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    
    setIsExporting(true);
    try {
      const element = pdfRef.current;
      
      // We use html2canvas to take a snapshot of the result section
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // You could manipulate the cloned document here if needed
          const el = clonedDoc.querySelector('.pdf-capture-area') as HTMLElement;
          if (el) el.style.padding = '40px';
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions (A4 size is ~595x842 px)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 40; // margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // If the content is taller than the page, we might need multiple pages, 
      // but for this summary, one page is usually enough or we scale it.
      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
      pdf.save(`NaijaTax_Summary_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF generation failed', error);
      alert('There was an error generating your PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const chartData = [
    { name: 'Net Income', value: result.netMonthlyIncome, color: '#10b981' },
    { name: 'Tax', value: result.monthlyTax, color: '#f43f5e' }
  ];

  const bandData = result.bands
    .filter(b => b.taxableAmount > 0)
    .map(b => ({
      name: b.label.includes('(') ? b.label.split(' ')[0] + ' ' + b.label.split(' ')[1] : b.label,
      Tax: b.taxPayable / 12,
      Income: b.taxableAmount / 12
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Your Summary</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-50"
          >
            {isExporting ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            Download PDF
          </button>
          <button
            onClick={onSave}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Calculation
          </button>
        </div>
      </div>

      <div ref={pdfRef} className="space-y-6 p-6 rounded-2xl pdf-capture-area bg-white shadow-xl border border-slate-100">
        {/* PDF Document Header (Always visible now for professional look) */}
        <div className="flex justify-between items-start border-b-2 border-emerald-500 pb-6 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🇳🇬</span>
              <h1 className="text-3xl font-black text-emerald-700 tracking-tighter">NaijaTax</h1>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Tax Calculation Summary</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">Generated On</p>
            <p className="text-slate-700 text-sm font-bold">{new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Monthly Net Pay</p>
            <p className="text-2xl font-black text-emerald-900">{formatCurrency(result.netMonthlyIncome)}</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl">
            <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">Monthly Tax (PAYE)</p>
            <p className="text-2xl font-black text-rose-900">{formatCurrency(result.monthlyTax)}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Effective Tax Rate</p>
            <p className="text-2xl font-black text-slate-900">
              {result.annualGross > 0 ? ((result.annualTax / result.annualGross) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Income Allocation</h3>
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

          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Tax Per Band</h3>
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

        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Annual Tax Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase text-slate-400 bg-white">
                <tr>
                  <th className="px-6 py-3 font-bold">Component</th>
                  <th className="px-6 py-3 font-bold text-right">Annual Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">Total Gross Earnings</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(result.annualGross)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">Consolidated Relief (CRA)</td>
                  <td className="px-6 py-4 text-right font-medium text-rose-500">({formatCurrency(result.cra)})</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">Pension & Allowable Deductions</td>
                  <td className="px-6 py-4 text-right font-medium text-rose-500">({formatCurrency(result.allowableDeductions)})</td>
                </tr>
                <tr className="bg-emerald-50/50">
                  <td className="px-6 py-4 text-sm font-bold text-emerald-800">Total Taxable Income</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-700 underline decoration-emerald-200 underline-offset-4">{formatCurrency(result.taxableIncome)}</td>
                </tr>
                <tr className="border-t-2 border-slate-200">
                  <td className="px-6 py-5 text-base font-black text-slate-900">Total Annual Tax Liability</td>
                  <td className="px-6 py-5 text-right text-lg font-black text-rose-600">{formatCurrency(result.annualTax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="pt-6 mt-6 border-t border-slate-100 text-center">
          <p className="text-[9px] text-slate-400 uppercase tracking-[0.3em]">NaijaTax • Professional Tax Reporting • Not Official Tax Advice</p>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
