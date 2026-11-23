import React, { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import "../style/landing.scss"

// ── Minimalist Inline SVGs (Clean, human-designed, zero external bloat) ─────
const IconSparkles = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
  </svg>
)

const IconCode = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
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
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const IconFileText = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const IconLightbulb = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
)

const IconTarget = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

// ── Realistic, Human-Curated Role Examples ──────────────────────────────────
const ROLE_PREVIEWS = {
  data_analyst: {
    id: "data_analyst",
    roleLabel: "Data Analyst",
    companyContext: "Fintech & Product Analytics",
    matchScore: 84,
    skillsMatched: ["SQL (Window Functions)", "Python (Pandas)", "Data Cleaning", "Tableau / BI"],
    focusGap: {
      topic: "A/B Testing & Statistical Significance",
      note: "Review sample size calculations, p-value thresholds, and variance reduction methods."
    },
    techQuestion: {
      title: "SQL Query Optimization on 10M+ Row Datasets",
      prompt: "How would you optimize a slow query containing multiple JOINs and a subquery over 10M transaction records?",
      interviewerFocus: "Checks practical query execution knowledge (EXPLAIN ANALYZE), index coverage, and CTE vs subquery memory overhead.",
      modelAnswer: "Start with EXPLAIN to identify full-table scans. Eliminate correlated subqueries by converting them to CTEs or window functions, ensure composite indexes cover foreign keys, and pre-aggregate time-series data."
    },
    starScenario: {
      title: "Resolving Conflicting Data with Business Stakeholders",
      prompt: "Describe a situation where your data analysis contradicted what department leadership expected.",
      situationTask: "Leadership believed a marketing campaign had boosted new user conversion by 25%, but overall revenue remained stagnant.",
      actionResult: "I built a cohort-level funnel analysis isolating duplicate account redemptions. Presented clear charts to the VP, saving $40k/mo in promo leakages."
    },
    roadmapPreview: {
      day1Focus: "Advanced SQL Drills: Window functions (ROW_NUMBER, DENSE_RANK, LAG/LEAD) & CTE transformations.",
      days2to7: [
        { day: 2, topic: "Pandas Data Cleaning & Aggregations" },
        { day: 3, topic: "A/B Testing & Statistical Rigor" },
        { day: 4, topic: "Product Metrics (LTV, CAC, Churn)" },
        { day: 5, topic: "Behavioral STAR Rehearsals" },
        { day: 6, topic: "Mock Case Study Drill" },
        { day: 7, topic: "Final Review & Cheat Sheet" }
      ]
    }
  },

  fullstack: {
    id: "fullstack",
    roleLabel: "Full-Stack SDE",
    companyContext: "High-Growth SaaS Platform",
    matchScore: 88,
    skillsMatched: ["React 18 Hooks", "Node.js / Express", "MongoDB / PostgreSQL", "REST APIs"],
    focusGap: {
      topic: "Distributed Caching & Race Conditions",
      note: "Brush up on Redis locks, idempotency keys, and concurrent database write patterns."
    },
    techQuestion: {
      title: "React Component Tree Optimization",
      prompt: "How do you systematically prevent unnecessary re-renders in a complex React dashboard without littering useMemo everywhere?",
      interviewerFocus: "Assesses component composition instincts, state colocation, context splitting, and profiling with React DevTools.",
      modelAnswer: "Colocate state as close as possible to leaf consumers. Pass components via children props so wrappers re-render without evaluating children, and split monolithic context into granular state and dispatch slices."
    },
    starScenario: {
      title: "Triaging a Production Incident Under Pressure",
      prompt: "Walk me through an unexpected production bug that happened right before a release.",
      situationTask: "Checkout transactions were sporadically double-charging customers during high-concurrency peak hours.",
      actionResult: "Traced it to missing idempotency validation. Added an Idempotency-Key header on the client and acquired a distributed Redis lock per checkout request."
    },
    roadmapPreview: {
      day1Focus: "State Architecture: Custom React hooks, memoization boundaries, and debounce patterns.",
      days2to7: [
        { day: 2, topic: "Async Node.js Event Loop & Streams" },
        { day: 3, topic: "Database Indexing & Query Plans" },
        { day: 4, topic: "System Design: Rate Limiting & Auth" },
        { day: 5, topic: "Behavioral STAR Scenarios" },
        { day: 6, topic: "Full-Stack Mock Coding Challenge" },
        { day: 7, topic: "Resume Alignment & Final Polish" }
      ]
    }
  },

  backend: {
    id: "backend",
    roleLabel: "Backend & Systems",
    companyContext: "Distributed Architecture & Cloud",
    matchScore: 82,
    skillsMatched: ["REST & gRPC", "PostgreSQL / Redis", "Docker & Kubernetes", "JWT Auth"],
    focusGap: {
      topic: "Message Queues & Eventual Consistency",
      note: "Prepare for questions on idempotency, dead-letter queues, and Kafka consumer group rebalancing."
    },
    techQuestion: {
      title: "Designing a Distributed Rate Limiter",
      prompt: "How would you design a rate-limiting service capable of handling 50,000 requests/sec across 15 server instances?",
      interviewerFocus: "Evaluates algorithms (Token Bucket vs Sliding Window), centralized caching tradeoffs, and atomic operations.",
      modelAnswer: "Use Redis with a sliding window log or token bucket algorithm executed via atomic Lua scripts. This eliminates race conditions across instances while maintaining sub-millisecond check latency."
    },
    starScenario: {
      title: "Pushing Back on Unscalable Requirements",
      prompt: "Have you ever negotiated technical scope when a requested feature threatened system stability?",
      situationTask: "Product wanted real-time user activity telemetry streamed on every mouse click, which would 10x API load.",
      actionResult: "Proposed client-side batching with 5-second flushes. Cut projected server compute costs by 80% while capturing 99.8% of necessary metrics."
    },
    roadmapPreview: {
      day1Focus: "Concurrency & Caching: Sliding window algorithms, Redis data structures, and connection pooling.",
      days2to7: [
        { day: 2, topic: "Database Partitioning & Replication" },
        { day: 3, topic: "Asynchronous Pipelines (Queues/Workers)" },
        { day: 4, topic: "System Design: High Availability APIs" },
        { day: 5, topic: "STAR Leadership & Tradeoff Questions" },
        { day: 6, topic: "Live Coding Sandbox: LeetCode Mediums" },
        { day: 7, topic: "Mock Technical Deep-Dive" }
      ]
    }
  },

  ai_engineer: {
    id: "ai_engineer",
    roleLabel: "AI & ML Specialist",
    companyContext: "Applied AI & GenAI Systems",
    matchScore: 90,
    skillsMatched: ["Python 3", "Gemini / OpenAI APIs", "RAG & Vector Embeddings", "Prompt Design"],
    focusGap: {
      topic: "Production LLM Guardrails & Evals",
      note: "Focus on automated output evaluations, schema adherence, and semantic cache hit rates."
    },
    techQuestion: {
      title: "Eliminating Hallucinations in Production RAG",
      prompt: "How do you guarantee that an LLM returns strictly structured JSON conforming to your database schema without dropping fields?",
      interviewerFocus: "Tests practical production experience over simple API wrappers—prompt anchoring, JSON mode, and schema validators.",
      modelAnswer: "Enforce JSON schema constraints at the API level (response_mime_type: 'application/json'), provide clear few-shot input-output examples, and pass responses through Zod/Pydantic validation with automated re-try."
    },
    starScenario: {
      title: "Managing Hallucinations in Customer-Facing AI",
      prompt: "Tell me about an instance where an AI model outputted unreliable responses and how you resolved it.",
      situationTask: "Our document assistant was generating plausible but factually incorrect numbers on financial PDF summaries.",
      actionResult: "Implemented strict chunk reranking and added a citation-verifier agent that cross-checks extracted numbers against source tables."
    },
    roadmapPreview: {
      day1Focus: "RAG Architecture: Chunking strategies, embedding distance metrics, and vector DB indexing.",
      days2to7: [
        { day: 2, topic: "Structured Output Extraction & Zod" },
        { day: 3, topic: "Evaluation Frameworks & Benchmarks" },
        { day: 4, topic: "System Design: Low-Latency AI Pipelines" },
        { day: 5, topic: "STAR Behavioral Rehearsals" },
        { day: 6, topic: "Coding Sandbox: Python Algorithms" },
        { day: 7, topic: "Final Interview Strategy Review" }
      ]
    }
  }
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Interactive Live Demo Tab States
  const [selectedRoleKey, setSelectedRoleKey] = useState("data_analyst")
  const [activeTab, setActiveTab] = useState("technical") // 'technical' | 'star' | 'roadmap'

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
            <a href="#preview" className="lp-nav__link">Live Blueprint</a>
            <a href="#how-it-works" className="lp-nav__link">How It Works</a>
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
            <span>PERSONALIZED INTERVIEW INTELLIGENCE</span>
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

        {/* ── REFINED HUMAN-DESIGNED PREVIEW CARD ──────────────────────── */}
        <div className="lp-hero__preview-wrapper" id="preview">
          <div className="lp-preview-card">
            
            {/* 1. Sleek Segmented Role Control */}
            <div className="lp-card-segmented-bar">
              <span className="lp-segmented-label">Previewing Strategy For:</span>
              <div className="lp-segmented-control">
                {Object.values(ROLE_PREVIEWS).map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={`lp-segment-btn ${selectedRoleKey === role.id ? "lp-segment-btn--active" : ""}`}
                    onClick={() => setSelectedRoleKey(role.id)}
                  >
                    {role.roleLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Cohesive Role Summary Header */}
            <div className="lp-card-header-row">
              <div className="lp-card-header-left">
                <span className="lp-card-eyebrow">TARGET PROFILE SPECIFICATION</span>
                <h3 className="lp-card-role-title">
                  {currentRole.roleLabel}
                  <span className="lp-card-company-tag">@ {currentRole.companyContext}</span>
                </h3>
                <div className="lp-skills-inline">
                  <span className="lp-skills-label">Matched Skills:</span>
                  {currentRole.skillsMatched.map((skill, idx) => (
                    <span key={idx} className="lp-skill-chip">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Elegant Inline Match Score Pill */}
              <div className="lp-card-header-right">
                <div className="lp-match-pill">
                  <div className="lp-match-pill__ring">
                    <svg viewBox="0 0 36 36" className="lp-circular-chart">
                      <path
                        className="lp-circle-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="lp-circle"
                        strokeDasharray={`${currentRole.matchScore}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="lp-match-pill__num">{currentRole.matchScore}%</span>
                  </div>
                  <div className="lp-match-pill__txt">
                    <span className="lp-match-pill__status">Profile Match</span>
                    <span className="lp-match-pill__caption">Strong Alignment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Thoughtful, Subtle Focus Area Callout (Replaced loud orange box) */}
            <div className="lp-focus-callout">
              <div className="lp-focus-callout__icon">
                <IconLightbulb />
              </div>
              <div className="lp-focus-callout__body">
                <div className="lp-focus-callout__header">
                  <span className="lp-focus-title">Priority Focus Area: <strong>{currentRole.focusGap.topic}</strong></span>
                  <span className="lp-focus-tag">Recommended Prep</span>
                </div>
                <p className="lp-focus-desc">{currentRole.focusGap.note}</p>
              </div>
            </div>

            {/* 4. Elegant Minimalist View Switcher */}
            <div className="lp-content-nav">
              <button
                type="button"
                className={`lp-content-nav-btn ${activeTab === "technical" ? "lp-content-nav-btn--active" : ""}`}
                onClick={() => setActiveTab("technical")}
              >
                <IconCode />
                <span>Technical Interview Question</span>
              </button>
              <button
                type="button"
                className={`lp-content-nav-btn ${activeTab === "star" ? "lp-content-nav-btn--active" : ""}`}
                onClick={() => setActiveTab("star")}
              >
                <IconFileText />
                <span>STAR Behavioral Scenario</span>
              </button>
              <button
                type="button"
                className={`lp-content-nav-btn ${activeTab === "roadmap" ? "lp-content-nav-btn--active" : ""}`}
                onClick={() => setActiveTab("roadmap")}
              >
                <IconCalendar />
                <span>7-Day Preparation Roadmap</span>
              </button>
            </div>

            {/* 5. Cohesive Content Body with Balanced Symmetrical Panels */}
            <div className="lp-card-content-body">
              {activeTab === "technical" && (
                <div className="lp-tab-content">
                  <div className="lp-question-header">
                    <span className="lp-topic-badge">{currentRole.techQuestion.title}</span>
                    <h4 className="lp-main-question">"{currentRole.techQuestion.prompt}"</h4>
                  </div>

                  {/* Symmetrical Two-Column Panels */}
                  <div className="lp-symmetrical-grid">
                    <div className="lp-insight-panel">
                      <div className="lp-panel-header">
                        <IconTarget />
                        <span>WHAT THE INTERVIEWER IS EVALUATING</span>
                      </div>
                      <p className="lp-panel-text">{currentRole.techQuestion.interviewerFocus}</p>
                    </div>

                    <div className="lp-insight-panel">
                      <div className="lp-panel-header">
                        <IconSparkles />
                        <span>RECOMMENDED ANSWERING STRATEGY</span>
                      </div>
                      <p className="lp-panel-text">{currentRole.techQuestion.modelAnswer}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "star" && (
                <div className="lp-tab-content">
                  <div className="lp-question-header">
                    <span className="lp-topic-badge lp-topic-badge--warm">{currentRole.starScenario.title}</span>
                    <h4 className="lp-main-question">"{currentRole.starScenario.prompt}"</h4>
                  </div>

                  {/* Symmetrical STAR Two-Column Panels */}
                  <div className="lp-symmetrical-grid">
                    <div className="lp-insight-panel">
                      <div className="lp-panel-header">
                        <span>SITUATION & TASK</span>
                      </div>
                      <p className="lp-panel-text">{currentRole.starScenario.situationTask}</p>
                    </div>

                    <div className="lp-insight-panel">
                      <div className="lp-panel-header">
                        <span>ACTION & MEASURABLE RESULT</span>
                      </div>
                      <p className="lp-panel-text">{currentRole.starScenario.actionResult}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "roadmap" && (
                <div className="lp-tab-content">
                  <div className="lp-roadmap-container">
                    <div className="lp-day1-highlight">
                      <div className="lp-day1-badge">DAY 1 ACTION</div>
                      <div className="lp-day1-details">
                        <h5>Immediate High-Yield Focus</h5>
                        <p>{currentRole.roadmapPreview.day1Focus}</p>
                      </div>
                    </div>

                    <div className="lp-remaining-days-grid">
                      {currentRole.roadmapPreview.days2to7.map((item) => (
                        <div key={item.day} className="lp-day-card">
                          <span className="lp-day-card__num">Day {item.day}</span>
                          <span className="lp-day-card__topic">{item.topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Clean, Harmonious Footer Action */}
            <div className="lp-card-footer">
              <span className="lp-card-footer-msg">Want this personalized for your authentic resume and target company?</span>
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
          <span className="lp-role-tag">Frontend (React / TypeScript)</span>
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
            <span>BUILT WITH RIGOR</span>
          </div>
          <h2 className="lp-section-heading">Everything You Need to Ace Your Next Round.</h2>
          <p className="lp-section-sub">
            Built from scratch to turn messy job descriptions into structured, actionable interview mastery.
          </p>
        </div>

        <div className="lp-bento-grid">
          {/* Card 1: Resume vs JD Match & Skill Gap Radar */}
          <div className="lp-bento-card lp-bento-card--large">
            <div className="lp-bento-icon">
              <IconTarget />
            </div>
            <span className="lp-bento-tag">PROFILE ALIGNMENT</span>
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
            <div className="lp-bento-icon">
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
            <div className="lp-bento-icon">
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
            <div className="lp-bento-icon">
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
