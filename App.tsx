
import React, { useState, useMemo, useEffect } from 'react';
import { TaxInputs, EmploymentType, TaxHistoryRecord } from './types';
import { calculateTax } from './services/taxCalculator';
import TaxForm from './components/TaxForm';
import ResultDisplay from './components/ResultDisplay';
import TaxAssistantChat from './components/TaxAssistantChat';
import HistoryTracker from './components/HistoryTracker';
import { EDUCATIONAL_TIPS } from './constants';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<TaxInputs>({
    monthlyGrossIncome: 250000,
    otherIncome: 0,
    employmentType: EmploymentType.SALARIED,
    pensionContribution: 20000,
    nhfContribution: 0,
    otherDeductions: 0,
    year: new Date().getFullYear()
  });

  const [history, setHistory] = useState<TaxHistoryRecord[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('naijatax_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('naijatax_history', JSON.stringify(history));
  }, [history]);

  const taxResult = useMemo(() => calculateTax(inputs), [inputs]);

  const handleSaveCalculation = () => {
    const newRecord: TaxHistoryRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      inputs: { ...inputs },
      summary: {
        monthlyGross: inputs.monthlyGrossIncome + inputs.otherIncome,
        monthlyTax: taxResult.monthlyTax,
        monthlyNet: taxResult.netMonthlyIncome
      }
    };
    setHistory(prev => [newRecord, ...prev]);
    
    // Provide visual feedback by scrolling to the history section
    const historyEl = document.getElementById('history-section');
    if (historyEl) {
      historyEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleLoadHistoryInputs = (savedInputs: TaxInputs) => {
    setInputs(savedInputs);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all saved calculations?")) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-emerald-700 text-white py-12 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-800 rounded-full -ml-10 -mb-10 opacity-50 blur-2xl"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl">🇳🇬</span>
            <h1 className="text-4xl font-extrabold tracking-tighter">NaijaTax</h1>
          </div>
          <p className="text-emerald-100 max-w-2xl text-lg font-medium opacity-90 leading-relaxed">
            A secure and professional tax planner for Nigerian professionals. 
            Track your income history and stay ahead of your PAYE assessments.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-6xl mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Calculator Inputs & Education */}
          <div className="lg:col-span-4 space-y-6">
            <TaxForm inputs={inputs} setInputs={setInputs} />
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 Tax Education
              </h3>
              <div className="space-y-4">
                {EDUCATIONAL_TIPS.map((tip, idx) => (
                  <div key={idx} className="group cursor-help">
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">{tip.title}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl">
              <p className="text-xs text-amber-800 flex gap-3">
                 <svg className="w-6 h-6 flex-shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 <span>
                  <strong>Legal Disclaimer:</strong> This calculation is an estimate based on Nigerian PAYE principles and user inputs. It does not replace official tax assessment from FIRS or State Internal Revenue Services. Tax laws are subject to change.
                 </span>
              </p>
            </div>
          </div>

          {/* Right Column: Results & History & AI Assistant */}
          <div className="lg:col-span-8 space-y-8">
            <ResultDisplay result={taxResult} onSave={handleSaveCalculation} />
            
            <div id="history-section" className="scroll-mt-8">
              <HistoryTracker 
                history={history} 
                onDelete={handleDeleteHistoryItem} 
                onLoad={handleLoadHistoryInputs}
                onClear={handleClearHistory}
              />
            </div>

            <div className="mt-8">
               <div className="flex items-center justify-between mb-4 px-2">
                 <h2 className="text-2xl font-bold text-slate-800">Tax Expert Assistant</h2>
                 <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                   AI Powered
                 </span>
               </div>
               <TaxAssistantChat />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 py-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-emerald-700">
            <span className="text-2xl">🇳🇬</span>
            <span className="font-bold text-xl tracking-tighter">NaijaTax</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} NaijaTax Systems. Helping Nigerian professionals calculate with confidence.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
