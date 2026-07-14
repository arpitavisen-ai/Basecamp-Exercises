import { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, Plus, ExternalLink, X, Upload, Sparkles, Pencil } from 'lucide-react';
import { useFirebaseSync } from '../hooks/useFirebaseSync';

interface PrototypeVersion {
  id: string;
  label: string;
  date: string;       // YYYY-MM-DD
  note: string;
  fileName: string;
  htmlContent: string;
  createdAt: string;
}

interface PrototypeDetailViewProps {
  onBack: () => void;
}

function AiBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-violet-500 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <Sparkles className="w-2.5 h-2.5" />
      AI
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

function openHtmlInNewTab(htmlContent: string) {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// ─── Version Modal (add + edit) ───────────────────────────────────────────────

interface VersionModalProps {
  open: boolean;
  onClose: () => void;
  /** Present when editing an existing version */
  initial?: PrototypeVersion;
  onSave: (data: Omit<PrototypeVersion, 'id' | 'createdAt'>) => void;
}

function VersionModal({ open, onClose, initial, onSave }: VersionModalProps) {
  const isEdit = Boolean(initial);
  const today = new Date().toISOString().split('T')[0];

  const [label, setLabel] = useState(initial?.label ?? '');
  const [date, setDate] = useState(initial?.date ?? today);
  const [note, setNote] = useState(initial?.note ?? '');
  const [fileName, setFileName] = useState(initial?.fileName ?? '');
  const [htmlContent, setHtmlContent] = useState(initial?.htmlContent ?? '');
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const resetToInitial = () => {
    setLabel(initial?.label ?? '');
    setDate(initial?.date ?? today);
    setNote(initial?.note ?? '');
    setFileName(initial?.fileName ?? '');
    setHtmlContent(initial?.htmlContent ?? '');
    setFileError('');
    setSubmitting(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      setFileError('Please select an .html or .htm file.');
      return;
    }
    setFileError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setHtmlContent(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  // In edit mode htmlContent is pre-populated from the stored version, so it's always valid
  const canSubmit = label.trim() && date && note.trim() && htmlContent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    onSave({ label: label.trim(), date, note: note.trim(), fileName, htmlContent });
    resetToInitial();
    onClose();
  };

  const labelId = 'version-modal-label-id';

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => { if (!v) { resetToInitial(); onClose(); } }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50" />
        <Dialog.Content
          className="fixed inset-0 flex items-center justify-center z-50 p-6 outline-none"
          aria-labelledby={labelId}
        >
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <Dialog.Title
                id={labelId}
                className="text-base font-semibold text-slate-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {isEdit ? 'Edit prototype version' : 'Add prototype version'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="pv-label"
                  className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1.5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Version label *
                </label>
                <input
                  id="pv-label"
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Version 4 — Final"
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="pv-date"
                  className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1.5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Date *
                </label>
                <input
                  id="pv-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="pv-note"
                  className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1.5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  What changed / what was learned *
                </label>
                <textarea
                  id="pv-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe what changed and what was learned in this iteration..."
                  rows={3}
                  required
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label
                  className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1.5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  HTML file {isEdit ? '(re-upload to replace)' : '*'}
                </label>
                <label
                  htmlFor="pv-file"
                  className={`flex items-center gap-3 w-full border rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                    fileName
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                >
                  <Upload className={`w-4 h-4 flex-shrink-0 ${fileName ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span className={`text-sm truncate ${fileName ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {fileName || 'Choose .html file…'}
                  </span>
                  <input
                    id="pv-file"
                    ref={fileRef}
                    type="file"
                    accept=".html,.htm"
                    onChange={handleFile}
                    className="sr-only"
                  />
                </label>
                {fileError && (
                  <p className="mt-1 text-xs text-red-500">{fileError}</p>
                )}
                {isEdit && !fileError && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    Leave unchanged to keep the existing file.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {isEdit ? 'Save changes' : 'Add version'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Timeline Entry ────────────────────────────────────────────────────────────

function VersionEntry({
  version,
  isLatest,
  isLast,
  onEdit,
}: {
  version: PrototypeVersion;
  isLatest: boolean;
  isLast: boolean;
  onEdit: (v: PrototypeVersion) => void;
}) {
  return (
    <div className="relative flex gap-4">
      {/* Dot + vertical line */}
      <div className="relative flex flex-col items-center flex-shrink-0 w-3">
        <div
          className={`w-3 h-3 rounded-full border-2 border-blue-500 mt-1 flex-shrink-0 relative z-10 ${
            isLatest ? 'bg-blue-500' : 'bg-white'
          }`}
        />
        {!isLast && (
          <div className="absolute top-4 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-200" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-5'}`}>
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors group">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="text-base font-semibold text-slate-900 leading-snug"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {version.label}
              </h3>
              {isLatest && (
                <span
                  className="inline-block text-[9px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Latest
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span
                className="text-[11px] text-slate-400 whitespace-nowrap mt-0.5"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {formatDate(version.date)}
              </span>
              <button
                onClick={() => onEdit(version)}
                aria-label={`Edit ${version.label}`}
                className="w-6 h-6 flex items-center justify-center rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-4">{version.note}</p>

          <div className="flex items-center justify-between">
            <span
              className="text-[10px] text-slate-400"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {version.fileName}
            </span>
            <button
              onClick={() => openHtmlInNewTab(version.htmlContent)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
            >
              Open in new tab
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function PrototypeDetailView({ onBack }: PrototypeDetailViewProps) {
  const [versions, setVersions] = useFirebaseSync<PrototypeVersion[]>('prototypeVersions', []);
  const [addOpen, setAddOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<PrototypeVersion | null>(null);

  const sorted = [...versions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAdd = (data: Omit<PrototypeVersion, 'id' | 'createdAt'>) => {
    const newVersion: PrototypeVersion = {
      ...data,
      id: `pv-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setVersions((prev) => [...prev, newVersion]);
  };

  const handleUpdate = (data: Omit<PrototypeVersion, 'id' | 'createdAt'>) => {
    if (!editingVersion) return;
    const updated: PrototypeVersion = { ...editingVersion, ...data };
    setVersions((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Back navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Artefacts
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-400"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Product Delivery · Artefact
          </p>
          <AiBadge />
        </div>
        <h1
          className="text-4xl font-semibold text-slate-900 leading-tight mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Prototype
        </h1>
        <p className="text-slate-500 text-sm">
          AI-augmented NHS FFT Feedback Dashboard — interactive prototype version history
        </p>
      </div>

      {/* Description */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <h2
            className="text-lg font-semibold text-slate-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What this prototype demonstrates
          </h2>
          <AiBadge />
        </div>
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            A prototype is a high-fidelity, interactive proof of concept built before full
            engineering investment. In the PDLC framework, it sits at the boundary of discovery
            and delivery: it validates the design with real users, stress-tests the data model,
            and gives the team a shared artefact to align against.
          </p>
          <p>
            This prototype demonstrates the NHS Patient Feedback Intelligence Platform — an
            AI-augmented dashboard that turns Friends and Family Test responses into structured,
            actionable intelligence for clinical leaders. It classifies every comment across the
            five CQC domains, surfaces deteriorating wards, flags critical themes, and generates
            board-ready evidence automatically.
          </p>
          <p>
            Each version in the design log below represents one iteration. The log captures what
            changed, what was learned, and how the design evolved toward the validated V4 spec
            that the engineering team is now building.
          </p>
        </div>
        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center gap-2">
          <span
            className="text-[10px] text-slate-400"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ✦ AI-assisted · Classified by Claude (claude-sonnet-4-6) · DEMO DATA ONLY — not for clinical use
          </span>
        </div>
      </div>

      {/* Design Log */}
      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Chronological iteration log
            </p>
            <h2
              className="text-2xl font-semibold text-slate-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Design Log
            </h2>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add version
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Upload className="w-5 h-5 text-slate-400" />
            </div>
            <p
              className="text-sm font-medium text-slate-500 mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No versions yet
            </p>
            <p className="text-xs text-slate-400 max-w-xs">
              Upload the first prototype version to start the design log
            </p>
            <button
              onClick={() => setAddOpen(true)}
              className="mt-5 flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add first version
            </button>
          </div>
        ) : (
          <div>
            {sorted.map((version, i) => (
              <VersionEntry
                key={version.id}
                version={version}
                isLatest={i === 0}
                isLast={i === sorted.length - 1}
                onEdit={setEditingVersion}
              />
            ))}
          </div>
        )}
      </div>

      <VersionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAdd}
      />

      <VersionModal
        open={editingVersion !== null}
        onClose={() => setEditingVersion(null)}
        initial={editingVersion ?? undefined}
        onSave={handleUpdate}
      />
    </div>
  );
}
