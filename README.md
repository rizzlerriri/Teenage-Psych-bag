# Teenage Psych Bags 📓🧠

A rebellious, expressive diary for teenagers interested in psychology, emotions, and raw self-expression.

## 🎨 Aesthetic
- **Teenage Dirtbag Rebellion**: Messy, chaotic, and anti-polished.
- **Notebook Vibe**: Handwritten fonts, crayon scribbles, and torn paper effects.
- **Dark Academia**: Muted tones (deep brown, beige, faded ink).
- **Interactive Chaos**: Scribbled annotations, grainy overlays, and unstable layouts.

## 🧠 Features
- **Homepage**: Latest posts in a scrapbook grid layout.
- **Blog System**: Markdown-supported entries with journal-style styling.
- **Admin Dashboard**: Secure panel to create, edit, and delete entries.
- **File-based CMS**: Data is stored in a simple `db.json` file for portability.
- **Search & Filter**: Find thoughts by keywords or category.

## ⚙️ Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion.
- **Backend**: Node.js + Express.
- **Database**: Local JSON Storage (LowDB-style).
- **Auth**: JWT + Bcrypt.
- **Icons**: Lucide React.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Edit `.env` (or use the defaults in AI Studio secrets).
   - `ADMIN_USERNAME`: Your admin username (default: `admin`)
   - `ADMIN_PASSWORD`: Your admin password (default: `admin123`)
   - `JWT_SECRET`: A secret key for security.

3. **Run the App**:
   ```bash
   npm run dev
   ```

## 🛠 Admin Panel
- Navigate to `/login` to access the dashboard.
- Default credentials (if not set in env): `admin` / `admin123`.
- From the dashboard, you can spill your thoughts, upload images, and manage existing entries.

## 📦 Deployment
This project is designed to be easily exported:
1. **GitHub**: Push the code to a repo.
2. **Vercel / Netlify**: Connect your repo. It will automatically detect the Vite build.
   - *Note*: For persistent storage on serverless platforms, you may want to connect a real database (like MongoDB or Postgres) in `server.ts`. The current setup uses a local `db.json`.

---
*"The brain is a messy room where we store our best secrets."*
