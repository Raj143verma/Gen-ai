import React, { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import "../style/landing.scss"

// ── Minimalist Inline SVGs (Zero external icon dependencies) ────────────────
const IconSparkles = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
  </svg>
)

const IconCode = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const IconDatabase = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
)

const IconFileText = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const IconShieldAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const IconDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

// ── Genuine Interactive Preview Data Across Multiple Roles ─────────────────
const ROLE_PREVIEWS = {
  data_analyst: {
    id: "data_analyst",
    roleLabel: "Data Analyst",
    badge: "Analytics & SQL Specialist",
    targetCompany: "Product & Fintech Company",
    matchScore: 84,
    scoreVerdict: "Strong Profile Match — 2 Key Gaps to Patch",
    matchedSkills: ["SQL (Window Functions)", "Python (Pandas)", "Data Cleaning", "Tableau / BI Dashboards"],
    skillGap: {
      skill: "A/B Testing & Statistical Significance",
      severity: "High",
      advice: "Review p-value thresholds, sample size calculation, and metric drift before round 2."
    },
    techQuestion: {
      q: "How would you optimize a slow-running SQL query with multiple JOINs and a subquery over 10M rows?",
      intention: "Evaluates understanding of query execution plans (EXPLAIN), indexing strategies, and CTE/temp table performance.",
      answerSnippet: "Inspect the EXPLAIN plan to check for full table scans. Replace correlated subqueries with CTEs or window functions, verify composite indexes on foreign keys, and pre-aggregate data where possible."
    },
    starQuestion: {
      q: "Describe a situation where the data contradicted what business stakeholders expected.",
      situation: "Marketing claimed a 30% conversion jump from a new campaign, but bottom-line revenue remained flat.",
      action: "I segmented the funnel by cohort and uncovered that users were creating duplicate accounts to claim promo credits.",
      result: "Presented findings with clear Tableau charts; prevented $45k in fraudulent coupon burns."
    },
    dayOneTask: "Day 1 Drill: Practice 5 SQL window functions (ROW_NUMBER, DENSE_RANK, LAG/LEAD) & CTE aggregations."
  },

  fullstack: {
    id: "fullstack",
    roleLabel: "Full-Stack SDE",
    badge: "React & Node.js Engineer",
    targetCompany: "Fast-Paced SaaS Startup",
    matchScore: 88,
    scoreVerdict: "Ready for Technical Screening",
    matchedSkills: ["React 18 Hooks", "Node.js / Express", "MongoDB Atlas", "RESTful API Architecture"],
    skillGap: {
      skill: "Redis Caching & Race Conditions",
      severity: "Medium",
      advice: "Practice implementing token-bucket rate limiting and handling concurrent checkout requests."
    },
    techQuestion: {
      q: "How do you prevent unnecessary re-renders in a deeply nested React component tree without overusing useMemo?",
      intention: "Tests real architectural intuition around component composition, state colocation, and Context API pitfalls.",
      answerSnippet: "Colocate state as close to leaves as possible. Lift content up via children props so wrappers re-render without re-executing children. Use granular context slices or external stores instead of a giant monolithic context."
    },
    starQuestion: {
      q: "Tell me about a production bug that happened under a critical deadline.",
      situation: "A race condition during midnight peak traffic was causing duplicate charges on checkout.",
      action: "Added an idempotency key header on the client and acquired a distributed Redis lock per user transaction.",
      result: "Fixed and deployed with zero data loss; customer support tickets dropped by 100% within 1 hour."
    },
    dayOneTask: "Day 1 Drill: Code an in-browser debounce hook & test component lifecycle under rapid state updates."
  },

  backend: {
    id: "backend",
    roleLabel: "Backend & Systems",
    badge: "Distributed Systems & API Architect",
    targetCompany: "High-Scale Tech Enterprise",
    matchScore: 82,
    scoreVerdict: "Solid Core Knowledge — System Design Focus Needed",
    matchedSkills: ["REST & GraphQL", "PostgreSQL / MongoDB", "Docker & Microservices", "JWT & Auth"],
    skillGap: {
      skill: "Message Queues & Eventual Consistency",
      severity: "High",
      advice: "Be prepared to design idempotent message consumers with dead-letter queues (Kafka/RabbitMQ)."
    },
    techQuestion: {
      q: "Explain how you would design a distributed rate limiter that works across 10 API instances.",
      intention: "Assesses knowledge of centralized state, sliding window algorithms, and Redis concurrency.",
      answerSnippet: "Use Redis with a Lua script implementing the Token Bucket or Sliding Window Log algorithm. The atomic Lua execution ensures consistency across distributed servers without race conditions."
    },
    starQuestion: {
      q: "Have you ever had to push back on a product feature request due to scalability constraints?",
      situation: "Product requested real-time user activity tracking across all pages, which would 10x API load.",
      action: "Proposed batching telemetry events in the browser and sending bulk payloads every 5 seconds or on page unload.",
      result: "Reduced projected server compute costs by 80% while still capturing 99.8% of required analytics."
    },
    dayOneTask: "Day 1 Drill: Diagram rate-limiter architecture & code a token bucket algorithm in Python/JS."
  },

  ai_engineer: {
    id: "ai_engineer",
    roleLabel: "AI & ML Specialist",
    badge: "LLM & Predictive Models",
    targetCompany: "AI-First Products & Research",
    matchScore: 90,
    scoreVerdict: "Exceptional Alignment with Modern Generative AI",
    matchedSkills: ["Python 3", "Gemini / OpenAI API", "Vector Embeddings & RAG", "Prompt Engineering"],
    skillGap: {
      skill: "LLM Output Evaluation & Guardrails",
      severity: "Medium",
      advice: "Familiarize yourself with semantic similarity metrics and defensive prompt injection guards."
    },
    techQuestion: {
      q: "How do you reduce hallucination and ensure structured JSON responses from LLMs in production?",
      intention: "Verifies practical production engineering vs purely theoretical machine learning knowledge.",
      answerSnippet: "Use strict schema enforcement (like Zod or response_mime_type: 'application/json'), implement Few-Shot prompt anchors, and run automated post-generation validation before returning data to the UI."
    },
    starQuestion: {
      q: "Tell me about a time an AI feature produced unexpected or biased outputs.",
      situation: "Our summarizer was occasionally dropping crucial monetary figures from legal contract summaries.",
      action: "Created a dedicated extraction validator agent that cross-checks entity tables before finalizing.",
      result: "Accuracy reached 99.4%, passing compliance audit for enterprise rollout."
    },
    dayOneTask: "Day 1 Drill: Build a quick RAG pipeline script and measure latency vs accuracy with chunk sizes."
  }
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Interactive Live Demo Tab States
  const [selectedRoleKey, setSelectedRoleKey] = useState("data_analyst")
  const [activePreviewView, setActivePreviewView] = useState("technical") // 'technical' | 'star' | 'roadmap'

  const currentRole = ROLE_PREVIEWS[selectedRoleKey]

  const handleCta = () => {
    if (user) {
      navigate("/home")
    } else {
      navigate("/register")
    }
  }

  return (
    <div className="landing-page">
      {/* ── Background Subtle Mesh Texture ───────────────────────────── */}
      <div className="lp-mesh" aria-hidden="true" />
      <div className="lp-ambient-glow" aria-hidden="true" />

      {/* ── Sticky Modern Navigation ──────────────────────────────────── */}
      <header className="lp-nav">
        <div className="lp-nav__inner">
          <div className="lp-brand" onClick={() => navigate("/")}>
            <div className="lp-brand__glyph">
              <IconSparkles />
            </div>
            <div className="lp-brand__text">
              <span className="lp-brand__name">Intervue<span className="lp-brand__dot">.AI</span></span>
            </div>
          </div>

          <nav className="lp-nav__links">
            <a href="#how-it-works" className="lp-nav__link">How It Works</a>
            <a href="#preview" className="lp-nav__link">Live Blueprint Preview</a>
            <a href="#features" className="lp-nav__link">Features</a>
            <a href="#roles" className="lp-nav__link">Supported Roles</a>
          </nav>

          <div className="lp-nav__actions">
            <div className="lp-status-pill">
              <span className="lp-status-dot" />
              <span className="lp-status-text">Powered by Gemini AI</span>
            </div>

            {user ? (
              <button type="button" className="lp-btn lp-btn--primary" onClick={() => navigate("/home")}>
                <span>Open Workspace</span>
                <IconArrowRight />
              </button>
            ) : (
              <>
                <button type="button" className="lp-btn lp-btn--ghost" onClick={() => navigate("/login")}>
                  Log In
                </button>
                <button type="button" className="lp-btn lp-btn--primary" onClick={() => navigate("/register")}>
                  <span>Get Started Free</span>
                  <IconArrowRight />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero__content">
          <div className="lp-kicker">
            <IconSparkles />
            <span>AI-POWERED INTERVIEW INTELLIGENCE • ZERO GENERIC GUESSWORK</span>
          </div>

          <h1 className="lp-hero__title">
            Stop Guessing What Interviewers Will Ask.
          </h1>

          <p className="lp-hero__subtitle">
            Upload your resume and paste your target Job Description. In 30 seconds, get a tailored 
            match score, real technical & STAR behavioral questions, skill gap alerts, and an actionable 7-day preparation roadmap.
          </p>

          <div className="lp-hero__ctas">
            <button type="button" className="lp-btn lp-btn--hero" onClick={handleCta}>
              <span>Generate My Interview Plan — Free</span>
              <IconArrowRight />
            </button>
            <a href="#preview" className="lp-btn lp-btn--outline">
              <span>Inspect Live Example Below</span>
            </a>
          </div>

          {/* Real Value Guarantees */}
          <div className="lp-hero__badges">
            <div className="lp-badge-item">
              <IconCheck />
              <span>Tailored to Your Exact JD</span>
            </div>
            <div className="lp-badge-item">
              <IconCheck />
              <span>SDE • Data Analyst • AI • DevOps</span>
            </div>
            <div className="lp-badge-item">
              <IconCheck />
              <span>Interactive Code & SQL Sandbox</span>
            </div>
            <div className="lp-badge-item">
              <IconCheck />
              <span>1-Click PDF Export</span>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE LIVE PRODUCT PREVIEW ─────────────────────────── */}
        <div className="lp-hero__preview-wrapper" id="preview">
          <div className="lp-preview-card">
            {/* Top Bar with Role Switcher */}
            <div className="lp-preview-card__header">
              <div className="lp-preview-card__title-box">
                <span className="lp-preview-card__label">INTERACTIVE PREVIEW: SELECT A ROLE</span>
                <span className="lp-preview-card__sublabel">See how the AI analyzes different profiles against real job descriptions</span>
              </div>

              {/* Role Select Pills */}
              <div className="lp-role-pills">
                {Object.values(ROLE_PREVIEWS).map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={`lp-role-pill ${selectedRoleKey === role.id ? "lp-role-pill--active" : ""}`}
                    onClick={() => setSelectedRoleKey(role.id)}
                  >
                    {role.roleLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Header Banner */}
            <div className="lp-preview-hero-row">
              <div className="lp-preview-role-info">
                <span className="lp-preview-badge">{currentRole.badge}</span>
                <h3 className="lp-preview-role-title">Target: {currentRole.roleLabel} @ {currentRole.targetCompany}</h3>
                <p className="lp-preview-score-sub">{currentRole.scoreVerdict}</p>
              </div>

              <div className="lp-preview-score-box">
                <div className="lp-preview-score-circle">
                  <span className="lp-preview-score-num">{currentRole.matchScore}%</span>
                  <span className="lp-preview-score-txt">Match Score</span>
                </div>
              </div>
            </div>

            {/* Skill Gap Alert Box */}
            <div className="lp-gap-alert">
              <div className="lp-gap-alert__icon">
                <IconShieldAlert />
              </div>
              <div className="lp-gap-alert__content">
                <div className="lp-gap-alert__title-row">
                  <span className="lp-gap-alert__title">Skill Gap Identified: <strong>{currentRole.skillGap.skill}</strong></span>
                  <span className="lp-gap-alert__severity">{currentRole.skillGap.severity} Priority</span>
                </div>
                <p className="lp-gap-alert__desc">{currentRole.skillGap.advice}</p>
              </div>
            </div>

            {/* Interactive View Tabs */}
            <div className="lp-view-tabs">
              <button
                type="button"
                className={`lp-view-tab ${activePreviewView === "technical" ? "lp-view-tab--active" : ""}`}
                onClick={() => setActivePreviewView("technical")}
              >
                <IconCode />
                <span>Technical Question</span>
              </button>
              <button
                type="button"
                className={`lp-view-tab ${activePreviewView === "star" ? "lp-view-tab--active" : ""}`}
                onClick={() => setActivePreviewView("star")}
              >
                <IconFileText />
                <span>STAR Behavioral Model</span>
              </button>
              <button
                type="button"
                className={`lp-view-tab ${activePreviewView === "roadmap" ? "lp-view-tab--active" : ""}`}
                onClick={() => setActivePreviewView("roadmap")}
              >
                <IconCalendar />
                <span>7-Day Prep Roadmap</span>
              </button>
            </div>

            {/* Tab Body View */}
            <div className="lp-preview-body">
              {activePreviewView === "technical" && (
                <div className="lp-preview-tab-pane">
                  <div className="lp-q-box">
                    <span className="lp-q-badge">Target Technical Question</span>
                    <h4 className="lp-q-text">{currentRole.techQuestion.q}</h4>
                  </div>
                  <div className="lp-eval-box">
                    <span className="lp-eval-label">What the Interviewer is Evaluating:</span>
                    <p className="lp-eval-text">{currentRole.techQuestion.intention}</p>
                  </div>
                  <div className="lp-ans-box">
                    <span className="lp-ans-label">Recommended Answering Strategy:</span>
                    <p className="lp-ans-text">{currentRole.techQuestion.answerSnippet}</p>
                  </div>
                </div>
              )}

              {activePreviewView === "star" && (
                <div className="lp-preview-tab-pane">
                  <div className="lp-q-box">
                    <span className="lp-q-badge lp-q-badge--star">Behavioral Question (STAR Framework)</span>
                    <h4 className="lp-q-text">{currentRole.starQuestion.q}</h4>
                  </div>
                  <div className="lp-star-grid">
                    <div className="lp-star-col">
                      <span className="lp-star-col__tag">S & T (Situation & Task)</span>
                      <p className="lp-star-col__text">{currentRole.starQuestion.situation}</p>
                    </div>
                    <div className="lp-star-col">
                      <span className="lp-star-col__tag">A & R (Action & Result)</span>
                      <p className="lp-star-col__text"><strong>Action:</strong> {currentRole.starQuestion.action}</p>
                      <p className="lp-star-col__text"><strong>Result:</strong> {currentRole.starQuestion.result}</p>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewView === "roadmap" && (
                <div className="lp-preview-tab-pane">
                  <div className="lp-roadmap-preview">
                    <div className="lp-roadmap-day">
                      <div className="lp-day-badge">Day 1 of 7</div>
                      <div className="lp-day-info">
                        <h5>Immediate High-Yield Focus</h5>
                        <p>{currentRole.dayOneTask}</p>
                      </div>
                    </div>
                    <div className="lp-roadmap-days-compact">
                      <div className="lp-day-chip">Day 2: Deep Dive</div>
                      <div className="lp-day-chip">Day 3: Sandbox Drills</div>
                      <div className="lp-day-chip">Day 4: System / Logic</div>
                      <div className="lp-day-chip">Day 5: Behavioral STAR</div>
                      <div className="lp-day-chip">Day 6: Gap Remediation</div>
                      <div className="lp-day-chip">Day 7: Full Mock</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Card Footer Action */}
            <div className="lp-preview-card__footer">
              <span className="lp-preview-card__footer-txt">Want this customized for YOUR resume & job description?</span>
              <button type="button" className="lp-btn lp-btn--primary lp-btn--sm" onClick={handleCta}>
                <span>Generate Plan for My Role →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUPPORTED ROLES BAR ───────────────────────────────────────── */}
      <section className="lp-roles-section" id="roles">
        <div className="lp-roles-header">
          <span>WORKS FOR ANY TECH DISCIPLINE</span>
        </div>
        <div className="lp-roles-container">
          <span className="lp-role-tag">Data Analysts & BI</span>
          <span className="lp-role-tag">Full-Stack SDE (MERN / Next.js)</span>
          <span className="lp-role-tag">Frontend (React / Vue / Angular)</span>
          <span className="lp-role-tag">Backend & Distributed APIs</span>
          <span className="lp-role-tag">AI, NLP & Machine Learning</span>
          <span className="lp-role-tag">Data Engineers & ETL</span>
          <span className="lp-role-tag">DevOps & Cloud Infrastructure</span>
          <span className="lp-role-tag">QA & Automation Engineers</span>
        </div>
      </section>

      {/* ── 4 GENUINE PRODUCTION-GRADE SUPERPOWERS (BENTO GRID) ───────── */}
      <section className="lp-features" id="features">
        <div className="lp-section-intro">
          <div className="lp-kicker">
            <IconSparkles />
            <span>WHAT MAKES IT GENUINE</span>
          </div>
          <h2 className="lp-section-heading">Everything You Need to Ace Your Next Round.</h2>
          <p className="lp-section-sub">
            Built from scratch to turn messy job descriptions into structured, actionable interview mastery.
          </p>
        </div>

        <div className="lp-bento-grid">
          {/* Card 1: Resume vs JD Match & Skill Gap Radar */}
          <div className="lp-bento-card lp-bento-card--large">
            <div className="lp-bento-icon lp-bento-icon--emerald">
              <IconShieldAlert />
            </div>
            <span className="lp-bento-tag">AI PROFILE ALIGNMENT</span>
            <h3 className="lp-bento-title">Resume vs. JD Match Score & Skill Gap Radar</h3>
            <p className="lp-bento-desc">
              Don't get caught off-guard. The AI analyzes your exact resume alongside the job requirements, 
              giving you a realistic 0-100% alignment score and highlighting high-risk technical gaps you need to review first.
            </p>
            <div className="lp-bento-spec-list">
              <div className="lp-spec-item"><IconCheck /><span>High, Medium, and Low severity skill gap classification</span></div>
              <div className="lp-spec-item"><IconCheck /><span>Exact missing keywords and technology mismatches highlighted</span></div>
              <div className="lp-spec-item"><IconCheck /><span>Actionable study advice for each missing requirement</span></div>
            </div>
          </div>

          {/* Card 2: Coding & SQL Practice Sandbox */}
          <div className="lp-bento-card">
            <div className="lp-bento-icon lp-bento-icon--blue">
              <IconCode />
            </div>
            <span className="lp-bento-tag">IN-BROWSER PRACTICE</span>
            <h3 className="lp-bento-title">Coding & SQL Sandbox</h3>
            <p className="lp-bento-desc">
              Practice questions directly inside the app with integrated templates for <strong>JavaScript</strong>, <strong>Python 3</strong>, and <strong>SQL</strong>.
            </p>
            <div className="lp-bento-spec-list">
              <div className="lp-spec-item"><IconCheck /><span>Live code editor with auto-indent</span></div>
              <div className="lp-spec-item"><IconCheck /><span>Instant sandbox execution & console feedback</span></div>
              <div className="lp-spec-item"><IconCheck /><span>AI Big-O Complexity evaluation</span></div>
            </div>
          </div>

          {/* Card 3: Role-Specific Behavioral STAR Models */}
          <div className="lp-bento-card">
            <div className="lp-bento-icon lp-bento-icon--amber">
              <IconFileText />
            </div>
            <span className="lp-bento-tag">BEHAVIORAL RIGOR</span>
            <h3 className="lp-bento-title">STAR Behavioral Question Prep</h3>
            <p className="lp-bento-desc">
              Behavioral rounds reject over 40% of qualified engineers. Get structured 
              <strong>Situation, Task, Action, Result</strong> frameworks customized to your career history.
            </p>
            <div className="lp-bento-spec-list">
              <div className="lp-spec-item"><IconCheck /><span>Minimum 5 high-frequency behavioral scenarios</span></div>
              <div className="lp-spec-item"><IconCheck /><span>Tailored to your past company scale & leadership</span></div>
              <div className="lp-spec-item"><IconCheck /><span>Practice verbally with built-in voice speech-to-text</span></div>
            </div>
          </div>

          {/* Card 4: 7-Day Roadmap & 1-Click PDF */}
          <div className="lp-bento-card lp-bento-card--large">
            <div className="lp-bento-icon lp-bento-icon--purple">
              <IconCalendar />
            </div>
            <span className="lp-bento-tag">STRUCTURED EXECUTION</span>
            <h3 className="lp-bento-title">7-Day Day-by-Day Preparation Plan & PDF Export</h3>
            <p className="lp-bento-desc">
              Stop panicking the night before. Receive a clear, 7-day checklist with 3 concrete daily tasks. 
              Track your daily progress and export your entire study guide as a clean PDF in one click.
            </p>
            <div className="lp-bento-spec-list">
              <div className="lp-spec-item"><IconCheck /><span>Day 1 to Day 7 progressive topic breakdown</span></div>
              <div className="lp-spec-item"><IconCheck /><span>Interactive task checkboxes with completion tracking</span></div>
              <div className="lp-spec-item"><IconCheck /><span>Instant, printer-ready PDF export for offline review</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (3 SIMPLE GENUINE STEPS) ─────────────────────── */}
      <section className="lp-pipeline-section" id="how-it-works">
        <div className="lp-section-intro">
          <div className="lp-kicker">
            <IconSparkles />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="lp-section-heading">Three Steps to Interview Readiness.</h2>
          <p className="lp-section-sub">Simple, fast, and completely focused on your specific job target.</p>
        </div>

        <div className="lp-pipeline-steps">
          <div className="lp-pipeline-step">
            <span className="lp-step-num">01</span>
            <div className="lp-step-content">
              <span className="lp-step-tag">INPUT DETAILS</span>
              <h4 className="lp-step-title">Upload Resume & Paste Job Description</h4>
              <p className="lp-step-desc">
                Drop your existing PDF or write a quick self-summary, then paste the job requirements from LinkedIn, Indeed, or the company careers page.
              </p>
            </div>
          </div>

          <div className="lp-pipeline-step">
            <span className="lp-step-num">02</span>
            <div className="lp-step-content">
              <span className="lp-step-tag">AI SYNTHESIS</span>
              <h4 className="lp-step-title">AI Compiles Your Custom Blueprint</h4>
              <p className="lp-step-desc">
                Gemini AI compares your background to the role requirements, calculates your match score, detects skill gaps, and prepares tailored interview questions with answers.
              </p>
            </div>
          </div>

          <div className="lp-pipeline-step">
            <span className="lp-step-num">03</span>
            <div className="lp-step-content">
              <span className="lp-step-tag">EXECUTION & MASTERY</span>
              <h4 className="lp-step-title">Practice, Code & Download Your PDF</h4>
              <p className="lp-step-desc">
                Solve coding and SQL questions in the sandbox, rehearse behavioral answers out loud, tick off your 7-day checklist, and download your complete PDF prep guide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HIGH CONVERSION CTA CARD ──────────────────────────────────── */}
      <section className="lp-cta-section">
        <div className="lp-cta-card">
          <div className="lp-cta-body">
            <span className="lp-cta-tag">GET STARTED TODAY</span>
            <h2 className="lp-cta-heading">Walk into your next interview knowing exactly what to expect.</h2>
            <p className="lp-cta-sub">
              Create your account in 10 seconds and generate your first custom interview strategy for free.
            </p>

            <div className="lp-cta-action-row">
              <button type="button" className="lp-btn lp-btn--hero" onClick={handleCta}>
                <span>Create My Custom Interview Plan — Free</span>
                <IconArrowRight />
              </button>
            </div>

            <div className="lp-cta-guarantees">
              <span>✔ 100% Free to Use</span>
              <span>✔ No Credit Card Required</span>
              <span>✔ Works for Any Tech Role</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer__top">
          <div className="lp-footer__brand">
            <div className="lp-brand">
              <div className="lp-brand__glyph"><IconSparkles /></div>
              <span className="lp-brand__name">Intervue<span className="lp-brand__dot">.AI</span></span>
            </div>
            <p className="lp-footer__bio">
              The personalized AI interview preparation platform helping engineers and analysts ace their technical and behavioral rounds.
            </p>
          </div>

          <div className="lp-footer__cols">
            <div className="lp-footer__col">
              <span className="lp-footer__col-title">NAVIGATION</span>
              <a href="#how-it-works">How It Works</a>
              <a href="#preview">Live Blueprint Preview</a>
              <a href="#features">Key Features</a>
              <a href="#roles">Supported Roles</a>
            </div>
            <div className="lp-footer__col">
              <span className="lp-footer__col-title">SUPPORTED ROLES</span>
              <span>Data Analyst & BI</span>
              <span>Full-Stack & React SDE</span>
              <span>Backend & Systems</span>
              <span>AI & Data Science</span>
            </div>
            <div className="lp-footer__col">
              <span className="lp-footer__col-title">TECH & PRIVACY</span>
              <span>Google Gemini AI</span>
              <span>Secure Session Auth</span>
              <span>MongoDB TLS</span>
              <span>Instant PDF Generation</span>
            </div>
          </div>
        </div>

        <div className="lp-footer__bottom">
          <span>© {new Date().getFullYear()} Intervue.AI. Built for ambitious candidates.</span>
          <span>All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
