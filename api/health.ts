import type { VercelRequest, VercelResponse } from "./_lib";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(
      process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY",
    ),
  });
}