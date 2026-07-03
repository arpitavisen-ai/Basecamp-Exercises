import { useState, useCallback, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import {
  X, Target, Search, Rocket, BarChart2, Map, Users2, Lightbulb,
  FlaskConical, TestTube2, Cpu, ClipboardList, Palette, GitBranch,
  Code2, ShieldCheck, Megaphone, TrendingUp, ChevronRight, RotateCcw,
  ArrowRight, Save, Plus, Trash2, Video, Play, Pencil,
} from 'lucide-react';
import { RichTextEditor, InlineEdit } from './RichTextEditor';
import { useFirebaseSync } from '../hooks/useFirebaseSync';

// ─── Static config (icons & colours — never serialised) ─────────────────────

interface PhaseConfig {
  id: string;
  number: string;
  accentColor: string;
  accentBg: string;
  borderColor: string;
  tagColor: string;
  cards: { id: string; icon: React.ReactNode; frontAccent: string; backBg: string }[];
}

const PHASE_CONFIG: PhaseConfig[] = [
  {
    id: 'strategy', number: '01',
    accentColor: 'text-blue-400', accentBg: 'bg-blue-500/10',
    borderColor: 'border-blue-500/25', tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    cards: [
      { id: 'ps-1', frontAccent: 'from-blue-600/20 to-blue-800/10', backBg: '#0F1E3A', icon: <BarChart2 className="w-6 h-6" /> },
      { id: 'ps-2', frontAccent: 'from-blue-600/20 to-indigo-800/10', backBg: '#0F1E3A', icon: <Target className="w-6 h-6" /> },
      { id: 'ps-3', frontAccent: 'from-blue-700/20 to-blue-900/10', backBg: '#0F1E3A', icon: <TrendingUp className="w-6 h-6" /> },
      { id: 'ps-4', frontAccent: 'from-indigo-600/20 to-blue-800/10', backBg: '#0F1E3A', icon: <Target className="w-6 h-6" /> },
      { id: 'ps-5', frontAccent: 'from-blue-500/20 to-blue-900/10', backBg: '#0F1E3A', icon: <Map className="w-6 h-6" /> },
      { id: 'ps-6', frontAccent: 'from-blue-800/20 to-indigo-900/10', backBg: '#0F1E3A', icon: <Users2 className="w-6 h-6" /> },
    ],
  },
  {
    id: 'discovery', number: '02',
    accentColor: 'text-emerald-400', accentBg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/25', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    cards: [
      { id: 'pd-1', frontAccent: 'from-emerald-600/20 to-teal-800/10', backBg: '#0F2A22', icon: <Search className="w-6 h-6" /> },
      { id: 'pd-2', frontAccent: 'from-teal-600/20 to-emerald-800/10', backBg: '#0F2A22', icon: <Lightbulb className="w-6 h-6" /> },
      { id: 'pd-3', frontAccent: 'from-emerald-700/20 to-teal-900/10', backBg: '#0F2A22', icon: <FlaskConical className="w-6 h-6" /> },
      { id: 'pd-4', frontAccent: 'from-teal-500/20 to-emerald-900/10', backBg: '#0F2A22', icon: <TestTube2 className="w-6 h-6" /> },
      { id: 'pd-5', frontAccent: 'from-emerald-600/20 to-cyan-800/10', backBg: '#0F2A22', icon: <Cpu className="w-6 h-6" /> },
    ],
  },
  {
    id: 'delivery', number: '03',
    accentColor: 'text-purple-400', accentBg: 'bg-purple-500/10',
    borderColor: 'border-purple-500/25', tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    cards: [
      { id: 'pdl-1', frontAccent: 'from-purple-600/20 to-violet-800/10', backBg: '#1A0F2E', icon: <ClipboardList className="w-6 h-6" /> },
      { id: 'pdl-2', frontAccent: 'from-violet-600/20 to-purple-800/10', backBg: '#1A0F2E', icon: <Palette className="w-6 h-6" /> },
      { id: 'pdl-3', frontAccent: 'from-purple-700/20 to-indigo-800/10', backBg: '#1A0F2E', icon: <GitBranch className="w-6 h-6" /> },
      { id: 'pdl-4', frontAccent: 'from-indigo-600/20 to-purple-900/10', backBg: '#1A0F2E', icon: <Code2 className="w-6 h-6" /> },
      { id: 'pdl-5', frontAccent: 'from-purple-500/20 to-violet-900/10', backBg: '#1A0F2E', icon: <ShieldCheck className="w-6 h-6" /> },
      { id: 'pdl-6', frontAccent: 'from-violet-700/20 to-purple-800/10', backBg: '#1A0F2E', icon: <Megaphone className="w-6 h-6" /> },
      { id: 'pdl-7', frontAccent: 'from-purple-600/20 to-fuchsia-800/10', backBg: '#1A0F2E', icon: <Rocket className="w-6 h-6" /> },
    ],
  },
];

