import { useEffect, useRef, useState } from "react";
import { Send, RotateCcw, AlertCircle, Loader2 } from "lucide-react";

type FreeModelId = "gemini-4-hydrogen" | "gemini-3.1-flash-lite";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  modelLabel?: string;
}

const STARTER_PROMPTS = [
  "Which lane should I use in a Portuguese roundabout (Rotunda)?",
  "What documents are needed to exchange a foreign license in Portugal?",
  "How many mistakes are allowed on the IMT theory exam?",
  "What are the speed limits in Portuguese cities and motorways?",
];

const INITIAL_WELCOME: ChatMessage = {
  id: "welcome",
  role: "model",
  text: "Hello! I am your **License Journey PT** AI driving instructor. Ask me anything about earning your Portuguese driving license (Carta de Condução), IMT paperwork, foreign license exchange (Troca), traffic signs, or Código da Estrada rules.",
  modelLabel: "Detailed Guide",
};

interface AiInstructorChatProps {
  externalPrompt: string | null;
  onExternalPromptConsumed: () => void;
}

function renderFormattedText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={lineIdx} className="h-2" />;
    }

    const isBullet = /^[-*•]\s+/.test(trimmed);
    const cleanLine = isBullet ? trimmed.replace(/^[-*•]\s+/, "") : trimmed;
    const segments = cleanLine.split(/(\*\*[^*]+\*\*)/g);

    const content = segments.map((seg, segIdx) => {
      if (seg.startsWith("**") && seg.endsWith("**")) {
        return (
          <strong key={segIdx} className="font-semibold text-slate-900">
            {seg.slice(2, -2)}
          </strong>
        );
      }
      return <span key={segIdx}>{seg}</span>;
    });

    if (isBullet) {
      return (
        <div key={lineIdx} className="flex items-start gap-2 pl-1">
          <span className="text-blue-700 font-bold mt-0.5">•</span>
          <span className="flex-1">{content}</span>
        </div>
      );
    }

    return <p key={lineIdx}>{content}</p>;
  });
}

export function AiInstructorChat({
  externalPrompt,
  onExternalPromptConsumed,
}: AiInstructorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<FreeModelId>("gemini-4-hydrogen");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    const historyForApi = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: historyForApi,
          model: selectedModel,
        }),
      });

      const data = (await res.json()) as { reply?: string; error?: string };

      if (!res.ok || !data.reply) {
        throw new Error(
          data.error || "Could not get a response from the instructor. Please try again."
        );
      }

      const modelLabel =
        selectedModel === "gemini-3.1-flash-lite" ? "Fast Answer" : "Detailed Guide";

      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: "model",
          text: data.reply as string,
          modelLabel,
        },
      ]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Network error occurred. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (externalPrompt) {
      void sendMessage(externalPrompt);
      onExternalPromptConsumed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME]);
    setError(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
      {/* Chat Toolbar */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            AI Driving Instructor (English + Portuguese Terms)
          </h3>
          <p className="text-xs text-slate-500">
            Multi-turn conversation · Free tier · Código da Estrada &amp; IMT guidance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg"
            role="group"
            aria-label="Response mode selector"
          >
            <button
              type="button"
              onClick={() => setSelectedModel("gemini-4-hydrogen")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedModel === "gemini-4-hydrogen"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Detailed Guide
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel("gemini-3.1-flash-lite")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedModel === "gemini-3.1-flash-lite"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fast Answer
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div
        ref={scrollContainerRef}
        className="h-[420px] overflow-y-auto p-6 space-y-5 bg-[#FAFBFD]"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-xl px-4 py-3.5 text-sm leading-relaxed space-y-1.5 ${
                msg.role === "user"
                  ? "bg-blue-700 text-white"
                  : "bg-white border border-slate-200 text-slate-700"
              }`}
            >
              {msg.role === "model" && (
                <div className="text-[11px] font-medium text-slate-400 mb-1">
                  License Journey PT Coach · {msg.modelLabel || "Detailed Guide"}
                </div>
              )}
              {msg.role === "user" ? (
                <p>{msg.text}</p>
              ) : (
                <div className="space-y-1.5">{renderFormattedText(msg.text)}</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 inline-flex items-center gap-2.5">
              <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
              <span>Preparing instructor response...</span>
            </div>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-red-800">Unable to send message</p>
              <p>{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Starter Prompt Buttons */}
      <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 mr-1">Quick questions:</span>
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={loading}
            onClick={() => void sendMessage(prompt)}
            className="text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 px-3 py-1.5 rounded-md transition-colors text-left cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Example: How do I book the theory exam in English at IMT?"
          disabled={loading}
          className="flex-1 px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
