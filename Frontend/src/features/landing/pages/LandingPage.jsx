import React, { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import "../style/landing.scss"

// ── Inline SVGs for zero dependency overhead ────────────────────────────────
const IconTerminal = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
)

const IconCode = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const IconMic = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
)

const IconFileDiff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="15" x2="15" y2="15" />
    <line x1="12" y1="12" x2="12" y2="18" />
  </svg>
)

const IconBarChart = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const IconCpu = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="14" x2="4" y2="14" />
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconPlay = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const IconArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const IconShield = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

// ── Interactive Terminal Mockup Snippets ────────────────────────────────────
const DEMO_SNIPPETS = {
  coding: {
    tabName: "solution.ts",
    badge: "O(N) Complexity Verified",
    code: `// LeetCode 146 - LRU Cache with O(1) Get/Put
class LRUCache {
  private capacity: number;
  private cache = new Map<number, number>();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, val); // Refresh recency
    return val;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      // Evict least recently used key
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }
}`,
    output: `[SANDBOX RUNTIME: Node v24.19 / V8 Engine]
✔ test_lru_operations: 4 ops completed in 0.8ms
✔ Memory Footprint: 2.1 MB (Heap allocated)
--------------------------------------------------
★ AI ENGINEERING VERDICT:
  • Time Complexity: O(1) amortized for Get & Put
  • Space Complexity: O(Capacity)
  • Boundary Conditions: Handled capacity=0 & eviction cycle`
  },

  ats_diff: {
    tabName: "ATS_Diff.json",
    badge: "18 Matched Keywords",
    code: `// Before vs After AST Bullet Transformation
{
  "section": "Experience: Senior Backend Engineer",
  "original": "Built microservices for checkout and improved database queries.",
  "optimized": "Architected low-latency microservices with Node.js & Redis caching, reducing p99 API response time by 42% across 50,000+ daily checkout transactions.",
  "impactAnalysis": {
    "actionVerb": "Architected (Score: 10/10)",
    "quantifiableMetric": "42% latency reduction & 50k DAU",
    "jdKeywordsInjected": ["Redis", "Microservices", "Latency", "p99 SLA"]
  }
}`,
    output: `[AST RESUME COMPILER]
✔ Strict 1-Page Vertical Budget Enforced (A4 Margin: 8mm)
✔ Matched Keywords: Kafka, Redis, Distributed Systems, Docker
✔ ATS Scannability Score: 94 / 100 (+26% jump from original)`
  },

  voice_stt: {
    tabName: "STAR_Voice.wav",
    badge: "Real-Time STT Stream",
    code: `// Real-Time Audio Telemetry (STAR Behavioral Analysis)
[00:03] S: "In my previous role at a fintech startup during peak festive sale..."
[00:11] T: "...the payment gateway experienced cascading 504 gateway timeouts."
[00:22] A: "I implemented a circuit breaker with Redis token bucket rate limiting,
          decoupled asynchronous webhooks with RabbitMQ, and added exponential backoff."
[00:39] R: "This restored 99.98% payment uptime and saved ~$85k in abandoned carts."`,
    output: `[DUAL-ENGINE SPEECH RECOGNITION]
✔ Pacing: 138 WPM (Optimal clarity)
✔ STAR Structural Score: 9.2 / 10
✔ Behavioral Competency: Crisis Leadership & Resilience`
  },

  telemetry: {
    tabName: "Readiness.telemetry",
    badge: "Composite Index: 88%",
    code: `// Multi-Pillar Candidate Telemetry Model
const CANDIDATE_READINESS = {
  profileMatchScore: 85,          // 35% Weight: Resume to JD alignment
  roadmapVelocity: 92,            // 25% Weight: 7-Day task completion
  technicalProblemSolving: 9.0,   // 25% Weight: Sandbox execution & Big-O
  skillGapMitigation: 88,         // 15% Weight: High-risk gaps neutralized
  
  compositeIndex: 88,
  readinessTier: "Tier 1: Interview Ready",
  clearanceProbability: "88% - 94%"
};`,
    output: `[HIRING COMMITTEE PREDICTION]
✔ Probability of Clearing Technical Deep-Dive: HIGH
✔ Top Skill Strengths: Low-latency REST, System Design, Concurrency
✔ Next Best Action: Final mock rehearsal on Behavioral conflict questions`
  }
}

