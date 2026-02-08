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
