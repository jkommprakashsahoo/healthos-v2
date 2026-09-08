import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "25mb" }));

// Lazy initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") });
});

app.post("/api/scan-document", async (req, res) => {
  try {
    const { fileName, mimeType, dataUrl } = req.body as {
      fileName?: string;
      mimeType?: string;
      dataUrl?: string;
    };
    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({ error: "Document AI is not configured. Add GEMINI_API_KEY before scanning a document." });
    }
    if (!fileName || !dataUrl || !mimeType) {
      return res.status(400).json({ error: "Choose a non-empty PDF or image before scanning." });
    }
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match || match[1] !== mimeType || !match[2]) {
      return res.status(400).json({ error: "The selected document could not be read." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [
          { inlineData: { mimeType, data: match[2] } },
          { text: `Read this uploaded health document carefully before extracting anything. Filename: ${fileName}

If the document is blank, unreadable, or is not a medical health record such as a prescription, lab report, imaging report, visit note, discharge summary, or medication record, return exactly JSON with this shape: {"valid":false,"message":"This is not a readable prescription or health report."}.

If it is valid, return only JSON with this shape: {"valid":true,"events":[{"title":"...","subtitle":"...","type":"lab|visit|medication|hospital|symptom|imaging","date":"YYYY-MM-DD","summary":"...","extractedInfo":[{"label":"...","value":"...","status":"normal|attention|changed|info"}]}]}. Extract only facts visible in the document. Do not diagnose, infer missing facts, or create events not present. If no meaningful health facts can be extracted, return valid false with a clear message.` }
        ]
      }],
      config: { temperature: 0, responseMimeType: "application/json" },
    });
    const raw = (response.text || "").replace(/^```json\s*|\s*```$/g, "").trim();
    const parsed = JSON.parse(raw);
    if (!parsed.valid || !Array.isArray(parsed.events) || parsed.events.length === 0) {
      return res.status(422).json({ error: parsed.message || "This document does not contain a readable prescription or health report." });
    }
    return res.json({ events: parsed.events });
  } catch (error: any) {
    console.error("Document scan error:", error);
    return res.status(422).json({ error: "We could not read this document. Please upload a clear prescription or health report." });
  }
});

// Gemini Chat / Query Endpoint
app.post("/api/ask-ai", async (req, res) => {
  try {
    const { question, healthMemoryContext } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: "Gemini API key not configured or in local demo mode.",
      });
    }

    const systemInstruction = `You are Health Memory AI — a trusted, human, and calm personal health-history assistant.
IMPORTANT SAFETY & BEHAVIOR RULES:
1. You are NOT an AI doctor and must NEVER diagnose diseases or prescribe treatments.
2. Structure your answers clearly around:
   - DOCUMENTED: Facts directly found in records.
   - OBSERVED: Longitudinal patterns identified across multiple records over time.
   - DISCUSS: Specific, practical points worth discussing with their healthcare professional.
3. Every factual claim must cite exact demo records from the provided health memory context. Never invent records.
4. Format citations clearly so the client can extract them.
5. Provide a warm, concise, professional tone suitable for a modern mobile health companion.`;

    const prompt = `Health Memory Patient Records Context:
${JSON.stringify(healthMemoryContext, null, 2)}

User Question: "${question}"

Please answer strictly based on the records provided above. Include Documented facts, Observed trends/changes, Discuss items for the doctor, and record citations.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({
      success: true,
      text: response.text || "",
    });
  } catch (error: any) {
    console.error("Gemini query error:", error);
    res.status(500).json({ error: error.message || "Failed to process question" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Health Memory server running on http://localhost:${PORT}`);
  });
  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the existing server or run with PORT=3001 npm run dev.`);
      process.exitCode = 1;
      return;
    }
    throw error;
  });
}

startServer();
