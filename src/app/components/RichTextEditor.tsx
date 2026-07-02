import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold, Italic, Underline, Heading2, Heading3, List, Minus, Type,
} from 'lucide-react';

const PALETTE = [
  { color: '#F1F5FF', label: 'White' },
  { color: '#93C5FD', label: 'Blue' },
  { color: '#6EE7B7', label: 'Green' },
  { color: '#C4B5FD', label: 'Purple' },
  { color: '#FCD34D', label: 'Amber' },
  { color: '#FCA5A5', label: 'Red' },
  { color: '#67E8F9', label: 'Cyan' },
  { color: '#94A3B8', label: 'Slate' },
];

interface RichTextEditorProps {
  html: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  toolbarAbove?: boolean;
}

function ToolBtn({
  onClick, title, active, children,
}: {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick(e); }}
      className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
        active ? 'bg-blue-500 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  html, onChange, placeholder = 'Click to edit…', className = '', toolbarAbove = true,
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (ref.current && !focused) {
      if (ref.current.innerHTML !== html) {
        ref.current.innerHTML = html || '';
      }
    }
  }, [html, focused]);

  const exec = useCallback((cmd: string, value?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, value ?? undefined);
    if (ref.current) onChange(ref.current.innerHTML);
  }, [onChange]);

  const isActive = (cmd: string) => {
    try { return document.queryCommandState(cmd); } catch { return false; }
  };

  const Toolbar = () => (
    <div
      className="flex items-center gap-0.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 shadow-lg flex-wrap"
      onMouseDown={e => e.preventDefault()}
    >
      {/* Format */}
      <ToolBtn onClick={() => exec('bold')} title="Bold" active={isActive('bold')}>
        <Bold className="w-3 h-3" />
      </ToolBtn>
      <ToolBtn onClick={() => exec('italic')} title="Italic" active={isActive('italic')}>
        <Italic className="w-3 h-3" />
      </ToolBtn>
      <ToolBtn onClick={() => exec('underline')} title="Underline" active={isActive('underline')}>
        <Underline className="w-3 h-3" />
      </ToolBtn>

      <div className="w-px h-4 bg-slate-200 mx-1" />

      {/* Headings */}
      <ToolBtn onClick={() => exec('formatBlock', 'h2')} title="Heading 2">
        <Heading2 className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => exec('formatBlock', 'h3')} title="Heading 3">
        <Heading3 className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => exec('formatBlock', 'p')} title="Paragraph">
        <Type className="w-3 h-3" />
      </ToolBtn>

      <div className="w-px h-4 bg-slate-200 mx-1" />

      {/* List */}
      <ToolBtn onClick={() => exec('insertUnorderedList')} title="Bullet list">
        <List className="w-3.5 h-3.5" />
      </ToolBtn>
      <ToolBtn onClick={() => exec('insertOrderedList')} title="Numbered list">
        <span className="text-[10px] font-mono leading-none">1.</span>
      </ToolBtn>

      <div className="w-px h-4 bg-slate-200 mx-1" />

      {/* Colors */}
      <div className="relative">
        <ToolBtn
          onClick={() => setShowColorPicker(p => !p)}
          title="Text colour"
        >
          <span className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 block" />
        </ToolBtn>
        {showColorPicker && (
          <div
            className="absolute top-8 left-0 z-30 flex gap-1 p-2 bg-white border border-slate-200 rounded-lg shadow-lg"
            onMouseDown={e => e.preventDefault()}
          >
            {PALETTE.map(({ color, label }) => (
              <button
                key={color}
                title={label}
                onMouseDown={e => {
                  e.preventDefault();
                  exec('foreColor', color);
                  setShowColorPicker(false);
                }}
                className="w-5 h-5 rounded-full border border-slate-200 hover:scale-125 transition-transform flex-shrink-0"
                style={{ background: color }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-4 bg-slate-200 mx-1" />

      {/* Clear */}
      <ToolBtn onClick={() => exec('removeFormat')} title="Clear formatting">
        <Minus className="w-3 h-3" />
      </ToolBtn>
    </div>
  );

  return (
    <div className="relative group/rte">
      {focused && toolbarAbove && (
        <div className="absolute -top-12 left-0 z-20">
          <Toolbar />
        </div>
      )}
      {focused && !toolbarAbove && (
        <div className="absolute -bottom-12 left-0 z-20">
          <Toolbar />
        </div>
      )}

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setShowColorPicker(false);
          if (ref.current) onChange(ref.current.innerHTML);
        }}
        onInput={() => { if (ref.current) onChange(ref.current.innerHTML); }}
        data-placeholder={placeholder}
        className={`
          outline-none min-h-[1em] transition-colors rounded
          focus:bg-slate-50 focus:ring-1 focus:ring-blue-500/30 px-1 py-0.5
          empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none
          [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:mt-2 [&_h2]:mb-1
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-1.5 [&_h3]:mb-0.5
          [&_strong]:font-semibold [&_em]:italic [&_u]:underline
          [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1
          [&_li]:text-slate-700
          ${className}
        `}
      />
    </div>
  );
}

interface InlineEditProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export function InlineEdit({ value, onChange, className = '', placeholder = 'Click to edit…', tag: Tag = 'div' }: InlineEditProps) {
  const ref = useRef<HTMLElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (ref.current && !focused && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value, focused]);

  return (
    // @ts-ignore – dynamic tag
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        if (ref.current) onChange(ref.current.textContent || '');
      }}
      data-placeholder={placeholder}
      className={`
        outline-none cursor-text transition-colors rounded px-1 -mx-1
        focus:bg-slate-50 focus:ring-1 focus:ring-blue-500/30
        empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none
        ${className}
      `}
    />
  );
}
