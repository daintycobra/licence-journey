import { useState } from "react";
import { CheckCircle2, AlertTriangle, RotateCcw, ArrowRight } from "lucide-react";

type SimulatorMode = "rotunda" | "priority" | "speed";
type RotundaExit = "first" | "second" | "third" | "uturn";
type RoadType = "localidade" | "fora" | "reservada" | "autoestrada";

const ROTUNDA_CONFIG: Record<
  RotundaExit,
  {
    label: string;
    laneEn: string;
    signalEn: string;
    stepsEn: string[];
    pathD: string;
    entryColor: string;
  }
> = {
  first: {
    label: "1st Exit (Right)",
    laneEn: "Right (Outer) Lane",
    signalEn: "Activate your right turn signal (Pisca direito) before entering the roundabout.",
    stepsEn: [
      "Approach in the right lane and yield to vehicles already circulating inside.",
      "Keep your right indicator on, stay in the outer lane, and leave immediately at the first exit.",
    ],
    pathD: "M 216 330 L 216 270 Q 216 218 270 218 L 332 218",
    entryColor: "#059669",
  },
  second: {
    label: "2nd Exit (Straight)",
    laneEn: "Inner (Left) Lane → Outer Lane",
    signalEn: "Signal right immediately after passing the 1st exit to shift into the outer lane.",
    stepsEn: [
      "Leave the outer lane clear for 1st-exit drivers and enter using the inner lane.",
      "Right after passing the 1st exit, check mirrors and blind spot, signal right, merge into the outer lane, and exit straight ahead.",
    ],
    pathD:
      "M 204 330 L 204 265 A 66 66 0 0 0 266 200 A 66 66 0 0 0 220 138 Q 216 120 216 68",
    entryColor: "#1D4ED8",
  },
  third: {
    label: "3rd Exit (Left)",
    laneEn: "Inner Lane → Outer Lane after 2nd Exit",
    signalEn: "Signal right after passing the 2nd exit to move smoothly to the outer lane.",
    stepsEn: [
      "Circulate in the inner lane past both the 1st and 2nd exits.",
      "Once past the 2nd exit, signal right, verify mirrors, merge into the outer lane, and take the 3rd exit.",
    ],
    pathD:
      "M 204 330 L 204 265 A 66 66 0 0 0 266 200 A 66 66 0 0 0 200 134 A 66 66 0 0 0 138 182 Q 116 184 68 184",
    entryColor: "#1D4ED8",
  },
  uturn: {
    label: "Full Turn (U-Turn)",
    laneEn: "Innermost Lane (Shift right after 3rd exit)",
    signalEn: "Signal right after passing the 3rd exit to exit back onto your return carriageway.",
    stepsEn: [
      "Stay in the innermost lane while passing the 1st, 2nd, and 3rd exits.",
      "After clearing the 3rd exit, signal right, shift to the outer lane, and return in the opposite direction.",
    ],
    pathD:
      "M 204 330 L 204 265 A 66 66 0 0 0 266 200 A 66 66 0 0 0 200 134 A 66 66 0 0 0 134 200 A 66 66 0 0 0 184 264 L 184 330",
    entryColor: "#D97706",
  },
};

const SPEED_TABLE: Record<
  RoadType,
  {
    nameEn: string;
    namePt: string;
    standardMax: number;
    provisionalMax: number;
    minSpeed: number | null;
    noteEn: string;
  }
> = {
  localidade: {
    nameEn: "Built-Up Urban Area",
    namePt: "Dentro das localidades",
    standardMax: 50,
    provisionalMax: 50,
    minSpeed: null,
    noteEn:
      "Shared residential or school zones (Zona de Coexistência) can drop to 20–30 km/h where posted.",
  },
  fora: {
    nameEn: "National & Rural Roads",
    namePt: "Restantes vias públicas (Estrada Nacional)",
    standardMax: 90,
    provisionalMax: 90,
    minSpeed: null,
    noteEn:
      "Outside urban boundaries on standard public roads, the default maximum limit is 90 km/h unless posted otherwise.",
  },
  reservada: {
    nameEn: "Reserved Motor Vehicle Road",
    namePt: "Via reservada a automóveis e motociclos",
    standardMax: 100,
    provisionalMax: 90,
    minSpeed: null,
    noteEn:
      "Marked by the blue car sign: standard limit is 100 km/h, capped at 90 km/h during your first year of licensing.",
  },
  autoestrada: {
    nameEn: "Motorway (Highway)",
    namePt: "Autoestrada (AE)",
    standardMax: 120,
    provisionalMax: 90,
    minSpeed: 50,
    noteEn:
      "Never drive below 50 km/h under normal traffic conditions on a motorway, and reserve left lanes strictly for overtaking.",
  },
};

interface RoundaboutSimulatorProps {
  onAskAi: (question: string) => void;
}

