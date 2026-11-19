import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { MOCK_EXAM_QUESTIONS } from "../data/licenseData";
import { TrafficSignIcon } from "./TrafficSignIcon";

interface MockExamPanelProps {
  onAskAi: (question: string) => void;
}

const EXAM_DURATION_SECONDS = 12 * 60; // 12 minutes for 10 questions (proportional to 35m/30q)

export function MockExamPanel({ onAskAi }: MockExamPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS);

  useEffect(() => {
    if (submitted) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [submitted]);

  const currentQuestion = MOCK_EXAM_QUESTIONS[currentIndex];
  const selectedOption = answers[currentQuestion.id];
  const answeredCount = Object.keys(answers).length;

  const correctCount = MOCK_EXAM_QUESTIONS.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const passThreshold = 9; // 90% matching Portugal IMT's 27/30 requirement
  const passed = correctCount >= passThreshold;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSelectOption = (optionIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
    setSecondsLeft(EXAM_DURATION_SECONDS);
  };

  if (submitted) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              {passed ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700">Passed (Aprovado — IMT 90% Standard)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-700">
                    More Practice Needed (Requires at least 9/10 to pass)
                  </span>
                </>
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Your Score:{" "}
              <span className="font-mono tabular-nums">
                {correctCount}/{MOCK_EXAM_QUESTIONS.length}
              </span>
            </h3>
            <p className="text-sm text-slate-600">
              On the official Portuguese IMT theory test, you must answer at least 27 out of 30
              questions (90%) correctly. Review each explanation below.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Exam</span>
          </button>
        </div>

        <div className="space-y-4">
          {MOCK_EXAM_QUESTIONS.map((q, idx) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.correctIndex;
            return (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span>
                    Question <span className="font-mono tabular-nums">{idx + 1}</span> ·{" "}
                    {q.topicEn} ({q.topicPt})
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      isCorrect ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Incorrect / Unanswered
                      </>
                    )}
                  </span>
                </div>

                <p className="text-base font-semibold text-slate-900">{q.questionEn}</p>

                <div className="text-sm space-y-1">
                  <p className="text-emerald-800">
                    <strong>Correct Answer:</strong> {q.options[q.correctIndex]}
                  </p>
                  {!isCorrect && userAns !== undefined && (
                    <p className="text-red-700">
                      <strong>Your Selection:</strong> {q.options[userAns]}
                    </p>
                  )}
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{q.explanationEn}</p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs font-mono text-slate-500">{q.ruleRef}</span>
                  <button
                    type="button"
                    onClick={() =>
                      onAskAi(
                        `Please explain this Portuguese driving theory question in detail: "${q.questionEn}" — why is "${q.options[q.correctIndex]}" the correct answer?`
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask AI Coach for Deeper Explanation</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Top Exam Meta Strip */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="font-semibold text-slate-900 tabular-nums">
            Question {currentIndex + 1} / {MOCK_EXAM_QUESTIONS.length}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {currentQuestion.topicEn} ({currentQuestion.topicPt})
          </span>
        </div>

        <div className="flex items-center gap-5 text-sm">
          <span className="text-slate-600 tabular-nums">
            Answered: {answeredCount}/{MOCK_EXAM_QUESTIONS.length}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-slate-900 tabular-nums">
            <Clock className="w-4 h-4 text-blue-700" />
            {formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          {currentQuestion.signGlyph && (
            <div className="shrink-0 w-24 h-24 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2">
              <TrafficSignIcon glyph={currentQuestion.signGlyph} className="w-20 h-20" />
            </div>
          )}
          <div className="space-y-2 flex-1">
            <p className="text-xs font-mono text-slate-500">{currentQuestion.ruleRef}</p>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
              {currentQuestion.questionEn}
            </h3>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const letter = ["A", "B", "C"][idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 border-blue-700 text-slate-900"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-md text-xs font-mono font-semibold flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? "bg-blue-700 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {letter}
                </span>
                <span className="text-sm sm:text-base leading-relaxed">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Question Number Quick Jump */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {MOCK_EXAM_QUESTIONS.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = answers[q.id] !== undefined;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-md text-xs font-mono font-medium transition-colors tabular-nums cursor-pointer ${
                    isCurrent
                      ? "bg-slate-900 text-white"
                      : isAnswered
                        ? "bg-blue-100 text-blue-900 hover:bg-blue-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  aria-label={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Previous
              </button>
            )}
            {currentIndex < MOCK_EXAM_QUESTIONS.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="px-5 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Submit &amp; Score ({answeredCount}/{MOCK_EXAM_QUESTIONS.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
