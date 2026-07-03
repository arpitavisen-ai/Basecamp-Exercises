import { useState } from 'react';

const PASSWORD = 'spe2026';
const STORAGE_KEY = 'app_auth';

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setUnlocked(true);
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span
            className="text-sm font-semibold text-slate-900 tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Patient Feedback Intelligence Platform
          </span>
        </div>

        <p
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400 mb-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          S&amp;PE Product Demo
        </p>
        <h1
          className="text-2xl font-semibold text-slate-900 mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Enter password to continue
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-1 ${
              error
                ? 'border-red-300 focus:ring-red-400 bg-red-50'
                : 'border-slate-200 focus:ring-blue-500 bg-white'
            }`}
          />
          {error && (
            <p className="text-xs text-red-500">Incorrect password. Please try again.</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl px-4 py-3 transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