// ── Target Roles Matrix ─────────────────────────────────────────────────────
const TARGET_ROLES = [
  {
    id: "fullstack",
    title: "Full-Stack SDE (MERN / Next.js)",
    matchScore: 88,
    keyStack: ["React 18", "Node.js", "MongoDB", "Redis", "TypeScript"],
    typicalTrap: "Race conditions in state & unindexed DB queries",
    targetComplexity: "O(N) Time / O(1) Space"
  },
  {
    id: "backend",
    title: "Backend & Distributed Systems",
    matchScore: 92,
    keyStack: ["Go / Java", "Kafka", "PostgreSQL", "Docker", "gRPC"],
    typicalTrap: "Distributed transactions & split-brain scenarios",
    targetComplexity: "O(log N) Index Search / O(1) Cache"
  },
  {
    id: "frontend",
    title: "Frontend Architect",
    matchScore: 86,
    keyStack: ["React Fiber", "TypeScript", "Core Web Vitals", "State Machines"],
    typicalTrap: "Excessive re-renders & memory leaks in long-lived SPAs",
    targetComplexity: "O(N) Tree Reconciliation"
  },
  {
    id: "ai",
    title: "AI Application & LLM Engineer",
    matchScore: 90,
    keyStack: ["Python", "Gemini API", "Vector Embeddings", "FastAPI", "LangChain"],
    typicalTrap: "Hallucination guards & token budget degradation",
    targetComplexity: "O(1) Streaming Latency"
  }
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Hero Terminal Tab State
  const [activeTab, setActiveTab] = useState("coding")
  const [isRunningSandbox, setIsRunningSandbox] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState(DEMO_SNIPPETS.coding.output)

  // Role Simulator State
  const [selectedRole, setSelectedRole] = useState(TARGET_ROLES[0])

  // Switch terminal tabs
  const handleTabSwitch = (tabKey) => {
    setActiveTab(tabKey)
    setTerminalOutput(DEMO_SNIPPETS[tabKey].output)
  }

  // Live "Run Sandbox" execution simulation in hero
  const handleRunDemoCode = () => {
    setIsRunningSandbox(true)
    setTerminalOutput("Compiling AST in isolated sandbox... running assertions...")
    setTimeout(() => {
      setTerminalOutput(DEMO_SNIPPETS[activeTab].output)
      setIsRunningSandbox(false)
    }, 700)
  }

  const handleCta = () => {
    if (user) {
      navigate("/home")
    } else {
      navigate("/register")
    }
  }

  return (
    <div className="landing-page">
      {/* ── Background Engineering Grid Mesh ─────────────────────────── */}
      <div className="lp-mesh" aria-hidden="true" />
      <div className="lp-ambient-glow" aria-hidden="true" />

      {/* ── Sticky Navigation Header ──────────────────────────────────── */}
      <header className="lp-nav">
        <div className="lp-nav__inner">
          <div className="lp-brand" onClick={() => navigate("/")}>
            <div className="lp-brand__glyph">
              <IconTerminal />
            </div>
            <div className="lp-brand__text">
              <span className="lp-brand__name">Intervue<span className="lp-brand__dot">.OS</span></span>
              <span className="lp-brand__badge">v2.4 Kernel</span>
            </div>
          </div>

          <nav className="lp-nav__links">
            <a href="#features" className="lp-nav__link">Features</a>
            <a href="#sandbox" className="lp-nav__link">Coding Sandbox</a>
            <a href="#readiness" className="lp-nav__link">Readiness Model</a>
            <a href="#pipeline" className="lp-nav__link">Architecture</a>
          </nav>

          <div className="lp-nav__actions">
            <div className="lp-status-pill">
              <span className="lp-status-dot" />
              <span className="lp-status-text">Puppeteer Engine Active</span>
            </div>

            {user ? (
              <button type="button" className="lp-btn lp-btn--primary" onClick={() => navigate("/home")}>
                <span>Workspace [{user.username || "Console"}]</span>
                <IconArrowRight />
              </button>
            ) : (
              <>
                <button type="button" className="lp-btn lp-btn--ghost" onClick={() => navigate("/login")}>
                  Sign In
                </button>
                <button type="button" className="lp-btn lp-btn--primary" onClick={() => navigate("/register")}>
                  <span>Initialize Free</span>
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
            <IconCpu />
            <span>DETERMINISTIC INTERVIEW INTELLIGENCE • GEMINI 2.5 FLASH</span>
          </div>

          <h1 className="lp-hero__title">
            The Technical Interview Operating System for Software Engineers.
          </h1>

          <p className="lp-hero__subtitle">
            Zero hand-wavy advice. Rigorous algorithmic coding sandboxes with Big-O runtime profiling,
            dual-engine voice STAR simulation, and deterministic 1-page ATS resume compilation.
          </p>

          <div className="lp-hero__ctas">
            <button type="button" className="lp-btn lp-btn--hero" onClick={handleCta}>
              <span>Launch Interview Console — Free</span>
              <IconArrowRight />
            </button>
            <a href="#sandbox" className="lp-btn lp-btn--outline">
              <IconPlay />
              <span>Inspect Live Sandbox</span>
            </a>
          </div>

          <div className="lp-hero__telemetry-bar">
            <div className="lp-telemetry-item">
              <span className="lp-telemetry-item__val">92.4%</span>
              <span className="lp-telemetry-item__label">Screening Pass Rate</span>
            </div>
            <div className="lp-telemetry-sep" />
            <div className="lp-telemetry-item">
              <span className="lp-telemetry-item__val">&lt; 350ms</span>
              <span className="lp-telemetry-item__label">Warm PDF Caching</span>
            </div>
            <div className="lp-telemetry-sep" />
            <div className="lp-telemetry-item">
              <span className="lp-telemetry-item__val">6 Runtimes</span>
              <span className="lp-telemetry-item__label">JS • TS • PY • JAVA • C++</span>
            </div>
            <div className="lp-telemetry-sep" />
            <div className="lp-telemetry-item">
              <span className="lp-telemetry-item__val">100%</span>
              <span className="lp-telemetry-item__label">Strict 1-Page A4 Budget</span>
            </div>
          </div>
        </div>

        {/* ── Interactive Hero Terminal Window ───────────────────────── */}
        <div className="lp-hero__terminal-window" id="sandbox">
          <div className="lp-term-chrome">
            <div className="lp-term-dots">
              <span className="lp-term-dot lp-term-dot--red" />
              <span className="lp-term-dot lp-term-dot--yellow" />
              <span className="lp-term-dot lp-term-dot--green" />
            </div>

            <div className="lp-term-tabs">
              <button
                type="button"
                className={`lp-term-tab ${activeTab === "coding" ? "lp-term-tab--active" : ""}`}
                onClick={() => handleTabSwitch("coding")}
              >
                <IconCode />
                <span>solution.ts</span>
              </button>
              <button
                type="button"
                className={`lp-term-tab ${activeTab === "ats_diff" ? "lp-term-tab--active" : ""}`}
                onClick={() => handleTabSwitch("ats_diff")}
              >
                <IconFileDiff />
                <span>ATS_Diff.json</span>
              </button>
              <button
                type="button"
                className={`lp-term-tab ${activeTab === "voice_stt" ? "lp-term-tab--active" : ""}`}
                onClick={() => handleTabSwitch("voice_stt")}
              >
                <IconMic />
                <span>Voice_STAR.wav</span>
              </button>
              <button
                type="button"
                className={`lp-term-tab ${activeTab === "telemetry" ? "lp-term-tab--active" : ""}`}
                onClick={() => handleTabSwitch("telemetry")}
              >
                <IconBarChart />
                <span>Readiness.telemetry</span>
              </button>
            </div>

            <div className="lp-term-action">
              <button
                type="button"
                className="lp-run-btn"
                onClick={handleRunDemoCode}
                disabled={isRunningSandbox}
              >
                <IconPlay />
                <span>{isRunningSandbox ? "Executing..." : "Run Sandbox [Ctrl+Enter]"}</span>
              </button>
            </div>
          </div>

          <div className="lp-term-body">
            <div className="lp-term-editor">
              <pre><code>{DEMO_SNIPPETS[activeTab].code}</code></pre>
            </div>
            <div className="lp-term-console">
              <div className="lp-term-console__header">
                <IconTerminal />
                <span>LIVE TELEMETRY OUTPUT</span>
                <span className="lp-term-badge">{DEMO_SNIPPETS[activeTab].badge}</span>
              </div>
              <pre className="lp-term-console__output">
                <code>{terminalOutput}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUPPORTED ROLES MARQUEE ───────────────────────────────────── */}
      <section className="lp-ticker-section">
        <div className="lp-ticker-label">OPTIMIZED FOR ENGINEERING ROLES AT TOP TECH ENTERPRISES</div>
        <div className="lp-ticker-track">
          <div className="lp-ticker-pill">Full-Stack MERN</div>
          <div className="lp-ticker-pill">Distributed Backend SDE</div>
          <div className="lp-ticker-pill">Frontend Architect</div>
          <div className="lp-ticker-pill">AI & LLM Application Engineer</div>
          <div className="lp-ticker-pill">Cloud Infrastructure & DevOps</div>
          <div className="lp-ticker-pill">Staff / Principal SDE</div>
          <div className="lp-ticker-pill">Platform Engineer</div>
          <div className="lp-ticker-pill">System Design Rounds</div>
        </div>
      </section>

      {/* ── 4 CORE ARCHITECTURAL SUPERPOWERS ──────────────────────────── */}
      <section className="lp-features" id="features">
        <div className="lp-section-intro">
          <div className="lp-kicker">
            <IconShield />
            <span>TECHNICAL SPECIFICATIONS</span>
          </div>
          <h2 className="lp-section-heading">Four Production-Grade Systems in One Platform.</h2>
          <p className="lp-section-sub">
            Built from scratch for engineers who demand depth, algorithmic profiling, and real measurable gains.
          </p>
        </div>

        <div className="lp-bento-grid">
          {/* Bento Card 1: Coding Sandbox */}
          <div className="lp-bento-card lp-bento-card--large">
            <div className="lp-bento-icon lp-bento-icon--blue">
              <IconCode />
            </div>
            <span className="lp-bento-tag">ALGORITHMIC RUNTIME PROFILING</span>
            <h3 className="lp-bento-title">In-Browser Code Execution & Big-O Auditor</h3>
            <p className="lp-bento-desc">
              Write solutions in JavaScript, TypeScript, Python, Java, C++, or SQL. Run code in a safe browser sandbox with sub-millisecond execution timers, captured console logs, and deep AI evaluation of Time/Space complexity.
            </p>
            <div className="lp-bento-spec-list">
              <div className="lp-spec-item"><IconCheck /><span>Smart Tab & Auto-Indent Preserved</span></div>
              <div className="lp-spec-item"><IconCheck /><span>Big-O Complexity (O(1), O(N), O(N log N))</span></div>
              <div className="lp-spec-item"><IconCheck /><span>Edge-Case Diagnostics (N=0, Duplicates, Overflow)</span></div>
              <div className="lp-spec-item"><IconCheck /><span>Optimized Reference Implementation Generator</span></div>
            </div>
          </div>

          {/* Bento Card 2: Voice STT */}
          <div className="lp-bento-card">
            <div className="lp-bento-icon lp-bento-icon--amber">
              <IconMic />
            </div>
            <span className="lp-bento-tag">BEHAVIORAL TELEMETRY</span>
            <h3 className="lp-bento-title">Dual-Engine Voice Practice (STAR)</h3>
            <p className="lp-bento-desc">
              Simulate actual verbal interview pressure. Web Speech API transcribes your answers in real-time with zero latency, backed by Gemini multi-modal fallback for noisy environments.
            </p>
            <div className="lp-bento-spec-list">
              <div className="lp-spec-item"><IconCheck /><span>Live Real-Time Speech-to-Text Typing</span></div>
              <div className="lp-spec-item"><IconCheck /><span>STAR Methodology Scoring (0-10)</span></div>
              <div className="lp-spec-item"><IconCheck /><span>Text-to-Speech Question Reader</span></div>
            </div>
          </div>

          {/* Bento Card 3: ATS Resume */}
          <div className="lp-bento-card">
            <div className="lp-bento-icon lp-bento-icon--purple">
              <IconFileDiff />
            </div>
            <span className="lp-bento-tag">AST COMPILER</span>
            <h3 className="lp-bento-title">1-Page ATS Resume & Visual Diff</h3>
            <p className="lp-bento-desc">
              Deterministic 1-page A4 vertical budgeting. Injects quantifiable impact metrics and target JD keywords into your authentic history without creating fake claims.
            </p>
            <div className="lp-bento-spec-list">
              <div className="lp-spec-item"><IconCheck /><span>Before vs After Visual Bullet Diff</span></div>
              <div className="lp-spec-item"><IconCheck /><span>ATS Keyword Match & Missing Highlighter</span></div>
              <div className="lp-spec-item"><IconCheck /><span>Warm Puppeteer Singleton (&lt;300ms PDF)</span></div>
            </div>
          </div>

          {/* Bento Card 4: Readiness Index */}
          <div className="lp-bento-card lp-bento-card--large">
            <div className="lp-bento-icon lp-bento-icon--emerald">
              <IconBarChart />
            </div>
            <span className="lp-bento-tag">PREDICTIVE ANALYTICS</span>
            <h3 className="lp-bento-title">Candidate Readiness Cockpit & 7-Day Velocity</h3>
            <p className="lp-bento-desc">
              Replace subjective feelings with objective telemetry. A weighted composite score combining profile alignment, daily roadmap velocity, coding performance, and skill gap mitigation.
            </p>
            <div className="lp-bento-spec-list">
              <div className="lp-spec-item"><IconCheck /><span>Weighted Readiness Index (0-100%)</span></div>
              <div className="lp-spec-item"><IconCheck /><span>High / Med / Low Severity Risk Heatmap</span></div>
              <div className="lp-spec-item"><IconCheck /><span>7-Day Actionable Burndown Roadmap</span></div>
              <div className="lp-spec-item"><IconCheck /><span>AI Interviewer "Next Best Actions" Engine</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE ROLE READINESS SIMULATOR ──────────────────────── */}
      <section className="lp-simulator-section" id="readiness">
        <div className="lp-section-intro">
          <div className="lp-kicker">
            <IconBarChart />
            <span>ROLE BENCHMARK SIMULATOR</span>
          </div>
          <h2 className="lp-section-heading">Inspect Your Target Role Requirements.</h2>
          <p className="lp-section-sub">Select your target engineering discipline to view benchmark criteria and high-frequency interview traps.</p>
        </div>

        <div className="lp-sim-container">
          <div className="lp-sim-tabs">
            {TARGET_ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`lp-sim-tab ${selectedRole.id === role.id ? "lp-sim-tab--active" : ""}`}
                onClick={() => setSelectedRole(role)}
              >
                {role.title}
              </button>
            ))}
          </div>

          <div className="lp-sim-card">
            <div className="lp-sim-card__header">
              <div>
                <span className="lp-sim-badge">Target Profile Architecture</span>
                <h3 className="lp-sim-title">{selectedRole.title}</h3>
              </div>
              <div className="lp-sim-score-box">
                <span className="lp-sim-score-val">{selectedRole.matchScore}%</span>
                <span className="lp-sim-score-label">Baseline Match</span>
              </div>
            </div>

            <div className="lp-sim-grid">
              <div className="lp-sim-block">
                <span className="lp-sim-block__label">CRITICAL STACK MAPPING</span>
                <div className="lp-sim-tags">
                  {selectedRole.keyStack.map((tech, i) => (
                    <span key={i} className="lp-sim-tag">{tech}</span>
                  ))}
                </div>
              </div>

              <div className="lp-sim-block">
                <span className="lp-sim-block__label">HIGH-FREQUENCY INTERVIEW TRAP</span>
                <p className="lp-sim-block__text">{selectedRole.typicalTrap}</p>
              </div>

              <div className="lp-sim-block">
                <span className="lp-sim-block__label">OPTIMAL RUNTIME COMPLEXITY TARGET</span>
                <p className="lp-sim-block__code">{selectedRole.targetComplexity}</p>
              </div>
            </div>

            <div className="lp-sim-footer">
              <span>Ready to generate your personalized 7-day blueprint for this role?</span>
              <button type="button" className="lp-btn lp-btn--primary" onClick={handleCta}>
                <span>Build My Blueprint →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURAL PIPELINE (HOW IT WORKS) ───────────────────────── */}
      <section className="lp-pipeline-section" id="pipeline">
        <div className="lp-section-intro">
          <div className="lp-kicker">
            <IconCpu />
            <span>EXECUTION LIFECYCLE</span>
          </div>
          <h2 className="lp-section-heading">How The Preparation Engine Operates.</h2>
          <p className="lp-section-sub">A 3-stage deterministic pipeline from raw resume PDF to offer-ready confidence.</p>
        </div>

        <div className="lp-pipeline-steps">
          <div className="lp-pipeline-step">
            <span className="lp-step-num">01</span>
            <div className="lp-step-content">
              <span className="lp-step-tag">INGESTION & AST PARSING</span>
              <h4 className="lp-step-title">Upload Resume & Target JD</h4>
              <p className="lp-step-desc">
                Your resume text and PDF buffer are parsed into structured abstract tokens. The target Job Description is analyzed for explicit dependencies, implicit system design expectations, and required competencies.
              </p>
            </div>
          </div>

          <div className="lp-pipeline-step">
            <span className="lp-step-num">02</span>
            <div className="lp-step-content">
              <span className="lp-step-tag">AI ANALYSIS & BLUEPRINT</span>
              <h4 className="lp-step-title">Generate 5 Tech + 5 Behavioral + 7-Day Plan</h4>
              <p className="lp-step-desc">
                Gemini 2.5 Flash evaluates your match score, flags severity-ranked skill gaps, drafts a tailored 1-page ATS resume, and structures an actionable daily checklist.
              </p>
            </div>
          </div>

          <div className="lp-pipeline-step">
            <span className="lp-step-num">03</span>
            <div className="lp-step-content">
              <span className="lp-step-tag">PRACTICE & TELEMETRY</span>
              <h4 className="lp-step-title">Solve in Sandbox & Track Readiness to 90%+</h4>
              <p className="lp-step-desc">
                Practice technical questions in the Code Editor with Big-O complexity feedback. Rehearse behavioral STAR questions with voice recognition. Watch your Readiness Index climb to Tier 1.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HIGH CONVERSION TERMINAL BANNER ────────────────────────────── */}
      <section className="lp-cta-section">
        <div className="lp-cta-card">
          <div className="lp-cta-terminal-header">
            <span className="lp-term-dot lp-term-dot--red" />
            <span className="lp-term-dot lp-term-dot--yellow" />
            <span className="lp-term-dot lp-term-dot--green" />
            <span className="lp-cta-terminal-title">bash - prep-session --init</span>
          </div>

          <div className="lp-cta-body">
            <h2 className="lp-cta-heading">Ready to Stop Interview Anxiety and Start Executing?</h2>
            <p className="lp-cta-sub">
              Upload your resume, paste your dream job description, and let Intervue.OS compile your complete technical blueprint in seconds.
            </p>

            <div className="lp-cta-action-row">
              <button type="button" className="lp-btn lp-btn--hero" onClick={handleCta}>
                <span>Initialize Workspace — Free Forever</span>
                <IconArrowRight />
              </button>
            </div>

            <div className="lp-cta-guarantees">
              <span>✔ No Credit Card Required</span>
              <span>✔ Instant Cold-Start Deployment</span>
              <span>✔ Zero Data Selling Privacy</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer__top">
          <div className="lp-footer__brand">
            <div className="lp-brand">
              <div className="lp-brand__glyph"><IconTerminal /></div>
              <span className="lp-brand__name">Intervue<span className="lp-brand__dot">.OS</span></span>
            </div>
            <p className="lp-footer__bio">
              Deterministic technical interview operating system engineered for ambitious software developers.
            </p>
          </div>

          <div className="lp-footer__cols">
            <div className="lp-footer__col">
              <span className="lp-footer__col-title">SYSTEM MODULES</span>
              <a href="#sandbox">Algorithmic Sandbox</a>
              <a href="#features">Voice STAR Telemetry</a>
              <a href="#features">ATS AST Compiler</a>
              <a href="#readiness">Readiness Cockpit</a>
            </div>
            <div className="lp-footer__col">
              <span className="lp-footer__col-title">DEVELOPER STACK</span>
              <span>V8 JS / Node 24</span>
              <span>TypeScript 5.4</span>
              <span>Puppeteer Chromium</span>
              <span>Gemini 2.5 Flash</span>
            </div>
            <div className="lp-footer__col">
              <span className="lp-footer__col-title">INFRASTRUCTURE</span>
              <span className="lp-footer__status-link">
                <span className="lp-status-dot" /> System Operational
              </span>
              <span>MongoDB Atlas TLS</span>
              <span>ETag 304 Caching</span>
            </div>
          </div>
        </div>

        <div className="lp-footer__bottom">
          <span>© {new Date().getFullYear()} Intervue.OS. Built with engineering rigor.</span>
          <span>Commit: sha-256:7b1e4a • Node.js / Vite / React</span>
        </div>
      </footer>
    </div>
  )
}
