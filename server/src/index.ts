import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import type { PlanDayRequest, PlanDayResponse } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', server: 'ImpactAi Backend', time: new Date().toISOString() });
});

import multer from 'multer';
import fs from 'fs';
import path from 'path';

// ... imports

const upload = multer({ dest: 'uploads/' });

// ... app setup

import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// API Endpoint for Voice Planning
app.post('/api/v1/plan-day', upload.single('audio'), async (req, res) => {
  try {
    const audioFile = req.file;
    const { user_id } = req.body;
    
    if (!audioFile) {
      res.status(400).json({ error: "No audio file provided" });
      return; 
    }

    console.log(`[Groq] Processing audio for user: ${user_id}`);

    // Rename file to have an extension so Groq can detect the type
    const originalPath = audioFile.path;
    const newPath = `${originalPath}.m4a`;
    fs.renameSync(originalPath, newPath);

    // 1. Transcribe with Groq Whisper
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(newPath),
      model: "whisper-large-v3",
      response_format: "json",
    });

    // Cleanup immediately after transcription (or in finally block)
    // We'll leave it for the finally block, but update the reference
    audioFile.path = newPath; // Update path for cleanup in finally/catch

    const transcriptText = transcription.text;
    console.log(`[Groq] Transcript: "${transcriptText}"`);

    // 2. Generate Schedule with Llama 3
    const systemPrompt = `
    You are an AI Personal Assistant responsible for creating a realistic daily schedule.
    
    Input: User's voice transcript describing their day.
    Output: A strictly valid JSON object starting with { "benchmark_slots": [...] }.
    
    Rules:
    - "benchmark_slots" must be an array of objects with:
      - "id": string (unique)
      - "time": string (HH:MM format, 24h)
      - "title": string
      - "duration": number (minutes)
      - "type": "BENCHMARK"
      - "category": One of "WORK", "HEALTH", "DEEP_WORK", "CHORES", "LEARNING", "LEISURE"
    - Infer missing details sensibly.
    - If the user provided no specific times, create a balanced schedule starting at 08:00.
    - Do NOT include any markdown formatting (like \`\`\`json). Just the raw JSON.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is my plan for today: "${transcriptText}"` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const aiResponse = completion.choices[0]?.message?.content || "{}";
    const parsedPlan = JSON.parse(aiResponse);

    console.log(`[Groq] Generated ${parsedPlan.benchmark_slots?.length || 0} slots.`);

    // 3. Return to App
    res.json({ 
      message: "Plan generated successfully", 
      day_id: "day-" + Date.now(),
      summary: "Here is your generated benchmark schedule.",
      benchmark_slots: parsedPlan.benchmark_slots || []
    });

    // Cleanup
    fs.unlinkSync(audioFile.path);

  } catch (error) {
    console.error("Error processing plan:", error);
    res.status(500).json({ error: "Internal server error" });
    // Attempt cleanup if file exists
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
