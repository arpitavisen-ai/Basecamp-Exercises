import { useState } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}

export function EditableText({
  value,
  onChange,
  multiline = false,
  className = "",
  placeholder = "Click to edit..."
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

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
          className={`${className} bg-transparent border border-blue-500/50 rounded px-2 py-1 w-full resize-none focus:outline-none`}
          autoFocus
          rows={Math.max(3, tempValue.split('\n').length)}
          placeholder={placeholder}
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
        className={`${className} bg-transparent border border-blue-500/50 rounded px-2 py-1 w-full focus:outline-none`}
        autoFocus
        placeholder={placeholder}
      />
    );
  }

  return (
    <div
      onClick={() => {
        setIsEditing(true);
        setTempValue(value);
      }}
      className={`${className} cursor-pointer hover:bg-slate-100 rounded px-2 py-1 transition-colors ${!value ? 'opacity-40' : ''}`}
    >
      {value || placeholder}
    </div>
  );
}
