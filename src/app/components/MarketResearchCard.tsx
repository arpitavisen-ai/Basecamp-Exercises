import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { EditableText } from './EditableText';

const CARD_IMAGES = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600',
];

const ACCENTS = [
  'from-blue-500 to-blue-700',
  'from-emerald-500 to-emerald-700',
  'from-violet-500 to-violet-700',
  'from-orange-500 to-orange-700',
  'from-rose-500 to-rose-700',
  'from-teal-500 to-teal-700',
  'from-indigo-500 to-indigo-700',
  'from-amber-500 to-amber-700',
];

interface MarketResearchCardProps {
  index: number;
  title: string;
  description: string;
  onUpdate: (field: string, value: string) => void;
  onDelete: () => void;
}

export function MarketResearchCard({ index, title, description, onUpdate, onDelete }: MarketResearchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const image = CARD_IMAGES[index % CARD_IMAGES.length];
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title || 'Research area'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r ${accent} text-white text-xs font-bold shadow-sm`}>
          Research Area {index + 1}
        </div>
        <button
          onClick={onDelete}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-red-500/80 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <div className={`absolute bottom-3 left-4 w-9 h-9 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center text-white font-bold text-base shadow-lg`}>
          {index + 1}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col">
        <EditableText
          value={title}
          onChange={(v) => onUpdate('title', v)}
          className="font-bold text-gray-900 text-base mb-1"
          placeholder="Research title..."
        />
        <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96' : 'max-h-[4.5rem]'}`}>
          <EditableText
            value={description}
            onChange={(v) => onUpdate('description', v)}
            multiline
            className="text-gray-500 text-sm leading-relaxed"
            placeholder="Describe this research activity..."
          />
        </div>
        {description && description.length > 80 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2 font-semibold self-start"
          >
            {expanded
              ? <><ChevronUp className="w-3 h-3" /> Show less</>
              : <><ChevronDown className="w-3 h-3" /> Read more</>}
          </button>
        )}
      </div>
    </div>
  );
}
