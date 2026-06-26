import { useState, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Plus, Trash2, ExternalLink, Bold, Italic, Underline, List, ListOrdered, FileText, Upload, Image as ImageIcon } from 'lucide-react';

interface ResearchItem {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  report?: string;
  reportName?: string;
  richContent?: string;
}

interface MarketResearchGridProps {
  items: ResearchItem[];
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
  onAdd: (data: Omit<ResearchItem, 'id'>) => void;
}

const ITEM_IMAGES: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1523875194681-bedd468c58bf?w=1200&h=600&fit=crop&auto=format',
  '2': 'https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=800&h=500&fit=crop&auto=format',
  '3': 'https://images.unsplash.com/photo-1686771416537-bf4a4f263d88?w=800&h=500&fit=crop&auto=format',
  '4': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=500&fit=crop&auto=format',
  '5': 'https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=800&h=500&fit=crop&auto=format',
  '6': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop&auto=format',
  '7': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&auto=format',
};
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1711097383282-28097ae16b1d?w=800&h=500&fit=crop&auto=format';

const PHASE_LABELS = [
  'Landscape Audit', 'Current State', 'User Research',
  'Tech Evaluation', 'Business Model', 'Compliance', 'Measurement',
];

const PHASE_COLORS = [
  'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'text-rose-400 bg-rose-500/10 border-rose-500/20',
  'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
];

function getImage(item: ResearchItem) {
  return item.thumbnail ?? ITEM_IMAGES[item.id] ?? FALLBACK_IMAGE;
}

function getPhaseLabel(index: number) {
  return PHASE_LABELS[index] ?? 'Research';
}

function getPhaseColor(index: number) {
  return PHASE_COLORS[index % PHASE_COLORS.length];
}

// ─── Rich Text Editor ────────────────────────────────────────────────────────