// ─── Editable data (stored in localStorage) ─────────────────────────────────

interface EditableCard {
  id: string;
  title: string;
  subtitle: string;
  description: string; // rich HTML
  bullets: string[];
}

interface EditablePhase {
  id: string;
  title: string;
  subtitle: string;
  cards: EditableCard[];
  videoUrl?: string;
}

const DEFAULT_PHASES: EditablePhase[] = [
  {
    id: 'strategy',
    title: 'Product Strategy',
    subtitle: 'Define the why, what, and who before building anything.',
    cards: [
      { id: 'ps-1', title: 'Market & Competitive Research', subtitle: 'Landscape analysis', description: 'Analyse the competitive landscape and identify market positioning opportunities. Understand how peers in public and private sector address the same problem.', bullets: ['Competitor benchmarking', 'Market sizing & opportunity', 'Gap analysis', 'PEST analysis', 'Positioning differentiation'] },
      { id: 'ps-2', title: 'Vision, Mission & SWOT', subtitle: 'Strategic foundation', description: 'Define the product vision, mission, and strategic objectives. Conduct a SWOT analysis to ensure the direction is sound and defensible.', bullets: ['Product vision statement', 'Mission articulation', 'SWOT mapping', 'Strategic objectives', 'Success criteria definition'] },
      { id: 'ps-3', title: 'Business Case Analysis', subtitle: 'Value justification', description: 'Build a compelling business case that quantifies value and justifies investment in the platform, using evidence from research and user data.', bullets: ['ROI modelling', 'Cost-benefit analysis', 'Risk assessment', 'Investment phasing', 'Stakeholder sign-off'] },
      { id: 'ps-4', title: 'OKR Definition', subtitle: 'Measurable outcomes', description: 'Define Objectives and Key Results to track product success, align teams, and create accountability at every level of the organisation.', bullets: ['Objective setting', 'Key results design', 'Metrics framework', 'Quarterly review cadence', 'OKR tooling setup'] },
      { id: 'ps-5', title: 'Product Roadmap', subtitle: 'Delivery planning', description: 'Create a prioritised roadmap that aligns delivery phases with strategic goals and communicates intent clearly to all stakeholders.', bullets: ['Feature prioritisation (RICE/MoSCoW)', 'Quarter-by-quarter planning', 'Dependency mapping', 'Milestone definition', 'Change management process'] },
      { id: 'ps-6', title: 'Stakeholder Mapping', subtitle: 'Governance & compliance', description: 'Identify primary, secondary, and legal stakeholders to ensure inclusive and compliant delivery across the public sector landscape.', bullets: ['Customer segmentation', 'Legal & compliance mapping', 'Governance structure', 'Comms & engagement plan', 'RACI definition'] },
    ],
  },
  {
    id: 'discovery',
    title: 'Product Discovery',
    subtitle: 'Validate assumptions for the MVP before committing to build.',
    cards: [
      { id: 'pd-1', title: 'User Interviews', subtitle: 'Round 1 · NHS stakeholders', description: 'Conduct one round of structured user interviews with key NHS personas — Chief Nurses, Quality Managers, and Ward Managers — to validate the core problem, uncover unmet needs, and pressure-test MVP scope.', bullets: ['Recruit 6–9 participants across 3 NHS trusts', 'Semi-structured interview guide aligned to MVP scope', 'Focus on current feedback workflows and pain points', 'Capture verbatim quotes and key observations', 'Synthesise findings into insight themes'] },
      { id: 'pd-2', title: 'Feedback Analysis', subtitle: 'Platform & dashboard scope', description: 'Analyse findings from user interviews and existing NHS FFT data to define what the MVP platform and dashboard must do. Keep scope tightly bounded to what is needed for the MVP demo — no gold-plating.', bullets: ['Affinity map interview insights', 'Identify top 3–5 critical jobs-to-be-done for MVP', 'Define must-have vs. out-of-scope platform features', 'Validate dashboard views against real user workflows', 'Document agreed MVP scope as a reference artefact'] },
      { id: 'pd-3', title: 'Tech Discovery', subtitle: 'Feasibility & architecture', description: 'Evaluate technical options and integration feasibility scoped specifically to MVP delivery. Identify the minimum viable architecture needed to demonstrate the platform end-to-end.', bullets: ['NHS data ingestion approach (FFT, NHS App)', 'AI/NLP model selection for theme classification', 'Build vs. buy assessment for key components', 'Data security and IG requirements for MVP', 'High-level architecture decision record'] },
      { id: 'pd-4', title: 'Ideation & Hypotheses', subtitle: 'Structured problem framing', description: 'Run focused ideation sessions to generate and prioritise product hypotheses for the MVP. Use HMW prompts and jobs-to-be-done to frame solvable problems, then score and rank hypotheses for testing.', bullets: ['HMW (How Might We) workshop', 'Jobs-to-be-done mapping', 'Hypothesis backlog creation', 'Opportunity scoring against MVP goals', 'Prioritised list of hypotheses to prototype'] },
      { id: 'pd-5', title: 'Design Prototypes', subtitle: 'Lo-fi to mid-fi concepts', description: 'Translate the top MVP hypotheses into low and mid-fidelity design prototypes. Focus on the core dashboard and key user flows to gather early feedback before engineering begins.', bullets: ['Wireframes for core MVP screens', 'Mid-fidelity interactive prototype', 'Dashboard layout validation with users', 'Design critique and iteration cycle', 'Prototype sign-off ahead of delivery'] },
    ],
  },
  {
    id: 'delivery',
    title: 'Product Delivery',
    subtitle: 'Ship with quality, iterate with data.',
    cards: [
      { id: 'pdl-1', title: 'Requirements & Backlog', subtitle: 'Structured delivery', description: 'Translate discovery insights into a structured, prioritised product backlog ready for engineering delivery.', bullets: ['User story writing', 'Acceptance criteria definition', 'Backlog grooming', 'Sprint readiness checks', 'Technical debt tracking'] },
      { id: 'pdl-2', title: 'Design', subtitle: 'UI/UX & accessibility', description: 'Create high-fidelity UI/UX designs aligned with user needs, accessibility standards, and the established design system.', bullets: ['Hi-fidelity designs', 'Component library build', 'WCAG 2.1 AA compliance', 'Design system documentation', 'Design review & sign-off'] },
      { id: 'pdl-3', title: 'Sprint Planning', subtitle: 'Agile cadence', description: 'Plan development sprints, assign capacity, set sprint goals, and maintain velocity across the delivery team.', bullets: ['Sprint goal definition', 'Capacity & velocity planning', 'Risk & dependency review', 'Daily stand-ups', 'Retrospectives'] },
      { id: 'pdl-4', title: 'Development', subtitle: 'Engineering & build', description: 'Build and iterate on features in short delivery cycles with engineering teams, maintaining code quality throughout.', bullets: ['Feature development', 'Code review process', 'CI/CD pipeline', 'Release management', 'Documentation'] },
      { id: 'pdl-5', title: 'Testing & QA', subtitle: 'Quality assurance', description: 'Conduct comprehensive functional, regression, performance, and security testing before every release.', bullets: ['Unit & integration testing', 'Regression testing', 'User acceptance testing (UAT)', 'Performance & load testing', 'Security & penetration testing'] },
      { id: 'pdl-6', title: 'Launch Readiness', subtitle: 'Go-live preparation', description: 'Prepare the platform for go-live with training materials, documentation, support setup, and stakeholder communications.', bullets: ['Release notes & documentation', 'Training materials creation', 'Support model setup', 'Stakeholder communications', 'Rollback plan'] },
      { id: 'pdl-7', title: 'Customer Rollout', subtitle: 'Phased deployment', description: 'Execute a phased rollout to customers, monitoring adoption closely and gathering early feedback to drive iteration.', bullets: ['Phased rollout plan', 'Adoption monitoring & KPIs', 'Feedback collection loops', 'Early adopter programme', 'Continuous improvement cycle'] },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function usePhases() {
  const [phases, setPhases, flushPhases] = useFirebaseSync<EditablePhase[]>('pdlcPhases', DEFAULT_PHASES);

  const updatePhase = useCallback((phaseId: string, field: keyof EditablePhase, value: string) => {
    setPhases(prev => prev.map(p => p.id === phaseId ? { ...p, [field]: value } : p));
  }, [setPhases]);

  const updateCard = useCallback((phaseId: string, cardId: string, field: keyof EditableCard, value: string | string[]) => {
    setPhases(prev => prev.map(p =>
      p.id === phaseId
        ? { ...p, cards: p.cards.map(c => c.id === cardId ? { ...c, [field]: value } : c) }
        : p
    ));
  }, [setPhases]);

  const updateBullet = useCallback((phaseId: string, cardId: string, idx: number, value: string) => {
    setPhases(prev => prev.map(p =>
      p.id === phaseId
        ? { ...p, cards: p.cards.map(c => {
            if (c.id !== cardId) return c;
            const bullets = [...c.bullets];
            bullets[idx] = value;
            return { ...c, bullets };
          })}
        : p
    ));
  }, [setPhases]);

  const addBullet = useCallback((phaseId: string, cardId: string) => {
    setPhases(prev => prev.map(p =>
      p.id === phaseId
        ? { ...p, cards: p.cards.map(c => c.id === cardId ? { ...c, bullets: [...c.bullets, ''] } : c) }
        : p
    ));
  }, [setPhases]);

  const removeBullet = useCallback((phaseId: string, cardId: string, idx: number) => {
    setPhases(prev => prev.map(p =>
      p.id === phaseId
        ? { ...p, cards: p.cards.map(c =>
            c.id === cardId ? { ...c, bullets: c.bullets.filter((_, i) => i !== idx) } : c
          )}
        : p
    ));
  }, [setPhases]);

  return { phases, updatePhase, updateCard, updateBullet, addBullet, removeBullet, flushPhases };
}

// ─── Card detail modal ────────────────────────────────────────────────────────

function CardModal({
  card, phaseId, config, phaseTagColor, open, onClose, onFlush,
  updateCard, updateBullet, addBullet, removeBullet,
}: {
  card: EditableCard;
  phaseId: string;
  config: PhaseConfig['cards'][number];
  phaseTagColor: string;
  open: boolean;
  onClose: () => void;
  onFlush: () => void;
  updateCard: (field: keyof EditableCard, value: string | string[]) => void;
  updateBullet: (idx: number, value: string) => void;
  addBullet: () => void;
  removeBullet: (idx: number) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={v => { if (!v) { onFlush(); onClose(); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50" />
        <Dialog.Content aria-describedby={undefined} className="fixed inset-0 flex items-center justify-center z-50 p-6 outline-none">
          <Dialog.Title className="sr-only">{card.title}</Dialog.Title>
          <div
            className="w-full max-w-xl rounded-2xl border border-slate-200 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col bg-white"
          >
            {/* Header */}
            <div className={`px-7 pt-7 pb-5 bg-gradient-to-br ${config.frontAccent} flex-shrink-0`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  {config.icon}
                </div>
                <Dialog.Close className="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-300/80 transition-colors">
                  <X className="w-4 h-4" />
                </Dialog.Close>
              </div>
              <InlineEdit
                value={card.subtitle}
                onChange={v => updateCard('subtitle', v)}
                className={`inline-block text-[9px] font-semibold uppercase tracking-widest px-2.5 py-0.5 rounded-full border mb-2 ${phaseTagColor}`}
                placeholder="Subtitle…"
              />
              <InlineEdit
                value={card.title}
                onChange={v => updateCard('title', v)}
                className="text-xl font-semibold text-slate-900 block"
                placeholder="Card title…"
                tag="h3"
              />
            </div>

            {/* Body */}
            <div className="px-7 py-6 overflow-y-auto flex-1">
              <div className="mb-6 relative pt-10">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-2 absolute top-0 left-0"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Description
                </p>
                <RichTextEditor
                  html={card.description}
                  onChange={v => updateCard('description', v)}
                  placeholder="Add a description…"
                  className="text-sm text-slate-700 leading-relaxed min-h-[60px]"
                />
              </div>

              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Key Activities
                </p>
                <ul className="space-y-2">
                  {card.bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 group/bullet">
                      <span
                        className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 flex-shrink-0"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <input
                        value={b}
                        onChange={e => updateBullet(i, e.target.value)}
                        placeholder={`Activity ${i + 1}…`}
                        className="flex-1 bg-transparent text-sm text-slate-700 focus:outline-none border-b border-transparent focus:border-blue-500/40 transition-colors py-0.5"
                      />
                      <button
                        onClick={() => removeBullet(i)}
                        className="opacity-0 group-hover/bullet:opacity-100 text-slate-700 hover:text-rose-400 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={addBullet}
                  className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-400 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add activity
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ─── Flip card ────────────────────────────────────────────────────────────────

function FlipCard({
  card, phaseId, config, phaseTagColor, onFlush,
  updateCard, updateBullet, addBullet, removeBullet,
}: {
  card: EditableCard;
  phaseId: string;
  config: PhaseConfig['cards'][number];
  phaseTagColor: string;
  onFlush: () => void;
  updateCard: (field: keyof EditableCard, value: string | string[]) => void;
  updateBullet: (idx: number, value: string) => void;
  addBullet: () => void;
  removeBullet: (idx: number) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="cursor-pointer select-none"
        style={{ perspective: '1000px', height: '200px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          style={{
            position: 'relative', width: '100%', height: '100%',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
            className={`rounded-xl border border-slate-200 bg-gradient-to-br ${config.frontAccent} flex flex-col p-5 hover:border-slate-300 transition-colors overflow-hidden`}
          >
            <div className="flex items-start justify-between mb-auto">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
                {config.icon}
              </div>
              <span className="flex items-center gap-1 text-[9px] text-slate-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <RotateCcw className="w-2.5 h-2.5" /> flip
              </span>
            </div>
            <div className="mt-4">
              <span
                className={`inline-block text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border mb-2 ${phaseTagColor}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {card.subtitle || 'Tag'}
              </span>
              <p
                className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {card.title || 'Untitled'}
              </p>
            </div>
          </div>

          {/* Back */}
          <div
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0, background: config.backBg }}
            className="rounded-xl border border-slate-200 bg-white flex flex-col p-4 overflow-hidden"
          >
            <p
              className="text-[11px] text-slate-700 leading-relaxed mb-3 flex-1 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: card.description || '<em>No description yet</em>' }}
            />
            <ul className="space-y-1 mb-3">
              {card.bullets.slice(0, 3).map((b, i) => (
                <li key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <span className="w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <button
              onClick={e => { e.stopPropagation(); setModalOpen(true); }}
              className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Edit & view all <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <CardModal
        card={card} phaseId={phaseId} config={config}
        phaseTagColor={phaseTagColor}
        open={modalOpen} onClose={() => setModalOpen(false)} onFlush={onFlush}
        updateCard={updateCard}
        updateBullet={updateBullet}
        addBullet={addBullet}
        removeBullet={removeBullet}
      />
    </>
  );
}

// ─── Phase video snippet ──────────────────────────────────────────────────────

function getYouTubeEmbedId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?/\s]+)/);
  return m ? m[1] : null;
}

function PhaseVideoSnippet({
  videoUrl, onUpdate, borderColor,
}: {
  videoUrl?: string;
  onUpdate: (url: string) => void;
  borderColor: string;
}) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(videoUrl ?? '');
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const ytId = videoUrl ? getYouTubeEmbedId(videoUrl) : null;
  const isYoutube = !!ytId;
  const isVideoFile = !!(videoUrl && !isYoutube);

  useEffect(() => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.play().catch(() => {});
    else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  }, [playing]);

  // reset playback when video changes
  useEffect(() => { setPlaying(false); }, [videoUrl]);

  const commit = (url: string) => { onUpdate(url.trim()); setEditing(false); };
  const clear = () => { onUpdate(''); setInputVal(''); setEditing(false); setPlaying(false); };

  if (!videoUrl) {
    return (
      <div className="mt-6">
        {editing ? (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 bg-slate-50">
            <Video className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input
              autoFocus
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Paste a video URL (mp4 / YouTube)…"
              className="flex-1 bg-transparent text-sm text-slate-700 focus:outline-none"
              onKeyDown={e => {
                if (e.key === 'Enter') commit(inputVal);
                if (e.key === 'Escape') setEditing(false);
              }}
            />
            <button onClick={() => commit(inputVal)} className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">Add</button>
            <button onClick={() => setEditing(false)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center justify-center gap-2 w-full text-xs text-slate-400 hover:text-slate-600 border border-dashed border-slate-200 hover:border-slate-400 px-4 py-3 rounded-xl transition-colors"
          >
            <Video className="w-3.5 h-3.5" />
            Add video snippet
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div
        className={`relative rounded-xl overflow-hidden border ${borderColor} bg-slate-900 group`}
        style={{ aspectRatio: '16/9' }}
      >
        {/* mp4 / direct video */}
        {isVideoFile && (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            {!playing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <button
                  data-testid="video-play-btn"
                  onClick={() => setPlaying(true)}
                  className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <Play className="w-6 h-6 ml-0.5" />
                </button>
              </div>
            )}
            {playing && (
              <button
                onClick={() => setPlaying(false)}
                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs transition-opacity"
              >
                Stop
              </button>
            )}
          </>
        )}

        {/* YouTube */}
        {isYoutube && (
          <>
            {!playing ? (
              <>
                <img
                  src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <button
                    data-testid="video-play-btn"
                    onClick={() => setPlaying(true)}
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    <Play className="w-7 h-7 ml-1" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&modestbranding=1&rel=0`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
                <button
                  onClick={() => setPlaying(false)}
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs transition-opacity z-10"
                >
                  Stop
                </button>
              </>
            )}
          </>
        )}

        {/* Remove */}
        <button
          onClick={clear}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full bg-slate-900/80 flex items-center justify-center text-slate-300 hover:text-white transition-all z-20"
          title="Remove video"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Edit URL row */}
      {editing ? (
        <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
          <input
            autoFocus
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-700 focus:outline-none"
            placeholder="New video URL…"
            onKeyDown={e => {
              if (e.key === 'Enter') commit(inputVal);
              if (e.key === 'Escape') setEditing(false);
            }}
          />
          <button onClick={() => commit(inputVal)} className="text-xs font-medium text-blue-500 hover:text-blue-400">Update</button>
          <button onClick={() => setEditing(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
        </div>
      ) : (
        <button
          onClick={() => { setInputVal(videoUrl ?? ''); setEditing(true); }}
          className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Pencil className="w-3 h-3" /> Change video URL
        </button>
      )}
    </div>
  );
}

// ─── Phase section ────────────────────────────────────────────────────────────

function PhaseSection({
  phase, config, onFlush,
  updatePhase, updateCard, updateBullet, addBullet, removeBullet,
}: {
  phase: EditablePhase;
  config: PhaseConfig;
  onFlush: () => void;
  updatePhase: (field: keyof EditablePhase, value: string) => void;
  updateCard: (cardId: string, field: keyof EditableCard, value: string | string[]) => void;
  updateBullet: (cardId: string, idx: number, value: string) => void;
  addBullet: (cardId: string) => void;
  removeBullet: (cardId: string, idx: number) => void;
}) {
  return (
    <div>
      <div className={`flex items-start gap-5 p-6 rounded-2xl border ${config.borderColor} ${config.accentBg} mb-6`}>
        <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0">
          <span
            className={`text-lg font-bold tabular-nums ${config.accentColor}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {config.number}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <InlineEdit
            value={phase.title}
            onChange={v => updatePhase('title', v)}
            className="text-xl font-semibold text-slate-900 mb-1 block"
            placeholder="Phase title…"
            tag="h3"
          />
          <InlineEdit
            value={phase.subtitle}
            onChange={v => updatePhase('subtitle', v)}
            className="text-sm text-slate-600 block"
            placeholder="Phase subtitle…"
          />
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border flex-shrink-0 ${config.tagColor}`}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {phase.cards.length} activities
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {phase.cards.map(card => {
          const cardConfig = config.cards.find(c => c.id === card.id) ?? config.cards[0];
          return (
            <FlipCard
              key={card.id}
              card={card}
              phaseId={phase.id}
              config={cardConfig}
              phaseTagColor={config.tagColor}
              onFlush={onFlush}
              updateCard={(field, value) => updateCard(card.id, field, value)}
              updateBullet={(idx, value) => updateBullet(card.id, idx, value)}
              addBullet={() => addBullet(card.id)}
              removeBullet={idx => removeBullet(card.id, idx)}
            />
          );
        })}
      </div>

      <PhaseVideoSnippet
        videoUrl={phase.videoUrl}
        onUpdate={url => updatePhase('videoUrl' as keyof EditablePhase, url)}
        borderColor={config.borderColor}
      />
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PDLCSection() {
  const { phases, updatePhase, updateCard, updateBullet, addBullet, removeBullet, flushPhases } = usePhases();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    flushPhases();
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
    toast.success('All changes saved', {
      description: 'Your PDLC content has been saved to Firebase.',
      duration: 3000,
    });
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header with Save button */}
      <div className="flex items-start justify-between mb-10 gap-6">
        <div>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            End-to-end lifecycle
          </p>
          <h2
            className="text-3xl font-semibold text-slate-900 mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Product Development Lifecycle
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
            Three interconnected phases. Click any card to flip it and explore key activities — flip it back or hit "Edit &amp; view all" to make changes.
          </p>
        </div>

        <button
          onClick={handleSave}
          className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-sm transition-all duration-200 ${
            saving
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-blue-600 hover:bg-blue-500 border-transparent text-white shadow-lg shadow-blue-900/30'
          }`}
        >
          <Save className={`w-4 h-4 transition-transform ${saving ? 'scale-110' : ''}`} />
          {saving ? 'Saved ✓' : 'Save All Changes'}
        </button>
      </div>

      {/* Phase pipeline */}
      <div className="flex items-center gap-0 mb-10 overflow-x-auto pb-2">
        {PHASE_CONFIG.map((pc, i) => {
          const phase = phases.find(p => p.id === pc.id);
          return (
            <div key={pc.id} className="flex items-center flex-shrink-0">
              <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${pc.borderColor} ${pc.accentBg}`}>
                <span className={`text-xs font-bold tabular-nums ${pc.accentColor}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{pc.number}</span>
                <span className="text-sm font-semibold text-slate-900 whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {phase?.title ?? ''}
                </span>
                <span className="text-xs text-slate-500">{phase?.cards.length ?? 0} activities</span>
              </div>
              {i < PHASE_CONFIG.length - 1 && (
                <div className="flex items-center px-2">
                  <div className="h-px w-8 bg-slate-300" />
                  <ArrowRight className="w-4 h-4 text-slate-400 -ml-1" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hint */}
      <div className="flex items-center gap-2 mb-8 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 w-fit">
        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-xs text-slate-500">Click a card to flip · "Edit &amp; view all" on the back opens the rich text editor</span>
      </div>

      {/* Phases */}
      <div className="space-y-14">
        {PHASE_CONFIG.map((pc, i) => {
          const phase = phases.find(p => p.id === pc.id);
          if (!phase) return null;
          return (
            <div key={pc.id}>
              <PhaseSection
                phase={phase}
                config={pc}
                onFlush={flushPhases}
                updatePhase={(field, value) => updatePhase(pc.id, field, value)}
                updateCard={(cardId, field, value) => updateCard(pc.id, cardId, field, value)}
                updateBullet={(cardId, idx, value) => updateBullet(pc.id, cardId, idx, value)}
                addBullet={cardId => addBullet(pc.id, cardId)}
                removeBullet={(cardId, idx) => removeBullet(pc.id, cardId, idx)}
              />
              {i < PHASE_CONFIG.length - 1 && (
                <div className="flex items-center justify-center mt-10 gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 px-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <ArrowRight className="w-3 h-3" /> feeds into
                  </div>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
