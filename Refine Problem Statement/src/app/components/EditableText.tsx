import { useState } from 'react';
import { Pencil } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  listMode?: boolean;
  richMode?: boolean;
  bulletColor?: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'gray';
  className?: string;
  placeholder?: string;
}

const bulletDot: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  red: 'bg-rose-500',
  purple: 'bg-violet-500',
  orange: 'bg-amber-500',
  gray: 'bg-gray-400',
};

const bulletRing: Record<string, string> = {
  blue: 'bg-blue-100',
  green: 'bg-emerald-100',
  red: 'bg-rose-100',
  purple: 'bg-violet-100',
  orange: 'bg-amber-100',
  gray: 'bg-gray-100',
};

interface RichSection {
  header: string;
  items: string[];
  plain: string[];
}

function parseRichContent(text: string): RichSection[] {
  const lines = text.split('\n');
  const sections: RichSection[] = [];
  let current: RichSection = { header: '', items: [], plain: [] };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.trim() === '') {
      if (current.header || current.items.length > 0 || current.plain.length > 0) {
        sections.push(current);
        current = { header: '', items: [], plain: [] };
      }
      continue;
    }
    const stripped = line.trim();
    if (stripped.startsWith('•') || stripped.startsWith('–') || stripped.startsWith('-')) {
      current.items.push(stripped.replace(/^[•\-–]\s*/, ''));
    } else if (stripped.startsWith('☐') || stripped.startsWith('☑')) {
      current.items.push(stripped);
    } else {
      if (current.items.length > 0 || current.plain.length > 0) {
        sections.push(current);
        current = { header: '', items: [], plain: [] };
      }
      current.header = stripped;
    }
  }
  if (current.header || current.items.length > 0 || current.plain.length > 0) {
    sections.push(current);
  }
  return sections;
}

export function EditableText({
  value,
  onChange,
  multiline = false,
  listMode = false,
  richMode = false,
  bulletColor = 'gray',
  className = "",
  placeholder = "Click to edit..."
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const startEditing = () => {
    setTempValue(value);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(tempValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${className} border-2 border-blue-400 rounded-lg px-3 py-2.5 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 bg-blue-50/60 transition-all placeholder:text-gray-400 font-mono text-sm`}
          autoFocus
          rows={Math.max(4, tempValue.split('\n').length + 1)}
          placeholder={listMode ? "One item per line..." : placeholder}
        />
      );
    }
    return (
      <input
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} border-2 border-blue-400 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 bg-blue-50/60 transition-all placeholder:text-gray-400`}
        autoFocus
        placeholder={placeholder}
      />
    );
  }

  // Rich content display: headers + bullet lists parsed from text
  if (richMode && value) {
    const sections = parseRichContent(value);
    return (
      <div
        onClick={startEditing}
        className="group relative cursor-pointer rounded-lg p-2 hover:bg-black/5 transition-colors"
      >
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i}>
              {section.header && (
                <p className="font-semibold text-gray-800 text-sm mb-2 leading-snug">
                  {section.header}
                </p>
              )}
              {section.items.length > 0 && (
                <ul className="space-y-1.5">
                  {section.items.map((item, j) => {
                    const isCheckbox = item.startsWith('☐') || item.startsWith('☑');
                    return (
                      <li key={j} className="flex items-start gap-2.5">
                        {isCheckbox ? (
                          <span className="text-base leading-none mt-0.5 flex-shrink-0">{item[0]}</span>
                        ) : (
                          <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400" />
                        )}
                        <span className="text-gray-600 text-sm leading-relaxed">
                          {isCheckbox ? item.slice(1).trim() : item}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
        <Pencil className="absolute top-2 right-2 w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  }

  // Bullet list display (newline-separated items for persona card fields)
  if (listMode && value) {
    const lines = value.split('\n').filter(line => line.trim());
    return (
      <div
        onClick={startEditing}
        className="group relative cursor-pointer rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
      >
        <ul className="space-y-2">
          {lines.map((line, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className={`mt-1.5 flex-shrink-0 w-3.5 h-3.5 rounded-full ${bulletRing[bulletColor]} flex items-center justify-center`}>
                <span className={`w-1.5 h-1.5 rounded-full ${bulletDot[bulletColor]}`} />
              </span>
              <span className={`${className} leading-relaxed`}>{line.trim()}</span>
            </li>
          ))}
        </ul>
        <Pencil className="absolute top-1.5 right-1.5 w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  }

  // Empty list/rich placeholder
  if ((listMode || richMode) && !value) {
    return (
      <div
        onClick={startEditing}
        className="group relative cursor-pointer rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors text-gray-400 text-sm italic"
      >
        {placeholder}
        <Pencil className="absolute top-1.5 right-1.5 w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  }

  // Regular text / paragraph display
  return (
    <div
      onClick={startEditing}
      className={`${className} group relative cursor-pointer rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors ${!value ? 'text-gray-400 italic' : ''}`}
    >
      {multiline && value ? (
        <span className="whitespace-pre-wrap leading-relaxed">{value}</span>
      ) : (
        value || placeholder
      )}
      <Pencil className="absolute top-1.5 right-1.5 w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
