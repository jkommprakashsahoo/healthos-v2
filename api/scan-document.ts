import { getAIClient, isPostRequest } from "./_lib.js";
import type { VercelRequest, VercelResponse } from "./_lib.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isPostRequest(req, res)) return;

  try {
    const { fileName, mimeType, dataUrl } = req.body || {};
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

If it is valid, return only JSON with this shape: {"valid":true,"events":[{"title":"...","subtitle":"...","type":"lab|visit|medication|hospital|symptom|imaging","date":"YYYY-MM-DD","summary":"...","extractedInfo":[{"label":"...","value":"...","status":"normal|attention|changed|info"}]}]}. Extract only facts visible in the document. Do not diagnose, infer missing facts, or create events not present. If no meaningful health facts can be extracted, return valid false with a clear message.` },
        ],
      }],
      config: { temperature: 0, responseMimeType: "application/json" },
    });
    const raw = (response.text || "").replace(/^```json\s*|\s*```$/g, "").trim();
    const parsed = JSON.parse(raw);
    if (!parsed.valid || !Array.isArray(parsed.events) || parsed.events.length === 0) {
      return res.status(422).json({ error: parsed.message || "This document does not contain a readable prescription or health report." });
    }
    return res.json({ events: parsed.events });
  } catch (error) {
    console.error("Document scan error:", error);
    return res.status(422).json({ error: "We could not read this document. Please upload a clear prescription or health report." });
  }
}