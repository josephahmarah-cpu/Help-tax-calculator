
import React, { useState, useMemo, useEffect } from 'react';
import { TaxInputs, EmploymentType, TaxHistoryRecord } from './types';
import { calculateTax } from './services/taxCalculator';
import TaxForm from './components/TaxForm';
import ResultDisplay from './components/ResultDisplay';
import TaxAssistantChat from './components/TaxAssistantChat';
import HistoryTracker from './components/HistoryTracker';
import Login from './components/Login';
import { EDUCATIONAL_TIPS } from './constants';

type AppTab = 'calculator' | 'history' | 'assistant';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState<AppTab>('calculator');
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

  useEffect(() => {
    // Check for existing session
    const session = localStorage.getItem('naijatax_session');
    if (session) {
      const data = JSON.parse(session);
      setIsAuthenticated(true);
      setUserEmail(data.email);
    }

    const savedHistory = localStorage.getItem('naijatax_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('naijatax_history', JSON.stringify(history));
    }
  }, [history, isAuthenticated]);

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
    setActiveTab('history');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleLoadHistoryInputs = (savedInputs: TaxInputs) => {
    setInputs(savedInputs);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    if (window.confirm("Delete all saved calculations?")) {
      setHistory([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('naijatax_session');
    setIsAuthenticated(false);
    setUserEmail('');
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={(email) => {
      setIsAuthenticated(true);
      setUserEmail(email);
      localStorage.setItem('naijatax_session', JSON.stringify({ email }));
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto md:max-w-6xl relative">
      
      {/* Top App Bar */}
      <header className="bg-emerald-700 text-white p-4 sticky top-0 z-30 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇳🇬</span>
            <h1 className="text-xl font-black tracking-tighter">NaijaTax</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-bold uppercase opacity-60 leading-none">Logged in as</p>
              <p className="text-xs font-semibold">{userEmail}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-emerald-100 hover:text-white transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <button 
              onClick={() => setActiveTab('assistant')}
              className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-12 pt-6 px-4">
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            {/* Desktop Left: Form */}
            <div className="lg:col-span-5 space-y-6">
              <TaxForm inputs={inputs} setInputs={setInputs} />
              
              <div className="hidden md:block bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                   <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Tax Education
                </h3>
                <div className="space-y-4">
                  {EDUCATIONAL_TIPS.map((tip, idx) => (
                    <div key={idx}>
                      <p className="text-sm font-semibold text-slate-700">{tip.title}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Right: Results */}
            <div className="lg:col-span-7">
              <ResultDisplay result={taxResult} onSave={handleSaveCalculation} />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-300">
            <HistoryTracker 
              history={history} 
              onDelete={handleDeleteHistoryItem} 
              onLoad={handleLoadHistoryInputs}
              onClear={handleClearHistory}
            />
          </div>
        )}

        {activeTab === 'assistant' && (
          <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-2xl font-bold text-slate-800">Tax Expert AI</h2>
              <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Active
              </span>
            </div>
            <TaxAssistantChat />
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar (Mobile) / Tab Switcher (Desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 pb-8 md:pb-2 z-40 max-w-md mx-auto md:max-w-6xl">
        <div className="flex justify-around items-center h-12">
          <button 
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'calculator' ? 'text-emerald-700' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Calc</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-emerald-700' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="text-[10px] font-bold uppercase tracking-tighter">History</span>
          </button>

          <button 
            onClick={() => setActiveTab('assistant')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'assistant' ? 'text-emerald-700' : 'text-slate-400'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
            <span className="text-[10px] font-bold uppercase tracking-tighter">AI Expert</span>
          </button>
        </div>
      </nav>

      <footer className="hidden md:block py-6 bg-slate-100 text-center text-slate-400 text-[10px] font-medium uppercase tracking-[0.2em] mb-14">
        NaijaTax © {new Date().getFullYear()} • Secure Personal Income Tax Planner
      </footer>
    </div>
  );
};

export default App;
