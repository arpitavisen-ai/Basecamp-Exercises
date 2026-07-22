const strategyNodes = [
  'Vision & Strategy',
  'Portfolio Backlog',
  'Business Goals & Objectives',
  'Market & User Research with AI',
];

const discoveryNodes = [
  'AI assisted user research',
  'AI enabled Programme Backlog',
  'AI assisted Product Backlog',
  'Exploration & Validation',
  'Rapid prototyping',
  'Increment Planning',
  'Fast Feedback Loops',
  'AI assisted User Story Definition',
  'AI assisted Product Refinement',
  'AI Assisted Sprint Planning',
  'Daily Stand Ups',
  'Sprint · Sprint Demo · MVP · Retro',
];

const ciNodes = [
  'AI Agentic Data',
  'AI tracked Metrics & KPIs',
  'Agentic AI Live Support',
  'Customer Feedback',
];

interface PhaseDescItem { title: string; desc: string }
interface PhaseDesc {
  number: string;
  phase: string;
  tagline: string;
  accent: string;
  bg: string;
  borderColor: string;
  body: string;
  highlight?: string;
  items: PhaseDescItem[];
  cols?: number;
}

const phases: PhaseDesc[] = [
  {
    number: '01',
    phase: 'Strategy',
    tagline: 'asks the questions',
    accent: '#7c3aed',
    bg: 'rgba(124,58,237,0.04)',
    borderColor: 'rgba(124,58,237,0.18)',
    body: 'AI accelerates market and user research by synthesising diverse inputs into actionable insights; helping teams uncover unmet needs, anticipate trends, and align investments with strategic outcomes.',
    items: [
      { title: 'Market & User Research',         desc: 'AI-powered insights uncover market gaps, emerging trends, and user behaviour patterns.' },
      { title: 'Business Goals & Objectives',    desc: 'Strategic objectives are shaped by real-time data and predictive analytics.' },
      { title: 'Vision & Strategy',              desc: 'Vision is guided by insight-driven, data-informed, and opportunity-focused AI inputs.' },
      { title: 'Portfolio Backlog',              desc: 'Opportunities are prioritised based on impact potential surfaced through AI analysis.' },
    ],
  },
  {
    number: '02',
    phase: 'Discovery',
    tagline: 'finds the answers',
    accent: '#2563eb',
    bg: 'rgba(37,99,235,0.04)',
    borderColor: 'rgba(37,99,235,0.18)',
    body: 'Here we validate and test before we commit to building anything. GenAI supports no code rapid prototyping and idea validation enabling faster, more confident planning decisions with the option to pivot before committing validated de-risked ideas to the development backlog.',
    highlight: 'This process of rapid test and validation becomes the true engine of the SDLC and de-risks delivery of technology.',
    cols: 3,
    items: [
      { title: 'Programme Backlog',             desc: 'Continuously updated with validated ideas, reducing waste and functional debt.' },
      { title: 'Development of Product Backlog',desc: 'Rapid prototyping and informal "vibe coding" enable frequent validation of assumptions.' },
      { title: 'Exploration',                   desc: 'AI supports ongoing discovery through experimentation and insight-driven iteration.' },
    ],
  },
  {
    number: '03',
    phase: 'Delivery',
    tagline: 'demonstrates value',
    accent: '#0d9488',
    bg: 'rgba(13,148,136,0.04)',
    borderColor: 'rgba(13,148,136,0.18)',
    body: 'AI improves the speed and quality of delivery through intelligent automation supporting code generation, test simulation, release optimisation, and experiment management within established pipelines.',
    items: [
      { title: 'Product Backlog',               desc: 'AI helps prioritise backlog items using product context and business logic.' },
      { title: 'Product Refinement',            desc: 'Automation streamlines story writing and supports backlog grooming.' },
      { title: 'Sprint Planning',               desc: 'AI-assisted predictive planning improves accuracy and delivery confidence.' },
      { title: 'Stand Ups · Sprint · Demo · MVP · Retro', desc: 'Fast feedback loops are enhanced by AI insights, enabling quicker iteration and decision-making.' },
    ],
  },
  {
    number: '04',
    phase: 'Continuous Improvement',
    tagline: 'closes the loop',
    accent: '#059669',
    bg: 'rgba(5,150,105,0.04)',
    borderColor: 'rgba(5,150,105,0.18)',
    body: 'Agentic AI transforms operations by detecting user behaviours and system signals, generating real-time natural language summaries, and surfacing intelligent actions, driving proactive, data-led optimisation.',
    items: [
      { title: 'Data',              desc: 'Real-time operational data is analysed by agentic AI to detect anomalies instantly.' },
      { title: 'Customer Feedback', desc: 'AI helps synthesise customer feedback and identify actionable insights.' },
      { title: 'Live Support',      desc: 'AI can autonomously resolve certain issues, increasing speed and resilience.' },
      { title: 'Metrics & KPIs',   desc: 'AI enhances performance monitoring with deeper trend and risk analysis.' },
    ],
  },
];

