# Speech Assist App

Real-Time Accent Reduction and Pronunciation Feedback Tool.

## 🚀 How to Run Locally

1.  **Install Node.js**: Ensure you have Node.js installed on your computer.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Open in Browser**: Visit `http://localhost:5173`

## 🗄️ Database Setup (Supabase)

This app works out-of-the-box with **LocalStorage**. To enable the real cloud database:

1.  Create a project at [Supabase](https://supabase.com).
2.  Go to the **SQL Editor** in Supabase and run the content of `supabase_schema.sql`.
3.  Create a `.env` file in the root folder (copy `.env.example`).
4.  Add your Supabase URL and Key from **Project Settings > API**.

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

The app will detect these keys and automatically switch to using Supabase.

## 🛠️ Technology Stack

*   **Frontend**: React, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Charts**: Recharts
*   **Database**: Supabase (PostgreSQL)
*   **Speech**: Web Speech API (Native Browser Support)


# Speech Assist 🎙️

**Speech Assist** is a real-time accent reduction and pronunciation feedback tool designed to help non-native English speakers improve their speaking clarity. By providing granular, phoneme-level feedback and long-term progress tracking, it empowers users to build confidence and master English pronunciation.

## 🚀 Key Features

- **Real-Time Speech Recognition**: Uses the Web Speech API to transcribe speech as you talk, with live word-highlighting.
- **Phoneme-Level Feedback**: Analyzes pronunciation and provides specific feedback on "Problem Sounds" (e.g., placement, voicing, timing).
- **Interactive Dashboard**:
  - **PER Trend**: Track your Phoneme Error Rate over time.
  - **Problem Sounds**: Identify which specific sounds need the most practice.
  - **Activity History**: Review past sessions and accuracy scores.
- **Difficulty Levels**: Practice sentences categorized into Easy, Medium, and Hard.
- **Hybrid Storage Architecture**: Seamlessly switches between **Supabase (PostgreSQL)** and **Browser LocalStorage** for maximum resilience.
- **Connection Diagnostics**: Built-in troubleshooter to help users diagnose network, firewall, or VPN issues.

## 📖 Usage

1. **Sign Up / Login**: Create a profile to save your progress.
2. **Select a Phrase**: Choose a sentence based on your desired difficulty level.
3. **Record**: Click and hold the microphone button while speaking the phrase clearly.
4. **Review Feedback**: Hover over orange phoneme badges to see specific suggestions for improvement.
5. **Track Progress**: Visit the Dashboard to see how your accuracy improves over time.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend/Auth**: Supabase (Auth & Database)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Speech Engine**: Native Web Speech API



