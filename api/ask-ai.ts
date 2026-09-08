import { getAIClient, isPostRequest } from "./_lib.js";
import type { VercelRequest, VercelResponse } from "./_lib.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isPostRequest(req, res)) return;

  try {
    const { question, healthMemoryContext } = req.body || {};
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
      config: { systemInstruction, temperature: 0.3 },
    });

    return res.json({ success: true, text: response.text || "" });
  } catch (error: any) {
    console.error("Gemini query error:", error);
    return res.status(500).json({ error: error.message || "Failed to process question" });
  }
}