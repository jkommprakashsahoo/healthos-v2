import { GoogleGenAI } from "@google/genai";

export interface VercelRequest {
  body: any;
  method?: string;
}

export interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
}

let aiClient: GoogleGenAI | null = null;

export function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return aiClient;
}

export function isPostRequest(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method === "POST") {
    return true;
  }
  res.status(405).json({ error: "Method not allowed" });
  return false;
}