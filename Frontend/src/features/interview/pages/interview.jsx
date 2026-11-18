import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import '../style/interview.scss'
import { useInterview } from '../hook/useinterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'




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

const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const IconFileText = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const IconDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUB-COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Expandable question card with practice mode */
const QuestionCard = ({ index, question, intention, answer, interviewId, onEvaluate }) => {
  const [open, setOpen] = useState(false)
  const [practiceOpen, setPracticeOpen] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")
  const [checking, setChecking] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [checkError, setCheckError] = useState("")

  const handleCheckAnswer = async () => {
    if (!userAnswer.trim() || checking) return
    setChecking(true)
    setCheckError("")
    try {
      const result = await onEvaluate({
        interviewReportId: interviewId,
        question,
        expectedAnswer: answer,
        userAnswer
      })
      setFeedback(result)
    } catch (err) {
      setCheckError(err.response?.data?.message || "Could not evaluate your answer right now.")
    } finally {
      setChecking(false)
    }
  }

  const scoreTier = feedback
    ? feedback.score >= 8 ? "high" : feedback.score >= 5 ? "medium" : "low"
    : "medium"

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

          <div className="practice-box">
            <button
              type="button"
              className="practice-box__toggle"
              onClick={() => setPracticeOpen((p) => !p)}
            >
              {practiceOpen ? "Hide Practice Area" : "Practice Your Answer"}
            </button>

            {practiceOpen && (
              <div className="practice-box__content">
                <textarea
                  className="practice-box__textarea"
                  rows={4}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Write how you would answer this in an interview..."
                />
                {checkError && <p className="practice-box__error">{checkError}</p>}
                <div className="practice-box__actions">
                  <button
                    type="button"
                    className="iv-action-btn"
                    onClick={handleCheckAnswer}
                    disabled={checking || !userAnswer.trim()}
                  >
                    {checking ? "Checking..." : "Check with AI"}
                  </button>
                </div>

                {feedback && (
                  <div className="practice-feedback">
                    <div className="practice-feedback__head">
                      <span>AI Evaluation</span>
                      <span className={`practice-feedback__score practice-feedback__score--${scoreTier}`}>
                        {feedback.score} / 10
                      </span>
                    </div>

                    {feedback.strengths?.length > 0 && (
                      <div className="practice-feedback__group">
                        <strong>Strengths</strong>
                        <ul>
                          {feedback.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                        </ul>
                      </div>
                    )}

                    {feedback.improvements?.length > 0 && (
                      <div className="practice-feedback__group">
                        <strong>To Improve</strong>
                        <ul>
                          {feedback.improvements.map((imp, idx) => <li key={idx}>{imp}</li>)}
                        </ul>
                      </div>
                    )}

                    {feedback.improvedAnswer && (
                      <div className="practice-feedback__group">
                        <strong>Stronger Version</strong>
                        <p>{feedback.improvedAnswer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/** Preparation day card with interactive checklist */
const DayCard = ({ day, focus, tasks, completedTasks, onToggleTask }) => {
  const [open, setOpen] = useState(day === 1)
  const taskList = tasks || []
  const doneCount = taskList.filter((_, i) => completedTasks.includes(`day-${day}-${i}`)).length

  return (
    <div className={`day-card ${open ? 'day-card--open' : ''}`}>
      <button className="day-card__header" onClick={() => setOpen(o => !o)}>
        <span className="day-card__badge">Day {day}</span>
        <span className="day-card__focus">{focus}</span>
        {taskList.length > 0 && (
          <span className={`day-card__count ${doneCount === taskList.length ? 'day-card__count--done' : ''}`}>
            {doneCount}/{taskList.length}
          </span>
        )}
        <span className="day-card__chevron"><IconChevron open={open} /></span>
      </button>
      {open && (
        <ul className="day-card__tasks">
          {taskList.map((t, i) => {
            const taskKey = `day-${day}-${i}`
            const isDone = completedTasks.includes(taskKey)
            return (
              <li key={taskKey} className={`day-card__task day-card__task--checkable ${isDone ? 'day-card__task--done' : ''}`}>
                <label className="day-card__task-label">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onToggleTask(taskKey)}
                  />
                  <span>{t}</span>
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN SECTIONS rendered in center panel
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TechnicalSection = ({ questions, interviewId, onEvaluate }) => (
  <section className="content-section">
    <div className="content-section__header">
      <span className="content-section__icon"><IconCode /></span>
      <h2 className="content-section__title">Technical Questions</h2>
      <span className="section-count">{(questions || []).length}</span>
    </div>
    <div className="question-list">
      {(questions || []).map((q, i) => (
        <QuestionCard key={i} index={i} interviewId={interviewId} onEvaluate={onEvaluate} {...q} />
      ))}
    </div>
  </section>
)

const BehavioralSection = ({ questions, interviewId, onEvaluate }) => (
  <section className="content-section">
    <div className="content-section__header">
      <span className="content-section__icon"><IconUsers /></span>
      <h2 className="content-section__title">Behavioral Questions</h2>
      <span className="section-count">{(questions || []).length}</span>
    </div>
    <div className="question-list">
      {(questions || []).map((q, i) => (
        <QuestionCard key={i} index={i} interviewId={interviewId} onEvaluate={onEvaluate} {...q} />
      ))}
    </div>
  </section>
)

const RoadmapSection = ({ plan, completedTasks = [], onToggleTask }) => {
  const days = plan || []
  const totalTasks = days.reduce((acc, d) => acc + (d.tasks?.length || 0), 0)
  const completedCount = days.reduce(
    (acc, d) => acc + (d.tasks || []).filter((_, i) => completedTasks.includes(`day-${d.day}-${i}`)).length,
    0
  )
  const percent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  return (
    <section className="content-section">
      <div className="content-section__header">
        <span className="content-section__icon"><IconMap /></span>
        <h2 className="content-section__title">7-Day Road Map</h2>
        {totalTasks > 0 && (
          <span className="section-count">{percent}%</span>
        )}
      </div>

      {totalTasks > 0 && (
        <div className="roadmap-progress">
          <div className="roadmap-progress__meta">
            <span>Preparation Progress</span>
            <span>{completedCount} / {totalTasks} tasks completed</span>
          </div>
          <div className="roadmap-progress__track">
            <div className="roadmap-progress__fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      <div className="day-list">
        {days.map((d, idx) => (
          <DayCard
            key={d.day ?? idx}
            completedTasks={completedTasks}
            onToggleTask={onToggleTask}
            {...d}
          />
        ))}
      </div>
    </section>
  )
}

const OptimizedResumeSection = ({ optimizedResume, loadingResume, resumeError, onGenerate, onDownload, downloadingPdf }) => (
  <section className="content-section">
    <div className="content-section__header">
      <span className="content-section__icon"><IconFileText /></span>
      <h2 className="content-section__title">Optimized Resume</h2>
      <button
        type="button"
        className="iv-action-btn"
        onClick={onDownload}
        disabled={downloadingPdf}
      >
        <IconDownload />
        {downloadingPdf ? "Generating PDF..." : "Download PDF"}
      </button>
    </div>

    {loadingResume && (
      <div className="resume-box">
        <p className="resume-box__muted">Tailoring your resume for this role...</p>
      </div>
    )}

    {resumeError && !loadingResume && (
      <div className="resume-box">
        <p className="resume-box__error">{resumeError}</p>
        <button type="button" className="iv-action-btn" onClick={onGenerate}>
          Try Again
        </button>
      </div>
    )}

    {optimizedResume && !loadingResume && (
      <div className="resume-preview">
        {optimizedResume.summary && (
          <div className="resume-block">
            <h3 className="resume-block__title">Professional Summary</h3>
            <p className="resume-block__text">{optimizedResume.summary}</p>
          </div>
        )}

        {optimizedResume.skills?.length > 0 && (
          <div className="resume-block">
            <h3 className="resume-block__title">Recommended Skills</h3>
            <div className="skill-tags">
              {optimizedResume.skills.map((skill, i) => (
                <span key={i} className="skill-tag skill-tag--low">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {optimizedResume.experience?.length > 0 && (
          <div className="resume-block">
            <h3 className="resume-block__title">Tailored Experience</h3>
            <div className="resume-exp-list">
              {optimizedResume.experience.map((exp, i) => (
                <div key={i} className="resume-exp-card">
                  <div className="resume-exp-card__head">
                    <strong>{exp.title}</strong>
                    {exp.company && <span> · {exp.company}</span>}
                  </div>
                  {exp.duration && <span className="resume-exp-card__meta">{exp.duration}</span>}
                  <ul className="day-card__tasks resume-exp-card__points">
                    {(exp.points || []).map((pt, j) => (
                      <li key={j} className="day-card__task">
                        <span className="day-card__task-icon"><IconCheckCircle /></span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {optimizedResume.suggestions?.length > 0 && (
          <div className="resume-block">
            <h3 className="resume-block__title">Improvement Tips</h3>
            <ul className="day-card__tasks resume-exp-card__points">
              {optimizedResume.suggestions.map((tip, i) => (
                <li key={i} className="day-card__task">
                  <span className="day-card__task-icon"><IconLightbulb /></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}
  </section>
)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const NAV_ITEMS = [
  { key: 'technical',  label: 'Technical questions',  icon: <IconCode /> },
  { key: 'behavioral', label: 'Behavioral questions', icon: <IconUsers /> },
  { key: 'roadmap',    label: 'Road Map',             icon: <IconMap /> },
  { key: 'resume',     label: 'Optimized Resume',     icon: <IconFileText /> },
]

const Interview = () => {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const currentId = interviewId;
  const isValidId = Boolean(currentId && /^[0-9a-fA-F]{24}$/.test(currentId));
  
  console.log("[InterviewPage] extracted parameter interviewId:", interviewId);
  console.log("[InterviewPage] is MongoDB ID syntax valid?:", isValidId ? "Yes" : "No");
  
  const { report, getReportById, getOptimizedResume, downloadResume, toggleTask, checkPracticeAnswer, loading, error } = useInterview()
  const { handleLogout } = useAuth()
  const [activeSection, setActiveSection] = useState('technical')
  const [optimizedResume, setOptimizedResume] = useState(null)
  const [loadingResume, setLoadingResume] = useState(false)
  const [resumeError, setResumeError] = useState(null)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [pdfError, setPdfError] = useState(null)

  useEffect(() => {
    setOptimizedResume(null)
    setResumeError(null)
    setPdfError(null)
  }, [currentId])

  useEffect(() => {
    if (isValidId && (!report || report._id !== currentId)) {
      getReportById(currentId)
    }
  }, [currentId, isValidId, report])

  const loadOptimizedResume = async () => {
    if (!currentId || loadingResume) return
    setLoadingResume(true)
    setResumeError(null)
    try {
      const data = await getOptimizedResume(currentId)
      setOptimizedResume(data)
    } catch (err) {
      setResumeError(err.response?.data?.message || "Failed to optimize resume.")
    } finally {
      setLoadingResume(false)
    }
  }

  const handleTabClick = (key) => {
    setActiveSection(key)
    if (key === 'resume' && !optimizedResume && !loadingResume) {
      loadOptimizedResume()
    }
  }

  const handleDownloadPdf = async () => {
    if (!currentId || downloadingPdf) return
    setDownloadingPdf(true)
    setPdfError(null)
    try {
      await downloadResume(currentId, analysis?.title)
    } catch (err) {
      setPdfError(err.response?.data?.message || "Failed to generate resume PDF. Please try again.")
    } finally {
      setDownloadingPdf(false)
    }
  }

  const onLogout = async () => {
    await handleLogout()
    navigate("/login")
  }

  const analysis = report && report._id === currentId ? report : null;

  if (!isValidId) {
     return (
      <div className="interview-page error-state">
        <p>Invalid interview report ID. Please check the URL.</p>
      </div>
    )
  }

  if (loading && !analysis) {
    return (
      <div className="interview-page loading-state">
        <p>Loading interview report...</p>
      </div>
    )
  }

  if (error && !analysis) {
    return (
      <div className="interview-page error-state">
        <p>{error || "Failed to load interview report. Please check the URL or try again."}</p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="interview-page loading-state">
        <p>Loading interview report...</p>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'technical':  return (
        <TechnicalSection
          questions={analysis?.technicalQuestions || analysis?.questions || []}
          interviewId={currentId}
          onEvaluate={checkPracticeAnswer}
        />
      )
      case 'behavioral': return (
        <BehavioralSection
          questions={analysis?.behavioralQuestions || analysis?.questions || []}
          interviewId={currentId}
          onEvaluate={checkPracticeAnswer}
        />
      )
      case 'roadmap':    return (
        <RoadmapSection
          plan={analysis?.preparationPlan || analysis?.roadmap || []}
          completedTasks={analysis?.completedTasks || []}
          onToggleTask={(taskKey) => toggleTask(currentId, taskKey)}
        />
      )
      case 'resume':     return (
        <OptimizedResumeSection
          optimizedResume={optimizedResume}
          loadingResume={loadingResume}
          resumeError={resumeError}
          onGenerate={loadOptimizedResume}
          onDownload={handleDownloadPdf}
          downloadingPdf={downloadingPdf}
        />
      )
      default:           return null
    }
  }

  return (
    <main className="interview-page">

      {/* ── Left Sidebar ─────────────────────────────────── */}
      <aside className="iv-sidebar">
        <button type="button" className="iv-back-btn" onClick={() => navigate("/home")}>
          <IconArrowLeft />
          Back to Home
        </button>

        {analysis?.title && (
          <div className="iv-report-title" title={analysis.title}>
            {analysis.title}
          </div>
        )}

        <nav className="iv-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`iv-nav__item ${activeSection === item.key ? 'iv-nav__item--active' : ''}`}
              onClick={() => handleTabClick(item.key)}
            >
              <span className="iv-nav__icon">{item.icon}</span>
              <span className="iv-nav__label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button type="button" className="iv-logout-btn" onClick={onLogout}>
          <IconLogout />
          Logout
        </button>
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

        {/* Download Resume PDF */}
        <div className="rp-section rp-download">
          {pdfError && <p className="rp-download__error">{pdfError}</p>}
          <button
            type="button"
            className="rp-download__btn"
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
          >
            <IconDownload />
            {downloadingPdf ? "Generating PDF..." : "Download Resume PDF"}
          </button>
        </div>

      </aside>

    </main>
  )
}

export default Interview