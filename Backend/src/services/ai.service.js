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
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
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
- Generate at least 4 behavioralQuestions using the STAR method in answers.
- Identify realistic skillGaps with severity ("low", "medium", or "high").
- Build a 7-day preparationPlan (day 1 to day 7) with clear focus and actionable tasks.
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
      "tasks": ["<actionable task 1>", "<actionable task 2>"]
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
        behavioralQuestions: Array.isArray(safeParsed.behavioralQuestions)
            ? safeParsed.behavioralQuestions
                .filter(item => item && (item.question || item.answer))
                .map((item) => ({
                    question: String(item?.question || "Behavioral Question"),
                    intention: String(item?.intention || "Assess cultural fit, teamwork, and communication"),
                    answer: String(item?.answer || "Structure response using STAR method: Situation, Task, Action, Result")
                }))
            : [],
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
                .map((item, index) => ({
                    day: Number(item?.day) || index + 1,
                    focus: String(item?.focus || `Day ${index + 1} Preparation`),
                    tasks: Array.isArray(item?.tasks) && item.tasks.length > 0
                        ? item.tasks.map(t => String(t || "").trim()).filter(Boolean)
                        : ["Review key concepts and practice sample interview problems"]
                }))
            : [],
        title: String(safeParsed.title || "Job Interview Report")
    };

    const validation = interviewReportSchema.safeParse(repaired);
    if (!validation.success) {
        throw new Error(`AI response could not be repaired to expected format: ${validation.error.message}`);
    }

    return validation.data;
}


async function generateOptimizedResume({ resume, selfDescription, jobDescription }) {
    const prompt = `
You are an expert resume writer and career coach.
Rewrite and optimize the candidate's resume to better match the target job description.

Input Data:
1. Original Resume:
${resume || "Not provided"}

2. Candidate Self Introduction:
${selfDescription || "Not provided"}

3. Target Job Description:
${jobDescription || "Not provided"}

Return ONLY a valid, complete JSON object.
Do NOT use markdown code fences.
Do NOT output any conversational text.

JSON Schema format:
{
  "summary": "<a strong professional summary tailored to the job>",
  "skills": ["<skill 1>", "<skill 2>"],
  "experience": [
    {
      "title": "<job title>",
      "company": "<company name>",
      "duration": "<duration>",
      "points": ["<achievement or responsibility>"]
    }
  ],
  "suggestions": ["<improvement tip 1>", "<improvement tip 2>"]
}
`;

    const content = await callGemini({
        systemInstruction: "You are an expert resume optimizer. Return ONLY valid, complete JSON strictly matching the requested schema. Do not include markdown code fences or extra text.",
        prompt,
        temperature: 0.3,
        maxOutputTokens: 4096
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

    return parsed;
}


async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const optimizedResume = await generateOptimizedResume({ resume, selfDescription, jobDescription });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #222; font-size: 14px; line-height: 1.6; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 15px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 20px; }
  ul { margin: 6px 0; padding-left: 20px; }
  li { margin-bottom: 3px; }
  .summary { margin-bottom: 16px; color: #444; }
  .job { margin-bottom: 12px; }
  .job-title { font-weight: bold; }
  .job-meta { color: #666; font-size: 13px; }
</style>
</head>
<body>

<h2>Professional Summary</h2>
<p class="summary">${optimizedResume.summary || ""}</p>

<h2>Skills</h2>
<ul>
  ${(optimizedResume.skills || []).map(s => `<li>${s}</li>`).join("")}
</ul>

<h2>Experience</h2>
${(optimizedResume.experience || []).map(exp => `
  <div class="job">
    <div class="job-title">${exp.title || ""} — ${exp.company || ""}</div>
    <div class="job-meta">${exp.duration || ""}</div>
    <ul>
      ${(exp.points || []).map(p => `<li>${p}</li>`).join("")}
    </ul>
  </div>
`).join("")}

<h2>Suggestions for Improvement</h2>
<ul>
  ${(optimizedResume.suggestions || []).map(s => `<li>${s}</li>`).join("")}
</ul>

</body>
</html>
`;

    const possibleBrowsers = [
        process.env.PUPPETEER_EXECUTABLE_PATH,
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
    ].filter(Boolean);

    const executablePath = possibleBrowsers.find(p => fs.existsSync(p));
    const launchOptions = { headless: true, args: ["--no-sandbox"] };
    if (executablePath) {
        launchOptions.executablePath = executablePath;
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" } });
    await browser.close();

    return { pdfBuffer, optimizedResume };
}


async function evaluateInterviewAnswer({ question, expectedAnswer, userAnswer, jobDescription }) {
    const prompt = `
You are an experienced technical and behavioral interviewer.
Evaluate the candidate's practice answer fairly and constructively.

Interview Question:
${question}

Reference / Expected Key Points:
${expectedAnswer || "Not provided"}

Target Role Context:
${jobDescription || "Software Developer"}

Candidate's Answer:
${userAnswer}

Return ONLY a valid JSON object matching this exact schema (no markdown fences, no extra text):
{
  "score": <integer from 0 to 10>,
  "strengths": ["<what the candidate did well>"],
  "improvements": ["<specific point that is missing or can be improved>"],
  "improvedAnswer": "<a crisp, strong version of the candidate's answer>"
}
`;

    const content = await callGemini({
        systemInstruction: "You are a strict yet helpful interview coach. Return ONLY valid JSON matching the requested schema.",
        prompt,
        temperature: 0.2,
        maxOutputTokens: 2048
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
        strengths: Array.isArray(parsed?.strengths) ? parsed.strengths.map(String).filter(Boolean) : [],
        improvements: Array.isArray(parsed?.improvements) ? parsed.improvements.map(String).filter(Boolean) : [],
        improvedAnswer: String(parsed?.improvedAnswer || "")
    };
}


module.exports = {
    generateInterviewReport,
    generateResumePdf,
    generateOptimizedResume,
    evaluateInterviewAnswer
};


