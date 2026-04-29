🚀 AI Job Prep Pro — Full Stack Gen AI Job Preparation Platform
A production-ready, full stack web application that empowers job seekers to leverage the power of Generative AI for smarter job preparation. Upload your resume, analyze job descriptions, detect skill gaps, generate personalized interview questions, and download an ATS-optimized resume — all in one place.
Built with React, Node.js, Google Gemini AI, JWT Authentication, and Puppeteer — this project is a complete real-world SaaS-grade product with end-to-end AI-powered features.

🌟 Live Demo

🔗 Coming Soon — Star this repo to get notified when it goes live!


📸 Project Flow
┌──────────────────────────────────────────────────────────────────────┐
│                        AI JOB PREP PRO                               │
│                                                                      │
│   👤 User        📄 Resume         🤖 Gemini AI       📝 Output      │
│   ───────   →   ──────────   →   ────────────   →   ──────────      │
│   Sign Up        Upload &          Analyze JD         Interview      │
│   / Login        Parse             Skill Gap          Questions +    │
│                  Resume            Detection          ATS Resume     │
│                                                          ↓           │
│                                                   🕷️ Puppeteer       │
│                                                   PDF Export         │
└──────────────────────────────────────────────────────────────────────┘

✨ Features

🔐 JWT Authentication — Secure signup/login with token-based auth & protected routes
📄 Resume Upload & Parsing — Upload PDF/DOCX and extract skills, experience, education automatically
📋 Job Description Analysis — Paste any JD and let AI extract required skills & keywords
🎯 Skill Gap Detection — AI compares your resume with the JD and pinpoints exactly what you're missing
🤖 AI-Powered Interview Questions — Gemini AI generates role-specific technical + behavioral questions
📝 ATS-Optimized Resume Generator — Auto-generates a professionally formatted, ATS-friendly resume tailored to the JD
🕷️ Puppeteer PDF Export — Download your AI-generated resume as a clean, print-ready PDF
⚡ RESTful API Backend — Modular, scalable Node.js/Express API with proper error handling & validation


🛠️ Tech Stack
LayerTechnologyFrontendReact.js, Tailwind CSS, AxiosBackendNode.js, Express.jsAI EngineGoogle Gemini AI APIAuthJWT (JSON Web Tokens), bcryptPDF EnginePuppeteer (Headless Chrome)Resume Parsepdf-parse, mammoth (DOCX)File UploadMulterEnvironmentdotenv, cors, helmet

🎯 What You'll Learn

✅ Full Stack application architecture from scratch (React + Node.js)
✅ Integrating Google Gemini AI API in a real-world app
✅ JWT-based authentication flow with protected middleware
✅ Resume parsing from PDF and DOCX formats
✅ Advanced prompt engineering for structured AI outputs
✅ PDF generation using headless browser (Puppeteer)
✅ ATS optimization logic & keyword matching
✅ File upload handling with Multer middleware
✅ Building production-grade REST APIs with proper validation


📁 Project Structure
ai-job-prep-pro/
│
├── client/                        # React Frontend
│   ├── public/
│   └── src/
│       ├── components/            # Reusable UI components
│       ├── pages/                 # Login, Dashboard, Resume, Interview
│       ├── context/               # Auth context (JWT)
│       ├── services/              # Axios API calls
│       └── App.jsx
│
├── server/                        # Node.js Backend
│   ├── controllers/               # Auth, Resume, AI, PDF controllers
│   ├── routes/                    # API route definitions
│   ├── middleware/                 # JWT auth middleware
│   ├── services/                  # Gemini AI & Puppeteer services
│   ├── uploads/                   # Temp resume storage
│   └── index.js
│
├── .env.example
├── README.md
└── package.json

🚀 Getting Started
Prerequisites

Node.js v18+
Google Gemini API Key → Get it here
npm or yarn

Installation
bash# Clone the repo
git clone https://github.com/YOUR_USERNAME/ai-job-prep-pro.git

# Go into the project folder
cd ai-job-prep-pro

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
Environment Setup
bash# In the server folder, create your .env file
cp .env.example .env
Add the following to your .env file:
envPORT=5000
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key_here
Run the App
bash# Run backend (from /server)
npm run dev

# Run frontend (from /client)
npm start

App will be running at http://localhost:3000 🎉


🔌 API Endpoints
MethodEndpointDescriptionAuth RequiredPOST/api/auth/registerRegister a new user❌
POST/api/auth/loginLogin and get JWT token❌
POST/api/resume/uploadUpload and parse resume✅
POST/api/ai/analyzeAnalyze JD + detect skill gaps✅
POST/api/ai/interview-questionsGenerate interview questions✅
POST/api/ai/generate-resumeGenerate ATS-optimized resume text✅
GET/api/resume/download-pdfDownload resume as PDF✅

🤖 How the AI Works
1. User uploads Resume (PDF / DOCX)
        ↓
2. Server extracts raw text using pdf-parse / mammoth
        ↓
3. User pastes Job Description
        ↓
4. Gemini AI receives → Resume Text + JD Text
   Prompt: "Compare resume with JD, find skill gaps,
            generate interview questions, create ATS resume"
        ↓
5. Structured JSON response returned to frontend
        ↓
6. Puppeteer renders HTML resume → exports as clean PDF

💡 Why This Project Stands Out
FeatureThis ProjectMost TutorialsReal JWT Auth with Middleware✅
Actual Resume Parsing (PDF/DOCX)✅
Gemini AI with Prompt Engineering✅
ATS Resume Auto-Generation✅
PDF Export via Puppeteer✅
Skill Gap Detection Logic✅
Production Folder Structure✅
