import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Users, TrendingUp, ListChecks, Edit2, Check, Layers } from 'lucide-react';
import { Toaster } from 'sonner';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { KanbanBoard } from './components/KanbanBoard';
import { PersonaCard } from './components/PersonaCard';
import { ProgressTracker } from './components/ProgressTracker';
import { MarketResearchGrid } from './components/MarketResearchGrid';
import { PDLCSection } from './components/PDLCSection';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [problemStatement, setProblemStatement] = useLocalStorage(
    "problemStatement",
    "NHS trusts face growing financial and reputational exposure from patient feedback they cannot analyse at scale. The 10 Year Health Plan (July 2025) directly ties trust income to patient ratings through clinical team payments, patient power payments, and publicly published league tables updated quarterly from summer 2025. Yet most trusts still rely on manual coding, sampled data, and disconnected reporting systems that prevent timely action. There is no NHS-native platform that combines AI-powered theme classification, closed-loop feedback management, and integration with clinical systems — leaving organisations unable to detect emerging risks early or demonstrate improvement to regulators and boards."
  );
  const [editingStatement, setEditingStatement] = useState(false);
  const [tempStatement, setTempStatement] = useState(problemStatement);

  const [userSegments, setUserSegments] = useLocalStorage("userSegments", {
    chiefNurse: {
      title: "Chief Nurse",
      imageUrl: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOSFMlMjBudXJzZSUyMGNsaW5pY2FsJTIwbGVhZGVyJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzgyMzk2NzM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      goals: "Ensure patient experience meets CQC standards and board expectations\nMonitor trust-wide feedback trends and emerging risks\nDemonstrate improvement to regulators and NHSE\nAlign patient experience strategy to the 10 Year Health Plan\nSecure trust income tied to patient ratings",
      painPoints: "Feedback data arrives too late to act on before inspections\nNo single view across all wards and care settings\nManual board reports take days to compile\nUnable to link patient feedback to clinical outcomes or team performance",
      motivators: "Real-time trust-wide visibility of patient sentiment\nAutomated CQC-ready reporting and evidence packs\nEarly warning alerts before issues escalate\nBoard-level dashboards that require no manual preparation",
      opportunities: "AI-powered anomaly detection surfacing ward-level risks proactively\nOne-click regulatory evidence packs for CQC inspections\nPortfolio view linking patient experience to clinical and financial outcomes"
    },
    qualityManager: {
      title: "Quality Manager",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcHJvZmVzc2lvbmFsJTIwZGF0YSUyMGFuYWx5c2lzJTIwbGFwdG9wfGVufDF8fHx8MTc4MjM5Njc0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      goals: "Analyse all patient feedback — not just samples — at speed and scale\nClassify free-text themes accurately without manual coding\nGenerate meaningful reports for clinical and executive audiences\nIdentify patterns and trends across wards, specialties, and time periods\nClose the loop between patient feedback and operational action",
      painPoints: "Spending 60–70% of time manually coding free-text responses\nSampling means genuine issues go undetected until it is too late\nMultiple disconnected tools with no unified analytical layer\nDifficult to demonstrate that feedback has led to measurable change\nNo way to benchmark against peer trusts or national datasets",
      motivators: "AI theme classification reducing manual coding to near zero\nDrill-down from trust level to ward level to verbatim comments\nClosed-loop feedback workflow linking issues to resolved actions\nBenchmarking against FFT and national patient survey data",
      opportunities: "Automated theme tagging at 92–95% accuracy on real NHS data\nAnomaly alerts when sentiment drops on a ward or specialty\nSelf-serve report builder for clinical governance and board packs\nIntegration with Datix, EPR, and NHS App feedback channels"
    },
    wardManager: {
      title: "Ward Manager",
      imageUrl: "https://images.unsplash.com/photo-1516841273335-e39b37888115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3YXJkJTIwbWFuYWdlciUyMGhvc3BpdGFsJTIwY2xpbmljYWwlMjB0ZWFtfGVufDF8fHx8MTc4MjM5NjczOHww&ixlib=rb-4.1.0&q=80&w=1080",
      goals: "Understand what patients on my ward are saying in near real time\nReceive actionable feedback before discharge — not weeks later\nTrack whether actions taken have improved patient experience scores\nBuild a culture of continuous improvement within the ward team\nAvoid surprises during CQC inspections or trust reviews",
      painPoints: "Feedback arrives weeks after a patient's stay — too late to respond\nAggregated scores hide which specific issues need addressing\nNo visibility into whether complaints have been resolved downstream\nTeam members are not aware of feedback relevant to their practice\nFeeling that feedback is collected but never acted upon",
      motivators: "Near real-time ward-level feedback visible on a simple dashboard\nSpecific, actionable themes rather than headline satisfaction scores\nAbility to log actions taken and track whether scores improve\nRecognition when ward performance improves based on patient voice",
      opportunities: "Ward-level dashboard surfacing the top 3 feedback themes each week\nPre-discharge feedback capture before patients leave the ward\nClosed-loop action log visible to ward team and quality management\nComparison with similar wards to benchmark and share good practice"
    }
  });

  const [marketResearch, setMarketResearch] = useLocalStorage("marketResearch", [
    { id: '1', title: 'Competitive Analysis', description: 'Analyse existing product intelligence platforms in private sector and international public sector organisations to understand the landscape and identify differentiation opportunities.' },
    { id: '2', title: 'Current State Assessment', description: 'Map existing tools and systems used across UK public sector for product reporting and performance tracking, identifying gaps and integration opportunities.' },
    { id: '3', title: 'User Research', description: 'Conduct interviews and surveys with 15–20 product leaders, PMs, and senior stakeholders across 5–7 departments to surface unmet needs and latent demand.' },
    { id: '4', title: 'Technology Stack Research', description: 'Evaluate integration capabilities with common delivery tools (Jira, Azure DevOps, ServiceNow, etc.) and assess technical feasibility of proposed architecture.' },
    { id: '5', title: 'Pricing & Business Model', description: 'Research pricing models for SaaS platforms in public sector and applicable procurement frameworks (G-Cloud, Crown Commercial Service, etc.).' },
    { id: '6', title: 'Compliance & Security', description: 'Understand data protection requirements, security standards, and compliance obligations (GDPR, Cyber Essentials, NCSC guidelines) relevant to public sector platforms.' },
    { id: '7', title: 'Success Metrics Definition', description: 'Define how platform success will be measured and benchmarked in a public sector context, including adoption, efficiency gains, and outcome alignment.' },
  ]);

  const updateUserSegment = (segment: string, field: string, value: string) => {
    setUserSegments(prev => ({
      ...prev,
      [segment]: { ...prev[segment as keyof typeof prev], [field]: value }
    }));
  };

  const updateMarketResearch = (id: string, field: string, value: string) => {
    setMarketResearch(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addMarketResearch = (data: { title: string; description: string; thumbnail?: string; report?: string; reportName?: string }) => {
    setMarketResearch(prev => [...prev, { id: `mr-${Date.now()}`, ...data }]);
  };

  const deleteMarketResearch = (id: string) => {
    setMarketResearch(prev => prev.filter(item => item.id !== id));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster theme="dark" position="bottom-right" richColors />
      <div
        className="min-h-screen bg-background"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Top bar */}
        <header className="border-b border-white/7 bg-[#080F1E]">
          <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span
                className="text-sm font-semibold text-white tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Patient Feedback Intelligence Platform
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                NHS · Discovery Complete
              </span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </header>

        {/* Hero section */}
        <div className="max-w-[1400px] mx-auto px-8 pt-12 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Strategic Initiative
              </p>
              <h1
                className="text-5xl font-semibold text-white leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Product Intelligence
                <br />
                <em className="font-normal text-slate-400">for the NHS</em>
              </h1>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500/40 rounded-full" />
                {editingStatement ? (
                  <div className="pl-5">
                    <textarea
                      value={tempStatement}
                      onChange={e => setTempStatement(e.target.value)}
                      onBlur={() => { setProblemStatement(tempStatement); setEditingStatement(false); }}
                      rows={5}
                      className="w-full bg-[#0F1A2E] border border-blue-500/40 rounded-xl px-4 py-3 text-sm text-slate-300 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => { setProblemStatement(tempStatement); setEditingStatement(false); }}
                      className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      <Check className="w-3 h-3" /> Save
                    </button>
                  </div>
                ) : (
                  <div
                    className="pl-5 cursor-pointer"
                    onClick={() => { setEditingStatement(true); setTempStatement(problemStatement); }}
                  >
                    <p className="text-slate-400 leading-relaxed text-sm max-w-2xl">{problemStatement}</p>
                    <button className="mt-2 flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Edit2 className="w-3 h-3" /> Edit statement
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-3 lg:pt-14">
              {[
                { label: 'User Personas', value: '3', sub: 'Chief Nurse · Quality Mgr · Ward Mgr' },
                { label: 'Research Activities', value: `${marketResearch.length}`, sub: 'Items planned' },
                { label: 'Tasks', value: '25', sub: 'In backlog' },
                { label: 'Build Decision', value: 'GO', sub: 'Discovery complete · June 2026' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="bg-[#0F1A2E] rounded-xl border border-white/7 px-4 py-4"
                >
                  <p
                    className="text-[9px] uppercase tracking-[0.15em] text-slate-500 mb-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl font-semibold text-white mb-0.5"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-[1400px] mx-auto px-8 pb-16">
          <Tabs.Root defaultValue="users">
            <Tabs.List className="flex gap-0 border-b border-white/8 mb-10">
              {[
                { value: 'users', label: 'User Analysis', Icon: Users },
                { value: 'research', label: 'Artefacts', Icon: TrendingUp },
                { value: 'pdlc', label: 'PDLC', Icon: Layers },
              { value: 'tasks', label: 'Tasks', Icon: ListChecks },
              ].map(({ value, label, Icon }) => (
                <Tabs.Trigger
                  key={value}
                  value={value}
                  className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-500 border-b-2 border-transparent hover:text-slate-200 transition-colors data-[state=active]:text-white data-[state=active]:border-blue-500"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* User Analysis */}
            <Tabs.Content value="users">
              <div className="mb-8">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1.5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Click any persona to explore in depth
                </p>
                <h2
                  className="text-2xl font-semibold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  User Personas
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(userSegments).map(([key, segment]) => (
                  <PersonaCard
                    key={key}
                    imageUrl={segment.imageUrl}
                    title={segment.title}
                    goals={segment.goals}
                    painPoints={segment.painPoints}
                    motivators={segment.motivators}
                    opportunities={segment.opportunities}
                    onUpdate={(field, value) => updateUserSegment(key, field, value)}
                  />
                ))}
              </div>
            </Tabs.Content>

            {/* Market Research */}
            <Tabs.Content value="research">
              <MarketResearchGrid
                items={marketResearch}
                onUpdate={updateMarketResearch}
                onDelete={deleteMarketResearch}
                onAdd={addMarketResearch}
              />
            </Tabs.Content>

            {/* PDLC */}
            <Tabs.Content value="pdlc">
              <PDLCSection />
            </Tabs.Content>

            {/* Tasks */}
            <Tabs.Content value="tasks">
              <div className="space-y-6">
                <div className="mb-2">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1.5"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Drag tasks between columns to update status
                  </p>
                  <h2
                    className="text-2xl font-semibold text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Delivery Board
                  </h2>
                </div>
                <ProgressTracker />
                <KanbanBoard />
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </DndProvider>
  );
}
