import { useState, useEffect, lazy, Suspense } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Users, ListChecks, Layers, FileText, Activity } from 'lucide-react';
import { Toaster } from 'sonner';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ref, get, set } from 'firebase/database';
import { db } from './firebase';
import { KanbanBoard } from './components/KanbanBoard';
import { PersonaCard } from './components/PersonaCard';
import { ProgressTracker } from './components/ProgressTracker';
import { MarketResearchGrid } from './components/MarketResearchGrid';
import { PrototypeDetailView } from './components/PrototypeDetailView';
import { PDLCSection } from './components/PDLCSection';
import { DraftScript } from './components/DraftScript';
import { PasswordGate } from './components/PasswordGate';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { SEED_VERSION, SEED_PROBLEM_STATEMENT, SEED_USER_SEGMENTS, SEED_MARKET_RESEARCH, SEED_DRAFT_SCRIPT } from './data/seedData';

const NhsStartPage = lazy(() =>
  import('../microsites/nhs-dashboard/NhsStartPage').then(m => ({ default: m.NhsStartPage }))
);
const NhsDashboardPage = lazy(() =>
  import('../microsites/nhs-dashboard/NhsDashboardPage').then(m => ({ default: m.NhsDashboardPage }))
);

export default function App() {
  const [problemStatement, setProblemStatement, flushProblemStatement] = useFirebaseSync(
    "problemStatement",
    SEED_PROBLEM_STATEMENT
  );
  const [editingStatement, setEditingStatement] = useState(false);
  const [activeTab, setActiveTab] = useState('pdlc');
  const [nhsView, setNhsView] = useState<'start' | 'dashboard'>('start');
  const [artefactDetailId, setArtefactDetailId] = useState<string | null>(null);
  const [tempStatement, setTempStatement] = useState(problemStatement);

  const [userSegments, setUserSegments, flushUserSegments] = useFirebaseSync(
    "userSegments",
    SEED_USER_SEGMENTS
  );

  const [marketResearch, setMarketResearch, flushMarketResearch] = useFirebaseSync(
    "marketResearch",
    SEED_MARKET_RESEARCH
  );

  useEffect(() => {
    const versionRef = ref(db, 'dataVersion');
    get(versionRef).then(async snapshot => {
      const version = snapshot.exists() ? (snapshot.val() as number) : 0;
      if (version < SEED_VERSION) {
        const seedIfEmpty = async (path: string, data: unknown) => {
          const snap = await get(ref(db, path));
          if (!snap.exists()) await set(ref(db, path), JSON.stringify(data));
        };

        const mergeMarketResearch = async () => {
          const snap = await get(ref(db, 'marketResearch'));
          if (!snap.exists()) {
            await set(ref(db, 'marketResearch'), JSON.stringify(SEED_MARKET_RESEARCH));
          } else {
            const existing = JSON.parse(snap.val() as string) as typeof SEED_MARKET_RESEARCH;
            const existingIds = new Set(existing.map(item => item.id));
            const newItems = SEED_MARKET_RESEARCH.filter(item => !existingIds.has(item.id));
            if (newItems.length > 0) {
              await set(ref(db, 'marketResearch'), JSON.stringify([...existing, ...newItems]));
            }
          }
        };

        await Promise.all([
          seedIfEmpty('problemStatement', SEED_PROBLEM_STATEMENT),
          seedIfEmpty('userSegments', SEED_USER_SEGMENTS),
          seedIfEmpty('draftScript', SEED_DRAFT_SCRIPT),
          mergeMarketResearch(),
        ]);
        await set(versionRef, SEED_VERSION);
      }
    });
  }, []);

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
    <PasswordGate>
    <DndProvider backend={HTML5Backend}>
      <Toaster theme="light" position="bottom-right" richColors />
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Top bar */}
        <header className="border-b border-slate-200 bg-white">
          <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span
                className="text-base font-semibold text-slate-900 tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                S&amp;PE Product AI Pillar
              </span>
            </div>
          </div>
        </header>

        {/* Hero section */}
        <div className="max-w-[1400px] mx-auto px-8 pt-12 pb-8">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              S&amp;PE Product Demo
            </p>
            <h1
              className="text-5xl font-semibold text-slate-900 leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              AI in Product Management
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-[1400px] mx-auto px-8 pb-16">
          <Tabs.Root
            value={activeTab}
            onValueChange={(value) => {
              if (activeTab === 'nhs' && value !== 'nhs') setNhsView('start');
              setActiveTab(value);
            }}
          >
            <Tabs.List className="flex gap-0 border-b border-slate-200 mb-10">
              {[
                { value: 'pdlc',   label: 'AI in PDLC',       Icon: Layers },
                { value: 'users',  label: 'Use Case - NHS Platform', Icon: Users },
                { value: 'tasks',  label: 'Tasks',              Icon: ListChecks },
                { value: 'script', label: 'Draft Script',       Icon: FileText },
              ].map(({ value, label, Icon }) => (
                <Tabs.Trigger
                  key={value}
                  value={value}
                  className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-500 border-b-2 border-transparent hover:text-slate-700 transition-colors data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Tabs.Trigger>
              ))}

              {/* Separator — NHS tab is the built product, visually separated */}
              <div className="w-px bg-slate-200 my-2 mx-2 self-stretch" aria-hidden="true" />
              <Tabs.Trigger
                value="nhs"
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-500 border-b-2 border-transparent hover:text-slate-700 transition-colors data-[state=active]:text-emerald-600 data-[state=active]:border-emerald-600"
              >
                <Activity className="w-4 h-4" />
                NHS platform
                <span className="text-[9px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-1.5 py-0.5 ml-0.5">
                  Built
                </span>
              </Tabs.Trigger>
            </Tabs.List>

            {/* Use Case 2 */}
            <Tabs.Content value="users">
              {/* NHS status badge */}
              <div className="flex items-center justify-end gap-3 mb-6">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  NHS · Discovery Complete
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Use Case and Problem Statement */}
              <div className="mb-10 p-8 bg-slate-50 rounded-2xl border border-slate-200">
                <h2
                  className="text-3xl font-semibold text-slate-900 leading-tight mb-8"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Use Case &amp; the Problem Statement
                  <br />
                  <em className="font-normal text-slate-600">Feedback analysis for NHS</em>
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm max-w-4xl mb-8">
                  NHS trusts face growing financial and reputational exposure from patient feedback they cannot analyse at scale. The 10 Year Health Plan (July 2025) directly ties trust income to patient ratings through clinical team payments, patient power payments, and publicly published league tables updated quarterly from summer 2025. Yet most trusts still rely on manual coding, sampled data, and disconnected reporting systems that prevent timely action. There is no NHS-native platform that combines AI-powered theme classification, closed-loop feedback management, and integration with clinical systems — leaving organisations unable to detect emerging risks early or demonstrate improvement to regulators and boards.
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'User Personas', value: '3', sub: 'Chief Nurse · Quality Mgr · Ward Mgr' },
                    { label: 'Research Activities', value: `${marketResearch.length}`, sub: 'Items planned' },
                    { label: 'Tasks', value: '25', sub: 'In backlog' },
                    { label: 'Build Decision', value: 'GO', sub: 'Discovery complete · June 2026' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl border border-slate-200 px-4 py-4">
                      <p
                        className="text-[9px] uppercase tracking-[0.15em] text-slate-500 mb-1"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {stat.label}
                      </p>
                      <p
                        className="text-2xl font-semibold text-slate-900 mb-0.5"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1.5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Click any persona to explore in depth
                </p>
                <h2
                  className="text-2xl font-semibold text-slate-900"
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
                    videoUrl={segment.videoUrl ?? ''}
                    onUpdate={(field, value) => updateUserSegment(key, field, value)}
                  />
                ))}
              </div>

              {/* Artefacts — moved inline below personas */}
              <div className="mt-14 pt-10 border-t border-slate-200">
                {artefactDetailId === 'artefact-prototype' ? (
                  <PrototypeDetailView onBack={() => setArtefactDetailId(null)} />
                ) : (
                  <MarketResearchGrid
                    items={marketResearch}
                    onUpdate={updateMarketResearch}
                    onDelete={deleteMarketResearch}
                    onAdd={addMarketResearch}
                    onSave={() => {
                      flushProblemStatement();
                      flushUserSegments();
                      flushMarketResearch();
                    }}
                    onOpenDetail={setArtefactDetailId}
                  />
                )}
              </div>
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
                    className="text-2xl font-semibold text-slate-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Delivery Board
                  </h2>
                </div>
                <ProgressTracker />
                <KanbanBoard />
              </div>
            </Tabs.Content>

            {/* Draft Script */}
            <Tabs.Content value="script">
              <DraftScript />
            </Tabs.Content>

            {/* NHS Platform — content renders as a full-screen overlay below */}
            <Tabs.Content value="nhs" />
          </Tabs.Root>
        </div>

        {/* NHS Platform — full-screen overlay, mounts only when tab is active */}
        {activeTab === 'nhs' && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <Suspense
              fallback={
                <div
                  className="flex items-center justify-center h-full min-h-screen"
                  style={{ backgroundColor: '#003087', fontFamily: 'Arial, sans-serif' }}
                >
                  <span className="text-white text-sm font-medium">Loading NHS Platform…</span>
                </div>
              }
            >
              {nhsView === 'start' ? (
                <NhsStartPage
                  onStartNow={() => setNhsView('dashboard')}
                  onBack={() => { setNhsView('start'); setActiveTab('users'); }}
                  onBuildLog={() => {
                    setNhsView('start');
                    setActiveTab('users');
                    setArtefactDetailId('artefact-prototype');
                  }}
                />
              ) : (
                <NhsDashboardPage onBack={() => setNhsView('start')} />
              )}
            </Suspense>
          </div>
        )}
      </div>
    </DndProvider>
    </PasswordGate>
  );
}
