# 🌿 CropGuard AI — Expert Plant Pathology Engine

**Cloud-Native Expert AI** for professional plant disease detection. CropGuard utilizes a high-expert reasoning engine (powered by Google Gemini 1.5 Flash) to provide agricultural diagnostics with botanical precision.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![AI](https://img.shields.io/badge/AI-Expert_Reasoning-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 What It Does

Point your phone camera at a plant leaf → Expert AI analyzes symptoms → Get precision diagnosis and treatment protocol.

| Feature | Description |
16: | **Infinite Diagnostic Range** | Recognizes thousands of plant species and diseases beyond standard datasets. |
17: | **Expert Reasoning** | Provides pathology reasoning, symptom analysis, and precision protocols. |
18: | **Cloud-Native** | Zero local overhead. High performance on any mobile device. |
19: | **Diagnostic Reports** | Download professional 1-page PDF reports for field records. |

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│  Next.js App (Vercel)                             │
│  ┌──────────┐      ┌──────────┐     ┌─────────┐   │
│  │ Mobile   │  →   │ Cloud    │  →  │ Expert  │   │
│  │ Capture  │      │ Expert AI│     │ Protocol│   │
│  └──────────┘      └──────────┘     └─────────┘   │
│                         │                         │
│                  ┌──────▼─────┐                   │
│                  │ Supabase   │ (Auth + History)  │
│                  └────────────┘                   │
└──────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Deployment Configuration

1. **Environment Variables**:
   You must set the following variables in your deployment environment (e.g., Vercel):
   - `GEMINI_API_KEY`: Your Google AI API key.
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.

### Run the App (Local)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Add your GEMINI_API_KEY to .env.local

# 3. Run development server
npm run dev
```

## 📊 Performance & Accuracy

- **Diagnosis**: Expert-level pathological reasoning for lesions, chlorosis, and pests.
- **Speed**: Optimized cloud inference (~1-2 seconds for full expert analysis).
- **Output**: Actionable "Spray/No-Spray" recommendations.

## 📝 License

MIT License — use freely for any purpose.
