import React, { useState, useEffect, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hook/useinterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
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

const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
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

const GENERATION_STEPS = [
  "Reading your resume & profile...",
  "Analyzing job requirements & skill gaps...",
  "Building questions & 7-day preparation plan..."
]

const Home = () => {

const {loading,generateReport, reports, getReports, deleteReport} = useInterview()
const { user, handleLogout } = useAuth()
const [jobDescription, setJobDescription] = useState("")
const [selfDescription, setSelfDescription] = useState("")
const [resumeFile, setResumeFile] = useState(null)
const [isDragging, setIsDragging] = useState(false)
const [deletingId, setDeletingId] = useState(null)
const [formError, setFormError] = useState("")
const [isGenerating, setIsGenerating] = useState(false)
const [loadingStep, setLoadingStep] = useState(0)
const resumeInputRef = useRef()

const navigate = useNavigate()

useEffect(() => {
  getReports()
}, [])

useEffect(() => {
  if (!isGenerating) {
    setLoadingStep(0)
    return
  }
  const timer = setInterval(() => {
    setLoadingStep((prev) => (prev < GENERATION_STEPS.length - 1 ? prev + 1 : prev))
  }, 3500)
  return () => clearInterval(timer)
}, [isGenerating])

const onLogout = async () => {
  await handleLogout()
  navigate("/login")
}

const handleFileSelect = (file) => {
  if (!file) return
  setFormError("")
  const fileName = file.name.toLowerCase()
  if (!fileName.endsWith(".pdf") && !fileName.endsWith(".docx")) {
    setFormError("Only PDF or DOCX files are supported.")
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    setFormError("File size exceeds the 5MB limit.")
    return
  }
  setResumeFile(file)
}

const handleFileChange = (e) => {
  const file = e.target.files?.[0] || null
  handleFileSelect(file)
}

const handleRemoveFile = (e) => {
  e.preventDefault()
  e.stopPropagation()
  setResumeFile(null)
  setFormError("")
  if (resumeInputRef.current) {
    resumeInputRef.current.value = ""
  }
}

const handleDragOver = (e) => {
  e.preventDefault()
  setIsDragging(true)
}

const handleDragLeave = (e) => {
  e.preventDefault()
  setIsDragging(false)
}

const handleDrop = (e) => {
  e.preventDefault()
  setIsDragging(false)
  const droppedFile = e.dataTransfer?.files?.[0] || null
  handleFileSelect(droppedFile)
}

const handleDeletePlan = async (planId) => {
  const confirmed = window.confirm("Delete this interview plan?")
  if (!confirmed) return
  setDeletingId(planId)
  setFormError("")
  try {
    await deleteReport(planId)
  } catch (err) {
    setFormError(err.response?.data?.message || "Failed to delete plan.")
  } finally {
    setDeletingId(null)
  }
}

const handleGenerateReport = async () => {
  console.log("-> Starting report generation...");
  setFormError("")
  const selectedResume = resumeFile || resumeInputRef.current?.files?.[0] || null;

  if (!selectedResume && !selfDescription.trim()) {
    setFormError("Please upload a resume or enter a self description before generating a report.");
    return;
  }

  setIsGenerating(true);
  try {
    const data = await generateReport({ resumeFile: selectedResume, selfDescription, jobDescription });
    console.log("<- Received response from generateReport:", data);
    if (data?._id) {
      console.log("Navigating to:", `/interview/${data._id}`);
      navigate(`/interview/${data._id}`);
    } else {
      setFormError("Could not open the generated report. Please check your saved plans below.");
    }
  } catch (err) {
    console.error("Report generation failed:", err);
    setFormError(err.response?.data?.message || "Failed to generate interview strategy. Please try again.");
  } finally {
    setIsGenerating(false);
  }
}

if (isGenerating) {
  return (
    <main className="home home--loading">
      <div className="gen-loader">
        <div className="gen-loader__spinner" />
        <h2>Building Your Interview Plan</h2>
        <p className="gen-loader__sub">This usually takes around 10–20 seconds.</p>
        <ul className="gen-loader__steps">
          {GENERATION_STEPS.map((label, idx) => (
            <li
              key={label}
              className={`gen-loader__step ${idx < loadingStep ? 'gen-loader__step--done' : ''} ${idx === loadingStep ? 'gen-loader__step--active' : ''}`}
            >
              <span className="gen-loader__dot" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

  return (
    <main className="home">

      {/* ── Top Bar ─────────────────────────────────── */}
      <div className="home-topbar">
        <span className="home-topbar__user">
          <IconUser />
          {user?.username || "Account"}
        </span>
        <button type="button" onClick={onLogout} className="home-topbar__logout">
          <IconLogout />
          Logout
        </button>
      </div>

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
              <div className="char-count">{jobDescription.length} / 5000 chars</div>
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
              <label
                className={`upload-area${isDragging ? ' upload-area--dragging' : ''}${resumeFile ? ' upload-area--selected' : ''}`}
                htmlFor="resume-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={resumeInputRef}
                  id="resume-upload"
                  type="file"
                  hidden
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />
                {resumeFile ? (
                  <>
                    <div className="upload-icon-wrap upload-icon-wrap--done"><IconCheck /></div>
                    <p className="upload-primary">{resumeFile.name}</p>
                    <p className="upload-secondary">{(resumeFile.size / 1024).toFixed(1)} KB · Ready to analyze</p>
                    <button type="button" className="upload-remove-btn" onClick={handleRemoveFile}>
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <div className="upload-icon-wrap"><IconUpload /></div>
                    <p className="upload-primary">Click to upload or drag &amp; drop</p>
                    <p className="upload-secondary">PDF or DOCX (Max 5MB)</p>
                  </>
                )}
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
         
        {/* ── Inline Error Banner ─────────────────── */}
        {formError && (
          <div className="form-error-banner" role="alert">
            <span>{formError}</span>
            <button type="button" onClick={() => setFormError("")} aria-label="Dismiss error">
              ×
            </button>
          </div>
        )}

        {/* ── Card Footer ─────────────────────────── */}
        <footer className="card-footer">
          <div className="footer-left">
            <IconClock />
            <span className="footer-label">AI-Powered Strategy Generation</span>
            <span className="footer-separator">·</span>
            <span className="footer-time">Approx 15s</span>
          </div>
          <button
          onClick={handleGenerateReport}
          disabled={isGenerating || loading}
          id="generate-btn" className="generate-btn" type="button">
            <IconStar />
            {isGenerating ? "Generating..." : "Generate My Interview Strategy"}      
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

              const score = typeof plan.matchScore === "number" ? plan.matchScore : null;
              const scoreTier = score >= 75 ? "high" : score >= 50 ? "medium" : "low";

              return (
              <div key={plan._id} className="plan-card">
                <div className="plan-info">
                  <div className="plan-card-top">
                    <h3 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "220px" }} title={dynamicTitle}>{dynamicTitle}</h3>
                    {score !== null && (
                      <span className={`plan-score plan-score--${scoreTier}`}>
                        {score}% Match
                      </span>
                    )}
                  </div>
                  <p className="plan-desc">
                    {plan.jobDescription ? (plan.jobDescription.length > 100 ? plan.jobDescription.substring(0, 100) + '...' : plan.jobDescription) : "Custom self-described strategy"}
                  </p>
                  <span className="plan-date">Generated on {new Date(plan.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="plan-actions">
                  <button onClick={() => navigate(`/interview/${plan._id}`)} className="view-btn">
                    View Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePlan(plan._id)}
                    disabled={deletingId === plan._id}
                    className="delete-btn"
                    title="Delete plan"
                  >
                    <IconTrash />
                    {deletingId === plan._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
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