export function RoundaboutSimulator({ onAskAi }: RoundaboutSimulatorProps) {
  const [mode, setMode] = useState<SimulatorMode>("rotunda");
  const [exit, setExit] = useState<RotundaExit>("second");
  const [selectedCar, setSelectedCar] = useState<"A" | "B" | null>(null);
  const [roadType, setRoadType] = useState<RoadType>("autoestrada");
  const [isNewDriver, setIsNewDriver] = useState<boolean>(false);

  const activeRotunda = ROTUNDA_CONFIG[exit];
  const activeSpeed = SPEED_TABLE[roadType];
  const displayedMax = isNewDriver ? activeSpeed.provisionalMax : activeSpeed.standardMax;

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setMode("rotunda")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === "rotunda"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Roundabout Lanes
          </button>
          <button
            type="button"
            onClick={() => setMode("priority")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === "priority"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Right-Hand Priority
          </button>
          <button
            type="button"
            onClick={() => setMode("speed")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === "speed"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Speed Limit Calculator
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Interactive Visual Sandbox · 100% Free Código da Estrada Simulator
        </p>
      </div>

      {/* Mode 1: Rotunda */}
      {mode === "rotunda" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Visual Stage */}
          <div className="lg:col-span-7 bg-[#0F172A] rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between text-xs text-slate-300 mb-3">
              <span className="font-mono tracking-wide">ROTUNDA · ARTIGO 14.º-A</span>
              <span>Counter-clockwise flow (Sentido anti-horário)</span>
            </div>

            <svg
              viewBox="0 0 400 370"
              className="w-full max-w-[420px] h-auto"
              role="img"
              aria-label="Portuguese roundabout lane simulation diagram"
            >
              {/* Asphalt Arms */}
              <rect x="166" y="30" width="68" height="310" fill="#334155" />
              <rect x="40" y="166" width="320" height="68" fill="#334155" />
              {/* Outer Roundabout asphalt */}
              <circle cx="200" cy="200" r="102" fill="#334155" />
              {/* Lane divider dashed circle */}
              <circle
                cx="200"
                cy="200"
                r="76"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="7 7"
              />
              {/* Road center dividers */}
              <line x1="200" y1="30" x2="200" y2="100" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="200" y1="300" x2="200" y2="340" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="40" y1="200" x2="100" y2="200" stroke="#CBD5E1" strokeWidth="2" />
              <line x1="300" y1="200" x2="360" y2="200" stroke="#CBD5E1" strokeWidth="2" />
              {/* Center island */}
              <circle cx="200" cy="200" r="46" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
              <circle cx="200" cy="200" r="34" fill="#14532D" />
              <text
                x="200"
                y="204"
                textAnchor="middle"
                fill="#E2E8F0"
                fontSize="11"
                fontWeight="600"
              >
                ROTUNDA
              </text>

              {/* Exit labels */}
              <text x="348" y="156" textAnchor="middle" fill="#CBD5E1" fontSize="11">
                1st Exit
              </text>
              <text x="200" y="20" textAnchor="middle" fill="#CBD5E1" fontSize="11">
                2nd Exit (Straight)
              </text>
              <text x="52" y="156" textAnchor="middle" fill="#CBD5E1" fontSize="11">
                3rd Exit
              </text>
              <text
                x="200"
                y="358"
                textAnchor="middle"
                fill="#93C5FD"
                fontSize="11"
                fontWeight="600"
              >
                Entry (Your Car)
              </text>

              {/* Active Trajectory Path */}
              <path
                d={activeRotunda.pathD}
                fill="none"
                stroke={activeRotunda.entryColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="10 6"
              />

              {/* Car marker at entry */}
              <rect
                x={exit === "first" ? 208 : 196}
                y="306"
                width="16"
                height="26"
                rx="4"
                fill="#FFFFFF"
                stroke={activeRotunda.entryColor}
                strokeWidth="3"
              />
            </svg>
          </div>

          {/* Control & Concept Deck */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Select your intended exit (Saída)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(ROTUNDA_CONFIG) as RotundaExit[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setExit(key)}
                      className={`px-3 py-2.5 text-xs sm:text-sm font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                        exit === key
                          ? "bg-blue-700 text-white border-blue-700"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {ROTUNDA_CONFIG[key].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-slate-500">Required Lane</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {activeRotunda.laneEn}
                  </span>
                </div>
                <p className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <strong className="text-slate-900">Indicator Rule:</strong>{" "}
                  {activeRotunda.signalEn}
                </p>
                <ul className="space-y-2 text-sm text-slate-700 leading-relaxed">
                  {activeRotunda.stepsEn.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-semibold text-blue-700 mt-1 tabular-nums">
                        0{idx + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onAskAi(
                  `Explain the lane discipline and turn signal (Pisca) rules in a Portuguese roundabout (Rotunda) when taking the '${activeRotunda.label}'.`
                )
              }
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            >
              <span>Ask AI Coach about this roundabout exit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Right-Hand Priority */}
      {mode === "priority" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 bg-[#0F172A] rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between text-xs text-slate-300 mb-3">
              <span className="font-mono">REGRA DA DIREITA · Unmarked Intersection</span>
              <span>Click which vehicle proceeds first</span>
            </div>

            <svg
              viewBox="0 0 400 320"
              className="w-full max-w-[420px] h-auto"
              role="img"
              aria-label="Right-hand priority intersection drill"
            >
              {/* Crossroad */}
              <rect x="160" y="20" width="80" height="280" fill="#334155" />
              <rect x="40" y="120" width="320" height="80" fill="#334155" />
              <line
                x1="200"
                y1="20"
                x2="200"
                y2="115"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <line
                x1="200"
                y1="205"
                x2="200"
                y2="300"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <line
                x1="40"
                y1="160"
                x2="155"
                y2="160"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <line
                x1="245"
                y1="160"
                x2="360"
                y2="160"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="6 6"
              />

              {/* Car A (Bottom going straight up) */}
              <g
                onClick={() => setSelectedCar("A")}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedCar("A")}
              >
                <rect
                  x="208"
                  y="222"
                  width="24"
                  height="44"
                  rx="6"
                  fill={selectedCar === "A" ? "#DC2626" : "#3B82F6"}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                <text
                  x="220"
                  y="249"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="13"
                  fontWeight="700"
                >
                  A
                </text>
                <path d="M 220 214 L 220 192" stroke="#93C5FD" strokeWidth="2.5" />
              </g>

              {/* Car B (Right coming left) */}
              <g
                onClick={() => setSelectedCar("B")}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedCar("B")}
              >
                <rect
                  x="262"
                  y="128"
                  width="44"
                  height="24"
                  rx="6"
                  fill={selectedCar === "B" ? "#059669" : "#F59E0B"}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                <text
                  x="284"
                  y="145"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="13"
                  fontWeight="700"
                >
                  B
                </text>
                <path d="M 254 140 L 232 140" stroke="#FDE68A" strokeWidth="2.5" />
              </g>
            </svg>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-900">
                Which vehicle has right of way?
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                This intersection has no STOP sign, yield sign, or traffic lights. Car A is driving
                straight ahead while Car B approaches from the right.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCar("A")}
                  className={`px-4 py-3 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
                    selectedCar === "A"
                      ? "bg-red-50 border-red-300 text-red-900"
                      : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  Car A (Blue)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCar("B")}
                  className={`px-4 py-3 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
                    selectedCar === "B"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  Car B (Amber)
                </button>
              </div>

              {selectedCar === "B" && (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Correct — Car B goes first.</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">
                    Car B is approaching from Car A&apos;s right-hand side. Under Portugal&apos;s
                    right-hand rule (Regra da Direita), Car A must yield to Car B.
                  </p>
                </div>
              )}

              {selectedCar === "A" && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-950 text-sm space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-red-800">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Incorrect — Car A must yield.</span>
                  </div>
                  <p className="text-red-900 leading-relaxed">
                    Because Car B sits on Car A&apos;s right side at an unmarked intersection, Car A
                    is legally required to give way.
                  </p>
                </div>
              )}
            </div>

            {selectedCar && (
              <button
                type="button"
                onClick={() => setSelectedCar(null)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Drill</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mode 3: Speed Calculator */}
      {mode === "speed" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 bg-[#0F172A] text-white rounded-xl p-8 flex flex-col justify-between gap-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="font-mono">LIMITES DE VELOCIDADE · CATEGORY B</span>
              <span>{activeSpeed.namePt}</span>
            </div>

            <div className="py-4 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-y border-slate-800">
              <div>
                <p className="text-xs text-slate-400 mb-1">Maximum Speed Limit (Velocidade Máxima)</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-6xl font-semibold tracking-tight tabular-nums text-white">
                    {displayedMax}
                  </span>
                  <span className="font-mono text-lg text-slate-400">km/h</span>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-xs text-slate-400 mb-1">Minimum Speed Limit</p>
                <p className="font-mono text-2xl font-medium tabular-nums text-slate-200">
                  {activeSpeed.minSpeed ? `${activeSpeed.minSpeed} km/h` : "None posted"}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{activeSpeed.noteEn}</p>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Choose Road Type</p>
              <div className="space-y-2">
                {(Object.keys(SPEED_TABLE) as RoadType[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRoadType(key)}
                    className={`w-full px-4 py-2.5 rounded-lg border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      roadType === key
                        ? "bg-blue-700 text-white border-blue-700"
                        : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-sm font-medium">{SPEED_TABLE[key].nameEn}</span>
                    <span
                      className={`text-xs font-mono ${
                        roadType === key ? "text-blue-100" : "text-slate-500"
                      }`}
                    >
                      {SPEED_TABLE[key].standardMax} km/h
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs font-medium text-slate-500 mb-2">Driver Experience</p>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIsNewDriver(false)}
                  className={`py-2 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    !isNewDriver ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                  }`}
                >
                  Standard (1+ Year)
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewDriver(true)}
                  className={`py-2 px-3 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    isNewDriver ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                  }`}
                >
                  New Driver (1st Year)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
