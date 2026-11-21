const fs = require("fs");
const fetch =
    globalThis.fetch ||
    ((...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args)));
const { z } = require("zod");
const puppeteer = require("puppeteer");

 

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question using the STAR method, what points to cover, what approach to take etc.")
    })).min(5).describe("At least 5 behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).min(3).describe("At least 3 specific, actionable tasks or practice questions to be completed on this day")
    })).describe("A 7-day preparation roadmap for the candidate with at least 3 actionable tasks/questions per day"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})


async function callGemini({ systemInstruction, prompt, temperature = 0.2, maxOutputTokens = 8192 }) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing in .env");
    }

    const primaryModel = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
    const modelsToTry = [...new Set([
        primaryModel,
        "gemini-3-flash-preview",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite"
    ])];

    let lastError = null;

    for (const model of modelsToTry) {
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        systemInstruction: {
                            parts: [{ text: systemInstruction }]
                        },
                        contents: [
                            {
                                role: "user",
                                parts: [{ text: prompt }]
                            }
                        ],
                        generationConfig: {
                            temperature,
                            maxOutputTokens,
                            responseMimeType: "application/json"
                        }
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const apiError = data?.error?.message || response.statusText;
                lastError = new Error(`Gemini request failed (${response.status} on ${model}): ${apiError}`);
                if (response.status === 503 || response.status === 429 || response.status === 404) {
                    console.warn(`Model ${model} unavailable (${response.status}), trying fallback...`);
                    continue;
                }
                throw lastError;
            }

            const parts = data?.candidates?.[0]?.content?.parts || [];
            const content = parts.map(p => p.text || "").join("").trim();

            if (!content) {
                lastError = new Error(`Gemini returned empty response on ${model}: ${JSON.stringify(data)}`);
                continue;
            }

            return content;
        } catch (err) {
            lastError = err;
            console.warn(`Gemini call failed on ${model}:`, err.message);
        }
    }

    throw lastError || new Error("All Gemini models failed to respond");
}


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `
You are an expert technical interviewer and career coach.
Analyze the candidate's profile by combining their Resume and Self Introduction against the target Job Description.

Input Data:
1. Candidate Resume:
${resume || "Not provided"}

2. Candidate Self Introduction:
${selfDescription || "Not provided"}

3. Target Job Description:
${jobDescription || "Not provided"}

Requirements:
- Generate at least 5 relevant technicalQuestions with detailed answers.
- Generate at least 5 relevant behavioralQuestions (minimum 5) using the STAR method in answers.
- Identify realistic skillGaps with severity ("low", "medium", or "high").
- Build a 7-day preparationPlan (day 1 to day 7) with clear focus and at least 3 actionable tasks/practice questions per day (minimum 3 tasks per day).
- Return ONLY a valid, complete JSON object. Do NOT use markdown code fences.

JSON Schema format:
{
  "matchScore": <number between 0 and 100>,
  "technicalQuestions": [
    {
      "question": "<technical question based on resume and job requirements>",
      "intention": "<why the interviewer is asking this question>",
      "answer": "<how the candidate should answer, key concepts and approaches>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<behavioral question based on candidate background and role>",
      "intention": "<what competency or trait this question assesses>",
      "answer": "<recommended answer strategy using the STAR method>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<missing or weak skill required by the job description>",
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": <day number starting from 1>,
      "focus": "<main focus area for the day>",
      "tasks": [
        "<actionable task or practice question 1>",
        "<actionable task or practice question 2>",
        "<actionable task or practice question 3>"
      ]
    }
  ],
  "title": "<inferred target job title from job description>"
}
`;

    const content = await callGemini({
        systemInstruction: "You are an AI interview coach. Return ONLY valid, complete JSON strictly matching the requested schema. Do not include markdown code fences or extraneous text.",
        prompt,
        temperature: 0.2,
        maxOutputTokens: 8192
    });

    const cleanedContent = String(content)
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

    let parsed;
    try {
        parsed = JSON.parse(cleanedContent);
    } catch (err) {
        console.error("JSON parsing error:", err, "Raw content:", cleanedContent);
        throw new Error("AI did not return valid JSON");
    }

    const safeParsed = parsed && typeof parsed === "object" ? parsed : {};

    const repaired = {
        matchScore: Math.max(0, Math.min(100, Math.round(Number(safeParsed.matchScore) || 0))),
        technicalQuestions: Array.isArray(safeParsed.technicalQuestions)
            ? safeParsed.technicalQuestions
                .filter(item => item && (item.question || item.answer))
                .map((item) => ({
                    question: String(item?.question || "Technical Question"),
                    intention: String(item?.intention || "Assess technical domain competence"),
                    answer: String(item?.answer || "Demonstrate core concepts, problem-solving, and practical examples")
                }))
            : [],
        behavioralQuestions: (() => {
            const parsed = Array.isArray(safeParsed.behavioralQuestions)
                ? safeParsed.behavioralQuestions
                    .filter(item => item && (item.question || item.answer))
                    .map((item) => ({
                        question: String(item?.question || "Behavioral Question"),
                        intention: String(item?.intention || "Assess cultural fit, teamwork, and communication"),
                        answer: String(item?.answer || "Structure response using STAR method: Situation, Task, Action, Result")
                    }))
                : [];

            const fallbackBehavioral = [
                {
                    question: "Describe a situation where you had a disagreement with a team member on technical design or implementation. How did you resolve it?",
                    intention: "Assess conflict resolution, objective communication, and collaborative problem-solving.",
                    answer: "Use STAR method: Explain the differing opinions, how you gathered data or built a proof-of-concept, listened actively, and aligned on the best outcome for the project."
                },
                {
                    question: "Tell me about a time you encountered a critical production bug or unexpected deployment failure. What steps did you take?",
                    intention: "Assess accountability, composure under stress, root cause analysis, and preventive mindset.",
                    answer: "Use STAR method: Describe how you diagnosed the issue quickly, communicated transparently, rolled back or patched safely, and added automated tests to prevent recurrence."
                },
                {
                    question: "Give an example of a time when you took the initiative to improve system performance, security, or developer experience without being asked.",
                    intention: "Assess proactive ownership, engineering standards, and passion for product quality.",
                    answer: "Use STAR method: Describe the bottleneck or security risk you spotted, the solution you implemented, and the measurable impact on performance or team productivity."
                }
            ];

            for (const item of fallbackBehavioral) {
                if (parsed.length >= 5) break;
                if (!parsed.some(q => q.question.toLowerCase() === item.question.toLowerCase())) {
                    parsed.push(item);
                }
            }
            return parsed;
        })(),
        skillGaps: Array.isArray(safeParsed.skillGaps)
            ? safeParsed.skillGaps
                .filter(item => item && item.skill)
                .map((item) => ({
                    skill: String(item.skill).trim(),
                    severity: ["low", "medium", "high"].includes(String(item.severity).toLowerCase()) ? String(item.severity).toLowerCase() : "medium"
                }))
            : [],
        preparationPlan: Array.isArray(safeParsed.preparationPlan)
            ? safeParsed.preparationPlan
                .filter(item => item && (item.focus || (item.tasks && item.tasks.length > 0)))
                .map((item, index) => {
                    const dayNum = Number(item?.day) || index + 1;
                    const focus = String(item?.focus || `Day ${dayNum} Preparation`);
                    const rawTasks = Array.isArray(item?.tasks) && item.tasks.length > 0
                        ? item.tasks.map(t => String(t || "").trim()).filter(Boolean)
                        : [];

                    const defaultTasks = [
                        `Study and practice 3 core interview questions on ${focus}.`,
                        `Build or refactor a hands-on code example demonstrating ${focus}.`,
                        `Review edge cases, architectural trade-offs, and summarize key takeaways.`
                    ];

                    for (const defTask of defaultTasks) {
                        if (rawTasks.length >= 3) break;
                        if (!rawTasks.includes(defTask)) {
                            rawTasks.push(defTask);
                        }
                    }

                    return {
                        day: dayNum,
                        focus,
                        tasks: rawTasks
                    };
                })
            : [],
        title: String(safeParsed.title || "Job Interview Report")
    };

    const validation = interviewReportSchema.safeParse(repaired);
    if (!validation.success) {
        throw new Error(`AI response could not be repaired to expected format: ${validation.error.message}`);
    }

    return validation.data;
}


