import { ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PersonaCardProps {
  imageUrl: string;
  title: string;
  goals: string;
  painPoints: string;
  motivators: string;
  opportunities: string;
  onClick: () => void;
}

export function PersonaCard({ imageUrl, title, goals, painPoints, motivators, opportunities, onClick }: PersonaCardProps) {
  const goalLines = goals.split('\n').filter(l => l.trim());
  const stats = [
    { label: 'Goals', count: goalLines.length, bg: 'bg-emerald-50', color: 'text-emerald-700' },
    { label: 'Pain Points', count: painPoints.split('\n').filter(l => l.trim()).length, bg: 'bg-rose-50', color: 'text-rose-700' },
    { label: 'Motivators', count: motivators.split('\n').filter(l => l.trim()).length, bg: 'bg-blue-50', color: 'text-blue-700' },
    { label: 'Opportunities', count: opportunities.split('\n').filter(l => l.trim()).length, bg: 'bg-violet-50', color: 'text-violet-700' },
  ];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer group hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-200"
    >
      {/* Hero image */}
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">User Persona</p>
          <h3 className="text-white text-2xl font-bold leading-tight">{title}</h3>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className={`flex flex-col items-center py-3.5 border-r border-gray-100 last:border-r-0 ${s.bg}`}>
            <span className={`text-xl font-bold ${s.color}`}>{s.count}</span>
            <span className="text-[10px] text-gray-500 mt-0.5 text-center leading-tight px-0.5">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Goals preview */}
      <div className="px-5 pt-5">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Key Goals</p>
        <ul className="space-y-2">
          {goalLines.slice(0, 3).map((g, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1.5 flex-shrink-0 w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm text-gray-600 leading-relaxed">{g.trim()}</span>
            </li>
          ))}
          {goalLines.length > 3 && (
            <li className="text-xs text-gray-400 pl-6">+{goalLines.length - 3} more goals</li>
          )}
        </ul>
      </div>

      {/* CTA */}
      <div className="p-5">
        <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors">
          <span className="text-sm font-semibold text-gray-500 group-hover:text-blue-700 transition-colors">
            View Full Profile
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
}
