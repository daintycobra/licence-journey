import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const ALLOWED_CHAT_MODELS = new Set([
  "gemini-4-hydrogen",
  "gemini-3.1-flash-lite",
]);

const SYSTEM_INSTRUCTION = `You are the experienced, friendly driving instructor for "License Journey PT".
Your role is to guide learners in Portugal through earning or exchanging their Portuguese driving license (Carta de Condução — IMT Portugal), mastering the Portuguese Highway Code (Código da Estrada), and passing both the theory exam (Exame Teórico) and practical test (Exame Prático).

Guidelines:
1. Always respond in clear, natural, easy-to-follow English (unless the user explicitly writes in another language).
2. Include the official Portuguese driving terms in parentheses when helpful (e.g., roundabout (Rotunda), right of way (Prioridade), medical certificate (Atestado Médico), highway code (Código da Estrada)).
3. Keep answers well-structured with concise paragraphs and bullet points so learners can absorb rules quickly.
4. When explaining mock exam questions or traffic signs, clearly state the correct answer and cite the exact Portuguese rule behind it.
5. Share accurate IMT rules (e.g., 30 questions with at least 27 correct to pass, 35-minute theory exam, 50 km/h urban speed limit, 120 km/h motorway limit, 28 theory + 32 practical hours). For local fees or document changes, remind learners to verify the latest updates on imt-ip.pt.`;

function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

interface IncomingHistoryItem {
  role: "user" | "model";
  text: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "license-journey-pt" });
  });

  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history = [], model = "gemini-4-hydrogen" } = req.body as {
        message?: string;
        history?: IncomingHistoryItem[];
        model?: string;
      };

      if (!message || typeof message !== "string" || !message.trim()) {
        res.status(400).json({ error: "Please enter a question to ask the instructor." });
        return;
      }

      const selectedModel = ALLOWED_CHAT_MODELS.has(model)
        ? model
        : "gemini-4-hydrogen";

      const ai = createGeminiClient();

      const formattedHistory = Array.isArray(history)
        ? history
            .filter(
              (item): item is IncomingHistoryItem =>
                item &&
                (item.role === "user" || item.role === "model") &&
                typeof item.text === "string" &&
                item.text.trim().length > 0
            )
            .slice(-20)
            .map((item) => ({
              role: item.role,
              parts: [{ text: item.text }],
            }))
        : [];

      const chat = ai.chats.create({
        model: selectedModel,
        history: formattedHistory,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const response = await chat.sendMessage({
        message: message.trim(),
      });

      const replyText = response.text?.trim();
      if (!replyText) {
        res.status(502).json({
          error: "No response was received from the instructor. Please try again.",
        });
        return;
      }

      res.json({
        reply: replyText,
        model: selectedModel,
      });
    } catch (error: unknown) {
      const errObj = error as { status?: number; message?: string };
      const rawMessage = errObj?.message ?? String(error);

      if (rawMessage === "MISSING_API_KEY") {
        res.status(503).json({
          error:
            "AI instructor service is not configured yet. Please check GEMINI_API_KEY in Settings > Secrets.",
        });
        return;
      }

      if (rawMessage.includes("429") || rawMessage.includes("RESOURCE_EXHAUSTED")) {
        res.status(429).json({
          error:
            "The request quota has been reached. Please wait a moment and try again, or review your API key in Settings > Secrets.",
        });
        return;
      }

      if (
        rawMessage.includes("403") ||
        rawMessage.includes("PERMISSION_DENIED") ||
        rawMessage.includes("API_KEY_INVALID")
      ) {
        res.status(403).json({
          error:
            "The API key appears invalid. Please verify your API key in the Settings > Secrets panel.",
        });
        return;
      }

      console.error("Gemini chat error:", rawMessage);
      res.status(500).json({
        error: "Could not reach the AI instructor right now. Please try again shortly.",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`License Journey PT server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
