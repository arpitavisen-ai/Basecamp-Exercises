import { useState, useCallback, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import {
  X, Target, Search, Rocket, BarChart2, Map, Users2, Lightbulb,
  FlaskConical, TestTube2, Cpu, ClipboardList, Palette, GitBranch,
  Code2, ShieldCheck, Megaphone, TrendingUp, ChevronRight, RotateCcw,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Save, Plus, Trash2, Video, Play, Pencil,
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
  accentHex: string;
  cards: { id: string; icon: React.ReactNode; frontAccent: string; backBg: string }[];
}

const PHASE_CONFIG: PhaseConfig[] = [
  {
    id: 'strategy', number: '01',
    accentColor: 'text-blue-400', accentBg: 'bg-blue-500/10',
    borderColor: 'border-blue-500/25', tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    accentHex: '#60a5fa',
    cards: [
      { id: 'ps-1', frontAccent: 'from-blue-600/20 to-blue-800/10', backBg: '#0F1E3A', icon: <BarChart2 className="w-6 h-6" /> },
      { id: 'ps-2', frontAccent: 'from-blue-600/20 to-indigo-800/10', backBg: '#0F1E3A', icon: <Target className="w-6 h-6" /> },
      { id: 'ps-4', frontAccent: 'from-indigo-600/20 to-blue-800/10', backBg: '#0F1E3A', icon: <Target className="w-6 h-6" /> },
      { id: 'ps-5', frontAccent: 'from-blue-500/20 to-blue-900/10', backBg: '#0F1E3A', icon: <Map className="w-6 h-6" /> },
    ],
  },
  {
    id: 'discovery', number: '02',
    accentColor: 'text-emerald-400', accentBg: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/25', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    accentHex: '#34d399',
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
    accentHex: '#c084fc',
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
  {
    id: 'ci', number: '04',
    accentColor: 'text-teal-400', accentBg: 'bg-teal-500/10',
    borderColor: 'border-teal-500/25', tagColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    accentHex: '#2dd4bf',
    cards: [
      { id: 'ci-1', frontAccent: 'from-teal-600/20 to-cyan-800/10',  backBg: '#0A2525', icon: <BarChart2 className="w-6 h-6" /> },
      { id: 'ci-2', frontAccent: 'from-cyan-600/20 to-teal-800/10',  backBg: '#0A2525', icon: <Users2 className="w-6 h-6" /> },
      { id: 'ci-3', frontAccent: 'from-teal-700/20 to-emerald-800/10', backBg: '#0A2525', icon: <Megaphone className="w-6 h-6" /> },
      { id: 'ci-4', frontAccent: 'from-emerald-600/20 to-teal-900/10', backBg: '#0A2525', icon: <TrendingUp className="w-6 h-6" /> },
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
  contentVersion?: number;
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
      { id: 'ps-1', contentVersion: 2, title: 'Market & Competitive Intelligence', subtitle: 'AI-accelerated market & customer insight', description: 'AI-assisted scanning continuously monitors markets, competitors, and macro trends — synthesising signals from competitor filings, academic papers, and social signals into positioning gaps and white-space opportunities. AI also models unmet needs from behavioural and voice-of-customer data, quantifying segment value and anticipating demand shifts — delivering an evidence-based opportunity landscape far faster than manual research alone.', bullets: ['AI-assisted competitor benchmarking and whitespace identification', 'AI-accelerated synthesis of market signals and emerging trends', 'AI-supported customer demand modelling from behavioural data', 'AI-assisted segment sizing and attractiveness ranking', 'AI-accelerated PEST & positioning analysis at scale'] },
      { id: 'ps-2', contentVersion: 2, title: 'Vision, Value Proposition & SWOT', subtitle: 'Strategic foundation', description: 'AI accelerates the synthesis of research inputs to surface evidence for each SWOT quadrant, then translates those insights into a differentiated value proposition — stress-tested against multiple market scenarios to produce a sharp, defensible strategic narrative. Teams leave with a vision grounded in evidence and positioning that stakeholders can align behind.', bullets: ['AI-assisted SWOT evidence gathering and synthesis', 'AI-supported value proposition generation and stress-testing', 'AI-assisted vision validation against market and user data', 'AI-accelerated scenario modelling for strategic options', 'AI-assisted strategic narrative and positioning generation'] },
      { id: 'ps-4', contentVersion: 2, title: 'Investment Prioritisation & OKRs', subtitle: 'Portfolio bets and measurable outcomes', description: 'AI-assisted modelling of trade-offs across initiatives by impact, cost, and risk helps teams optimise portfolio bets and resource allocation against strategic goals. AI then converts those priorities into measurable OKRs — benchmarking KPI targets against industry data, flagging objectives that lack measurable key results, and aligning cross-functional teams on what good looks like before a single sprint begins.', bullets: ['AI-assisted portfolio trade-off modelling by impact, cost, and risk', 'AI-supported resource allocation optimisation against strategic goals', 'AI-assisted KPI benchmarking vs. industry norms', 'AI-supported OKR draft generation and cross-objective alignment checks', 'AI-accelerated baseline modelling for stretch targets'] },
      { id: 'ps-5', contentVersion: 2, title: 'Roadmap & Performance Steering', subtitle: 'From living plan to continuously steered delivery', description: 'AI-assisted scoring and sequencing of features using impact-effort modelling produces a living roadmap aligned to OKRs and cross-functional dependencies. Once live, AI tracks KPIs, market shifts, and leading indicators in real time — recommending course corrections and reprioritisation as conditions change — so strategy is steered continuously, not just revisited at planning time.', bullets: ['AI-assisted RICE / MoSCoW scoring and capacity-adjusted sequencing', 'AI-supported dependency risk analysis and stakeholder roadmap views', 'AI-accelerated roadmap-to-OKR alignment and scenario planning', 'AI-assisted real-time KPI and leading indicator tracking', 'AI-supported course correction and reprioritisation recommendations'] },
    ],
  },
  {
    id: 'discovery',
    title: 'Product Discovery',
    subtitle: 'Validate assumptions for the MVP before committing to build.',
    cards: [
      { id: 'pd-1', contentVersion: 2, title: 'Signal Intelligence & User Research', subtitle: 'Insight aggregation and user discovery', description: 'AI-assisted transcription and real-time coding of interview recordings auto-clusters responses and surfaces recurring themes across sessions. At scale, AI aggregates feedback, analytics, market trends, and competitor data — detecting patterns, unmet needs, and emerging opportunities prioritised by business impact. Output: an opportunity landscape grounded in both qualitative depth and quantitative evidence.', bullets: ['AI-assisted transcription, theme coding, and clustering across sessions', 'AI-accelerated aggregation of feedback, analytics, and market signals', 'AI-supported sentiment and emotion tagging across channels', 'AI-assisted pattern and unmet need detection at scale', 'AI-supported opportunity prioritisation by business impact'] },
      { id: 'pd-2', contentVersion: 2, title: 'Feedback Analysis & Problem Definition', subtitle: 'From signals to structured problem statements', description: 'AI accelerates the classification of qualitative feedback at scale — grouping responses by jobs-to-be-done, identifying sentiment clusters, and ranking unmet needs by frequency and severity. AI then converts those insights into quantified problem statements with measurable success criteria, refining personas using behavioural signals — ensuring the team solves the right problem with precision before committing to a direction.', bullets: ['AI-assisted theme classification, clustering, and JTBD extraction', 'AI-accelerated sentiment scoring and unmet need ranking', 'AI-supported quantified problem statement generation', 'AI-assisted persona refinement from behavioural signals', 'AI-supported decision-ready problem framing for team alignment'] },
      { id: 'pd-3', contentVersion: 2, title: 'Tech Discovery & Delivery Handoff', subtitle: 'Feasibility, architecture, and execution readiness', description: 'AI-assisted evaluation of architecture options against requirements helps teams flag compliance and IG risks faster, and model build-vs-buy trade-offs using live vendor data. At the end of discovery, AI translates validated concepts into epics, objectives, and roadmap options — surfacing dependencies, risks, and instrumentation needs — and preserves learnings in a reusable discovery memory for a clean, loss-free handoff to delivery.', bullets: ['AI-assisted architecture option scoring and compliance risk flagging', 'AI-supported build vs. buy analysis with live vendor data', 'AI-accelerated security pattern recommendation', 'AI-assisted translation of validated concepts into epics and objectives', 'AI-supported dependency and instrumentation surfacing for handoff'] },
      { id: 'pd-4', contentVersion: 2, title: 'Hypothesis Generation & Concept Validation', subtitle: 'Structured problem framing and evidence-based decisions', description: 'AI-assisted generation of HMW prompts and hypotheses — seeded from research themes and scored against user data — identifies which assumptions carry the highest risk, focusing prototyping effort where it matters most. AI then synthesises qualitative and quantitative validation evidence in a unified view, detecting adoption blockers and providing confidence-based scale / pivot / pause recommendations before any engineering commitment.', bullets: ['AI-assisted HMW prompt and hypothesis generation from research', 'AI-supported hypothesis scoring by desirability, feasibility, and strategic fit', 'AI-accelerated assumption risk ranking to focus prototyping effort', 'AI-assisted validation evidence synthesis across all research sources', 'AI-supported scale / pivot / pause recommendations with confidence scores'] },
      { id: 'pd-5', contentVersion: 2, title: 'Rapid Prototyping & Experiment Design', subtitle: 'GenAI rapid prototyping and experiment-ready validation', description: 'GenAI-assisted no-code and vibe-coded rapid prototyping turns a text prompt or sketch into a working interactive prototype in hours. AI generates robust experiment plans with cohorts, success metrics, and test sequences — sequenced by uncertainty reduction — so teams learn fast and validate layouts against known usability patterns before committing to engineering, dramatically compressing the idea-to-evidence cycle.', bullets: ['AI-assisted prompt-to-prototype creation for fast, tangible concepts', 'AI-supported experiment plan generation with cohorts and success metrics', 'AI-accelerated iteration from user feedback loops and usability heuristics', 'AI-assisted accessibility checks (WCAG) on prototypes', 'AI-supported test sequencing by uncertainty reduction'] },
    ],
  },
  {
    id: 'delivery',
    title: 'Product Delivery',
    subtitle: 'Ship with quality, iterate with data.',
    cards: [
      { id: 'pdl-1', contentVersion: 2, title: 'Delivery Planning & Requirements', subtitle: 'From validated ideas to an executable plan', description: 'AI-assisted OKR-driven delivery planning converts strategy and discovery outputs into comprehensive roadmaps with risks, dependencies, and team capacity made explicit — producing a 90-day executable plan. AI then drafts user stories from interview transcripts and research artefacts, suggests acceptance criteria, and flags vague or untestable requirements before they reach engineering.', bullets: ['AI-assisted OKR and roadmap generation from discovery outputs', 'AI-supported resource capacity modelling and gap identification', 'AI-accelerated user story generation and acceptance criteria suggestions', 'AI-assisted vague requirement detection before reaching engineering', 'AI-supported dependency and duplication identification'] },
      { id: 'pdl-2', contentVersion: 2, title: 'Design', subtitle: 'AI-augmented UI/UX', description: 'AI-assisted generation of component variants and layout alternatives from a brief helps teams check colour contrast and accessibility compliance automatically — accelerating the design-to-dev handoff.', bullets: ['AI-assisted component & variant generation', 'AI-supported WCAG contrast & a11y checks', 'AI-assisted UI copy generation', 'AI-supported design token suggestions from brand guidelines', 'AI-assisted design critique before review sessions'] },
      { id: 'pdl-3', contentVersion: 2, title: 'Sprint Planning', subtitle: 'AI-assisted planning', description: 'AI-assisted analysis of historical velocity and team capacity helps teams recommend sprint scope, surface stories at risk of spilling over, and flag dependencies that could block delivery before the sprint starts.', bullets: ['AI-assisted velocity & capacity analysis', 'AI-supported risk-adjusted sprint scope suggestions', 'AI-accelerated dependency blocker detection', 'AI-assisted sprint goal generation', 'AI-supported retrospective insight summarisation'] },
      { id: 'pdl-4', contentVersion: 2, title: 'Intelligent Engineering', subtitle: 'AI-assisted engineering and code intelligence', description: 'AI-assisted coding (Copilot, Claude) accelerates feature development through code suggestions, real-time explanation of complex logic, and automated documentation. Code intelligence tools improve product maintainability, reduce long-term technical debt, and flag risky deployments — enabling the CI/CD pipeline to catch flaky code and release faster with higher confidence and fewer rollbacks.', bullets: ['AI-assisted code generation, autocomplete, and inline documentation', 'AI-supported code intelligence for maintainability and debt reduction', 'AI-accelerated code review suggestions and risky path detection', 'AI-assisted unit test scaffolding from requirements', 'AI-supported explanation and refactoring of legacy and complex code'] },
      { id: 'pdl-5', contentVersion: 2, title: 'Intelligent Testing & QA', subtitle: 'AI-accelerated quality and release confidence', description: 'AI-assisted test case generation from acceptance criteria helps teams run regression suites faster, identify edge cases, and predict which areas of the codebase carry the highest release risk. Intelligent CI/CD catches flaky code, flags risky deployments, and shortens the time between build and go-live — enabling faster, more confident releases with fewer rollbacks.', bullets: ['AI-assisted test case generation from acceptance criteria', 'AI-accelerated regression, smoke, and edge case testing', 'AI-supported intelligent CI/CD — catching flaky code and risky deployments', 'AI-assisted risk-scored release impact analysis', 'AI-supported performance anomaly and threshold breach detection'] },
      { id: 'pdl-6', contentVersion: 2, title: 'Launch Readiness & Personalisation', subtitle: 'Safe releases and personalised user journeys', description: 'AI-assisted scanning of release notes and change logs for undocumented risk helps teams assess go-live readiness and generate training materials and stakeholder comms drafts. Post-launch, AI optimises go-to-market timing from market signals, personalises user journeys based on live behaviour, and proactively reduces drop-off through predictive interventions — maximising activation and retention from day one.', bullets: ['AI-assisted release risk scanning, readiness scoring, and comms drafting', 'AI-supported go-to-market timing optimisation from market signals', 'AI-accelerated user journey personalisation from live behaviour', 'AI-assisted predictive drop-off detection and proactive intervention', 'AI-supported rollback plan and launch checklist generation'] },
      { id: 'pdl-7', contentVersion: 2, title: 'Adoption Monitoring & Agentic Iteration', subtitle: 'Continuous improvement from live product signals', description: 'AI-assisted monitoring of adoption signals in real time surfaces friction points before they become support tickets. Agentic AI investigates performance dips with root cause analysis, aggregates user feedback to identify priority themes, and continuously tunes personalisation and recommendations without human oversight — closing the loop between what shipped and what to build next.', bullets: ['AI-assisted adoption and drop-off detection from usage signals', 'AI-accelerated agentic root cause analysis on performance dips', 'AI-supported user feedback aggregation and priority theme identification', 'AI-assisted churn risk prediction and proactive intervention', 'AI-supported agentic personalisation refinement without manual oversight'] },
    ],
  },
  {
    id: 'ci',
    title: 'Product Ops',
    subtitle: 'AI-driven optimisation that closes the loop.',
    cards: [
      { id: 'ci-1', contentVersion: 2, title: 'Agentic Data Analytics', subtitle: 'AI-assisted real-time intelligence', description: 'AI-assisted real-time monitoring of operational data streams detects anomalies and behavioural shifts — generating natural language summaries and triggering alerts before KPI thresholds are breached. Agentic AI proactively investigates dips and spikes, performing root cause analysis and recommending fixes before issues escalate to the product team.', bullets: ['AI-assisted anomaly detection and pattern identification in real-time data', 'AI-supported natural language operational summaries on demand', 'AI-accelerated alerting before KPI thresholds breach', 'AI-assisted agentic root-cause analysis on flagged signals', 'AI-supported proactive issue surfacing before team escalation'] },
      { id: 'ci-2', contentVersion: 2, title: 'Customer Feedback Intelligence', subtitle: 'AI-accelerated closed-loop insight', description: 'AI accelerates synthesis of customer feedback at scale — classifying sentiment themes, clustering verbatims by jobs-to-be-done, and tracking insight trends over time. Agentic personalisation refinement continuously tunes product recommendations and flows based on aggregated feedback without human oversight — so product teams act on evidence rather than anecdote.', bullets: ['AI-assisted theme classification across all feedback channels', 'AI-supported sentiment trend tracking and JTBD verbatim clustering', 'AI-accelerated insight report generation and pattern detection', 'AI-assisted agentic personalisation refinement from feedback signals', 'AI-supported action backlog prioritisation from synthesised feedback'] },
      { id: 'ci-3', contentVersion: 2, title: 'Live Support Automation', subtitle: 'AI-assisted support resolution', description: 'AI-assisted tier-1 support diagnoses common issues, routes escalations intelligently, and continuously updates the knowledge base — increasing speed and reducing cost. AI can autonomously resolve certain issues, escalate only the cases that genuinely need human judgement, and analyse support patterns to surface actionable product fixes for the engineering team.', bullets: ['AI-assisted tier-1 issue resolution and autonomous case handling', 'AI-supported intelligent issue triage and escalation routing', 'AI-accelerated knowledge base updates from resolved cases', 'AI-assisted escalation prediction before SLA breach', 'AI-supported support pattern analysis to drive product fixes'] },
      { id: 'ci-4', contentVersion: 2, title: 'Performance Sensing & Steering', subtitle: 'AI-assisted performance monitoring and course correction', description: 'AI-assisted performance monitoring surfaces leading indicators and anticipates metric trends before they turn negative — generating board-ready summaries connecting operational signals to strategic outcomes. AI enhances KPI tracking with deeper trend and risk analysis and recommends proactive course corrections as conditions change, keeping the product continuously aligned to its strategic intent.', bullets: ['AI-assisted leading indicator detection and trend forecasting', 'AI-supported deeper trend and risk analysis on KPIs', 'AI-accelerated predictive metric modelling and anomaly detection', 'AI-assisted executive performance summary generation', 'AI-supported anomaly-to-action recommendations for course correction'] },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function usePhases() {
  const [phases, setPhases, flushPhases] = useFirebaseSync<EditablePhase[]>('pdlcPhases', DEFAULT_PHASES);

  // Merge phases + cards: ensures new phases/cards appear and AI-focused descriptions load
  const mergedPhases = DEFAULT_PHASES.map(def => {
    const stored = phases.find(p => p.id === def.id);
    if (!stored) return def;
    const mergedCards = def.cards.map(defCard => {
      const storedCard = stored.cards.find(c => c.id === defCard.id);
      if (!storedCard) return defCard;
      // Replace content when a newer contentVersion exists in DEFAULT_PHASES
      const needsRefresh = (storedCard.contentVersion ?? 1) < (defCard.contentVersion ?? 1);
      const desc = needsRefresh || !storedCard.description.toLowerCase().includes('ai') ? defCard.description : storedCard.description;
      const bullets = needsRefresh || !storedCard.bullets.some(b => b.toLowerCase().includes('ai')) ? defCard.bullets : storedCard.bullets;
      const title = needsRefresh ? defCard.title : storedCard.title;
      const subtitle = needsRefresh ? defCard.subtitle : storedCard.subtitle;
      return { ...storedCard, title, subtitle, description: desc, bullets, contentVersion: defCard.contentVersion };
    });
    return { ...stored, cards: mergedCards };
  });

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

  return { phases: mergedPhases, updatePhase, updateCard, updateBullet, addBullet, removeBullet, flushPhases };
}

// ─── Card detail modal ────────────────────────────────────────────────────────

function CardModal({
  card, phaseId, config, phaseTagColor, accentHex, open, onClose, onFlush,
  updateCard, updateBullet, addBullet, removeBullet,
}: {
  card: EditableCard;
  phaseId: string;
  config: PhaseConfig['cards'][number];
  phaseTagColor: string;
  accentHex?: string;
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
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={accentHex
                    ? { background: accentHex + '18', color: accentHex }
                    : { background: '#f1f5f9', color: '#475569' }}
                >
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
  card, phaseId, config, phaseTagColor, accentHex, onFlush,
  updateCard, updateBullet, addBullet, removeBullet,
}: {
  card: EditableCard;
  phaseId: string;
  config: PhaseConfig['cards'][number];
  phaseTagColor: string;
  accentHex?: string;
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
        style={{ perspective: '1000px', height: '220px' }}
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
            className="rounded-xl border border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
          >
            {/* Coloured top stripe */}
            <div className="h-1 w-full flex-shrink-0" style={{ background: accentHex ?? '#94a3b8' }} />

            <div className="flex flex-col flex-1 p-5">
              <div className="flex items-start justify-between mb-auto">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={accentHex
                    ? { background: accentHex + '15', color: accentHex }
                    : { background: '#f1f5f9', color: '#475569' }}
                >
                  {config.icon}
                </div>
                <span className="flex items-center gap-1 text-[9px] text-slate-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <RotateCcw className="w-2.5 h-2.5" /> flip
                </span>
              </div>

              <div className="mt-auto pt-3">
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
          </div>

          {/* Back */}
          <div
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}
            className="rounded-xl border border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm"
          >
            {/* Coloured top stripe */}
            <div className="h-1 w-full flex-shrink-0" style={{ background: accentHex ?? '#94a3b8' }} />

            <div className="flex flex-col h-full p-4 pt-3">
              <div className="flex-1 overflow-hidden">
                <p
                  className="text-[11px] text-slate-700 leading-relaxed mb-2 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: card.description || '<em>No description yet</em>' }}
                />
                <ul className="space-y-1.5">
                  {card.bullets.slice(0, 3).map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[10px] text-slate-600 line-clamp-1">
                      <span className="w-1.5 h-1.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: accentHex ?? '#94a3b8' }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={e => { e.stopPropagation(); setModalOpen(true); }}
                className="flex items-center gap-1.5 text-[10px] font-semibold transition-colors mt-3 flex-shrink-0"
                style={{ color: accentHex ?? '#60a5fa' }}
              >
                Edit & view all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CardModal
        card={card} phaseId={phaseId} config={config}
        phaseTagColor={phaseTagColor} accentHex={accentHex}
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

// ─── Phase insight blocks ─────────────────────────────────────────────────────

interface InsightDifferentiator { label: string; desc: string }
interface InsightData {
  phase: string; tagline: string; accent: string; bg: string;
  borderHex: string; body: string; highlight?: string;
  takeaway?: string;
  differentiators?: InsightDifferentiator[];
}

const PHASE_INSIGHTS: Record<string, InsightData> = {
  strategy: {
    phase: 'Strategy', tagline: 'asks the questions',
    accent: '#7c3aed', bg: 'rgba(124,58,237,0.04)', borderHex: 'rgba(124,58,237,0.18)',
    body: 'AI accelerates market and user research by synthesising diverse inputs into actionable insights; helping teams uncover unmet needs, anticipate trends, and align investments with strategic outcomes.',
    takeaway: 'AI sharpens strategic foresight and investment confidence. Humans own the vision, judgement, and accountability.',
    differentiators: [
      { label: 'Aligned',      desc: 'Every initiative ladders up to the vision and business goals — no orphan work.' },
      { label: 'Streamlined',  desc: 'A single, prioritised plan replaces competing lists and duplicated effort.' },
      { label: 'User Centric', desc: 'Decisions start from real user needs and validated evidence, not opinion.' },
      { label: 'Actionable',   desc: 'Strategy translates into OKRs and a roadmap teams can act on today.' },
      { label: 'Value Driven', desc: 'Effort concentrates on the bets that drive measurable growth and impact.' },
    ],
  },
  discovery: {
    phase: 'Discovery', tagline: 'finds the answers',
    accent: '#2563eb', bg: 'rgba(37,99,235,0.04)', borderHex: 'rgba(37,99,235,0.18)',
    body: 'Here we validate and test before we commit to building anything. GenAI supports no code rapid prototyping and idea validation enabling faster, more confident planning decisions with the option to pivot before committing validated de-risked ideas to the development backlog.',
    highlight: 'This process of rapid test and validation becomes the true engine of the SDLC and de-risks delivery of technology.',
    takeaway: 'AI accelerates discovery velocity and decision confidence. Humans retain strategic judgement and accountability.',
    differentiators: [
      { label: 'Define',   desc: 'AI-assisted discovery and insight generation forms a strong, data-driven foundation for meaningful solutions.' },
      { label: 'Analyse',  desc: 'AI-driven user research, sentiment analysis, and pattern detection uncover deep user needs and pain points.' },
      { label: 'Create',   desc: 'AI-driven ideation, concept generation, and rapid prototyping turn ideas into tangible designs quickly.' },
      { label: 'Validate', desc: 'AI-powered testing and predictive analytics ensure only the most impactful solutions move forward.' },
      { label: 'Align',    desc: 'Teams and stakeholders unite around shared understanding, reducing waste and accelerating delivery.' },
    ],
  },
  delivery: {
    phase: 'Delivery', tagline: 'demonstrates value',
    accent: '#0d9488', bg: 'rgba(13,148,136,0.04)', borderHex: 'rgba(13,148,136,0.18)',
    body: 'AI improves the speed and quality of delivery through intelligent automation supporting code generation, test simulation, release optimisation, and experiment management within established pipelines.',
    takeaway: 'AI accelerates delivery speed and quality. Teams maintain ownership of architecture, quality standards, and customer relationships.',
    differentiators: [
      { label: 'Plan',    desc: 'OKRs connect research to a living backlog with risks and dependencies explicit — strategy becomes a 90-day executable plan.' },
      { label: 'Develop', desc: 'CI/CD, DoR/DoD, and test automation keep feedback fast and defects low — delivery cycles speed up without sacrificing stability.' },
      { label: 'Release', desc: 'Feature flags, launch readiness checks, and rollback paths make frequent, safe drops the default.' },
      { label: 'Iterate', desc: 'KPI trees, real-time dashboards, and lightweight experiments guide prioritisation and continuous improvement.' },
      { label: 'Partner', desc: 'Blended squads, proven playbooks, and practical AI accelerators help teams sustain outcomes beyond the engagement.' },
    ],
  },
  ci: {
    phase: 'Product Ops', tagline: 'closes the loop',
    accent: '#059669', bg: 'rgba(5,150,105,0.04)', borderHex: 'rgba(5,150,105,0.18)',
    body: 'Agentic AI transforms operations by detecting user behaviours and system signals, generating real-time natural language summaries, and surfacing intelligent actions, driving proactive, data-led optimisation.',
    takeaway: 'Agentic AI keeps the product loop running continuously. Humans set goals, govern outputs, and make the strategic calls.',
    differentiators: [
      { label: 'Real-time',   desc: 'Operational signals are detected and actioned within minutes, not monthly review cycles.' },
      { label: 'Proactive',   desc: 'AI surfaces issues before they escalate — shifting teams from reactive to predictive operations.' },
      { label: 'Closed-loop', desc: 'Customer feedback, product data, and support signals feed directly back into the product backlog.' },
      { label: 'Scalable',    desc: 'Agentic AI handles increasing data volumes and support loads without proportional headcount growth.' },
    ],
  },
};

// ─── Circular phase cycle (SVG) ───────────────────────────────────────────────

function PhaseCycle({ phases }: { phases: EditablePhase[] }) {
  const get = (id: string) => phases.find(p => p.id === id);
  const s = get('strategy');
  const d = get('discovery');
  const dl = get('delivery');
  const ci = get('ci');

  // viewBox 0 0 900 340
  // Card rects: x, y, w=215, h=115
  const cards = [
    { phase: s,  x: 25,  y: 25,  fill: 'url(#gb)',  stroke: 'rgba(59,130,246,0.3)',  accent: '#3b82f6',  n: '01' },
    { phase: d,  x: 660, y: 25,  fill: 'url(#gg)',  stroke: 'rgba(16,185,129,0.3)',  accent: '#10b981',  n: '02' },
    { phase: dl, x: 660, y: 200, fill: 'url(#gp)',  stroke: 'rgba(139,92,246,0.3)', accent: '#8b5cf6',  n: '03' },
    { phase: ci, x: 25,  y: 200, fill: 'url(#gt)',  stroke: 'rgba(20,184,166,0.3)', accent: '#14b8a6',  n: '04' },
  ];

  return (
    <div className="mb-10 rounded-2xl overflow-hidden border border-slate-100" style={{ background: 'linear-gradient(135deg,rgba(248,250,252,0.8) 0%,rgba(255,255,255,0.9) 100%)' }}>
      <svg viewBox="0 0 900 340" className="w-full" style={{ display: 'block' }}>
        <defs>
          {/* Card gradients */}
          <linearGradient id="gb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#eff6ff"/><stop offset="100%" stopColor="#f8faff"/></linearGradient>
          <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0fdf4"/><stop offset="100%" stopColor="#f7fff9"/></linearGradient>
          <linearGradient id="gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#faf5ff"/><stop offset="100%" stopColor="#fdf9ff"/></linearGradient>
          <linearGradient id="gt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f0fdfa"/><stop offset="100%" stopColor="#f5fffe"/></linearGradient>
          {/* Soft drop shadow */}
          <filter id="cshadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#94a3b8" floodOpacity="0.10"/>
          </filter>
          {/* Arrow markers */}
          <marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M1,2 L8,5 L1,8" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
        </defs>

        {/* Curved dashed arrows (drawn first, behind cards) */}
        {/* Strategy → Discovery (top arc) */}
        <path d="M 243,83 Q 450,22 657,83" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="7 5" markerEnd="url(#arr)"/>
        {/* Discovery → Delivery (right arc) */}
        <path d="M 767,143 Q 834,170 767,197" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="7 5" markerEnd="url(#arr)"/>
        {/* Delivery → Ops (bottom arc) */}
        <path d="M 657,258 Q 450,318 243,258" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="7 5" markerEnd="url(#arr)"/>
        {/* Ops → Strategy (left arc) */}
        <path d="M 133,197 Q 66,170 133,143" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="7 5" markerEnd="url(#arr)"/>

        {/* Centre badge */}
        <circle cx="450" cy="170" r="46" fill="white" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#cshadow)"/>
        <circle cx="450" cy="170" r="38" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
        <text x="450" y="162" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui,sans-serif" fontWeight="500" letterSpacing="0.03em">AI-powered</text>
        <text x="450" y="177" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui,sans-serif" fontWeight="500" letterSpacing="0.03em">PDLC loop</text>

        {/* Phase cards */}
        {cards.map(({ phase, x, y, fill, stroke, accent, n }) => (
          <g key={n} filter="url(#cshadow)">
            <rect x={x} y={y} width="215" height="115" rx="14" fill={fill} stroke={stroke} strokeWidth="1.5"/>
            {/* Coloured left accent bar */}
            <rect x={x} y={y + 12} width="4" height="91" rx="2" fill={accent}/>
            {/* Number */}
            <text x={x + 20} y={y + 34} fontSize="11" fill={accent} fontFamily="'JetBrains Mono',monospace" fontWeight="700">{n}</text>
            {/* Title */}
            <text x={x + 20} y={y + 58} fontSize="15" fill="#1e293b" fontFamily="'Playfair Display',Georgia,serif" fontWeight="600">{phase?.title ?? ''}</text>
            {/* Activity count */}
            <text x={x + 20} y={y + 78} fontSize="11" fill="#64748b" fontFamily="system-ui,sans-serif">{phase?.cards.length ?? 0} activities</text>
            {/* Subtitle snippet */}
            <text x={x + 20} y={y + 98} fontSize="10" fill="#94a3b8" fontFamily="system-ui,sans-serif">
              {(phase?.subtitle ?? '').slice(0, 34)}{(phase?.subtitle ?? '').length > 34 ? '…' : ''}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Phase section ────────────────────────────────────────────────────────────

function PhaseSection({
  phase, config, insight, onFlush,
  updatePhase, updateCard, updateBullet, addBullet, removeBullet,
}: {
  phase: EditablePhase;
  config: PhaseConfig;
  insight?: InsightData;
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
          {insight && (
            <p className="text-sm text-slate-600 leading-relaxed mt-2">
              {insight.body}
            </p>
          )}
          {insight?.highlight && (
            <p
              className="text-xs font-semibold leading-relaxed mt-3 pl-3 py-2 rounded-lg"
              style={{ borderLeft: `3px solid ${insight.accent}`, background: 'rgba(255,255,255,0.5)', color: insight.accent }}
            >
              {insight.highlight}
            </p>
          )}
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border flex-shrink-0 ${config.tagColor}`}
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {phase.cards.length} activities
        </span>
      </div>

      {/* Key takeaway — moved above cards per user feedback */}
      {insight?.takeaway && (
        <div
          className="mb-5 flex items-center gap-3 px-5 py-3.5 rounded-xl"
          style={{ border: `1px solid ${insight.borderHex}`, background: insight.bg }}
        >
          <span className="text-sm flex-shrink-0 font-bold" style={{ color: insight.accent }}>✦</span>
          <p className="text-xs font-medium text-slate-600 leading-relaxed italic">{insight.takeaway}</p>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-bold" style={{ color: insight?.accent ?? '#64748b' }}>◆</span>
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          What we deliver
        </p>
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
              accentHex={config.accentHex}
              onFlush={onFlush}
              updateCard={(field, value) => updateCard(card.id, field, value)}
              updateBullet={(idx, value) => updateBullet(card.id, idx, value)}
              addBullet={() => addBullet(card.id)}
              removeBullet={idx => removeBullet(card.id, idx)}
            />
          );
        })}
      </div>

      {/* Differentiators */}
      {insight?.differentiators && insight.differentiators.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold" style={{ color: insight.accent }}>◆</span>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              How we differentiate
            </p>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${insight.differentiators.length}, 1fr)` }}>
            {insight.differentiators.map((d, i) => (
              <div
                key={d.label}
                className="relative rounded-2xl bg-white border border-slate-200 p-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: insight.accent }} />
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold mb-4"
                  style={{ background: insight.accent, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p
                  className="text-sm font-bold text-slate-900 mb-2 leading-snug"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {d.label}
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
      {/* Header + cycle — grey box matching Use Case tab */}
      <div className="mb-10 p-8 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              End-to-end lifecycle
            </p>
            <h2
              className="text-3xl font-semibold text-slate-900 leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Product Development Lifecycle
              <br />
              <em className="font-normal text-slate-600">AI transforms every phase</em>
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              AI transforms the Product Development Lifecycle from a linear process into a continuously learning system. Each phase is accelerated by AI-assisted research, planning, and automation — compressing discovery from weeks to days, reducing delivery risk through predictive insight, and closing the feedback loop in real time. The result is faster time-to-value, higher confidence in decisions, and products that improve continuously after launch.
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

        {/* Phase cycle */}
        <PhaseCycle phases={phases} />
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
                insight={PHASE_INSIGHTS[pc.id]}
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
