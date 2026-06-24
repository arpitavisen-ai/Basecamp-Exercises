import { EditableText } from './EditableText';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Target, AlertCircle, Zap, Lightbulb } from 'lucide-react';

interface PersonaCardProps {
  imageUrl: string;
  title: string;
  goals: string;
  painPoints: string;
  motivators: string;
  opportunities: string;
  onUpdate: (field: string, value: string) => void;
}

const sections = [
  {
    key: 'goals' as const,
    label: 'Goals',
    icon: Target,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    bulletColor: 'green' as const,
  },
  {
    key: 'painPoints' as const,
    label: 'Pain Points',
    icon: AlertCircle,
    iconColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-100',
    bulletColor: 'red' as const,
  },
  {
    key: 'motivators' as const,
    label: 'Motivators',
    icon: Zap,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    bulletColor: 'blue' as const,
  },
  {
    key: 'opportunities' as const,
    label: 'Opportunities',
    icon: Lightbulb,
    iconColor: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-100',
    bulletColor: 'purple' as const,
  },
];

export function PersonaCard({
  imageUrl,
  title,
  goals,
  painPoints,
  motivators,
  opportunities,
  onUpdate
}: PersonaCardProps) {
  const values: Record<string, string> = { goals, painPoints, motivators, opportunities };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="p-6">
        <EditableText
          value={title}
          onChange={(value) => onUpdate('title', value)}
          className="text-xl font-bold text-gray-900 mb-5 block"
        />

        <div className="space-y-3">
          {sections.map(({ key, label, icon: Icon, iconColor, bgColor, borderColor, bulletColor }) => (
            <div key={key} className={`rounded-xl border ${borderColor} ${bgColor} overflow-hidden`}>
              <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${borderColor}`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
                <h4 className={`text-xs font-bold uppercase tracking-widest ${iconColor}`}>
                  {label}
                </h4>
              </div>
              <div className="px-2 py-2">
                <EditableText
                  value={values[key]}
                  onChange={(value) => onUpdate(key, value)}
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
      </div>
    </div>
  );
}
