import { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { exportScriptPptx } from '../lib/exportScriptPptx';
import { InlineEdit, RichTextEditor } from './RichTextEditor';
import { useFirebaseSync } from '../hooks/useFirebaseSync';
import { SEED_DRAFT_SCRIPT, type ScriptBlock } from '../data/seedData';

export type { ScriptBlock };

const ACCENT_OPTIONS = [
  { value: 'indigo', border: 'border-l-indigo-500', badge: 'bg-indigo-100 text-indigo-700' },
  { value: 'sky',    border: 'border-l-sky-500',    badge: 'bg-sky-100 text-sky-700' },
  { value: 'emerald',border: 'border-l-emerald-500',badge: 'bg-emerald-100 text-emerald-700' },
  { value: 'amber',  border: 'border-l-amber-500',  badge: 'bg-amber-100 text-amber-700' },
  { value: 'rose',   border: 'border-l-rose-500',   badge: 'bg-rose-100 text-rose-700' },
  { value: 'purple', border: 'border-l-purple-500', badge: 'bg-purple-100 text-purple-700' },
  { value: 'slate',  border: 'border-l-slate-400',  badge: 'bg-slate-100 text-slate-700' },
];

function getAccent(value: string) {
  return ACCENT_OPTIONS.find(a => a.value === value) ?? ACCENT_OPTIONS[0];
}

export function DraftScript() {
  const [blocks, setBlocks, flushBlocks] = useFirebaseSync<ScriptBlock[]>(
    'draftScript',
    SEED_DRAFT_SCRIPT
  );
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportScriptPptx(blocks);
    } finally {
      setExporting(false);
    }
  };

  const update = (id: string, field: keyof ScriptBlock, value: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const addBlock = () => {
    const id = `block-${Date.now()}`;
    setBlocks(prev => [
      ...prev,
      { id, label: `${prev.length + 1}`, title: 'New Section', body: '<p>Click to edit…</p>', accent: 'slate' },
    ]);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const toggleCollapse = (id: string) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };

  return (
    <div className="flex gap-8 items-start">
      {/* Left nav — document outline */}
      <aside className="hidden lg:flex flex-col gap-1 w-52 flex-shrink-0 sticky top-6 max-h-[80vh] overflow-y-auto pr-2">
        <p
          className="text-[9px] uppercase tracking-[0.18em] text-slate-400 mb-2 px-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Sections
        </p>
        {blocks.map(b => {
          const accent = getAccent(b.accent);
          return (
            <button
              key={b.id}
              onClick={() => {
                setActiveNav(b.id);
                document.getElementById(b.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 group ${
                activeNav === b.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold flex-shrink-0 ${accent.badge}`}>
                {b.label}
              </span>
              <span className="truncate leading-snug">{b.title}</span>
            </button>
          );
        })}
        <button
          onClick={addBlock}
          className="mt-2 flex items-center gap-1.5 px-3 py-2 text-xs text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Plus className="w-3 h-3" /> Add section
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              All sections editable · changes auto-saved
            </p>
            <h2
              className="text-2xl font-semibold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AI in the PDLC — Presentation Script
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {exporting ? 'Exporting…' : 'Download .pptx'}
            </button>
            <button
              onClick={() => flushBlocks()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Save all
            </button>
            <button
              onClick={addBlock}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Section
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {blocks.map((block, idx) => {
            const accent = getAccent(block.accent);
            const isCollapsed = collapsed[block.id];

            return (
              <div
                key={block.id}
                id={block.id}
                className={`bg-white border border-slate-200 border-l-4 ${accent.border} rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md`}
              >
                {/* Block header */}
                <div className="flex items-center gap-3 px-5 py-4">
                  {/* Drag handle / move buttons */}
                  <div className="flex flex-col gap-0.5 flex-shrink-0 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveBlock(block.id, -1)}
                      disabled={idx === 0}
                      className="text-slate-300 hover:text-slate-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <GripVertical className="w-3.5 h-3.5 text-slate-300" />
                    <button
                      onClick={() => moveBlock(block.id, 1)}
                      disabled={idx === blocks.length - 1}
                      className="text-slate-300 hover:text-slate-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Label badge — editable */}
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold flex-shrink-0 ${accent.badge}`}>
                    <InlineEdit
                      value={block.label}
                      onChange={v => update(block.id, 'label', v)}
                      className="w-full text-center text-xs font-bold"
                      placeholder="§"
                    />
                  </div>

                  {/* Title — editable */}
                  <div className="flex-1 min-w-0">
                    <InlineEdit
                      value={block.title}
                      onChange={v => update(block.id, 'title', v)}
                      className="text-base font-semibold text-slate-900 w-full"
                      placeholder="Section title…"
                      tag="h3"
                    />
                  </div>

                  {/* Accent colour picker */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {ACCENT_OPTIONS.map(a => (
                      <button
                        key={a.value}
                        onClick={() => update(block.id, 'accent', a.value)}
                        title={a.value}
                        className={`w-3.5 h-3.5 rounded-full border-2 transition-transform hover:scale-125 ${
                          block.accent === a.value ? 'border-slate-700 scale-125' : 'border-transparent'
                        } ${a.badge.split(' ')[0]}`}
                      />
                    ))}
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => toggleCollapse(block.id)}
                    className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                    title={isCollapsed ? 'Expand' : 'Collapse'}
                  >
                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors flex-shrink-0"
                    title="Delete section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Body — rich text editor */}
                {!isCollapsed && (
                  <div className="px-6 pb-6 pt-1 border-t border-slate-100">
                    <div className="mt-4 relative">
                      <RichTextEditor
                        html={block.body}
                        onChange={v => update(block.id, 'body', v)}
                        placeholder="Start writing this section…"
                        className="text-sm text-slate-700 leading-relaxed min-h-[80px]"
                        toolbarAbove
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add section button at bottom */}
        <button
          onClick={addBlock}
          className="mt-6 w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add section
        </button>
      </div>
    </div>
  );
}