function RichTextEditor({
  value, onChange, placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const lastValueRef = useRef(value);

  useEffect(() => {
    if (editorRef.current && lastValueRef.current !== value) {
      editorRef.current.innerHTML = value || '';
      lastValueRef.current = value;
    }
  }, [value]);

  const exec = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastValueRef.current = html;
      onChange(html);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastValueRef.current = html;
      onChange(html);
    }
  };

  const isEmpty = !value || value === '<br>' || value.trim() === '';

  const toolbarBtn = (label: React.ReactNode, action: () => void, title: string) => (
    <button
      key={title}
      onMouseDown={e => { e.preventDefault(); action(); }}
      title={title}
      className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-[11px] font-bold"
    >
      {label}
    </button>
  );

  return (
    <div className={`border rounded-lg overflow-hidden transition-colors ${focused ? 'border-blue-500/50' : 'border-white/10'}`}>
      <style>{`
        .rich-editor ul { list-style: disc; padding-left: 1.4em; margin: 0.4em 0; }
        .rich-editor ol { list-style: decimal; padding-left: 1.4em; margin: 0.4em 0; }
        .rich-editor h2 { font-size: 1.15em; font-weight: 700; margin: 0.6em 0 0.2em; color: #fff; }
        .rich-editor h3 { font-size: 1em; font-weight: 600; margin: 0.5em 0 0.2em; color: #e2e8f0; }
        .rich-editor p { margin: 0.25em 0; }
        .rich-editor b, .rich-editor strong { color: #f1f5f9; }
        .rich-editor a { color: #60a5fa; text-decoration: underline; }
        .rich-editor:focus { outline: none; }
      `}</style>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-white/10 bg-[#080F1E]/60 flex-wrap">
        {toolbarBtn(<Bold className="w-3.5 h-3.5" />, () => exec('bold'), 'Bold')}
        {toolbarBtn(<Italic className="w-3.5 h-3.5" />, () => exec('italic'), 'Italic')}
        {toolbarBtn(<Underline className="w-3.5 h-3.5" />, () => exec('underline'), 'Underline')}
        <div className="w-px h-4 bg-white/10 mx-1" />
        {toolbarBtn(<List className="w-3.5 h-3.5" />, () => exec('insertUnorderedList'), 'Bullet List')}
        {toolbarBtn(<ListOrdered className="w-3.5 h-3.5" />, () => exec('insertOrderedList'), 'Numbered List')}
        <div className="w-px h-4 bg-white/10 mx-1" />
        {toolbarBtn('H2', () => exec('formatBlock', 'H2'), 'Heading 2')}
        {toolbarBtn('H3', () => exec('formatBlock', 'H3'), 'Heading 3')}
        {toolbarBtn('¶', () => exec('formatBlock', 'p'), 'Paragraph')}
      </div>
      {/* Editable area */}
      <div className="relative min-h-[160px]">
        {isEmpty && !focused && (
          <div className="absolute top-0 left-0 right-0 px-4 py-3 text-sm text-slate-600 pointer-events-none select-none">
            {placeholder ?? 'Add rich notes, findings, and observations...'}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="rich-editor min-h-[160px] px-4 py-3 text-sm text-slate-300 leading-relaxed focus:outline-none"
        />
      </div>
    </div>
  );
}

// ─── Editable plain text field (for title) ───────────────────────────────────

function EditableField({
  value, onChange, multiline, className, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  if (editing) {
    if (multiline) {
      return (
        <textarea
          value={temp}
          onChange={e => setTemp(e.target.value)}
          onBlur={() => { onChange(temp); setEditing(false); }}
          className={`${className} bg-transparent border border-blue-500/40 rounded px-2 py-1 w-full resize-none focus:outline-none focus:ring-1 focus:ring-blue-500`}
          autoFocus
          rows={Math.max(3, temp.split('\n').length + 1)}
          placeholder={placeholder}
        />
      );
    }
    return (
      <input
        value={temp}
        onChange={e => setTemp(e.target.value)}
        onBlur={() => { onChange(temp); setEditing(false); }}
        onKeyDown={e => { if (e.key === 'Enter') { onChange(temp); setEditing(false); } }}
        className={`${className} bg-transparent border border-blue-500/40 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500`}
        autoFocus
        placeholder={placeholder}
      />
    );
  }

  return (
    <div
      onClick={() => { setEditing(true); setTemp(value); }}
      className={`${className} cursor-pointer hover:bg-white/5 rounded px-1 py-0.5 transition-colors ${!value ? 'opacity-40' : ''}`}
    >
      {value || (placeholder ?? 'Click to edit...')}
    </div>
  );
}

// ─── Item Modal (View Details / Read More) ────────────────────────────────────

function ItemModal({
  item, index, open, onClose, onUpdate, onDelete,
}: {
  item: ResearchItem;
  index: number;
  open: boolean;
  onClose: () => void;
  onUpdate: (field: string, value: string) => void;
  onDelete: () => void;
}) {
  const openReport = () => {
    if (!item.report) return;
    const win = window.open();
    if (win) {
      win.document.write(`<iframe src="${item.report}" style="width:100%;height:100%;border:none;" />`);
      win.document.title = item.reportName ?? 'Report';
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 flex items-center justify-center z-50 p-6 outline-none"
        >
          <Dialog.Title className="sr-only">{item.title || 'Artefact details'}</Dialog.Title>
          <div className="bg-[#0C1526] border border-white/10 rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header image */}
            <div className="relative h-48 bg-[#080F1E] overflow-hidden flex-shrink-0">
              <img
                src={getImage(item)}
                alt={item.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C1526] via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-block text-[10px] font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full border ${getPhaseColor(index)}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {getPhaseLabel(index)}
                </span>
              </div>
              <Dialog.Close className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors border border-white/20">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>

            {/* Scrollable body */}
            <div className="p-7 overflow-y-auto flex-1">
              <EditableField
                value={item.title}
                onChange={v => onUpdate('title', v)}
                className="text-2xl font-semibold text-white mb-3 block"
                placeholder="Artefact title..."
              />
              <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Summary
              </p>
              <EditableField
                value={item.description}
                onChange={v => onUpdate('description', v)}
                multiline
                className="text-sm text-slate-400 leading-relaxed block mb-5"
                placeholder="Short summary..."
              />

              <p className="text-[11px] text-slate-500 uppercase tracking-widest mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Detailed Notes
              </p>
              <RichTextEditor
                value={item.richContent ?? ''}
                onChange={v => onUpdate('richContent', v)}
                placeholder="Add rich notes, findings, and observations..."
              />

              {/* Report section */}
              {item.report && (
                <div className="mt-5 flex items-center gap-3 p-3 rounded-lg bg-white/4 border border-white/8">
                  <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{item.reportName ?? 'Report'}</p>
                    <p className="text-xs text-slate-500">Attached report</p>
                  </div>
                  <button
                    onClick={openReport}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium rounded-lg transition-colors border border-blue-500/20"
                  >
                    View Report
                  </button>
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-white/8 flex justify-between items-center">
                <button
                  onClick={() => { onDelete(); onClose(); }}
                  className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove item
                </button>
                <Dialog.Close className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                  Done
                </Dialog.Close>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Add Activity Modal ───────────────────────────────────────────────────────

function AddActivityModal({
  open, onClose, onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (data: Omit<ResearchItem, 'id'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<string | undefined>();
  const [thumbnailName, setThumbnailName] = useState('');
  const [report, setReport] = useState<string | undefined>();
  const [reportName, setReportName] = useState('');
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setTitle(''); setDescription('');
    setThumbnail(undefined); setThumbnailName('');
    setReport(undefined); setReportName('');
  };

  const readFile = (file: File): Promise<string> =>
    new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const handleThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailName(file.name);
    setThumbnail(await readFile(file));
  };

  const handleReport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReportName(file.name);
    setReport(await readFile(file));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ title, description, thumbnail, report: report ?? undefined, reportName: reportName || undefined });
    reset();
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => { if (!v) { reset(); onClose(); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 flex items-center justify-center z-50 p-6 outline-none"
        >
          <Dialog.Title className="sr-only">Add Artefact</Dialog.Title>
          <div className="bg-[#0C1526] border border-white/10 rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h2 className="text-base font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Add Artefact
              </h2>
              <Dialog.Close className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>

            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Title <span className="text-rose-400">*</span>
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Competitive Analysis"
                  className="w-full bg-[#080F1E] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Summary
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief description of this artefact..."
                  rows={3}
                  className="w-full bg-[#080F1E] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                />
              </div>

              {/* Thumbnail upload */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Thumbnail Photo
                </label>
                <input ref={thumbInputRef} type="file" accept="image/*" onChange={handleThumbnail} className="hidden" />
                <button
                  onClick={() => thumbInputRef.current?.click()}
                  className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#080F1E] border border-white/10 hover:border-blue-500/30 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {thumbnail ? (
                    <>
                      <img src={thumbnail} alt="thumb" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                      <span className="truncate text-slate-300">{thumbnailName}</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4 flex-shrink-0" />
                      <span>Upload thumbnail image…</span>
                    </>
                  )}
                </button>
              </div>

              {/* Report upload */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Report
                </label>
                <input ref={reportInputRef} type="file" accept=".pdf,.doc,.docx,.pptx,.xlsx,.png,.jpg,.jpeg" onChange={handleReport} className="hidden" />
                <button
                  onClick={() => reportInputRef.current?.click()}
                  className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#080F1E] border border-white/10 hover:border-blue-500/30 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {report ? (
                    <>
                      <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="truncate text-slate-300">{reportName}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 flex-shrink-0" />
                      <span>Upload report (PDF, DOCX, PPTX…)</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-slate-600 mt-1">Viewable later from "View details"</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-1">
                <Dialog.Close className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                  Cancel
                </Dialog.Close>
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Add Artefact
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Card components ──────────────────────────────────────────────────────────

function HeroCard({ item, index, onOpen }: { item: ResearchItem; index: number; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-[#0F1A2E] border border-white/7 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col lg:flex-row"
    >
      <div className="lg:w-[45%] relative h-64 lg:h-auto bg-[#080F1E] overflow-hidden flex-shrink-0">
        <img
          src={getImage(item)}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
        />
        <div className="absolute inset-0 lg:hidden bg-gradient-to-t from-[#0F1A2E]/80 to-transparent" />
      </div>
      <div className="flex-1 p-8 flex flex-col justify-center">
        <div className="flex items-start justify-between mb-2">
          <span
            className={`inline-block text-[10px] font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full border mb-4 ${getPhaseColor(index)}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {getPhaseLabel(index)}
          </span>
          <span className="text-xs text-slate-600 font-mono">01</span>
        </div>
        <h3 className="text-2xl font-semibold text-white mb-3 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
          {item.title || 'Untitled Artefact'}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {item.description || 'No description yet.'}
        </p>
        {item.report && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 mb-3">
            <FileText className="w-3 h-3" /> Report attached
          </span>
        )}
        <div className="flex items-center gap-1.5 text-sm text-blue-400 font-medium group-hover:gap-2.5 transition-all duration-200">
          Read more
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}

function GridCard({ item, index, onOpen }: { item: ResearchItem; index: number; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      className="group cursor-pointer rounded-xl overflow-hidden bg-[#0F1A2E] border border-white/7 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-0.5 flex flex-col"
    >
      <div className="relative h-44 bg-[#080F1E] overflow-hidden flex-shrink-0">
        <img
          src={getImage(item)}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A2E]/60 to-transparent" />
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block text-[9px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${getPhaseColor(index)}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {getPhaseLabel(index)}
          </span>
        </div>
        {item.report && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <FileText className="w-3 h-3 text-emerald-400" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-white mb-2 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
          {item.title || 'Untitled'}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed flex-1 line-clamp-3">
          {item.description || 'No description yet.'}
        </p>
        <div className="mt-4 flex items-center gap-1 text-xs text-blue-400 font-medium group-hover:gap-2 transition-all duration-200">
          View details
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ListCard({ item, index, onOpen }: { item: ResearchItem; index: number; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      className="group cursor-pointer rounded-xl overflow-hidden bg-[#0F1A2E] border border-white/7 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 flex items-stretch"
    >
      <div className="relative w-32 flex-shrink-0 bg-[#080F1E] overflow-hidden">
        <img
          src={getImage(item)}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
        />
      </div>
      <div className="flex-1 px-5 py-4 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className={`inline-block text-[9px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${getPhaseColor(index)}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {getPhaseLabel(index)}
          </span>
          <div className="flex items-center gap-2">
            {item.report && <FileText className="w-3 h-3 text-emerald-400" />}
            <span className="text-[10px] text-slate-600 font-mono">{String(index + 1).padStart(2, '0')}</span>
          </div>
        </div>
        <h3 className="text-base font-semibold text-white mb-1 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
          {item.title || 'Untitled'}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
          {item.description || 'No description yet.'}
        </p>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function MarketResearchGrid({ items, onUpdate, onDelete, onAdd }: MarketResearchGridProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const heroItem = items[0];
  const gridItems = items.slice(1, 4);
  const listItems = items.slice(4);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400 mb-2"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Research Agenda
          </p>
          <h2
            className="text-3xl font-semibold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Artefact Details
          </h2>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </button>
      </div>

      <div className="space-y-6">
        {heroItem && (
          <HeroCard item={heroItem} index={0} onOpen={() => setOpenId(heroItem.id)} />
        )}

        {gridItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {gridItems.map((item, i) => (
              <GridCard key={item.id} item={item} index={i + 1} onOpen={() => setOpenId(item.id)} />
            ))}
          </div>
        )}

        {listItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-white/7" />
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Additional Activities
              </span>
              <div className="h-px flex-1 bg-white/7" />
            </div>
            {listItems.map((item, i) => (
              <ListCard key={item.id} item={item} index={i + 4} onOpen={() => setOpenId(item.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Detail modals for each item */}
      {items.map((item, index) => (
        <ItemModal
          key={item.id}
          item={item}
          index={index}
          open={openId === item.id}
          onClose={() => setOpenId(null)}
          onUpdate={(field, value) => onUpdate(item.id, field, value)}
          onDelete={() => onDelete(item.id)}
        />
      ))}

      {/* Add activity modal */}
      <AddActivityModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={onAdd}
      />
    </div>
  );
}