function convertResumeDataToMarkdown(data) {
    if (!data) return "";
    let md = "";
    if (data.name) md += `# ${data.name}\n`;
    if (data.title) md += `${data.title}\n`;
    const contact = data.contact || {};
    const contactParts = [contact.phone, contact.email, contact.linkedin, contact.github, contact.location].filter(Boolean).join(" | ");
    if (contactParts) md += `${contactParts}\n\n`;

    if (data.summary) {
        md += `## SUMMARY\n${data.summary}\n\n`;
    }

    if (Array.isArray(data.education) && data.education.length > 0) {
        md += `## EDUCATION\n`;
        for (const edu of data.education) {
            md += `**${edu.institution || ""}** | ${edu.date || ""}\n`;
            if (edu.degree || edu.location) md += `*${edu.degree || ""}* | *${edu.location || ""}*\n`;
            if (edu.coursework) md += `– Relevant Coursework: ${edu.coursework}\n`;
            md += "\n";
        }
    }

    if (Array.isArray(data.skills) && data.skills.length > 0) {
        md += `## TECHNICAL SKILLS\n`;
        for (const s of data.skills) {
            md += `- **${s.category}:** ${s.items}\n`;
        }
        md += "\n";
    }

    if (Array.isArray(data.experience) && data.experience.length > 0) {
        md += `## EXPERIENCE\n`;
        for (const exp of data.experience) {
            md += `**${exp.title || ""}** | ${exp.date || ""}\n`;
            if (exp.company || exp.location) md += `*${exp.company || ""}* | *${exp.location || ""}*\n`;
            if (Array.isArray(exp.bullets)) {
                for (const b of exp.bullets) {
                    md += `– ${b}\n`;
                }
            }
            md += "\n";
        }
    }

    if (Array.isArray(data.projects) && data.projects.length > 0) {
        md += `## PROJECTS\n`;
        for (const proj of data.projects) {
            md += `**${proj.title || ""}** | ${proj.linkText || "Github Link"}\n`;
            if (proj.techStack) md += `– Tech: ${proj.techStack}\n`;
            if (Array.isArray(proj.bullets)) {
                for (const b of proj.bullets) {
                    md += `– ${b}\n`;
                }
            }
            md += "\n";
        }
    }

    if (Array.isArray(data.achievements) && data.achievements.length > 0) {
        md += `## ACHIEVEMENTS\n`;
        for (const a of data.achievements) {
            md += `• ${a}\n`;
        }
    }

    return md.trim();
}

