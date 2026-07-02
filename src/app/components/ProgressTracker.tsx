import { useState, useRef } from 'react';
import { Calendar, Edit2, Check } from 'lucide-react';
import { useFirebaseSync } from '../hooks/useFirebaseSync';

const MILESTONES = [
  { pct: 0, label: 'Kickoff' },
  { pct: 25, label: 'Strategy' },
  { pct: 50, label: 'Discovery' },
  { pct: 75, label: 'Delivery' },
  { pct: 100, label: 'Launch' },
];

export function ProgressTracker() {
  const [progress, setProgress] = useFirebaseSync("projectProgress", 25);
  const [isDragging, setIsDragging] = useState(false);
  const [targetDate, setTargetDate] = useFirebaseSync("targetDate", '16th June');
  const [editingDate, setEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(targetDate);
  const trackRef = useRef<HTMLDivElement>(null);

  const calculateProgress = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const buttonWidth = 28;
    const buttonRadius = buttonWidth / 2;
    const adjustedWidth = rect.width - buttonWidth;
    const x = clientX - rect.left - buttonRadius;
    const pct = Math.max(0, Math.min(100, (x / adjustedWidth) * 100));
    setProgress(Math.round(pct));
  };

  const activeMilestone = MILESTONES.reduce((best, m) => {
    if (m.pct <= progress) return m;
    return best;
  }, MILESTONES[0]);

  return (
    <div
      className="rounded-2xl border border-slate-200 overflow-hidden bg-white"
      style={{
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="px-8 pt-7 pb-6">
        <div className="flex items-start justify-between mb-7">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400 mb-1.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Project Progress
            </p>
            <div className="flex items-baseline gap-3">
              <span
                className="text-5xl font-light text-slate-900 tabular-nums"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {progress}%
              </span>
              <span className="text-slate-500 text-sm">complete</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Phase: <span className="text-slate-700">{activeMilestone.label}</span>
              &nbsp;·&nbsp;{100 - progress}% remaining
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span
              className="text-[10px] uppercase tracking-widest text-slate-500"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Target
            </span>
            {editingDate ? (
              <input
                value={tempDate}
                onChange={e => setTempDate(e.target.value)}
                onBlur={() => { setTargetDate(tempDate); setEditingDate(false); }}
                onKeyDown={e => { if (e.key === 'Enter') { setTargetDate(tempDate); setEditingDate(false); } }}
                className="text-sm font-medium text-slate-900 bg-transparent border-b border-blue-500/60 focus:outline-none w-28"
                autoFocus
              />
            ) : (
              <button
                onClick={() => { setEditingDate(true); setTempDate(targetDate); }}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors group"
              >
                {targetDate}
                <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
              </button>
            )}
          </div>
        </div>

        <div className="relative mb-3">
          <div
            ref={trackRef}
            className="relative h-2 bg-slate-200 rounded-full cursor-pointer"
            onMouseMove={e => { if (isDragging) calculateProgress(e.clientX); }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onClick={(e) => calculateProgress(e.clientX)}
          >
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 60%, #60A5FA 100%)',
                boxShadow: '0 0 12px rgba(59,130,246,0.5)',
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white cursor-grab active:cursor-grabbing shadow-lg flex items-center justify-center transition-transform hover:scale-125"
              style={{
                left: `calc(${progress}% - 10px)`,
                boxShadow: '0 0 0 3px rgba(59,130,246,0.4), 0 2px 8px rgba(0,0,0,0.4)',
              }}
              onMouseDown={e => { e.stopPropagation(); setIsDragging(true); }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>
          </div>

          <div className="absolute -top-1 left-0 right-0 flex justify-between pointer-events-none">
            {MILESTONES.map(m => (
              <div
                key={m.pct}
                className="flex flex-col items-center"
                style={{ left: `${m.pct}%` }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-5">
          {MILESTONES.map(m => {
            const active = m.pct <= progress;
            return (
              <div key={m.pct} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${active ? 'bg-blue-400' : 'bg-slate-300'}`}
                />
                <span
                  className={`text-[9px] uppercase tracking-widest transition-colors ${active ? 'text-blue-400' : 'text-slate-400'}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {m.label}
                </span>
                <span className={`text-[9px] tabular-nums transition-colors ${active ? 'text-slate-600' : 'text-slate-400'}`}>
                  {m.pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
