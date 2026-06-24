import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Users, TrendingUp, ListChecks, Lightbulb, Search, Rocket, X, Plus, BookOpen } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EditableText } from './components/EditableText';
import { KanbanBoard } from './components/KanbanBoard';
import { PersonaCard } from './components/PersonaCard';
import { ProgressTracker } from './components/ProgressTracker';
import { useFirebaseSync } from './hooks/useFirebaseSync';

const BLOCK_COLORS = [
  { color: 'border-blue-400 bg-blue-50', headerColor: 'bg-blue-400' },
  { color: 'border-green-400 bg-green-50', headerColor: 'bg-green-400' },
  { color: 'border-purple-400 bg-purple-50', headerColor: 'bg-purple-400' },
  { color: 'border-orange-400 bg-orange-50', headerColor: 'bg-orange-400' },
  { color: 'border-red-400 bg-red-50', headerColor: 'bg-red-400' },
  { color: 'border-yellow-400 bg-yellow-50', headerColor: 'bg-yellow-400' },
  { color: 'border-teal-400 bg-teal-50', headerColor: 'bg-teal-400' },
  { color: 'border-pink-400 bg-pink-50', headerColor: 'bg-pink-400' },
];

export default function App() {
  const [problemStatement, setProblemStatement, flushProblemStatement] = useFirebaseSync(
    "problemStatement",
    "Many public sector organisations face challenges in gaining clear visibility into product performance and strategic alignment across their portfolios. Teams often work across disconnected systems with varying reporting approaches, which can make it harder to track performance consistently, identify delivery risks early, and support evidence-based decision-making. There's an opportunity to provide a unified platform that connects operational delivery data with strategic objectives, helping organisations monitor product health and make more informed decisions."
  );

  const [userSegments, setUserSegments, flushUserSegments] = useFirebaseSync("userSegments", {
    productManagers: {
      title: "Product Managers",
      imageUrl: "https://images.unsplash.com/photo-1713947503588-8ff8196dc4a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBwcm9kdWN0JTIwbWFuYWdlciUyMHdvcmtpbmclMjBvZmZpY2V8ZW58MXx8fHwxNzc5NDgxMDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      goals: "Track product KPIs and user outcomes\nDemonstrate progress against OKRs\nCommunicate delivery impact to leadership\nIdentify risks and performance issues early",
      painPoints: "Time-consuming manual reporting\nMultiple disconnected tools\nLack of clear performance benchmarks",
      motivators: "Streamlined reporting workflows\nReal-time performance insights\nIntegrated tooling\nClear success metrics",
      opportunities: "One-click report generation\nIntegrated analytics and tooling\nBenchmarking against peer products"
    },
    productLeaders: {
      title: "Head of Products",
      imageUrl: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxleGVjdXRpdmUlMjBsZWFkZXIlMjBidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzc5NDgxMDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      goals: "Monitor portfolio-wide product performance\nAlign products to strategic objectives and public outcomes\nPrioritise investment and resources effectively\nImprove product governance and accountability",
      painPoints: "Inconsistent reporting across teams\nLimited visibility into delivery health\nDifficulty linking product metrics to organisational outcomes",
      motivators: "Clear portfolio visibility\nStrategic alignment tools\nData-driven decision support\nGovernance frameworks",
      opportunities: "Unified dashboard for portfolio oversight\nAutomated OKR tracking and reporting\nPredictive analytics for resource allocation"
    }
  });

  const [saved, setSaved] = useState(false);
  const [marketResearch, setMarketResearch, flushMarketResearch] = useFirebaseSync("marketResearch", [
    {
      id: '1',
      title: 'Competitive Analysis',
      description: 'Analyze existing product intelligence platforms in private sector and international public sector organizations'
    },
    {
      id: '2',
      title: 'Current State Assessment',
      description: 'Map existing tools and systems used across UK public sector for product reporting and performance tracking'
    },
    {
      id: '3',
      title: 'User Research',
      description: 'Conduct interviews and surveys with 15-20 product leaders, PMs, and senior stakeholders across 5-7 departments'
    },
    {
      id: '4',
      title: 'Technology Stack Research',
      description: 'Evaluate integration capabilities with common B&T tools (Jira, Azure DevOps, ServiceNow, etc.)'
    },
    {
      id: '5',
      title: 'Pricing & Business Model',
      description: 'Research pricing models for SaaS platforms in public sector and procurement frameworks (G-Cloud, etc.)'
    },
    {
      id: '6',
      title: 'Compliance & Security',
      description: 'Understand data protection, security requirements, and compliance standards for public sector platforms'
    },
    {
      id: '7',
      title: 'Success Metrics Definition',
      description: 'Define how success will be measured and benchmarked in public sector context'
    }
  ]);

  const [strategyItems, setStrategyItems, flushStrategyItems] = useFirebaseSync("strategyItems", [
    {
      id: 'market-research',
      title: 'Market and Competitor Research',
      color: 'border-blue-400 bg-blue-50',
      headerColor: 'bg-blue-400',
      content: `Key Competitors\n• ProductBoard, Aha!, Jira Align — strong in private sector but not public-sector compliant\n• No unified platform exists specifically for UK government product intelligence\n• International benchmarks: US Digital.gov dashboards, Australian DTA performance framework\n\nMarket Landscape\n• ~5,000 product managers across UK central government (GDS estimate)\n• Most departments rely on manual reporting via spreadsheets or siloed tools (Jira, Azure DevOps, ServiceNow)\n• Growing demand post-GDS Service Standard for measurable product outcomes\n\nMarket Opportunity\n• £multi-million TAM across central and local government\n• Procurement via G-Cloud 14 and Digital Marketplace frameworks\n• First-mover advantage in a compliance-first, public-sector-native platform\n\nGaps We Address\n• Cross-tool data aggregation for portfolio visibility\n• Automated OKR alignment reporting\n• Risk-flagging and delivery health scoring`
    },
    {
      id: 'vmost',
      title: 'VMOST – Vision, Mission, Objectives, Strategy & Tactics',
      color: 'border-green-400 bg-green-50',
      headerColor: 'bg-green-400',
      content: `Vision\nA world where every UK public sector product decision is backed by clear, real-time intelligence — delivering better outcomes for citizens.\n\nMission\nProvide public sector organisations with a unified platform to monitor product performance, align delivery to strategic objectives, and enable evidence-based decision-making.\n\nObjectives\n• Reduce average reporting time by 50% within 6 months of adoption\n• Achieve 80% portfolio-level visibility for Heads of Product\n• Enable 30% faster identification of delivery risks across pilot departments\n\nStrategy\n• Start with 2–3 large government departments as funded Alpha partners\n• Integrate with the tools teams already use (Jira, Azure DevOps, ServiceNow)\n• List on G-Cloud to enable rapid, compliant procurement across the public sector\n\nTactics\n• Run a 12-week Alpha with HMRC and DWP product teams\n• Conduct fortnightly user research and iterate bi-weekly\n• Build native integrations for top 3 delivery tools in Q1\n• Publish open API and GDS-aligned documentation from day one`
    },
    {
      id: 'business-strategy',
      title: 'Analysis of Business Strategy',
      color: 'border-purple-400 bg-purple-50',
      headerColor: 'bg-purple-400',
      content: `Market Entry Approach\n• Partner with GDS and Cabinet Office to gain endorsement and accelerate trust\n• Pilot with high-visibility departments (HMRC, DWP, DVLA) to generate case studies\n• Leverage existing Accenture relationships across government to reduce sales cycle\n\nRevenue Model\n• SaaS subscription: department-level annual licensing via G-Cloud 14\n• Tiered pricing: Starter (up to 20 PMs), Growth (20–100), Enterprise (100+)\n• Professional services revenue from onboarding, training, and custom integrations\n\nValue Chain\nData Ingestion → Aggregation & Normalisation → Analytics Engine → Insights & Alerts → Reporting & Dashboards → Decision Support\n\nCompetitive Advantage\n• Compliance by design: GDPR, Cyber Essentials, ISO 27001 alignment from day one\n• Public-sector-native UX — built around GDS Design System principles\n• Integrated OKR framework aligned to government outcome frameworks\n\nKey Risks & Mitigations\n• Budget cycle dependency → multi-year agreements and phased rollouts\n• Procurement complexity → G-Cloud listing simplifies buying\n• Cultural resistance → change management support included in onboarding`
    },
    {
      id: 'okrs',
      title: 'OKRs',
      color: 'border-orange-400 bg-orange-50',
      headerColor: 'bg-orange-400',
      content: `Objective 1: Establish Product Intelligence Platform as the primary reporting tool for UK public sector PMs\n• KR1: Onboard 3 government departments in Alpha by end of Q2 2025\n• KR2: Achieve NPS of 40+ from product manager users within 6 months\n• KR3: Reduce average sprint reporting time from 4 hours to under 1 hour\n\nObjective 2: Demonstrate measurable strategic alignment across product portfolios\n• KR1: 80% of product metrics mapped to departmental OKRs for all pilot products\n• KR2: Generate fully automated alignment reports for 100% of pilot products weekly\n• KR3: Enable 3 evidence-based portfolio investment decisions per quarter in pilot depts\n\nObjective 3: Build a scalable, secure, and compliant platform\n• KR1: Achieve Cyber Essentials Plus certification by Q3 2025\n• KR2: Maintain 99.9% uptime SLA across all production environments\n• KR3: Pass GDS Technology Code of Practice review with no major findings\n\nObjective 4: Generate commercial traction\n• KR1: Convert 2 Alpha departments to paid contracts by Q4 2025\n• KR2: List on G-Cloud 14 by Q3 2025\n• KR3: Pipeline of £1.5M ARR identified by end of FY25`
    },
    {
      id: 'roadmap',
      title: 'Roadmap',
      color: 'border-red-400 bg-red-50',
      headerColor: 'bg-red-400',
      content: `Now — Alpha (Q2 2025)\n• Core product performance dashboard (KPIs, velocity, quality metrics)\n• Jira integration for automated data ingestion\n• Basic OKR tracking and alignment view\n• 2–3 pilot departments onboarded with dedicated support\n• GDS-aligned design system implemented\n\nNext — Beta (Q3 2025)\n• Azure DevOps and ServiceNow integrations\n• Portfolio-wide view for Heads of Product\n• Automated weekly and monthly reporting\n• Risk flagging and delivery health scoring\n• Self-serve onboarding for new teams\n\nLater — General Availability (Q4 2025)\n• AI-powered insights and anomaly detection\n• Predictive analytics for delivery risk\n• G-Cloud 14 listing live\n• Cross-department benchmarking (anonymised)\n• Public sector OKR template library\n\nFuture — Scale (2026)\n• Local government expansion\n• Open API for third-party integrations\n• Executive-level strategic reporting suite\n• Citizen outcome impact tracking\n• International public sector pilots`
    },
    {
      id: 'customer-base',
      title: 'Primary and Secondary Target Customer Base',
      color: 'border-yellow-400 bg-yellow-50',
      headerColor: 'bg-yellow-400',
      content: `Primary Customers — Direct Users\n• Product Managers in UK central government departments\n  – Day-to-day users of dashboards, reporting tools, OKR tracking\n  – Departments: HMRC, DWP, DVLA, MHCLG, NHSD, Home Office, MOD\n  – ~5,000 PMs across government; target 500 in Year 1\n\n• Heads of Product / Deputy Directors (Digital)\n  – Portfolio-level consumers; primary economic buyers\n  – Need visibility across 10–50 products simultaneously\n  – Drive procurement decisions and budget approval\n\nSecondary Customers — Indirect Beneficiaries\n• Chief Digital Officers (CDOs) and CIOs\n  – Senior sponsors who mandate consistent reporting standards\n  – Strategic alignment to departmental transformation goals\n\n• Senior Responsible Owners (SROs) and Programme Directors\n  – Consume executive-level product health summaries\n  – Need evidence for HMT business cases and spend reviews\n\n• Local Government Authorities\n  – Growing digital maturity, increasing demand for product practice\n  – Potential second wave of adoption post-central government success\n\nBuyer vs User Distinction\n• Economic Buyer: Head of Product / DDaT Deputy Director\n• Champion: Senior Product Manager\n• End User: Product Manager / Delivery Manager\n• Influencer: GDS, CDDO, Cabinet Office`
    }
  ]);

  const [discoveryItems, setDiscoveryItems, flushDiscoveryItems] = useFirebaseSync("discoveryItems", [
    {
      id: 'disc-1',
      title: 'User Research',
      color: 'border-blue-400 bg-blue-50',
      headerColor: 'bg-blue-400',
      content: `Research Plan\n• Methods: User interviews, contextual inquiry, usability testing\n• Target: 15–20 participants across primary and secondary segments\n• Recruitment: Via department contacts and GDS user panel\n\nKey Research Questions\n• What are the biggest challenges with current reporting tools?\n• How do teams currently track OKRs and product metrics?\n• What decisions are blocked without better product intelligence?\n\nOutputs\n• Synthesised insights report\n• Affinity map and theme clusters\n• Top 5 validated pain points ranked by frequency`
    },
    {
      id: 'disc-2',
      title: 'Problem Definition',
      color: 'border-green-400 bg-green-50',
      headerColor: 'bg-green-400',
      content: `Jobs To Be Done\n• When I need to report on product performance, I want a single source of truth so I can stop compiling data manually\n• When I need to demonstrate strategic alignment, I want automated OKR tracking so I can focus on decisions, not admin\n\nValidated Pain Points (Priority Order)\n1. Manual, time-consuming reporting across disconnected tools\n2. No portfolio-wide visibility for Heads of Product\n3. Difficulty linking delivery metrics to strategic outcomes\n4. No standardised way to flag or track delivery risk\n\nHow Might We Statements\n• HMW reduce the reporting burden for product managers?\n• HMW give Heads of Product real-time portfolio visibility?\n• HMW automate alignment between delivery and strategy?`
    },
    {
      id: 'disc-3',
      title: 'Hypothesis Testing',
      color: 'border-purple-400 bg-purple-50',
      headerColor: 'bg-purple-400',
      content: `Core Hypotheses\n• H1: If we automate data ingestion from Jira/Azure DevOps, PMs will save 3+ hours/week on reporting\n• H2: If we provide a portfolio dashboard, Heads of Product will make faster, more confident investment decisions\n• H3: If we align metrics to OKRs automatically, teams will improve strategic coherence within 3 months\n\nTest Approach\n• H1: Time-on-task study with 5 PMs during Alpha\n• H2: Decision-quality survey with HoPs before and after 4-week pilot\n• H3: OKR alignment score comparison pre and post adoption\n\nSuccess Criteria\n• H1 validated if average time reduction ≥ 50%\n• H2 validated if 4 out of 5 HoPs rate decisions as "more confident"\n• H3 validated if alignment score improves by ≥ 30%`
    },
    {
      id: 'disc-4',
      title: 'Prototype & Validation',
      color: 'border-orange-400 bg-orange-50',
      headerColor: 'bg-orange-400',
      content: `Prototype Phases\n• Phase 1 – Paper prototype: Core dashboard layout, navigation, and key views\n• Phase 2 – Lo-fi Figma: Data visualisations and OKR tracking module\n• Phase 3 – Hi-fi interactive: Full user flows with real data integration\n\nValidation Methods\n• Guerrilla testing with 3–5 internal PMs (Phase 1)\n• Moderated usability sessions with 8 target users (Phase 2)\n• Unmoderated testing via lookback.io (Phase 3)\n\nKey Metrics\n• Task completion rate ≥ 80%\n• System Usability Scale (SUS) score ≥ 70\n• Time-on-task within 20% of established benchmark`
    }
  ]);

  const [deliveryItems, setDeliveryItems, flushDeliveryItems] = useFirebaseSync("deliveryItems", [
    {
      id: 'del-1',
      title: 'Sprint Planning',
      color: 'border-blue-400 bg-blue-50',
      headerColor: 'bg-blue-400',
      content: `Sprint Structure\n• Cadence: 2-week sprints\n• Ceremonies: Planning (Monday), Daily stand-up, Review + Retro (final Friday)\n• Team capacity: 80% allocation — 20% buffer for bugs and support\n\nSprint Goal Framework\n• One clear, testable outcome per sprint\n• Goal aligned to current Alpha/Beta milestone\n• Shared with stakeholders at sprint start\n\nBacklog Health\n• Top 3 sprints of backlog always refined and estimated\n• Definition of ready: acceptance criteria written, design approved, no blockers\n• Story points via planning poker; baseline velocity tracked from sprint 3`
    },
    {
      id: 'del-2',
      title: 'Build & Iterate',
      color: 'border-green-400 bg-green-50',
      headerColor: 'bg-green-400',
      content: `Development Standards\n• Branching: Feature branches from main; PR review required before merge\n• Code review: Minimum 1 approver; automated lint and test checks must pass\n• Feature flags: All new features behind flags for controlled rollout\n\nIteration Cadence\n• Weekly internal demos to product and design\n• Bi-weekly stakeholder showcases with Alpha departments\n• Continuous deployment to staging; production releases every 2 weeks\n\nTechnical Debt Management\n• 20% sprint capacity reserved for tech debt and refactoring\n• Debt logged in backlog with severity tagging (critical / high / low)\n• Quarterly tech debt review with engineering lead`
    },
    {
      id: 'del-3',
      title: 'Testing & Quality Assurance',
      color: 'border-purple-400 bg-purple-50',
      headerColor: 'bg-purple-400',
      content: `Test Coverage Requirements\n• Unit tests: ≥ 80% coverage on business logic\n• Integration tests: All API endpoints covered\n• E2E tests: Critical user journeys automated (Playwright)\n\nQA Process\n• Developer testing: Local unit and integration tests before raising PR\n• QA review: Exploratory testing on staging environment each sprint\n• UAT: User acceptance testing with pilot department PMs before each release\n\nPerformance Benchmarks\n• Page load: ≤ 2s on 4G connection\n• API response: ≤ 500ms for dashboard data endpoints\n• Uptime SLA: 99.9% in production environments`
    },
    {
      id: 'del-4',
      title: 'Launch & Release',
      color: 'border-orange-400 bg-orange-50',
      headerColor: 'bg-orange-400',
      content: `Release Process\n• Release notes prepared for every production release\n• Staged rollout: 10% → 50% → 100% over 3 days\n• Rollback plan documented and tested prior to each release\n\nGo-Live Checklist\n☐ All UAT sign-offs received from pilot departments\n☐ Performance and load tests passed\n☐ Security scan completed (Cyber Essentials checks)\n☐ Monitoring, alerting, and dashboards configured\n☐ Support runbook updated\n☐ Stakeholder communications sent\n\nPost-Launch\n• 72-hour hypercare period with on-call support\n• Week 1 metrics review against launch KPIs\n• In-app feedback survey sent to users in week 2`
    }
  ]);

  const updateStrategyItem = (id: string, field: string, value: string) => {
    setStrategyItems(prev =>
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  const updateUserSegment = (segment: string, field: string, value: string) => {
    setUserSegments(prev => ({
      ...prev,
      [segment]: {
        ...prev[segment as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const updateMarketResearch = (id: string, field: string, value: string) => {
    setMarketResearch(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addMarketResearch = () => {
    setMarketResearch(prev => [
      ...prev,
      {
        id: `mr-${Date.now()}`,
        title: '',
        description: ''
      }
    ]);
  };

  const deleteMarketResearch = (id: string) => {
    setMarketResearch(prev => prev.filter(item => item.id !== id));
  };

  const updateDiscoveryItem = (id: string, field: string, value: string) => {
    setDiscoveryItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addDiscoveryItem = () => {
    const idx = discoveryItems.length % BLOCK_COLORS.length;
    setDiscoveryItems(prev => [
      ...prev,
      { id: `disc-${Date.now()}`, title: '', ...BLOCK_COLORS[idx], content: '' }
    ]);
  };

  const deleteDiscoveryItem = (id: string) => {
    setDiscoveryItems(prev => prev.filter(item => item.id !== id));
  };

  const updateDeliveryItem = (id: string, field: string, value: string) => {
    setDeliveryItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addDeliveryItem = () => {
    const idx = deliveryItems.length % BLOCK_COLORS.length;
    setDeliveryItems(prev => [
      ...prev,
      { id: `del-${Date.now()}`, title: '', ...BLOCK_COLORS[idx], content: '' }
    ]);
  };

  const deleteDeliveryItem = (id: string) => {
    setDeliveryItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveAll = () => {
    flushProblemStatement();
    flushUserSegments();
    flushMarketResearch();
    flushStrategyItems();
    flushDiscoveryItems();
    flushDeliveryItems();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1600px] mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Product Intelligence Platform
          </h1>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest">
                Problem Statement
              </h2>
            </div>
            <div className="px-4 py-4">
              <EditableText
                value={problemStatement}
                onChange={setProblemStatement}
                multiline
                className="text-gray-700 leading-relaxed text-base"
              />
            </div>
          </div>
        </div>

        <Tabs.Root defaultValue="users" className="w-full">
          <div className="flex items-end justify-between border-b border-gray-200 mb-6">
            <Tabs.List className="flex gap-2">
              <Tabs.Trigger
                value="users"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors"
              >
                <Users className="w-4 h-4" />
                User Analysis
              </Tabs.Trigger>
              <Tabs.Trigger
                value="research"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Market Research
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tasks"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors"
              >
                <ListChecks className="w-4 h-4" />
                Tasks
              </Tabs.Trigger>
              <Tabs.Trigger
                value="strategy"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                Strategy
              </Tabs.Trigger>
              <Tabs.Trigger
                value="discovery"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors"
              >
                <Search className="w-4 h-4" />
                Product Discovery
              </Tabs.Trigger>
              <Tabs.Trigger
                value="delivery"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors"
              >
                <Rocket className="w-4 h-4" />
                Product Delivery
              </Tabs.Trigger>
            </Tabs.List>
            <div className="flex items-center gap-3 pb-2">
              {saved && (
                <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All changes saved
                </span>
              )}
              <button
                onClick={handleSaveAll}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Save All Changes
              </button>
            </div>
          </div>

          <Tabs.Content value="users">
            <div className="grid grid-cols-2 gap-6">
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

          <Tabs.Content value="research">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Market Research Activities</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{marketResearch.length} research areas identified</p>
                </div>
                <button
                  onClick={addMarketResearch}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm font-medium shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Research Item
                </button>
              </div>
              <div className="space-y-3">
                {marketResearch.map((item, index) => (
                  <div
                    key={item.id}
                    className="group border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all bg-white"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <EditableText
                          value={item.title}
                          onChange={(value) => updateMarketResearch(item.id, 'title', value)}
                          className="font-semibold text-gray-900 text-base"
                          placeholder="Research title..."
                        />
                        <div className="mt-1">
                          <EditableText
                            value={item.description}
                            onChange={(value) => updateMarketResearch(item.id, 'description', value)}
                            multiline
                            className="text-gray-600 text-sm"
                            placeholder="Describe this research activity..."
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => deleteMarketResearch(item.id)}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="tasks">
            <div className="space-y-6">
              <ProgressTracker />
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Project Tasks
                </h2>
                <KanbanBoard />
              </div>
            </div>
          </Tabs.Content>

          <Tabs.Content value="strategy">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {strategyItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border-2 overflow-hidden shadow-sm ${item.color}`}
                >
                  <div className={`px-5 py-3.5 ${item.headerColor}`}>
                    <h3 className="text-white font-bold text-sm tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <EditableText
                      value={item.content}
                      onChange={(value) => updateStrategyItem(item.id, 'content', value)}
                      multiline
                      richMode
                      placeholder="Add content..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="discovery">
            <div className="flex justify-end mb-4">
              <button
                onClick={addDiscoveryItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Block
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {discoveryItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border-2 overflow-hidden shadow-sm ${item.color}`}
                >
                  <div className={`px-5 py-3 ${item.headerColor} flex items-center gap-2`}>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateDiscoveryItem(item.id, 'title', e.target.value)}
                      className="bg-transparent text-white font-semibold text-sm tracking-wide outline-none placeholder-white/60 flex-1 border-b border-transparent focus:border-white/50 transition-colors"
                      placeholder="Block title..."
                    />
                    <button
                      onClick={() => deleteDiscoveryItem(item.id)}
                      className="text-white/60 hover:text-white transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <EditableText
                      value={item.content}
                      onChange={(value) => updateDiscoveryItem(item.id, 'content', value)}
                      multiline
                      richMode
                      placeholder="Add content..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Content>

          <Tabs.Content value="delivery">
            <div className="flex justify-end mb-4">
              <button
                onClick={addDeliveryItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Block
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {deliveryItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border-2 overflow-hidden shadow-sm ${item.color}`}
                >
                  <div className={`px-5 py-3.5 ${item.headerColor} flex items-center gap-2`}>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateDeliveryItem(item.id, 'title', e.target.value)}
                      className="bg-transparent text-white font-bold text-sm tracking-wide outline-none placeholder-white/60 flex-1 border-b border-transparent focus:border-white/50 transition-colors"
                      placeholder="Block title..."
                    />
                    <button
                      onClick={() => deleteDeliveryItem(item.id)}
                      className="text-white/60 hover:text-white transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <EditableText
                      value={item.content}
                      onChange={(value) => updateDeliveryItem(item.id, 'content', value)}
                      multiline
                      richMode
                      placeholder="Add content..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
    </DndProvider>
  );
}