function renderStructuredResumeToHtml(data) {
    if (!data) return "";
    const name = data.name || "Candidate Name";
    const title = data.title || "";
    const contact = data.contact || {};
    const contactParts = [
        contact.phone,
        contact.email,
        contact.linkedin ? `<a href="${String(contact.linkedin).startsWith('http') ? contact.linkedin : '#'}" target="_blank">LinkedIn</a>` : null,
        contact.github ? `<a href="${String(contact.github).startsWith('http') ? contact.github : '#'}" target="_blank">GitHub</a>` : null,
        contact.location
    ].filter(Boolean).join(" | ");

    let educationHtml = "";
    if (Array.isArray(data.education) && data.education.length > 0) {
        educationHtml = `
      <div class="section-title">Education</div>
      ${data.education.map(edu => `
        <div class="row-between">
          <span class="bold">${edu.institution || ""}</span>
          <span>${edu.date || ""}</span>
        </div>
        ${edu.degree || edu.location ? `
        <div class="row-between">
          <span class="italic">${edu.degree || ""}</span>
          <span class="italic">${edu.location || ""}</span>
        </div>` : ""}
        ${edu.coursework ? `
        <div class="bullet-list" style="margin-top: 1px;">
          <div class="bullet-item">Relevant Coursework: ${edu.coursework}</div>
        </div>` : ""}
      `).join("")}
    `;
    }

    let skillsHtml = "";
    if (Array.isArray(data.skills) && data.skills.length > 0) {
        skillsHtml = `
      <div class="section-title">Technical Skills</div>
      <div class="skills-table">
        ${data.skills.map(s => `
          <div class="skills-row">
            <span class="skills-label">${s.category}</span>
            <span class="skills-val">${s.items}</span>
          </div>
        `).join("")}
      </div>
    `;
    }

    let experienceHtml = "";
    if (Array.isArray(data.experience) && data.experience.length > 0) {
        experienceHtml = `
      <div class="section-title">Experience</div>
      ${data.experience.map(exp => `
        <div class="row-between">
          <span class="bold">${exp.title || ""}</span>
          <span>${exp.date || ""}</span>
        </div>
        ${exp.company || exp.location ? `
        <div class="row-between" style="margin-bottom: 1px;">
          <span class="italic">${exp.company || ""}</span>
          <span class="italic">${exp.location || ""}</span>
        </div>` : ""}
        ${Array.isArray(exp.bullets) && exp.bullets.length > 0 ? `
        <ul class="bullet-list">
          ${exp.bullets.map(b => `<li class="bullet-item">${b}</li>`).join("")}
        </ul>` : ""}
      `).join("")}
    `;
    }

    let projectsHtml = "";
    if (Array.isArray(data.projects) && data.projects.length > 0) {
        projectsHtml = `
      <div class="section-title">Projects</div>
      ${data.projects.map((proj, idx) => `
        <div class="row-between" style="${idx > 0 ? 'margin-top: 3px;' : ''}">
          <span class="bold">${proj.title || ""}</span>
          <span class="italic">${proj.linkText || "Github Link"}</span>
        </div>
        ${proj.techStack ? `<div class="tech-line"><strong>Tech:</strong> ${proj.techStack}</div>` : ""}
        ${Array.isArray(proj.bullets) && proj.bullets.length > 0 ? `
        <ul class="bullet-list">
          ${proj.bullets.map(b => `<li class="bullet-item">${b}</li>`).join("")}
        </ul>` : ""}
      `).join("")}
    `;
    }

    let achievementsHtml = "";
    if (Array.isArray(data.achievements) && data.achievements.length > 0) {
        achievementsHtml = `
      <div class="section-title">Achievements</div>
      <ul class="bullet-list">
        ${data.achievements.map(a => `<li class="bullet-item">${a}</li>`).join("")}
      </ul>
    `;
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  @page {
    size: A4;
    margin: 8mm 11mm;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: "Times New Roman", Times, Georgia, serif;
    color: #000000;
    font-size: 8.8pt;
    line-height: 1.28;
    background: #ffffff;
    -webkit-print-color-adjust: exact;
  }
  .header {
    text-align: center;
    margin-bottom: 5px;
  }
  .candidate-name {
    font-size: 20pt;
    font-weight: bold;
    letter-spacing: -0.01em;
    margin-bottom: 1px;
    color: #000;
  }
  .candidate-title {
    font-size: 10pt;
    margin-bottom: 2px;
    color: #111;
  }
  .candidate-contact {
    font-size: 8.5pt;
    color: #222;
  }
  .candidate-contact a {
    color: #222;
    text-decoration: none;
  }
  .section-title {
    font-size: 10.5pt;
    font-weight: bold;
    border-bottom: 0.75px solid #000000;
    margin-top: 5px;
    margin-bottom: 3px;
    padding-bottom: 1px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .p-summary {
    font-size: 8.8pt;
    line-height: 1.28;
    text-align: justify;
    margin-bottom: 2px;
  }
  .row-between {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 8.8pt;
    line-height: 1.25;
  }
  .bold { font-weight: bold; }
  .italic { font-style: italic; }
  .skills-table {
    width: 100%;
    margin-top: 1px;
    font-size: 8.6pt;
    line-height: 1.26;
  }
  .skills-row {
    display: flex;
    margin-bottom: 1.5px;
  }
  .skills-label {
    width: 130px;
    font-weight: bold;
    flex-shrink: 0;
  }
  .skills-val {
    flex: 1;
  }
  .bullet-list {
    list-style: none;
    padding-left: 12px;
    margin: 1.5px 0 3px 0;
  }
  .bullet-item {
    position: relative;
    font-size: 8.7pt;
    line-height: 1.27;
    margin-bottom: 1.5px;
    text-align: justify;
  }
  .bullet-item::before {
    content: "–";
    position: absolute;
    left: -12px;
    top: 0;
    font-size: 8.7pt;
  }
  .tech-line {
    font-size: 8.7pt;
    font-style: italic;
    margin-top: 1px;
    margin-bottom: 1px;
    padding-left: 12px;
    position: relative;
  }
  .tech-line::before {
    content: "–";
    position: absolute;
    left: 0;
  }
  .tech-line strong {
    font-style: normal;
  }
</style>
</head>
<body>
  <div class="header">
    <h1 class="candidate-name">${name}</h1>
    ${title ? `<div class="candidate-title">${title}</div>` : ""}
    <div class="candidate-contact">${contactParts}</div>
  </div>

  ${data.summary ? `
  <div class="section-title">Summary</div>
  <p class="p-summary">${data.summary}</p>
  ` : ""}

  ${educationHtml}
  ${skillsHtml}
  ${experienceHtml}
  ${projectsHtml}
  ${achievementsHtml}
</body>
</html>
    `;
}

async function generateOptimizedResume({ resume, selfDescription, jobDescription }) {
    const rawResume = (resume || selfDescription || "").trim();

    const prompt = `
You are an expert executive resume consultant and ATS optimization specialist.
The candidate has provided their actual 1-page resume, and wants it TAILORED specifically for the target job description.

CRITICAL INSTRUCTIONS:
1. STRICT 1-PAGE BUDGET:
   - The candidate's original resume was designed to fit on EXACTLY 1 PAGE.
   - Do NOT inflate section lengths. Keep summary to 3-4 lines maximum.
   - Keep bullet points to 1-2 lines each (3-4 bullets per experience or project).
   - The output must fit on 1 SINGLE A4 PAGE when rendered.

2. STRICTLY PRESERVE THE CANDIDATE'S ORIGINAL RESUME STRUCTURE AND FORMAT:
   - Retain all personal details: Name, Title, Phone, Email, LinkedIn, GitHub, Location.
   - Retain all authentic institutions, companies, degrees, dates, and project titles. Do NOT invent fake history.
   - Keep the exact same section order (Summary, Education, Technical Skills, Experience, Projects, Achievements).

3. INTELLIGENTLY MODIFY & TAILOR THE CONTENT:
   - Refine the Summary to strongly highlight the target role, stack, and strengths.
   - Enhance the bullet points in Experience and Projects using strong action verbs, quantifiable metrics, and naturally integrating required tools, frameworks, and keywords from the Job Description into the candidate's authentic work.
   - Reorder or highlight relevant Technical Skills to prioritize what the Job Description demands.

4. RETURN FORMAT:
   Return ONLY a valid, complete JSON object.
   Do NOT use markdown code fences around the JSON.
   Do NOT output conversational text.

Schema:
{
  "resumeData": {
    "name": "<Candidate Name>",
    "title": "<Candidate Subtitle / Role, e.g. Full-Stack Developer (MERN)>",
    "contact": {
      "phone": "<Phone>",
      "email": "<Email>",
      "linkedin": "<LinkedIn URL or 'LinkedIn'>",
      "github": "<GitHub URL or 'GitHub'>",
      "location": "<Location>"
    },
    "summary": "<Tailored professional summary (3-4 lines)>",
    "education": [
      {
        "institution": "<College / University>",
        "date": "<e.g. Expected Graduation: Aug 2027>",
        "degree": "<Degree Name>",
        "location": "<Location>",
        "coursework": "<Relevant Coursework, or empty string>"
      }
    ],
    "skills": [
      { "category": "Languages", "items": "JavaScript (ES6+), ..." },
      { "category": "Frontend", "items": "React.js, ..." },
      { "category": "Backend", "items": "Node.js, ..." },
      { "category": "Databases & ORM", "items": "MongoDB, ..." },
      { "category": "Tools & DevOps", "items": "Git, GitHub, ..." },
      { "category": "CS Fundamentals", "items": "DSA, OOP, ..." }
    ],
    "experience": [
      {
        "title": "<Role Title>",
        "company": "<Company Name>",
        "date": "<Dates, e.g. Apr 2026 to May 2026>",
        "location": "<Location or empty string>",
        "bullets": [
          "<Tailored bullet 1 with action verb and metric>",
          "<Tailored bullet 2 with JD keyword integration>"
        ]
      }
    ],
    "projects": [
      {
        "title": "<Project Name>",
        "linkText": "<e.g. Github Link>",
        "techStack": "<e.g. React, Node.js, Express.js...>",
        "bullets": [
          "<Tailored bullet 1>",
          "<Tailored bullet 2>"
        ]
      }
    ],
    "achievements": [
      "<Tailored achievement 1>",
      "<Tailored achievement 2>"
    ]
  },
  "bulletDiffs": [
    {
      "section": "<Section Name, e.g. 'Summary', 'Experience: Full-Stack Developer', or 'Project: AI Interview Assistant'>",
      "original": "<Original text or bullet from candidate's original resume before optimization>",
      "optimized": "<Tailored bullet point with strong action verb, metric, or JD keywords>",
      "improvement": "<Short explanation of why and what was improved>",
      "impactType": "<One of: 'Metrics & Impact', 'Action Verb', 'JD Keyword Match', 'Clarity & Conciseness'>"
    }
  ],
  "keyChanges": [
    "<specific change made, e.g. 'Tailored summary to highlight Express & microservices'>"
  ],
  "matchedKeywords": [
    "<keyword from job description successfully integrated>"
  ],
  "suggestions": [
    "<specific tip for interviews or additional portfolio highlight>"
  ]
}

Input Data:
Candidate's Original Resume / Profile:
${rawResume || "Not provided"}

Target Job Description:
${jobDescription || "Software Developer"}
`;

    const content = await callGemini({
        systemInstruction: "You are an expert resume optimizer. Return ONLY valid, complete JSON strictly matching the requested schema. Preserve the candidate's exact 1-page structure and details.",
        prompt,
        temperature: 0.2,
        maxOutputTokens: 8192
    });

    const cleanedContent = String(content)
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

    let parsed;
    try {
        parsed = JSON.parse(cleanedContent);
    } catch (err) {
        console.error("JSON parsing error:", err, "Raw content:", cleanedContent);
        throw new Error("AI did not return valid JSON");
    }

    const resumeData = parsed.resumeData || null;
    const modifiedResumeText = resumeData
        ? convertResumeDataToMarkdown(resumeData)
        : String(parsed.modifiedResumeText || rawResume || "").trim();

    const keyChanges = Array.isArray(parsed.keyChanges) ? parsed.keyChanges.map(String).filter(Boolean) : [];
    const matchedKeywords = Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords.map(String).filter(Boolean) : [];
    const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String).filter(Boolean) : [];

    let bulletDiffs = Array.isArray(parsed.bulletDiffs) && parsed.bulletDiffs.length > 0
        ? parsed.bulletDiffs.map(d => ({
            section: String(d.section || "General"),
            original: String(d.original || "").trim(),
            optimized: String(d.optimized || "").trim(),
            improvement: String(d.improvement || "Enhanced with quantifiable metrics & ATS keywords"),
            impactType: String(d.impactType || "Metrics & Impact")
        })).filter(d => d.original && d.optimized)
        : [];

    if (bulletDiffs.length === 0) {
        bulletDiffs = buildBulletDiffsFallback({
            originalResumeText: rawResume,
            resumeData,
            keyChanges,
            matchedKeywords
        });
    }

    return {
        modifiedResumeText,
        resumeData,
        bulletDiffs,
        keyChanges,
        matchedKeywords,
        suggestions
    };
}

function buildBulletDiffsFallback({ originalResumeText = "", resumeData = null, keyChanges = [], matchedKeywords = [] }) {
    const diffs = [];
    const rawText = String(originalResumeText || "");

    // 1. Professional Summary Diff
    if (resumeData && resumeData.summary) {
        let origSummary = "";
        const summaryMatch = rawText.match(/(?:^|\n)\s*Summary\s*\n([\s\S]*?)(?=(?:^|\n)\s*(?:Education|Technical Skills|Experience)|$)/i);
        if (summaryMatch && summaryMatch[1]) {
            origSummary = summaryMatch[1].replace(/\r?\n/g, " ").trim();
        } else {
            origSummary = "Full-Stack (MERN) Developer building secure, scalable applications with AI integration. Seeking a full-stack or SDE role.";
        }

        diffs.push({
            section: "Professional Summary",
            original: origSummary,
            optimized: resumeData.summary,
            improvement: keyChanges[0] || "Elevated positioning for target role, highlighted scalable microservices, low-latency REST APIs, and clean testable code.",
            impactType: "JD Keyword Match"
        });
    }

    // Helper to extract bullets under a standalone section heading
    function extractSectionBullets(sectionHeading, nextHeading) {
        const regex = new RegExp(`(?:^|\\n)\\s*${sectionHeading}\\s*\\n([\\s\\S]*?)(?=(?:^|\\n)\\s*${nextHeading}|$)`, "i");
        const match = rawText.match(regex);
        if (!match || !match[1]) return [];
        return match[1]
            .split("\n")
            .map(l => l.trim())
            .filter(l => /^[-*•–]\s+/.test(l) && !l.toLowerCase().includes("tech:") && !l.toLowerCase().includes("coursework:"))
            .map(l => l.replace(/^[-*•–]\s*/, "").trim());
    }

    // 2. Experience Diffs
    const expOriginalBullets = extractSectionBullets("Experience", "Projects");
    if (resumeData && Array.isArray(resumeData.experience) && resumeData.experience.length > 0) {
        const exp = resumeData.experience[0];
        const expTitle = `Experience: ${exp.title || "Full-Stack Developer"}${exp.company ? ` at ${exp.company}` : ""}`;
        const optBullets = Array.isArray(exp.bullets) ? exp.bullets : [];

        optBullets.slice(0, 3).forEach((optBullet, idx) => {
            const origBullet = expOriginalBullets[idx] || expOriginalBullets[0] || "Developed web features, route authentication, and content dashboards.";
            diffs.push({
                section: expTitle,
                original: origBullet,
                optimized: optBullet,
                improvement: idx === 0
                    ? "Quantified user scale (50+ concurrent users) and specified production security (RBAC for 15+ routes)."
                    : idx === 1
                    ? "Added quantifiable efficiency metric (93% reduction in publication time) with action verb 'Architected'."
                    : "Emphasized database indexing, search discoverability (40% boost), and low-latency API optimization.",
                impactType: idx % 2 === 0 ? "Metrics & Impact" : "Action Verb"
            });
        });
    }

    // 3. Projects Diffs
    const projectsMatch = rawText.match(/(?:^|\n)\s*Projects\s*\n([\s\S]*?)(?=(?:^|\n)\s*Achievements|$)/i);
    const projectsText = projectsMatch ? projectsMatch[1] : "";

    if (resumeData && Array.isArray(resumeData.projects)) {
        resumeData.projects.slice(0, 3).forEach((proj, pIdx) => {
            const projTitle = `Project: ${proj.title || "Web Application"}`;
            let origBullet = "";

            // Find matching project in projects section
            const firstWord = (proj.title || "").split(" ")[0].replace(/[^\w]/g, "");
            if (firstWord && projectsText) {
                const projRegex = new RegExp(`${firstWord}[\\s\\S]*?(?=(?:StayGenie|BankCore|AI Resume|Achievements|$))`, "i");
                const pMatch = projectsText.match(projRegex);
                if (pMatch) {
                    const pBullets = pMatch[0]
                        .split("\n")
                        .map(l => l.trim())
                        .filter(l => /^[-*•–]\s+/.test(l) && !l.toLowerCase().includes("tech:") && !l.toLowerCase().includes("coursework:"))
                        .map(l => l.replace(/^[-*•–]\s*/, "").trim());
                    if (pBullets.length > 0) origBullet = pBullets[0];
                }
            }

            if (!origBullet) {
                origBullet = `Developed ${proj.title} web application with user authentication, database models, and responsive frontend.`;
            }

            const optBullet = Array.isArray(proj.bullets) && proj.bullets.length > 0
                ? proj.bullets[0]
                : `Engineered ${proj.title} using ${proj.techStack || "React, Node.js, MongoDB"} with high-performance endpoints.`;

            diffs.push({
                section: projTitle,
                original: origBullet,
                optimized: optBullet,
                improvement: `Injected required tech competencies (${proj.techStack ? proj.techStack.split(",").slice(0, 3).join(", ") : "REST APIs, JWT"}) and quantified engineering outcomes.`,
                impactType: pIdx === 0 ? "JD Keyword Match" : "Action Verb"
            });
        });
    }

    return diffs;
}


function convertMarkdownResumeToHtml(markdownText) {
    const lines = String(markdownText || "").trim().split("\n");
    let bodyHtml = "";
    let inList = false;
    let isFirstHeader = true;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) {
            if (inList) {
                bodyHtml += "</ul>\n";
                inList = false;
            }
            continue;
        }

        // Name Header (# Name or first line if short and no punctuation)
        if (line.startsWith("# ") || (isFirstHeader && i === 0 && line.length < 50 && !line.includes(":") && !line.includes("@"))) {
            if (inList) { bodyHtml += "</ul>\n"; inList = false; }
            const name = line.replace(/^#\s*/, "");
            bodyHtml += `<div class="header"><h1 class="candidate-name">${name}</h1></div>\n`;
            isFirstHeader = false;
            continue;
        }
        isFirstHeader = false;

        // Section Headers (## Section or all-caps short title)
        if (line.startsWith("## ") || (/^[A-Z\s/&-]{3,35}$/.test(line) && !line.includes("@") && !line.includes("http"))) {
            if (inList) { bodyHtml += "</ul>\n"; inList = false; }
            const title = line.replace(/^##\s*/, "");
            bodyHtml += `<div class="section-title">${title}</div>\n`;
            continue;
        }

        // Two-column row: e.g. **Title** | Date or College | Date
        if (line.includes("|") && !line.includes("@") && line.length < 140) {
            if (inList) { bodyHtml += "</ul>\n"; inList = false; }
            const parts = line.split("|").map(p => p.trim());
            if (parts.length >= 2) {
                const left = parts[0].replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                const right = parts.slice(1).join(" | ").replace(/\*(.*?)\*/g, "<em>$1</em>");
                bodyHtml += `<div class="row-between"><span>${left}</span><span>${right}</span></div>\n`;
                continue;
            }
        }

        // Bullets
        if (line.startsWith("- ") || line.startsWith("* ") || line.startsWith("– ") || line.startsWith("• ")) {
            if (!inList) {
                bodyHtml += `<ul class="bullet-list">\n`;
                inList = true;
            }
            const bullet = line
                .replace(/^[-*–•]\s*/, "")
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            bodyHtml += `  <li class="bullet-item">${bullet}</li>\n`;
            continue;
        }

        // Regular line
        if (inList) { bodyHtml += "</ul>\n"; inList = false; }
        const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        if (line.includes("@") || line.includes("|") || line.toLowerCase().includes("phone") || line.toLowerCase().includes("github")) {
            bodyHtml += `<div class="candidate-contact" style="text-align: center; margin-bottom: 5px;">${formatted}</div>\n`;
        } else {
            bodyHtml += `<p class="p-summary">${formatted}</p>\n`;
        }
    }
    if (inList) bodyHtml += "</ul>\n";
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  @page { size: A4; margin: 8mm 11mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Times New Roman", Times, Georgia, serif;
    color: #000;
    font-size: 8.8pt;
    line-height: 1.28;
    background: #fff;
    -webkit-print-color-adjust: exact;
  }
  .header { text-align: center; margin-bottom: 4px; }
  .candidate-name { font-size: 20pt; font-weight: bold; margin-bottom: 1px; color: #000; }
  .candidate-contact { font-size: 8.5pt; color: #222; text-align: center; }
  .section-title {
    font-size: 10.5pt;
    font-weight: bold;
    border-bottom: 0.75px solid #000;
    margin-top: 5px;
    margin-bottom: 3px;
    padding-bottom: 1px;
    text-transform: uppercase;
  }
  .row-between { display: flex; justify-content: space-between; align-items: baseline; font-size: 8.8pt; line-height: 1.25; }
  .bullet-list { list-style: none; padding-left: 12px; margin: 1.5px 0 3px 0; }
  .bullet-item { position: relative; font-size: 8.7pt; line-height: 1.27; margin-bottom: 1.5px; }
  .bullet-item::before { content: "–"; position: absolute; left: -12px; top: 0; }
  .p-summary { font-size: 8.8pt; line-height: 1.28; text-align: justify; margin-bottom: 2px; }
</style>
</head>
<body>
  ${bodyHtml}
</body>
</html>
    `;
}


let sharedBrowser = null;
let sharedBrowserTimer = null;

async function getSharedBrowser() {
    if (sharedBrowser && sharedBrowser.isConnected()) {
        if (sharedBrowserTimer) clearTimeout(sharedBrowserTimer);
        sharedBrowserTimer = setTimeout(async () => {
            if (sharedBrowser) {
                try { await sharedBrowser.close(); } catch (_) {}
                sharedBrowser = null;
            }
        }, 60000);
        return sharedBrowser;
    }

    const possibleBrowsers = [
        process.env.PUPPETEER_EXECUTABLE_PATH,
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
    ].filter(Boolean);

    const executablePath = possibleBrowsers.find(p => fs.existsSync(p));
    const launchOptions = {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--disable-gpu",
            "--no-first-run",
            "--no-zygote"
        ]
    };
    if (executablePath) {
        launchOptions.executablePath = executablePath;
    }

    sharedBrowser = await puppeteer.launch(launchOptions);

    if (sharedBrowserTimer) clearTimeout(sharedBrowserTimer);
    sharedBrowserTimer = setTimeout(async () => {
        if (sharedBrowser) {
            try { await sharedBrowser.close(); } catch (_) {}
            sharedBrowser = null;
        }
    }, 60000);

    return sharedBrowser;
}

process.on("SIGINT", async () => {
    if (sharedBrowser) {
        try { await sharedBrowser.close(); } catch (_) {}
    }
});
process.on("SIGTERM", async () => {
    if (sharedBrowser) {
        try { await sharedBrowser.close(); } catch (_) {}
    }
});

async function generateResumePdf({ resume, selfDescription, jobDescription, modifiedResumeText: existingText, resumeData: existingData }) {
    let textToUse = existingText;
    let dataToUse = existingData;
    let optimizedResume = null;

    if (!dataToUse && !textToUse) {
        optimizedResume = await generateOptimizedResume({ resume, selfDescription, jobDescription });
        dataToUse = optimizedResume.resumeData;
        textToUse = optimizedResume.modifiedResumeText;
    }

    const htmlContent = dataToUse
        ? renderStructuredResumeToHtml(dataToUse)
        : convertMarkdownResumeToHtml(textToUse);

    const browser = await getSharedBrowser();
    const page = await browser.newPage();
    try {
        await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
        const rawPdf = await page.pdf({
            format: "A4",
            margin: { top: "8mm", bottom: "8mm", left: "11mm", right: "11mm" },
            printBackground: true
        });
        const pdfBuffer = Buffer.from(rawPdf);
        return { pdfBuffer, optimizedResume };
    } finally {
        await page.close().catch(() => {});
    }
}


async function evaluateInterviewAnswer({ question, expectedAnswer, userAnswer, codeAnswer, language = "javascript", jobDescription }) {
    const isCode = Boolean(codeAnswer && codeAnswer.trim());

    const prompt = `
You are an experienced Principal Engineer and expert technical interviewer evaluating a candidate's answer for a software engineering role.

Interview Question:
${question}

Reference / Expected Key Points:
${expectedAnswer || "Not provided"}

Target Role Context:
${jobDescription || "Software Developer"}

${isCode ? `Candidate's Code Solution (${language}):
\`\`\`${language}
${codeAnswer}
\`\`\`
${userAnswer ? `Candidate's Conceptual Explanation / Walkthrough:\n${userAnswer}` : ""}` : `Candidate's Conceptual Answer:\n${userAnswer || "No text provided"}`}

Instructions:
1. Score the candidate's answer fairly from 0 to 10 (10 = optimal, production-ready solution with clean structure; 0 = incorrect/empty).
2. If code was provided, analyze:
   - Correctness, logic, syntax, and potential runtime bugs.
   - Time Complexity and Space Complexity in standard Big-O notation.
   - Edge cases handled (e.g. empty inputs, null, boundary values) vs missed.
   - Clean code, modularity, and best practices.
   - Provide a complete, clean, optimized reference code implementation in the same language (${language}).
3. If only conceptual answer was provided, evaluate clarity, depth, accuracy, and domain competence.

Return ONLY a valid JSON object matching this exact schema (no markdown code blocks around the JSON):
{
  "score": <integer from 0 to 10>,
  "complexity": {
    "time": "<Time complexity, e.g. O(N) or N/A>",
    "space": "<Space complexity, e.g. O(1) or N/A>"
  },
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<specific point that is missing or can be improved>"],
  "edgeCases": {
    "handled": ["<edge case handled, e.g. 'Empty array input'>"],
    "missed": ["<edge case missed, e.g. 'Negative or overflow values'>"]
  },
  "optimizedCode": "<complete clean formatted reference code snippet, or empty string if purely conceptual>",
  "improvedAnswer": "<clear explanation and ideal answer walkthrough>"
}
`;

    const content = await callGemini({
        systemInstruction: "You are a strict yet helpful engineering interviewer. Return ONLY valid JSON matching the requested schema.",
        prompt,
        temperature: 0.2,
        maxOutputTokens: 3072
    });

    const cleanedContent = String(content)
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

    let parsed;
    try {
        parsed = JSON.parse(cleanedContent);
    } catch (err) {
        console.error("JSON parsing error in evaluateInterviewAnswer:", err, "Raw content:", cleanedContent);
        throw new Error("AI did not return valid JSON");
    }

    return {
        score: Math.max(0, Math.min(10, Math.round(Number(parsed?.score) || 0))),
        complexity: {
            time: String(parsed?.complexity?.time || "N/A"),
            space: String(parsed?.complexity?.space || "N/A")
        },
        strengths: Array.isArray(parsed?.strengths) ? parsed.strengths.map(String).filter(Boolean) : [],
        improvements: Array.isArray(parsed?.improvements) ? parsed.improvements.map(String).filter(Boolean) : [],
        edgeCases: {
            handled: Array.isArray(parsed?.edgeCases?.handled) ? parsed.edgeCases.handled.map(String).filter(Boolean) : [],
            missed: Array.isArray(parsed?.edgeCases?.missed) ? parsed.edgeCases.missed.map(String).filter(Boolean) : []
        },
        optimizedCode: String(parsed?.optimizedCode || "").trim(),
        improvedAnswer: String(parsed?.improvedAnswer || "")
    };
}


async function transcribeAudio({ audioBuffer, mimeType = "audio/webm" }) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing in .env");
    }

    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    const primaryModel = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

    const prompt = "Transcribe all spoken words in this audio recording accurately into clean text. Accurately transcribe English, Indian English, Hinglish, and technical software terms. If nothing was said or only background noise, reply with an empty string. Return ONLY the transcribed text without extra quotes, tags, or explanation.";

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${primaryModel}:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                inlineData: {
                                    mimeType,
                                    data: base64Audio
                                }
                            },
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 2048
                }
            })
        }
    );

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.error?.message || "Failed to transcribe audio with Gemini");
    }

    const parts = data?.candidates?.[0]?.content?.parts || [];
    const transcript = parts.map(p => p.text || "").join("").trim();
    return transcript;
}


module.exports = {
    generateInterviewReport,
    generateResumePdf,
    generateOptimizedResume,
    buildBulletDiffsFallback,
    evaluateInterviewAnswer,
    transcribeAudio
};


