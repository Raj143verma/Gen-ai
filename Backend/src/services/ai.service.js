const fetch =
    globalThis.fetch ||
    ((...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args)));
const { z } = require("zod");
const {  zodToJsonSchema } = require("zod-to-json-schema");
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


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const model = process.env.OPENROUTER_MODEL || "qwen/qwen3.6-plus";
    const maxTokens = Number(process.env.OPENROUTER_MAX_TOKENS || 150);

    const prompt = `
Return ONLY valid JSON.

STRICT RULES:

* Do not include any text before or after JSON.
* Do not use markdown (no triple-backtick fences).
* All strings must be enclosed in double quotes.
* Do not leave any string incomplete.
* Do not cut the response midway.
* Ensure all brackets {} and [] are properly closed.
* Do not add trailing commas.
* Keep the response SHORT to avoid truncation.

If the JSON is invalid or incomplete, FIX it before sending.

Generate the response in this exact JSON structure:

{
"matchScore": number,
"technicalQuestions": [],
"behavioralQuestions": [],
"skillGaps": [],
"preparationPlan": [],
"title": "string"
}

INPUT:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model,
            messages: [
                {
                    role: "system",
                    content: "Return only valid JSON, no markdown, no extra text. Ensure output strictly matches the requested schema fields."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.2,
            max_tokens: Number.isFinite(maxTokens) ? maxTokens : 150,
            response_format: { type: "json_object" }
        })
    });

    const data = await response.json();

    if (!response.ok) {
        const apiError = data?.error?.message || data?.error || response.statusText;
        throw new Error(`OpenRouter request failed (${response.status}): ${apiError}`);
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
        throw new Error(`OpenRouter returned unexpected response: ${JSON.stringify(data)}`);
    }

    const cleanedContent = String(content)
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

    // 🧠 JSON parse safely
    let parsed;
    try {
        parsed = JSON.parse(cleanedContent);
    } catch (err) {
        console.error("JSON parsing error:", err);
        throw new Error("AI did not return valid JSON");
    }

    const safeParsed = parsed && typeof parsed === "object" ? parsed : {};

    const repaired = {
        matchScore: Math.max(0, Math.min(100, Number(safeParsed.matchScore) || 0)),
        technicalQuestions: Array.isArray(safeParsed.technicalQuestions)
            ? safeParsed.technicalQuestions.slice(0, 2).map((item) => ({
                question: String(item?.question || ""),
                intention: String(item?.intention || ""),
                answer: String(item?.answer || "")
            }))
            : [],
        behavioralQuestions: Array.isArray(safeParsed.behavioralQuestions)
            ? safeParsed.behavioralQuestions.slice(0, 2).map((item) => ({
                question: String(item?.question || ""),
                intention: String(item?.intention || ""),
                answer: String(item?.answer || "")
            }))
            : [],
        skillGaps: Array.isArray(safeParsed.skillGaps)
            ? safeParsed.skillGaps.slice(0, 3).map((item) => ({
                skill: String(item?.skill || ""),
                severity: ["low", "medium", "high"].includes(item?.severity) ? item.severity : "medium"
            }))
            : [],
        preparationPlan: Array.isArray(safeParsed.preparationPlan)
            ? safeParsed.preparationPlan.slice(0, 3).map((item, index) => ({
                day: Number(item?.day) || index + 1,
                focus: String(item?.focus || ""),
                tasks: Array.isArray(item?.tasks)
                    ? item.tasks.map((task) => String(task || ""))
                    : []
            }))
            : [],
        title: String(safeParsed.title || "Interview Report")
    };

    const validation = interviewReportSchema.safeParse(repaired);
    if (!validation.success) {
        throw new Error(`AI response could not be repaired to expected format: ${validation.error.message}`);
    }

    const normalized = {
        ...validation.data,
        matchScore: Math.max(0, Math.min(100, Number(validation.data.matchScore) || 0)),
        technicalQuestions: validation.data.technicalQuestions.slice(0, 2),
        behavioralQuestions: validation.data.behavioralQuestions.slice(0, 2),
        skillGaps: validation.data.skillGaps.slice(0, 3),
        preparationPlan: validation.data.preparationPlan.slice(0, 3)
    };

    return normalized;
}


module.exports = { generateInterviewReport };


