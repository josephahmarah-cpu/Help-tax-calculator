
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const TaxAssistantChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getGeminiResponse(messages, input);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error: Could not connect to tax expert." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col h-[70vh] md:h-[600px] overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-emerald-50/30">
        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-sm">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 leading-tight">Tax Expert AI</h3>
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Online & Ready</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 p-8">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <p className="text-sm font-medium text-slate-400">Ask me about tax bands, reliefs, or the Finance Act.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm' 
                : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl px-4 py-2.5 text-slate-400 rounded-tl-none animate-pulse flex items-center gap-2 text-xs">
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm text-black focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
            placeholder="Type your question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white w-12 h-12 rounded-2xl transition-all shadow-md flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxAssistantChat;
