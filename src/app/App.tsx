import { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Users, TrendingUp, ListChecks, Edit2, Check, Layers } from 'lucide-react';
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
import { PasswordGate } from './components/PasswordGate';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { SEED_VERSION, SEED_PROBLEM_STATEMENT, SEED_USER_SEGMENTS, SEED_MARKET_RESEARCH } from './data/seedData';

export default function App() {
  const [problemStatement, setProblemStatement, flushProblemStatement] = useFirebaseSync(
    "problemStatement",
    SEED_PROBLEM_STATEMENT
  );
  const [editingStatement, setEditingStatement] = useState(false);
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

  // Migration strategy:
  // - Scalar paths (problemStatement, userSegments): seed only if empty — user edits are authoritative.
  // - marketResearch: merge by artefact ID — existing items and user edits are preserved,
  //   but new seed artefacts (identified by id) are appended if not already present.
  // Bump SEED_VERSION when adding new artefact IDs or new scalar paths.
  useEffect(() => {
    const versionRef = ref(db, 'dataVersion');
    get(versionRef).then(async snapshot => {
      const version = snapshot.exists() ? (snapshot.val() as number) : 0;
      if (version < SEED_VERSION) {
        const seedIfEmpty = async (path: string, data: unknown) => {
          const snap = await get(ref(db, path));
          if (!snap.exists()) await set(ref(db, path), JSON.stringify(data));
        };

        // Merge new seed artefacts into existing marketResearch without overwriting user edits
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
                className="text-sm font-semibold text-slate-900 tracking-tight"
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
                S&amp;PE Product Demo
              </p>
              <h1
                className="text-5xl font-semibold text-slate-900 leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                AI in Product Management
                <br />
                <em className="font-normal text-slate-600">usecase: Feedback analysis for NHS</em>
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
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    <p className="text-slate-600 leading-relaxed text-sm max-w-2xl">{problemStatement}</p>
                    <button className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700 transition-colors opacity-0 group-hover:opacity-100">
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
                  className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-4"
                >
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
        </div>

        {/* Tabs */}
        <div className="max-w-[1400px] mx-auto px-8 pb-16">
          <Tabs.Root defaultValue="users">
            <Tabs.List className="flex gap-0 border-b border-slate-200 mb-10">
              {[
                { value: 'users', label: 'User Analysis', Icon: Users },
                { value: 'research', label: 'Artefacts', Icon: TrendingUp },
                { value: 'pdlc', label: 'AI in PDLC', Icon: Layers },
                { value: 'tasks', label: 'Tasks', Icon: ListChecks },
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
            </Tabs.Content>

            {/* Market Research */}
            <Tabs.Content value="research">
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
          </Tabs.Root>
        </div>
      </div>
    </DndProvider>
    </PasswordGate>
  );
}
