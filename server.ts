import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use("/assets", express.static(path.join(process.cwd(), "assets")));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 1. Minecraft Server Status proxy to avoid CORS issues
  app.get("/api/minecraft/server-status", async (req, res) => {
    const serverIp = req.query.ip as string;
    if (!serverIp) {
      res.status(400).json({ error: "Missing 'ip' query parameter." });
      return;
    }

    try {
      const response = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(serverIp)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch status from public API. Status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching Minecraft server status:", error);
      res.status(500).json({ error: "Failed to fetch server status.", details: error.message });
    }
  });

  // 2. AI Performance Advisor using Gemini-3.5-Flash
  app.post("/api/gemini/advisor", async (req, res) => {
    const { cpu, gpu, ramGb, playstyle, customRequirements } = req.body;

    if (!ramGb) {
      res.status(400).json({ error: "Missing 'ramGb' in request body." });
      return;
    }

    const prompt = `
      The user is configuring a custom Minecraft launcher profile. Based on their hardware specifications and playstyle, generate optimized Java argument flags (JVM flags), launcher settings, and mod recommendations.

      User Hardware Specs:
      - CPU: ${cpu || "Modern Multi-core CPU"}
      - GPU: ${gpu || "Standard Integrated/Dedicated GPU"}
      - Allocated RAM: ${ramGb} GB (Important for GC parameters)
      - Playstyle Focus: ${playstyle || "Balanced FPS & Visuals"}
      - Custom Requests: ${customRequirements || "None"}

      Provide your analysis and recommendations strictly as a JSON object matching this schema:
      {
        "recommendedAllocatedRamGb": number (suggested allocation between 2GB and 8GB, keeping in mind they input ${ramGb}GB, e.g. for modded usually 6-8GB, for vanilla 2-4GB),
        "jvmArguments": "string containing optimized Java flags, e.g. G1GC optimization flags tailored for ${ramGb}GB RAM",
        "jvmExplanation": "brief explanation of why these JVM flags help their specific system",
        "essentialMods": [
          {
            "name": "string",
            "category": "Performance / Visuals / Quality of Life",
            "description": "brief description of how this mod helps them (e.g., Sodium for FPS, Iris for Shaders, FerriteCore for RAM reduction)"
          }
        ],
        "fpsTuningTips": [
          "string of specific settings to tweak in-game or in the launcher"
        ],
        "performanceImpactScore": "string describing performance level, e.g., 'High FPS / Cinematic Shaders Ready / Smooth Modded'"
      }
    `;

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is missing on the server.");
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedAllocatedRamGb: { type: Type.INTEGER },
              jvmArguments: { type: Type.STRING },
              jvmExplanation: { type: Type.STRING },
              essentialMods: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    category: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "category", "description"]
                }
              },
              fpsTuningTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              performanceImpactScore: { type: Type.STRING }
            },
            required: [
              "recommendedAllocatedRamGb",
              "jvmArguments",
              "jvmExplanation",
              "essentialMods",
              "fpsTuningTips",
              "performanceImpactScore"
            ]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini API.");
      }

      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini Advisor Error:", error);
      res.status(500).json({ error: "Failed to generate AI performance profile.", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
