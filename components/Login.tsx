
import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teamName, setTeamName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (isRegistering && !teamName)) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-700 rounded-3xl shadow-xl mb-4 rotate-3">
            <span className="text-4xl">🇳🇬</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">NaijaTax</h1>
          <p className="text-slate-500 text-sm mt-1">Professional Tax Planner for Teams</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8">
          <div className="flex gap-4 mb-8 p-1 bg-slate-100 rounded-2xl">
            <button 
              onClick={() => { setIsRegistering(false); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${!isRegistering ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsRegistering(true); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${isRegistering ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
            >
              Join Team
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold p-3 rounded-xl text-center animate-shake">
                {error}
              </div>
            )}

            {isRegistering && (
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Team Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-black focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                    placeholder="e.g. Finance Hub"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-black focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  placeholder="name@company.com"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 ml-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-black focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  placeholder="••••••••"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
              </div>
            </div>

            {!isRegistering && (
              <div className="text-right">
                <button type="button" className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider">Forgot Password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:shadow-emerald-200/50 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  {isRegistering ? 'CREATE TEAM ACCOUNT' : 'SECURE SIGN IN'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-8 uppercase tracking-[0.2em]">
          Protected by NaijaTax Secure Gateway
        </p>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default Login;
