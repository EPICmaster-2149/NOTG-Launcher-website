// Vercel serverless entry point for the Express app
// This allows the full backend API to run on Vercel's serverless infrastructure

import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Import the main server app setup
export { app };

const app = express();
const DIST_PATH = path.join(process.cwd(), "dist");

app.use(express.json());
app.use("/assets", express.static(path.join(process.cwd(), "assets")));
app.use(express.static(DIST_PATH));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Minecraft Server Status proxy
app.get("/api/minecraft/server-status", async (req, res) => {
  const serverIp = req.query.ip as string;
  if (!serverIp) {
    res.status(400).json({ error: "Missing 'ip' query parameter." });
    return;
  }
  try {
    const response = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(serverIp)}`);
    if (!response.ok) throw new Error(`API status: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch server status.", details: error.message });
  }
});

// Gemini AI Advisor
const GEMINI_KEY = process.env.GEMINI_API_KEY;
let ai: any = null;
if (GEMINI_KEY) {
  import("@google/genai").then(({ GoogleGenAI }) => {
    ai = new GoogleGenAI({
      apiKey: GEMINI_KEY,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  });
}

app.post("/api/gemini/advisor", async (req, res) => {
  const { cpu, gpu, ramGb, playstyle, customRequirements } = req.body;

  if (!ramGb) {
    res.status(400).json({ error: "Missing 'ramGb' in request body." });
    return;
  }

  if (!GEMINI_KEY || !ai) {
    res.status(503).json({ error: "AI advisor unavailable", details: "GEMINI_API_KEY is not configured." });
    return;
  }

  const prompt = `...`; // (same prompt as server.ts)
  
  try {
    const { GoogleGenAI, Type } = await import("@google/genai");
    
    const aiClient = new GoogleGenAI({
      apiKey: GEMINI_KEY,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `The user is configuring a custom Minecraft launcher profile. Based on their hardware specifications and playstyle, generate optimized Java argument flags (JVM flags), launcher settings, and mod recommendations.

User Hardware Specs:
- CPU: ${cpu || "Modern Multi-core CPU"}
- GPU: ${gpu || "Standard Integrated/Dedicated GPU"}
- Allocated RAM: ${ramGb} GB (Important for GC parameters)
- Playstyle Focus: ${playstyle || "Balanced FPS & Visuals"}
- Custom Requests: ${customRequirements || "None"}

Provide your analysis and recommendations strictly as a JSON object matching this schema:
{
  "recommendedAllocatedRamGb": number,
  "jvmArguments": "string",
  "jvmExplanation": "string",
  "essentialMods": [{ "name": "string", "category": "string", "description": "string" }],
  "fpsTuningTips": ["string"],
  "performanceImpactScore": "string"
}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            recommendedAllocatedRamGb: { type: "INTEGER" },
            jvmArguments: { type: "STRING" },
            jvmExplanation: { type: "STRING" },
            essentialMods: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  category: { type: "STRING" },
                  description: { type: "STRING" },
                },
                required: ["name", "category", "description"],
              },
            },
            fpsTuningTips: { type: "ARRAY", items: { type: "STRING" } },
            performanceImpactScore: { type: "STRING" },
          },
          required: ["recommendedAllocatedRamGb", "jvmArguments", "jvmExplanation", "essentialMods", "fpsTuningTips", "performanceImpactScore"],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Empty response from Gemini API.");
    res.json(JSON.parse(responseText.trim()));
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate AI performance profile.", details: error.message });
  }
});

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_PATH, "index.html"));
});

export default app;