function PurpleNode({ label }: { label: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-full border-2 border-purple-400/70 bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <div className="w-2 h-2 rounded-full bg-purple-500" />
      </div>
      <span className="text-xs text-slate-700 leading-relaxed pt-1">{label}</span>
    </div>
  );
}

function TealNode({ label }: { label: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded-full border-2 border-teal-400/70 bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
      </div>
      <span className="text-xs text-slate-700 leading-relaxed pt-0.5">{label}</span>
    </div>
  );
}

function GradientNode({ label }: { label: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ border: '2px solid rgba(20,184,166,0.6)', background: 'rgba(20,184,166,0.1)' }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg,#7c3aed,#14b8a6)' }} />
      </div>
      <span className="text-xs text-slate-700 leading-relaxed pt-1">{label}</span>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center px-1 self-stretch">
      <div className="flex flex-col items-center gap-1 h-full">
        <div className="w-px flex-1 bg-slate-200" />
        <svg className="w-4 h-4 text-slate-300 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5l8 7-8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <div className="w-px flex-1 bg-slate-200" />
      </div>
    </div>
  );
}

function ItemCard({ title, desc, accent }: { title: string; desc: string; accent: string }) {
  return (
    <div
      className="rounded-xl bg-white p-4 border border-slate-100"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <p className="text-xs font-semibold text-slate-800 mb-1.5 leading-snug">{title}</p>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

export function AiPdlcDiagram() {
  return (
    <div className="mt-8 space-y-10">
      {/* Subtitle */}
      <p className="text-slate-500 text-sm leading-relaxed">
        A data-driven strategy, continuously validated, prioritised and delivered as tangible increments of value.
      </p>

      {/* ── Phase pipeline with circles ── */}
      <div className="grid gap-0" style={{ gridTemplateColumns: '1fr 28px 2fr 28px 1fr' }}>
        <div className="bg-purple-50/60 rounded-2xl border border-purple-200/60 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-purple-500 mb-5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Product Strategy
          </p>
          <div className="space-y-3.5">
            {strategyNodes.map(n => <PurpleNode key={n} label={n} />)}
          </div>
        </div>

        <Arrow />

        <div className="bg-teal-50/60 rounded-2xl border border-teal-200/60 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-teal-600 mb-5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Discovery and Delivery
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
            {discoveryNodes.map(n => <TealNode key={n} label={n} />)}
          </div>
        </div>

        <Arrow />

        <div className="rounded-2xl border p-5" style={{ background: 'linear-gradient(135deg,rgba(167,139,250,0.07) 0%,rgba(20,184,166,0.07) 100%)', borderColor: 'rgba(20,184,166,0.35)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-5" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#0f766e' }}>
            Continuous Improvement
          </p>
          <div className="space-y-3.5">
            {ciNodes.map(n => <GradientNode key={n} label={n} />)}
          </div>
        </div>
      </div>

      {/* ── Phase description cards ── */}
      <div className="space-y-4 border-t border-slate-100 pt-8">
        {phases.map((p, i) => (
          <div
            key={p.number}
            className="rounded-2xl p-6"
            style={{ background: p.bg, border: `1px solid ${p.borderColor}` }}
          >
            <div className="grid grid-cols-[220px_1fr] gap-8">

              {/* Left — phase identity + body */}
              <div className="flex flex-col">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold mb-4 flex-shrink-0"
                  style={{ background: p.accent, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {p.number}
                </div>
                <p
                  className="text-lg font-semibold text-slate-900 leading-snug mb-0.5"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {p.phase}
                </p>
                <p
                  className="text-sm font-normal mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", color: p.accent }}
                >
                  <em>{p.tagline}</em>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed flex-1">{p.body}</p>
                {p.highlight && (
                  <p
                    className="text-xs font-semibold leading-relaxed mt-4 pl-3 py-2 rounded-lg"
                    style={{ borderLeft: `3px solid ${p.accent}`, background: 'rgba(255,255,255,0.6)', color: p.accent }}
                  >
                    {p.highlight}
                  </p>
                )}
              </div>

              {/* Right — item cards */}
              <div
                className="grid gap-3 content-start"
                style={{ gridTemplateColumns: `repeat(${p.cols ?? 2}, 1fr)` }}
              >
                {p.items.map(item => (
                  <ItemCard key={item.title} title={item.title} desc={item.desc} accent={p.accent} />
                ))}
              </div>
            </div>

            {/* Connector arrow between cards */}
            {i < phases.length - 1 && (
              <div className="flex justify-center mt-4 -mb-8">
                <svg className="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 5v14M5 15l7 7 7-7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
