import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
You are a Roadmap Generator AI.
The user will provide a sentence (e.g. "I want to learn how to build web apps").
You must first detect the correct domain (e.g. "Frontend Development") from the sentence.
You must ALWAYS return a valid JSON object with this exact structure:
{
  "title": "...",
  "description": "...",
  "domain": "...", // Detected automatically from the user sentence
  "estimated_duration": "...", // You must calculate this automatically
  "created_at": "...",
  "sections": [
    {
      "title": "...",
      "summary": "...",
      "order": 1,
      "steps": [
        {
          "title": "...",
          "description": "...",
          "duration": "...",
          "resources": [
            { "type": "article" | "video" | "course", "title": "...", "url": "..." }
          ]
        }
      ]
    }
  ]
}
`;

export async function generateRoadmap(userSentence: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
${SYSTEM_PROMPT}

Generate a roadmap based on this user sentence: "${userSentence}".
The roadmap must include:
- The automatically detected domain from the sentence.
- An automatically calculated \"estimated_duration\" based on the number and complexity of steps.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Clean JSON (Gemini sometimes wraps in code blocks)
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ JSON parse failed:", err);
    return { error: "Invalid JSON", raw: cleaned };
  }
}
