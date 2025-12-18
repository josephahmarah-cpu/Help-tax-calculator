
import React from 'react';
import { TaxInputs, EmploymentType } from '../types';

interface TaxFormProps {
  inputs: TaxInputs;
  setInputs: React.Dispatch<React.SetStateAction<TaxInputs>>;
}

const TaxForm: React.FC<TaxFormProps> = ({ inputs, setInputs }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'number' || name === 'year' ? parseFloat(value) || 0 : value
    }));
  };

  const inputClass = "w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-slate-700";
  const labelClass = "block text-sm font-semibold text-slate-600 mb-1.5";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <span className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </span>
        Income & Deductions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Tax Year</label>
          <select
            name="year"
            value={inputs.year}
            onChange={handleChange}
            className={inputClass}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Employment Type</label>
          <select
            name="employmentType"
            value={inputs.employmentType}
            onChange={handleChange}
            className={inputClass}
          >
            <option value={EmploymentType.SALARIED}>Salaried (PAYE)</option>
            <option value={EmploymentType.SELF_EMPLOYED}>Self-Employed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Monthly Gross Income (₦)</label>
          <input
            type="number"
            name="monthlyGrossIncome"
            value={inputs.monthlyGrossIncome || ''}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Other Monthly Income (₦)</label>
          <input
            type="number"
            name="otherIncome"
            value={inputs.otherIncome || ''}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
      </div>

      <hr className="border-slate-100" />

      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Allowable Deductions (Monthly)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Pension</label>
          <input
            type="number"
            name="pensionContribution"
            value={inputs.pensionContribution || ''}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>NHF</label>
          <input
            type="number"
            name="nhfContribution"
            value={inputs.nhfContribution || ''}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Others</label>
          <input
            type="number"
            name="otherDeductions"
            value={inputs.otherDeductions || ''}
            onChange={handleChange}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

export default TaxForm;
