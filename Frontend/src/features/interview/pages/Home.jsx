import React, { useState, useEffect, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hook/useinterview.js'
import { useNavigate } from 'react-router'

const useTyping = (fullText, speed = 38, startDelay = 0) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isDone, setIsDone]               = useState(false)
  const [prevText, setPrevText]           = useState(fullText)
  const indexRef  = useRef(0)
  const timerRef  = useRef(null)

  if (fullText !== prevText) {
    setPrevText(fullText)
    setDisplayedText('')
    setIsDone(false)
  }

  useEffect(() => {
    indexRef.current = 0
    const start = () => {
      const tick = () => {
        if (indexRef.current < fullText.length) {
          indexRef.current += 1
          setDisplayedText(fullText.slice(0, indexRef.current))
          // Natural jitter: pause longer on punctuation
          const ch    = fullText[indexRef.current - 1]
          const pause = /[.,!?]/.test(ch)
            ? speed * 6 + Math.random() * 80   // pause after punctuation
            : speed     + Math.random() * 40    // normal keystroke jitter
          timerRef.current = setTimeout(tick, pause)
        } else {
          setIsDone(true)
        }
      }
      tick()
    }

    timerRef.current = setTimeout(start, startDelay)

    return () => clearTimeout(timerRef.current)
  }, [fullText, speed, startDelay])

  return { displayedText, isDone }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENT — TypingPlaceholder
