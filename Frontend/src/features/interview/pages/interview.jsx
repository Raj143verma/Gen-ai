import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import '../style/interview.scss'
import { useInterview } from '../hook/useinterview.js'




// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICON COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const IconCode = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconMap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
)

const IconChevron = ({ open }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const IconTarget = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const IconLightbulb = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="10" y1="22" x2="14" y2="22" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
)

const IconCheckCircle = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUB-COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Expandable question card */
const QuestionCard = ({ index, question, intention, answer }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={`question-card ${open ? 'question-card--open' : ''}`}>
      <button className="question-card__header" onClick={() => setOpen(o => !o)}>
        <span className="question-card__num">{String(index + 1).padStart(2, '0')}</span>
        <span className="question-card__q">{question}</span>
        <span className="question-card__chevron"><IconChevron open={open} /></span>
      </button>
      {open && (
        <div className="question-card__body">
          <div className="question-card__row">
            <span className="question-card__label"><IconTarget /> Intention</span>
            <p className="question-card__text">{intention}</p>
          </div>
          <div className="question-card__row">
            <span className="question-card__label"><IconLightbulb /> Key Points</span>
            <p className="question-card__text">{answer}</p>
          </div>
        </div>
      )}
    </div>
  )
}

/** Preparation day card */
const DayCard = ({ day, focus, tasks }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className={`day-card ${open ? 'day-card--open' : ''}`}>
      <button className="day-card__header" onClick={() => setOpen(o => !o)}>
        <span className="day-card__badge">Day {day}</span>
        <span className="day-card__focus">{focus}</span>
        <span className="day-card__chevron"><IconChevron open={open} /></span>
      </button>
      {open && (
        <ul className="day-card__tasks">
          {(tasks || []).map((t, i) => (
            <li key={i} className="day-card__task">
              <span className="day-card__task-icon"><IconCheckCircle /></span>
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN SECTIONS rendered in center panel
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TechnicalSection = ({ questions }) => (
  <section className="content-section">
    <div className="content-section__header">
      <span className="content-section__icon"><IconCode /></span>
      <h2 className="content-section__title">Technical Questions</h2>
      <span className="section-count">{(questions || []).length}</span>
    </div>
    <div className="question-list">
      {(questions || []).map((q, i) => (
        <QuestionCard key={i} index={i} {...q} />
      ))}
    </div>
  </section>
)

const BehavioralSection = ({ questions }) => (
  <section className="content-section">
    <div className="content-section__header">
      <span className="content-section__icon"><IconUsers /></span>
      <h2 className="content-section__title">Behavioral Questions</h2>
      <span className="section-count">{(questions || []).length}</span>
    </div>
    <div className="question-list">
      {(questions || []).map((q, i) => (
        <QuestionCard key={i} index={i} {...q} />
      ))}
    </div>
  </section>
)

const RoadmapSection = ({ plan }) => (
  <section className="content-section">
    <div className="content-section__header">
      <span className="content-section__icon"><IconMap /></span>
      <h2 className="content-section__title">7-Day Road Map</h2>
    </div>


        <div className="day-list">
      {(plan || []).map(d => (
        <DayCard key={d.day || Math.random()} {...d} />
      ))}
    </div>
  </section>
)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const NAV_ITEMS = [
  { key: 'technical',  label: 'Technical questions',  icon: <IconCode /> },
  { key: 'behavioral', label: 'Behavioral questions', icon: <IconUsers /> },
  { key: 'roadmap',    label: 'Road Map',             icon: <IconMap /> },
]

const Interview = () => {
  const { interviewId } = useParams()
  const currentId = interviewId;
  const isValidId = currentId && /^[0-9a-fA-F]{24}$/.test(currentId);
  
  console.log("[InterviewPage] extracted parameter interviewId:", interviewId);
  console.log("[InterviewPage] is MongoDB ID syntax valid?:", isValidId ? "Yes" : "No");
  
  const { report, getReportById, loading, error } = useInterview()
  const [analysis, setAnalysis] = useState(null)
  const [activeSection, setActiveSection] = useState('technical')

  useEffect(() => {
    if (isValidId) {
      getReportById(currentId)
    }
  }, [currentId, isValidId])

  useEffect(() => {
    if (report) {
      console.log("API Response format:", { success: true, data: report })
      setAnalysis(report)
    }
  }, [report])

  if (!isValidId) {
     return (
      <div className="interview-page error-state">
        <p>Invalid interview report ID. Please check the URL.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="interview-page loading-state">
        <p>Loading interview report...</p>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="interview-page error-state">
        <p>{error || "Failed to load interview report. Please check the URL or try again."}</p>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'technical':  return <TechnicalSection  questions={analysis?.technicalQuestions || analysis?.questions || []} />
      case 'behavioral': return <BehavioralSection questions={analysis?.behavioralQuestions || analysis?.questions || []} />
      case 'roadmap':    return <RoadmapSection    plan={analysis?.preparationPlan || analysis?.roadmap || []} />
      default:           return null
    }
  }

  return (
    <main className="interview-page">

      {/* ── Left Sidebar ─────────────────────────────────── */}
      <aside className="iv-sidebar">
        <nav className="iv-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`iv-nav__item ${activeSection === item.key ? 'iv-nav__item--active' : ''}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="iv-nav__icon">{item.icon}</span>
              <span className="iv-nav__label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Vertical Divider ─────────────────────────────── */}
      <div className="iv-divider" />

      {/* ── Center Content ───────────────────────────────── */}
      <div className="iv-content">
        <div className="iv-content__inner">
          {renderContent()}
        </div>
      </div>

      {/* ── Vertical Divider ─────────────────────────────── */}
      <div className="iv-divider" />

      {/* ── Right Panel — Match Score + Skill Gaps ────────── */}
      <aside className="iv-right-panel">

        {/* Match Score */}
        <div className="rp-score">
          <div className="score-ring">
            <svg viewBox="0 0 36 36" className="score-ring__svg">
              <circle className="score-ring__track" cx="18" cy="18" r="15.9" />
              <circle
                className="score-ring__fill"
                cx="18" cy="18" r="15.9"
                strokeDasharray={`${analysis?.matchScore || 0} ${100 - (analysis?.matchScore || 0)}`}
                strokeDashoffset="25"
              />
            </svg>
            <span className="score-ring__value">{analysis?.matchScore || 0}</span>
          </div>
          <p className="rp-score__label">Match Score</p>
        </div>

        {/* Skill Gaps */}
        <div className="rp-section">
          <div className="rp-section__header">
            <span className="rp-section__icon"><IconAlert /></span>
            <h3 className="rp-section__title">Skill Gaps</h3>
          </div>
          <div className="skill-tags">
            {analysis?.skillGaps?.map((gap, i) => (
              <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                {gap.skill}
              </span>
            ))}
          </div>
        </div>

      </aside>

    </main>
  )
}

export default Interview