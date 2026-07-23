import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Target, AlertTriangle, Zap, Lightbulb, Edit2, Check, Video, RotateCcw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

function toEmbedUrl(url: string): string | null {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return url;
  return null;
}

interface PersonaCardProps {
  imageUrl: string;
  title: string;
  goals: string;
  painPoints: string;
  motivators: string;
  opportunities: string;
  videoUrl?: string;
  onUpdate: (field: string, value: string) => void;
}

function SectionBlock({
  icon,
  label,
  accentClass,
  dotClass,
  value,
  field,
  onUpdate,
}: {
  icon: React.ReactNode;
  label: string;
  accentClass: string;
  dotClass: string;
  value: string;
  field: string;
  onUpdate: (field: string, value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const items = value.split('\n').filter(Boolean);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2.5 mb-4">
        <span className={accentClass}>{icon}</span>
        <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {label}
        </h4>
        <button
          onClick={() => { setEditing(!editing); setTempValue(value); }}
          className="ml-auto text-slate-500 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-100"
        >
          {editing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit2 className="w-3.5 h-3.5" />}
        </button>
      </div>
      {editing ? (
        <textarea
          value={tempValue}
          onChange={e => setTempValue(e.target.value)}
          onBlur={() => { onUpdate(field, tempValue); setEditing(false); }}
          rows={Math.max(3, tempValue.split('\n').length + 1)}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
          autoFocus
        />
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
              <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PersonaCard({
  imageUrl, title, goals, painPoints, motivators, opportunities, videoUrl = '', onUpdate
}: PersonaCardProps) {
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [editingVideo, setEditingVideo] = useState(false);
  const [tempVideo, setTempVideo] = useState(videoUrl);
  const embedUrl = toEmbedUrl(videoUrl);
  const firstGoal = goals.split('\n').filter(Boolean)[0] || '';

  useEffect(() => {
    if (!open) {
      setFlipped(false);
      setEditingVideo(false);
    }
  }, [open]);

  return (
    <>
      {/* Grid card */}
      <div
        onClick={() => setOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1"
      >
        <div className="relative h-64 bg-slate-100 overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent" />
        </div>
        <div className="p-6">
          <span
            className="inline-block text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-3"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            User Persona
          </span>
          <h3
            className="text-2xl font-semibold text-slate-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h3>
          {firstGoal && (
            <p className="text-sm text-slate-400 leading-relaxed mb-5 line-clamp-2">{firstGoal}</p>
          )}
          <div className="flex items-center gap-1.5 text-sm text-blue-400 font-medium group-hover:gap-2.5 transition-all duration-200">
            View full profile
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-0 m-auto w-full max-w-2xl h-[90vh] bg-white rounded-2xl border border-slate-200 z-50 shadow-2xl outline-none overflow-hidden"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <Dialog.Title className="sr-only">{title} — User Persona</Dialog.Title>

            {/* Close button — always on top, outside flip card */}
            <Dialog.Close className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-200/80 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:bg-slate-300/80 transition-colors border border-slate-300 z-20">
              <X className="w-4 h-4" />
            </Dialog.Close>

            {/* Flip card container */}
            <div className="w-full h-full" style={{ perspective: '1400px' }}>
              <div
                className="w-full h-full"
                style={{
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* ── FRONT FACE ── */}
                <div
                  className="absolute inset-0 overflow-y-auto bg-white"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' } as React.CSSProperties}
                >
                  {/* Hero image */}
                  <div className="relative h-64 bg-slate-100 overflow-hidden flex-shrink-0">
                    <ImageWithFallback src={imageUrl} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent" />
                  </div>

                  <div className="px-8 pt-6 pb-10">
                    <span
                      className="inline-block text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-4"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      User Persona
                    </span>

                    <h2
                      className="text-3xl font-semibold text-slate-900 mb-6"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {title}
                    </h2>

                    {/* Video — under the name */}
                    <div className="mb-6 border border-slate-200 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <Video className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          Persona Video
                        </span>
                        <button
                          onClick={e => { e.stopPropagation(); setEditingVideo(!editingVideo); setTempVideo(videoUrl); }}
                          className="ml-auto text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-200"
                        >
                          {editingVideo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {editingVideo ? (
                        <div className="p-4 space-y-2">
                          <input
                            value={tempVideo}
                            onChange={e => setTempVideo(e.target.value)}
                            placeholder="Paste a YouTube or direct video URL…"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={e => { e.stopPropagation(); setEditingVideo(false); }}
                              className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); onUpdate('videoUrl', tempVideo); setEditingVideo(false); }}
                              className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : embedUrl ? (
                        embedUrl.includes('youtube.com/embed') ? (
                          <iframe
                            src={embedUrl}
                            title="Persona video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full aspect-video border-0"
                          />
                        ) : (
                          <video src={embedUrl} controls className="w-full aspect-video bg-black" />
                        )
                      ) : (
                        <div
                          onClick={e => { e.stopPropagation(); setEditingVideo(true); }}
                          className="flex flex-col items-center justify-center gap-2 py-8 text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          <Video className="w-6 h-6" />
                          <span className="text-xs">Click to add a video URL</span>
                        </div>
                      )}
                    </div>

                    {/* Flip to details */}
                    <button
                      onClick={() => setFlipped(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      View persona details
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* ── BACK FACE ── */}
                <div
                  className="absolute inset-0 overflow-y-auto bg-white"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  } as React.CSSProperties}
                >
                  <div className="px-8 pt-14 pb-10">
                    <span
                      className="inline-block text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-4"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      Persona Profile
                    </span>

                    <h2
                      className="text-3xl font-semibold text-slate-900 mb-8"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {title}
                    </h2>

                    <div className="grid grid-cols-2 gap-x-10 border-t border-slate-200 pt-8">
                      <SectionBlock
                        icon={<Target className="w-4 h-4" />}
                        label="Goals"
                        accentClass="text-blue-400"
                        dotClass="bg-blue-400"
                        value={goals}
                        field="goals"
                        onUpdate={onUpdate}
                      />
                      <SectionBlock
                        icon={<AlertTriangle className="w-4 h-4" />}
                        label="Pain Points"
                        accentClass="text-amber-400"
                        dotClass="bg-amber-400"
                        value={painPoints}
                        field="painPoints"
                        onUpdate={onUpdate}
                      />
                      <SectionBlock
                        icon={<Zap className="w-4 h-4" />}
                        label="Motivators"
                        accentClass="text-emerald-400"
                        dotClass="bg-emerald-400"
                        value={motivators}
                        field="motivators"
                        onUpdate={onUpdate}
                      />
                      <SectionBlock
                        icon={<Lightbulb className="w-4 h-4" />}
                        label="Opportunities"
                        accentClass="text-purple-400"
                        dotClass="bg-purple-400"
                        value={opportunities}
                        field="opportunities"
                        onUpdate={onUpdate}
                      />
                    </div>

                    {/* Flip back */}
                    <button
                      onClick={() => setFlipped(false)}
                      className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Back to overview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
