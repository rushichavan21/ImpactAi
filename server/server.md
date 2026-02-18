# ImpactAi Server

## Overview
The **ImpactAi Server** is a Node.js & Express application written in TypeScript. It serves as the intelligent backend for the ImpactAi mobile app, handling voice processing, AI planning, and data management.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Integration**: Groq SDK
    - **Transcription**: `distil-whisper-large-v3-en`
    - **Planning/Reasoning**: `llama3-70b-8192`
- **File Handling**: Multer (for audio uploads)
- **Database**: PostgreSQL (Schema defined, integration pending)

## API Endpoints

### 1. Health Check
- **Endpoint**: `GET /health`
- **Description**: Returns server status and current time.
- **Response**:
  ```json
  {
    "status": "ok",
    "server": "ImpactAi Backend",
    "time": "ISO-8601 Timestamp"
  }
  ```

### 2. Plan Day (Voice to Schedule)
- **Endpoint**: `POST /api/v1/plan-day`
- **Content-Type**: `multipart/form-data`
- **Body**:
    - `audio`: The voice recording file (audio/wav, audio/m4a, etc.)
    - `user_id`: String ID of the user.
- **Process**:
    1.  Receives audio file via `multer`.
    2.  Transcribes audio using **Groq Whisper**.
    3.  Generates a daily schedule using **Llama 3** based on the transcript.
    4.  Returns a structured JSON object with `benchmark_slots`.
- **Response**:
  ```json
  {
    "message": "Plan generated successfully",
    "day_id": "day-timestamp",
    "summary": "AI generated summary...",
    "benchmark_slots": [
      {
        "id": "1",
        "time": "08:00",
        "title": "Morning Routine",
        "duration": 30,
        "type": "BENCHMARK",
        "category": "HEALTH"
      }
    ]
  }
  ```

## Database Schema (Planned)
The database schema is defined in `src/db/schema.sql`. It includes:
- **Users**: Stores user preferences and credentials.
- **Days**: Represents a specific date for a user (summary, score).
- **Tasks**: The "What" (title, category, duration).
- **Schedule Slots**: The "When" (start/end times, Benkmark vs Actual).

**Note**: The current `src/index.ts` implementation mocks the database persistence and currently returns AI-generated responses directly without saving to DB.

## Development Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root:
    ```env
    PORT=3000
    GROQ_API_KEY=your_groq_api_key_here
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    This uses `nodemon` and `ts-node` for hot-reloading.

4.  **Build & Run Production**:
    ```bash
    npm run build
    npm start
    ```
