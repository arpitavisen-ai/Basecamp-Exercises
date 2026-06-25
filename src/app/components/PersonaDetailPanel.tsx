import { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Target, AlertCircle, Zap, Lightbulb } from 'lucide-react';
import { EditableText } from './EditableText';
import { ImageWithFallback } from './figma/ImageWithFallback';

const SECTIONS = [
  { key: 'goals', label: 'Goals', icon: Target, iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100', bulletColor: 'green' as const },
  { key: 'painPoints', label: 'Pain Points', icon: AlertCircle, iconColor: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-100', bulletColor: 'red' as const },
  { key: 'motivators', label: 'Motivators', icon: Zap, iconColor: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-100', bulletColor: 'blue' as const },
  { key: 'opportunities', label: 'Opportunities', icon: Lightbulb, iconColor: 'text-violet-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-100', bulletColor: 'purple' as const },
];

interface PersonaData {
  imageUrl: string;
  title: string;
  goals: string;
  painPoints: string;
  motivators: string;
  opportunities: string;
}

interface PersonaDetailPanelProps {
  persona: PersonaData;
  onClose: () => void;
  onUpdate: (field: string, value: string) => void;
}

export function PersonaDetailPanel({ persona, onClose, onUpdate }: PersonaDetailPanelProps) {
  const values: Record<string, string> = {
    goals: persona.goals,
    painPoints: persona.painPoints,
    motivators: persona.motivators,
    opportunities: persona.opportunities,
  };

  const countItems = (text: string) => text.split('\n').filter(l => l.trim()).length;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="fixed right-0 top-0 h-full w-full max-w-[580px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Hero */}
        <div className="relative h-56 flex-shrink-0">
          <ImageWithFallback src={persona.imageUrl} alt={persona.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-5 left-6 right-16">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-[10px] font-bold tracking-widest uppercase mb-2">
              User Persona
            </span>
            <EditableText
              value={persona.title}
              onChange={(v) => onUpdate('title', v)}
              className="text-2xl font-bold text-white"
            />
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          {[
            { label: 'Goals', value: countItems(persona.goals), color: 'text-emerald-600' },
            { label: 'Pain Points', value: countItems(persona.painPoints), color: 'text-rose-600' },
            { label: 'Motivators', value: countItems(persona.motivators), color: 'text-blue-600' },
            { label: 'Opportunities', value: countItems(persona.opportunities), color: 'text-violet-600' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center py-4 border-r border-gray-100 last:border-r-0">
              <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] text-gray-500 mt-0.5 text-center leading-tight px-1">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {SECTIONS.map(({ key, label, icon: Icon, iconColor, bgColor, borderColor, bulletColor }) => (
            <div key={key} className={`rounded-xl border ${borderColor} ${bgColor} overflow-hidden`}>
              <div className={`flex items-center gap-2 px-4 py-3 border-b ${borderColor}`}>
                <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0`} />
                <h4 className={`text-xs font-bold uppercase tracking-widest ${iconColor}`}>{label}</h4>
              </div>
              <div className="px-2 py-2">
                <EditableText
                  value={values[key]}
                  onChange={(v) => onUpdate(key, v)}
                  multiline
                  listMode
                  bulletColor={bulletColor}
                  className="text-gray-700 text-sm"
                  placeholder={`Add ${label.toLowerCase()}...`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
