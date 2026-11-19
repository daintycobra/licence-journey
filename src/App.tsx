import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Menu,
  MessageSquare,
  X,
} from "lucide-react";
import {
  FREE_RESOURCE_LINKS,
  GENERATED_IMAGES,
  JOURNEY_STEPS,
  ROAD_SIGNS,
  TESTIMONIALS,
  type FreeResourceLink,
  type SignCategory,
} from "./data/licenseData";
import { TrafficSignIcon } from "./components/TrafficSignIcon";
import { RoundaboutSimulator } from "./components/RoundaboutSimulator";
import { MockExamPanel } from "./components/MockExamPanel";
import { AiInstructorChat } from "./components/AiInstructorChat";

const CHECKLIST_STORAGE_KEY = "ljpt_checklist_v1";

function SafeImage({
  src,
  alt,
  className,
  fallbackTitle,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-6 text-center ${className ?? ""}`}
      >
        <span className="text-sm font-medium">{fallbackTitle}</span>
        <span className="text-xs text-slate-400 mt-1">License Journey PT</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  });

  const [practiceTab, setPracticeTab] = useState<"signs" | "exam">("signs");
  const [signFilter, setSignFilter] = useState<SignCategory>("all");
  const [linkFilter, setLinkFilter] = useState<"all" | FreeResourceLink["category"]>("all");
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [pendingAiPrompt, setPendingAiPrompt] = useState<string | null>(null);

  // Study plan inquiry form state
  const [formName, setFormName] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formStage, setFormStage] = useState("Getting Started (Documents & Medical)");
  const [formNote, setFormNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checkedItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [checkedItems]);

  const totalChecklistCount = useMemo(
    () => JOURNEY_STEPS.reduce((sum, step) => sum + step.checklist.length, 0),
    []
  );

  const completedChecklistCount = useMemo(
    () => Object.values(checkedItems).filter(Boolean).length,
    [checkedItems]
  );

  const completionPercent =
    totalChecklistCount > 0
      ? Math.round((completedChecklistCount / totalChecklistCount) * 100)
      : 0;

  const filteredSigns = useMemo(() => {
    if (signFilter === "all") return ROAD_SIGNS;
    return ROAD_SIGNS.filter((s) => s.category === signFilter);
  }, [signFilter]);

  const filteredLinks = useMemo(() => {
    if (linkFilter === "all") return FREE_RESOURCE_LINKS;
    return FREE_RESOURCE_LINKS.filter((l) => l.category === linkFilter);
  }, [linkFilter]);

  const activeStep = JOURNEY_STEPS[activeStepIndex];

  const toggleChecklistItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyUrl = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLinkId(id);
      window.setTimeout(() => {
        setCopiedLinkId((curr) => (curr === id ? null : curr));
      }, 2000);
    } catch {
      // Ignore if clipboard unavailable
    }
  };

  const handleAskAi = (prompt: string) => {
    setPendingAiPrompt(prompt);
    const el = document.getElementById("ai-instructor");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToMockExam = () => {
    setPracticeTab("exam");
    setMobileMenuOpen(false);
    const el = document.getElementById("practice");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = formName.trim();
    const trimmedContact = formContact.trim();

    if (trimmedName.length < 2) {
      setFormError("Please enter your full name.");
      return;
    }

    const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact);
    const phoneLike = /^[+\d][\d\s-]{7,}$/.test(trimmedContact);
    if (!emailLike && !phoneLike) {
      setFormError("Please enter a valid email address or Portuguese phone number (+351...).");
      return;
    }

    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900">
      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
            style={{ fontFamily: "var(--font-display)" }}
          >
            License Journey PT
          </a>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <a
              href="#journey"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Roadmap
            </a>
            <a
              href="#practice"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Signs &amp; Exam
            </a>
            <a
              href="#simulator"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Simulator
            </a>
            <a
              href="#free-links"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Free Links
            </a>
            <a
              href="#ai-instructor"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              AI Coach
            </a>
          </nav>

          {/* Zone 3: 1 primary action (+ mobile menu trigger on small screens) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={scrollToMockExam}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Take Mock Exam
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2">
            {[
              { href: "#journey", label: "Roadmap" },
              { href: "#practice", label: "Signs & Exam" },
              { href: "#simulator", label: "Simulator" },
              { href: "#free-links", label: "Free Links" },
              { href: "#ai-instructor", label: "AI Coach" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={scrollToMockExam}
              className="w-full mt-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg"
            >
              Take Mock Exam
            </button>
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO SECTION — Balanced 2-Column Split + Full-Width 4-Column IMT Facts Strip */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:pt-14 lg:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Hero Copy */}
              <div className="lg:col-span-6 flex flex-col justify-between py-2 space-y-8">
                <div className="space-y-5">
                  <p className="text-xs sm:text-sm font-medium text-slate-500">
                    Portugal (IMT) Driving License Guide · 100% Free Preparation Platform
                  </p>

                  <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-slate-900 leading-[1.1] max-w-xl">
                    Your Portuguese driving license journey, made clear.
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                    From medical certificates and driving school enrollment to{" "}
                    <span className="font-medium text-slate-800">Código da Estrada</span> theory
                    exams, roundabout rules, and verified free official portals — everything you
                    need in one place.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-5 pt-2">
                  <button
                    type="button"
                    onClick={scrollToMockExam}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Start Free Mock Exam</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="#free-links"
                    className="text-sm sm:text-base font-medium text-slate-700 hover:text-blue-700 underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
                  >
                    Browse Free Official Links
                  </a>
                </div>
              </div>

              {/* Hero Focal 16:9 Editorial Photograph */}
              <div className="lg:col-span-6">
                <div className="relative h-72 sm:h-96 lg:h-full min-h-[340px] rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                  <SafeImage
                    src={GENERATED_IMAGES.heroLisbon}
                    alt="Sunlit coastal avenue in Lisbon Portugal with Ponte 25 de Abril in the background"
                    fallbackTitle="Lisbon Coastal Highway"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-5">
                    <p className="text-xs text-slate-200">
                      Lisbon, Portugal · Category B (Carta de Condução) Preparation Hub
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Quantitative IMT Facts Strip */}
            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-200">
              <div className="lg:pr-8">
                <p className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                  30 Questions
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Official IMT Theory Exam (Exame Teórico)
                </p>
              </div>
              <div className="lg:px-8">
                <p className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                  27+ Correct
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Passing standard (maximum 3 mistakes allowed)
                </p>
              </div>
              <div className="lg:px-8">
                <p className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                  35 Minutes
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Computer-based theory exam time limit
                </p>
              </div>
              <div className="lg:pl-8">
                <p className="font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                  28 + 32 hrs
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Mandatory theory and practical driving lessons
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 01: 5-STEP INTERACTIVE LICENSE JOURNEY TRACKER */}
        <section id="journey" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-medium text-slate-500">
                Step-by-Step Roadmap · Carta de Condução (Category B)
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                01. Five Stages to Your Portuguese License
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Select any stage to review required Portuguese documents and check off completed
                milestones. Your progress saves automatically in your browser.
              </p>
            </div>

            <div className="shrink-0 bg-white border border-slate-200 rounded-xl px-5 py-3.5 min-w-[230px]">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Checklist Progress</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {completedChecklistCount}/{totalChecklistCount} ({completionPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-700 transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step List Selector */}
            <div className="lg:col-span-4 space-y-2">
              {JOURNEY_STEPS.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                const doneInStep = step.checklist.filter((c) => checkedItems[c.id]).length;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs mb-1">
                      <span
                        className={`font-mono font-semibold tabular-nums ${
                          isActive ? "text-blue-300" : "text-blue-700"
                        }`}
                      >
                        Stage {step.number}
                      </span>
                      <span
                        className={`font-mono tabular-nums ${
                          isActive ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {doneInStep}/{step.checklist.length} done
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-semibold leading-snug">
                      {step.titleEn}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isActive ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {step.titlePt} · {step.duration}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Active Step Detail Panel */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 items-stretch border-b border-slate-200">
                <div className="md:col-span-7 p-6 sm:p-8 space-y-3">
                  <p className="text-xs text-slate-500">
                    Stage {activeStep.number} · {activeStep.titlePt} · Est. time:{" "}
                    {activeStep.duration}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {activeStep.titleEn}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {activeStep.summary}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 pt-1">
                    Key Requirement: {activeStep.keyRequirement}
                  </p>
                </div>

                <div className="md:col-span-5 min-h-[210px] bg-slate-100">
                  <SafeImage
                    src={
                      activeStepIndex <= 2
                        ? GENERATED_IMAGES.theoryStudy
                        : GENERATED_IMAGES.practicalDriving
                    }
                    alt={activeStep.titleEn}
                    fallbackTitle={activeStep.titleEn}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Stage Checklist
                  </h4>
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                    {activeStep.checklist.map((item) => {
                      const checked = Boolean(checkedItems[item.id]);
                      return (
                        <label
                          key={item.id}
                          className="flex items-start gap-3.5 p-4 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={checked}
                            onClick={() => toggleChecklistItem(item.id)}
                            className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                              checked
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "bg-white border-slate-300"
                            }`}
                          >
                            {checked && <Check className="w-3.5 h-3.5" />}
                          </button>
                          <div className="space-y-0.5 flex-1">
                            <span
                              className={`block text-sm font-medium ${
                                checked ? "line-through text-slate-400" : "text-slate-900"
                              }`}
                            >
                              {item.label}
                            </span>
                            <span className="block text-xs font-mono text-slate-500">
                              {item.ptTerm}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                    <strong className="text-slate-900">Practical Tip:</strong> {activeStep.tip}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleAskAi(
                        `Give me a detailed step-by-step walkthrough and common pitfalls for Stage ${activeStep.number}: '${activeStep.titleEn} (${activeStep.titlePt})' in Portugal.`
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-700 hover:text-blue-900 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Ask Coach about this stage</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: TRAFFIC SIGNS & MOCK EXAM SIMULATOR */}
        <section id="practice" className="bg-white border-y border-slate-200 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs font-medium text-slate-500">
                  Study &amp; Testing Center · Sinalização e Exame Teórico
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  02. Portuguese Traffic Signs &amp; Mock Exam
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  Study the highest-frequency Portuguese traffic signs with exact IMT codes or test
                  yourself on a timed Código da Estrada practice exam.
                </p>
              </div>

              {/* Primary Workspace Mode Switcher */}
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setPracticeTab("signs")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    practiceTab === "signs"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Traffic Signs ({ROAD_SIGNS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPracticeTab("exam")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    practiceTab === "exam"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Mock Exam (10 Questions)
                </button>
              </div>
            </div>

            {practiceTab === "signs" ? (
              <div className="space-y-6">
                {/* Category Filter Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: "all", label: "All Signs" },
                      { id: "cedencia", label: "Priority (Cedência)" },
                      { id: "proibicao", label: "Prohibition (Proibição)" },
                      { id: "perigo", label: "Warning (Perigo)" },
                      { id: "obrigacao", label: "Mandatory (Obrigação)" },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSignFilter(cat.id)}
                      className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        signFilter === cat.id
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Road Signs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSigns.map((sign) => (
                    <article
                      key={sign.id}
                      className="p-6 rounded-xl border border-slate-200 bg-[#FAFBFD] flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-xs text-slate-500 font-mono">
                              {sign.code} · {sign.categoryEn}
                            </p>
                            <h3 className="text-base font-bold text-slate-900 leading-snug">
                              {sign.nameEn}
                            </h3>
                            <p className="text-xs text-slate-500">{sign.namePt}</p>
                          </div>
                          <div className="shrink-0">
                            <TrafficSignIcon glyph={sign.glyph} className="w-16 h-16" />
                          </div>
                        </div>

                        <p className="text-sm text-slate-700 leading-relaxed">{sign.ruleEn}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-200 space-y-2.5">
                        <p className="text-xs text-slate-600">
                          <strong className="text-slate-800">Exam Note:</strong> {sign.examNote}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            handleAskAi(
                              `Explain Portuguese traffic sign '${sign.code} - ${sign.namePt} (${sign.nameEn})' and give me 2 realistic IMT theory exam scenarios involving it.`
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Ask AI Coach for exam examples</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <MockExamPanel onAskAi={handleAskAi} />
            )}
          </div>
        </section>

        {/* SECTION 03: INTERACTIVE VISUAL DRIVING SIMULATOR */}
        <section id="simulator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
            <div className="lg:col-span-7 space-y-2">
              <p className="text-xs font-medium text-slate-500">
                Visual Driving Lab · Rotunda, Prioridade e Velocidade
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                03. Interactive Road Scenario Simulator
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Practice the three rules that trip up learners most often in Portugal — multi-lane
                roundabout exits, unmarked right-hand priority intersections, and road-specific
                speed limits.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="h-44 sm:h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <SafeImage
                  src={GENERATED_IMAGES.roundabout}
                  alt="Aerial view of a multi-lane roundabout in Lisbon Portugal"
                  fallbackTitle="Lisbon Multi-Lane Roundabout"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <RoundaboutSimulator onAskAi={handleAskAi} />
        </section>

        {/* SECTION 04: 100% FREE OFFICIAL & STUDY LINKS HUB */}
        <section id="free-links" className="bg-white border-y border-slate-200 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs font-medium text-slate-500">
                  Verified Official Portals · 100% Free Access
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  04. Free Official &amp; Study Links
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  Access official Portuguese government services, license exchange instructions,
                  health center information, and free Código da Estrada test banks at zero cost.
                </p>
              </div>

              <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start md:self-auto">
                {(
                  [
                    { id: "all", label: "All Links" },
                    { id: "official", label: "Government" },
                    { id: "practice", label: "Free Practice" },
                    { id: "health", label: "Health" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setLinkFilter(tab.id)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      linkFilter === tab.id
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((item) => (
                <article
                  key={item.id}
                  className="p-6 rounded-xl border border-slate-200 bg-[#FAFBFD] flex flex-col justify-between gap-5"
                >
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">
                      {item.categoryLabel} · {item.costLabel}
                    </p>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {item.titleEn}
                      </h3>
                      <p className="text-xs font-mono text-blue-700 mt-1">{item.domainLabel}</p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.descriptionEn}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Open Website</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => void handleCopyUrl(item.id, item.url)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {copiedLinkId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 05: FREE MULTI-TURN AI LICENSE INSTRUCTOR */}
        <section id="ai-instructor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="space-y-2 max-w-2xl mb-8">
            <p className="text-xs font-medium text-slate-500">
              Personal Support · 24/7 Free Driving Rules Coach
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              05. Ask the AI Driving Instructor
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Have a question about foreign license exchange (Troca), IMT paperwork, tricky theory
              questions, or practical test tips? Ask right here in plain English.
            </p>
          </div>

          <AiInstructorChat
            externalPrompt={pendingAiPrompt}
            onExternalPromptConsumed={() => setPendingAiPrompt(null)}
          />
        </section>

        {/* SECTION 06: COMMUNITY PROOF & STUDY PLAN REQUEST */}
        <section id="contact" className="bg-white border-t border-slate-200 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            {/* Testimonials */}
            <div className="space-y-8">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs font-medium text-slate-500">
                  Learner Outcomes Across Portugal
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Clear preparation leads to first-try passes
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((item) => (
                  <blockquote
                    key={item.id}
                    className="p-6 rounded-xl border border-slate-200 bg-[#FAFBFD] flex flex-col justify-between gap-5"
                  >
                    <p className="text-sm text-slate-700 leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                    <footer className="pt-4 border-t border-slate-200 space-y-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.name} ·{" "}
                        <span className="font-normal text-slate-500">{item.location}</span>
                      </p>
                      <p className="text-xs font-medium text-emerald-700">{item.outcome}</p>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>

            {/* Study Plan & Inquiry Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch pt-8 border-t border-slate-200">
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium text-slate-500">Free Study Plan</p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Request guidance for your license stage
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Starting from scratch in Portugal or working through a foreign driving license
                    exchange (Troca)? Share your current stage to organize your study plan and
                    document checklist.
                  </p>
                </div>

                <div className="h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <SafeImage
                    src={GENERATED_IMAGES.practicalDriving}
                    alt="Practical driving lesson inside a modern car on a Portuguese boulevard"
                    fallbackTitle="Practical Driving Lesson"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-7 bg-[#FAFBFD] border border-slate-200 rounded-xl p-6 sm:p-8">
                {formSubmitted ? (
                  <div className="h-full flex flex-col items-start justify-center space-y-4 py-8">
                    <div className="inline-flex items-center gap-2 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Your request has been received</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900">Thank you, {formName}!</h4>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                      Use the stage checklist and free official portals above tailored for{" "}
                      <strong>{formStage}</strong>. For immediate answers, you can also chat
                      directly with the AI Driving Instructor anytime.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormName("");
                        setFormContact("");
                        setFormNote("");
                      }}
                      className="px-4 py-2 text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="ljpt-name"
                          className="block text-xs font-medium text-slate-700"
                        >
                          Full Name *
                        </label>
                        <input
                          id="ljpt-name"
                          type="text"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g., Bikash Tamang"
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="ljpt-contact"
                          className="block text-xs font-medium text-slate-700"
                        >
                          Email or Phone (+351) *
                        </label>
                        <input
                          id="ljpt-contact"
                          type="text"
                          value={formContact}
                          onChange={(e) => setFormContact(e.target.value)}
                          placeholder="name@email.com or +351 9XX XXX XXX"
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="ljpt-stage"
                        className="block text-xs font-medium text-slate-700"
                      >
                        Current Stage
                      </label>
                      <select
                        id="ljpt-stage"
                        value={formStage}
                        onChange={(e) => setFormStage(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
                      >
                        <option value="Getting Started (Documents & Medical)">
                          Getting Started (Documents &amp; Atestado Médico)
                        </option>
                        <option value="Theory Exam Preparation (Código da Estrada)">
                          Theory Exam Preparation (Código da Estrada)
                        </option>
                        <option value="Practical Driving Test (Exame Prático)">
                          Practical Driving Test (Exame Prático)
                        </option>
                        <option value="Foreign License Exchange (Troca de Carta)">
                          Foreign License Exchange (Troca de Carta)
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="ljpt-note"
                        className="block text-xs font-medium text-slate-700"
                      >
                        Your Question or City (Optional)
                      </label>
                      <textarea
                        id="ljpt-note"
                        rows={3}
                        value={formNote}
                        onChange={(e) => setFormNote(e.target.value)}
                        placeholder="Example: I live in Lisbon and want to take the IMT theory exam in English."
                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
                      />
                    </div>

                    {formError && (
                      <p role="alert" className="text-xs font-medium text-red-700">
                        {formError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Request Study Plan
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-md">
            <p
              className="text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              License Journey PT
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              An educational preparation guide for Portugal&apos;s Carta de Condução, Código da
              Estrada practice, and verified free official IMT links.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-400">
            <a href="#journey" className="hover:text-white transition-colors">
              Roadmap
            </a>
            <a href="#practice" className="hover:text-white transition-colors">
              Signs &amp; Exam
            </a>
            <a href="#simulator" className="hover:text-white transition-colors">
              Simulator
            </a>
            <a href="#free-links" className="hover:text-white transition-colors">
              Free Links
            </a>
            <a href="#ai-instructor" className="hover:text-white transition-colors">
              AI Coach
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 License Journey PT · Educational Guide</p>
            <p>Always verify the latest legal rules and fees at imt-ip.pt.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