// Renders a transparent overlay inside a textarea-wrapper that:
//   • Shows the animated typing text + blinking cursor
//   • Disappears instantly when the user clicks the textarea (userActive)
//   • Re-appears if user never typed anything (passive UX hint)
//
// Props:
//   text        — full string to type out
//   speed       — ms between keystrokes (default 38ms ≈ ~26 WPM)
//   startDelay  — ms before typing begins (stagger multiple instances)
//   targetId    — id of the <textarea> this overlay belongs to
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TypingPlaceholder = ({ text, speed = 38, startDelay = 0, targetId }) => {
  const { displayedText, isDone } = useTyping(text, speed, startDelay)
  const [userActive, setUserActive] = useState(false)

  // Hide when the real textarea receives focus
  useEffect(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    const show = () => setUserActive(true)
    el.addEventListener('focus', show)
    return () => el.removeEventListener('focus', show)
  }, [targetId])

  if (userActive) return null

  return (
    <div className="typing-overlay" aria-hidden="true">
      <span className="typing-text">{displayedText}</span>
      <span className={`typing-cursor${isDone ? ' typing-cursor--blink' : ''}`}>|</span>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICON COMPONENTS (inline SVGs — no external deps)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const IconDoc = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const IconUpload = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const IconStar = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPING STRINGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const JOB_DESC_HINT =
  "e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"

const SELF_DESC_HINT =
  "e.g. '3 years of full-stack experience with React and Node.js, strong problem-solving skills...'"

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const Home = () => {

const {loading,generateReport, reports, getReports} = useInterview()
const [jobDescription, setJobDescription] = useState("")
const [selfDescription, setSelfDescription] = useState("")
const resumeInputRef = useRef()

const navigate = useNavigate()

useEffect(() => {
  getReports()
}, [])

const handleGenerateReport =  async() => {
  console.log("-> Starting report generation...");
  const resumeFile = resumeInputRef.current.files[0] || null
  const data = await generateReport({ resumeFile, selfDescription, jobDescription })
  console.log("<- Received response from generateReport:", data);
  if (data?._id) {
    console.log("Navigating to:", `/interview/${data._id}`);
    navigate(`/interview/${data._id}`)
  } else {
    console.error("Failed to get a valid _id from backend:", data);
  }
}

if (loading) {
  return (
    <main className='loading-screen'>
      <h1>Loading your interview report...</h1>
    </main>
  )
}

  return (
    <main className="home">

      {/* ── Page Header ─────────────────────────────── */}
      <header className="home-header">
        <h1>
          Create Your Custom{" "}
          <span className="highlight-text">Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to build a{" "}
          <strong>winning strategy.</strong>
        </p>
      </header>

      {/* ── Main Card ───────────────────────────────── */}
      <div className="interview-card">
        <div className="card-content">

          {/* ── LEFT PANEL — Job Description ──────── */}
          <div className="left-panel">
            <div className="panel-header">
              <div className="title-with-icon">
                <span className="panel-icon"><IconDoc /></span>
                <h2>Target Job Description</h2>
              </div>
              <span className="badge required">REQUIRED</span>
            </div>

            <div className="textarea-wrapper">
              {/* Typing animation overlay — disappears on focus */}
              <TypingPlaceholder
                text={JOB_DESC_HINT}
                speed={30}
                startDelay={400}
                targetId="job-description"
              />
              <textarea
              onChange={(e)=>{setJobDescription(e.target.value)}}
                id="job-description"
                placeholder="Paste the full job description here..."
              />
              <div className="char-count">0 / 5000 chars</div>
            </div>
          </div>

          {/* ── Vertical Divider ──────────────────── */}
          <div className="panel-divider" aria-hidden="true" />

          {/* ── RIGHT PANEL — Profile ─────────────── */}
          <div className="right-panel">
            <div className="panel-header">
              <div className="title-with-icon">
                <span className="panel-icon"><IconUser /></span>
                <h2>Your Profile</h2>
              </div>
            </div>

            {/* Upload Resume */}
            <div className="profile-section">
              <div className="section-header">
                <h3>Upload Resume</h3>
                <span className="badge best-results">BEST RESULTS</span>
              </div>
              <label className="upload-area" htmlFor="resume-upload">
                <input ref={resumeInputRef} id="resume-upload" type="file" hidden accept=".pdf,.docx" />
                <div className="upload-icon-wrap"><IconUpload /></div>
                <p className="upload-primary">Click to upload or drag &amp; drop</p>
                <p className="upload-secondary">PDF or DOCX (Max 5MB)</p>
              </label>
            </div>

            {/* OR Divider */}
            <div className="or-divider"><span>OR</span></div>

            {/* Quick Self-Description */}
            <div className="profile-section">
              <div className="section-header">
                <h3>Quick Self-Description</h3>
              </div>

              {/* Wrapper needed for the overlay to position correctly */}
              <div className="self-desc-wrapper">
                <TypingPlaceholder
                  text={SELF_DESC_HINT}
                  speed={32}
                  startDelay={1800}   // starts after job-desc typing begins
                  targetId="self-description"
                />
                <textarea
                onChange={(e)=>{setSelfDescription(e.target.value)}}
                  id="self-description"
                  className="self-desc-textarea"
                  placeholder="Briefly describe your experience..."
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="info-box" role="note">
              <span className="info-icon"><IconInfo /></span>
              <p>
                Either a <strong>Resume</strong> or a{" "}
                <strong>Self Description</strong> is required to generate a
                personalized plan.
              </p>
            </div>
          </div>
        </div>
         
        {/* ── Card Footer ─────────────────────────── */}
        <footer className="card-footer">
          <div className="footer-left">
            <IconClock />
            <span className="footer-label">AI-Powered Strategy Generation</span>
            <span className="footer-separator">·</span>
            <span className="footer-time">Approx 30s</span>
          </div>
          <button
          onClick={handleGenerateReport}
          disabled={loading}
          id="generate-btn" className="generate-btn" type="button">
            <IconStar />
            {loading ? "Generating..." : "Generate My Interview Strategy"}      
          </button>
        </footer>
      </div>

      {/* ── Generated Plans Section (Bottom) ─────── */}
      <section className="generated-plans-section">
        <h2>Your Generated Plans</h2>
        
        {reports && reports.length > 0 ? (
          <div className="plans-grid">
            {reports.map((plan) => {
              // Extract dynamic title: prioritize jobTitle, then non-default title, then first line of job description
              let dynamicTitle = plan.jobTitle;
              if (!dynamicTitle && plan.title && plan.title !== "Job Interview Report") dynamicTitle = plan.title;
              if (!dynamicTitle && plan.jobDescription) {
                const firstLine = plan.jobDescription.split('\n')[0].trim();
                dynamicTitle = firstLine.length > 45 ? firstLine.substring(0, 45) + '...' : firstLine;
              }
              if (!dynamicTitle) dynamicTitle = "Job Interview Report";

              return (
              <div key={plan._id} className="plan-card">
                <div className="plan-info">
                  <h3 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "250px" }} title={dynamicTitle}>{dynamicTitle}</h3>
                  <p className="plan-desc">
                    {plan.jobDescription ? (plan.jobDescription.length > 100 ? plan.jobDescription.substring(0, 100) + '...' : plan.jobDescription) : "Custom self-described strategy"}
                  </p>
                  <span className="plan-date">Generated on {new Date(plan.createdAt).toLocaleDateString()}</span>
                </div>
                <button onClick={() => navigate(`/interview/${plan._id}`)} className="view-btn">
                  View Plan
                </button>
              </div>
            )})}
          </div>
        ) : (
          <div className="empty-plans">
            <p>No plans generated yet.</p>
          </div>
        )}
      </section>

    </main>
  )
}

export default Home
