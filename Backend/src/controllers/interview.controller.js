const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const { generateInterviewReport, generateResumePdf, generateOptimizedResume, buildBulletDiffsFallback, evaluateInterviewAnswer, transcribeAudio } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const mongoose = require("mongoose");




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterviewReportController(req, res) {
    try {
        const { selfDescription, jobDescription, title } = req.body;

        if (!req.file && !selfDescription) {
            return res.status(400).json({
                message: "Please provide either a resume file or a self description."
            });
        }

        let resumeText = selfDescription || "";
        let originalResumeFile = null;
        if (req.file) {
            originalResumeFile = {
                data: req.file.buffer,
                contentType: req.file.mimetype || "application/pdf",
                fileName: req.file.originalname || "resume.pdf"
            };
            const originalName = (req.file.originalname || "").toLowerCase();
            const isDocx =
                originalName.endsWith(".docx") ||
                req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

            if (isDocx) {
                const parsedDocx = await mammoth.extractRawText({ buffer: req.file.buffer });
                resumeText = parsedDocx.value || "";
            } else {
                const parser = new PDFParse({ data: req.file.buffer });
                const parsed = await parser.getText();
                resumeText = parsed.text || "";
            }
        }

        const effectiveJobDescription = jobDescription && jobDescription.trim()
            ? jobDescription.trim()
            : "General Software Development Role";

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription: effectiveJobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resumeText: resumeText || "",
            originalResumeFile,
            selfDescription: selfDescription || "",
            jobDescription: effectiveJobDescription,
            ...interViewReportByAi,
            title: interViewReportByAi.title || title || "Job Interview Report"
        });

        res.status(201).json({
            success: true,
            message: "Interview report generated successfully.",
            interviewReport
        });
    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({ message: "Failed to generate interview report." });
    }
}
   

/**
 * @description Controller to get interview report by interviewid.
 */

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        console.log(`-> [Backend] Received request for interview id: ${interviewId}`);

        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            console.warn(`<- [Backend] Invalid MongoDB ObjectId format: ${interviewId}`);
            return res.status(400).json({ message: "Invalid interview ID format." });
        }

        const interviewReport = await interviewReportModel
            .findOne({ _id: interviewId, user: req.user.id })
            .select("-originalResumeFile.data");

        if (!interviewReport) {
            console.warn(`<- [Backend] Report not found for id: ${interviewId}`);
            return res.status(404).json({
                message: "Interview report not found.",
            });
        }

       res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (error) {
        console.error("Error fetching interview report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @description Controller to get all interview reports of logged in user.
 */

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resumeText -selfDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan -originalResumeFile");

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    } catch (error) {
        console.error("Error fetching interview reports:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @description Controller to delete an interview report by ID.
 */
async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({ message: "Invalid interview ID format." });
        }

        const deletedReport = await interviewReportModel.findOneAndDelete({
            _id: interviewId,
            user: req.user.id
        });

        if (!deletedReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        res.status(200).json({
            message: "Interview report deleted successfully.",
            deletedId: interviewId
        });
    } catch (error) {
        console.error("Error deleting interview report:", error);
        res.status(500).json({ message: "Failed to delete interview report." });
    }
}


/**
 * @description  Controller to generate resume PDF based on user self description, resume and job description.
 */

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(interviewReportId)) {
            return res.status(400).json({ message: "Invalid interview ID format." });
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const { selfDescription, jobDescription, resumeText } = interviewReport;
        const sourceResume = resumeText || selfDescription;

        if (!sourceResume) {
            return res.status(400).json({
                message: "Resume or self description is missing from the interview report."
            });
        }

        // Return cached PDF buffer immediately if available
        if (interviewReport.cachedOptimizedPdf?.data) {
            const rawCached = interviewReport.cachedOptimizedPdf.data;
            const cachedBuffer = Buffer.isBuffer(rawCached)
                ? rawCached
                : (rawCached.buffer && Buffer.isBuffer(rawCached.buffer) ? rawCached.buffer : Buffer.from(rawCached));

            if (cachedBuffer && cachedBuffer.length > 0) {
                const genTime = interviewReport.cachedOptimizedPdf.generatedAt
                    ? new Date(interviewReport.cachedOptimizedPdf.generatedAt).getTime()
                    : new Date(interviewReport.updatedAt).getTime();
                const etag = `W/"opt-pdf-${interviewReport._id}-${genTime}"`;

                if (req.headers["if-none-match"] === etag) {
                    return res.status(304).end();
                }

                res.set({
                    'Content-Type': interviewReport.cachedOptimizedPdf.contentType || 'application/pdf',
                    'Content-Disposition': 'attachment; filename="optimized-resume.pdf"',
                    'Content-Length': cachedBuffer.length,
                    'Cache-Control': 'private, max-age=86400, stale-while-revalidate=3600',
                    'ETag': etag
                });
                return res.send(cachedBuffer);
            }
        }

        let modifiedResumeText = interviewReport.optimizedResume?.modifiedResumeText;
        let resumeData = interviewReport.optimizedResume?.resumeData;
        if (!modifiedResumeText || !resumeData) {
            const freshOptimized = await generateOptimizedResume({
                resume: sourceResume,
                selfDescription,
                jobDescription
            });
            modifiedResumeText = freshOptimized.modifiedResumeText;
            resumeData = freshOptimized.resumeData;
            interviewReport.optimizedResume = freshOptimized;
            await interviewReport.save();
        }

        const result = await generateResumePdf({
            resume: sourceResume,
            selfDescription,
            jobDescription,
            modifiedResumeText,
            resumeData
        });

        const pdfBuffer = Buffer.from(result.pdfBuffer);

        // Store compiled PDF buffer in database cache
        interviewReport.cachedOptimizedPdf = {
            data: pdfBuffer,
            contentType: 'application/pdf',
            generatedAt: new Date()
        };
        await interviewReport.save();

        const etag = `W/"opt-pdf-${interviewReport._id}-${Date.now()}"`;
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="optimized-resume.pdf"',
            'Content-Length': pdfBuffer.length,
            'Cache-Control': 'private, max-age=86400, stale-while-revalidate=3600',
            'ETag': etag
        });
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating resume PDF:", error);
        res.status(500).json({ message: "Failed to generate resume PDF." });
    }
}

/**
 * @description Controller to optimize resume based on interview report.
 */
async function optimizeResumeController(req, res) {
    try {
        const { interviewReportId, regenerate } = req.body;
        if (!mongoose.Types.ObjectId.isValid(interviewReportId)) {
            return res.status(400).json({ message: "Invalid interview ID format." });
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        });
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        const { selfDescription, jobDescription, resumeText } = interviewReport;
        const sourceResume = resumeText || selfDescription || "";

        if (interviewReport.optimizedResume?.modifiedResumeText && !regenerate) {
            let bulletDiffs = interviewReport.optimizedResume.bulletDiffs;
            if (!Array.isArray(bulletDiffs) || bulletDiffs.length === 0) {
                bulletDiffs = buildBulletDiffsFallback({
                    originalResumeText: sourceResume,
                    resumeData: interviewReport.optimizedResume.resumeData || null,
                    keyChanges: interviewReport.optimizedResume.keyChanges || [],
                    matchedKeywords: interviewReport.optimizedResume.matchedKeywords || []
                });
                interviewReport.optimizedResume.bulletDiffs = bulletDiffs;
                await interviewReport.save();
            }

            return res.status(200).json({
                message: "Cached optimized resume fetched successfully.",
                optimizedResume: {
                    modifiedResumeText: interviewReport.optimizedResume.modifiedResumeText,
                    resumeData: interviewReport.optimizedResume.resumeData || null,
                    bulletDiffs: bulletDiffs || [],
                    keyChanges: interviewReport.optimizedResume.keyChanges || [],
                    matchedKeywords: interviewReport.optimizedResume.matchedKeywords || [],
                    suggestions: interviewReport.optimizedResume.suggestions || [],
                    originalResumeText: sourceResume
                }
            });
        }

        const optimizedResume = await generateOptimizedResume({
            resume: sourceResume,
            selfDescription,
            jobDescription
        });

        // Invalidate cached PDF on regenerate
        interviewReport.cachedOptimizedPdf = null;
        interviewReport.optimizedResume = optimizedResume;
        await interviewReport.save();

        res.status(200).json({
            message: "Resume optimized successfully.",
            optimizedResume: {
                ...optimizedResume,
                bulletDiffs: optimizedResume.bulletDiffs || [],
                originalResumeText: sourceResume
            }
        });
    } catch (error) {
        console.error("Error optimizing resume:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @description Controller to toggle a roadmap task completion status for an interview report.
 */
async function toggleTaskProgressController(req, res) {
    try {
        const { interviewId } = req.params;
        const { taskKey } = req.body;

        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({ message: "Invalid interview ID format." });
        }

        if (!taskKey || typeof taskKey !== "string") {
            return res.status(400).json({ message: "taskKey is required." });
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        const existing = Array.isArray(interviewReport.completedTasks) ? interviewReport.completedTasks : [];
        const alreadyDone = existing.includes(taskKey);

        interviewReport.completedTasks = alreadyDone
            ? existing.filter((k) => k !== taskKey)
            : [...existing, taskKey];

        await interviewReport.save();

        res.status(200).json({
            message: "Progress updated.",
            completedTasks: interviewReport.completedTasks
        });
    } catch (error) {
        console.error("Error updating task progress:", error);
        res.status(500).json({ message: "Failed to update task progress." });
    }
}

/**
 * @description Controller to evaluate a user's practice answer to an interview question.
 */
async function evaluateAnswerController(req, res) {
    try {
        const { interviewReportId, question, expectedAnswer, userAnswer, codeAnswer, language, category = "technical", mode } = req.body;

        const hasText = Boolean(userAnswer && userAnswer.trim());
        const hasCode = Boolean(codeAnswer && codeAnswer.trim());

        if (!question || (!hasText && !hasCode)) {
            return res.status(400).json({ message: "Please write an answer or provide code before checking." });
        }

        let jobDescription = "";
        let interviewReport = null;
        if (interviewReportId && mongoose.Types.ObjectId.isValid(interviewReportId)) {
            interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id });
            jobDescription = interviewReport?.jobDescription || "";
        }

        const evaluation = await evaluateInterviewAnswer({
            question,
            expectedAnswer,
            userAnswer: hasText ? userAnswer.trim() : "",
            codeAnswer: hasCode ? codeAnswer.trim() : "",
            language: language || "javascript",
            jobDescription
        });

        let updatedPracticeHistory = [];
        if (interviewReport) {
            const rawScore = Number(evaluation.score);
            const validScore = Number.isFinite(rawScore) ? Math.max(0, Math.min(10, Math.round(rawScore))) : 7;
            const attempt = {
                question,
                category: category || (hasCode ? "technical" : "behavioral"),
                mode: mode || (hasCode ? "code" : "text"),
                language: language || "javascript",
                score: validScore,
                timeComplexity: evaluation.timeComplexity || "",
                spaceComplexity: evaluation.spaceComplexity || "",
                strengths: Array.isArray(evaluation.strengths) ? evaluation.strengths : [],
                improvements: Array.isArray(evaluation.improvements) ? evaluation.improvements : [],
                submittedAt: new Date()
            };

            if (!Array.isArray(interviewReport.practiceHistory)) {
                interviewReport.practiceHistory = [];
            }
            interviewReport.practiceHistory.unshift(attempt);
            if (interviewReport.practiceHistory.length > 50) {
                interviewReport.practiceHistory = interviewReport.practiceHistory.slice(0, 50);
            }
            await interviewReport.save();
            updatedPracticeHistory = interviewReport.practiceHistory;
        }

        res.status(200).json({
            message: "Answer evaluated successfully.",
            evaluation,
            practiceHistory: updatedPracticeHistory
        });
    } catch (error) {
        console.error("Error evaluating answer:", error);
        res.status(500).json({ message: "Failed to evaluate your answer." });
    }
}

/**
 * @description Controller to serve the original uploaded resume PDF (or fallback generated from resumeText).
 */
async function getOriginalResumePdfController(req, res) {
    try {
        const { interviewId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({ message: "Invalid interview ID format." });
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        // If the original uploaded file buffer is stored
        if (interviewReport.originalResumeFile?.data) {
            const rawData = interviewReport.originalResumeFile.data;
            const fileBuffer = Buffer.isBuffer(rawData)
                ? rawData
                : (rawData.buffer && Buffer.isBuffer(rawData.buffer) ? rawData.buffer : Buffer.from(rawData));

            if (fileBuffer && fileBuffer.length > 0) {
                const fileName = interviewReport.originalResumeFile.fileName || "original-resume.pdf";
                const contentType = interviewReport.originalResumeFile.contentType || "application/pdf";
                const etag = `W/"orig-pdf-${interviewId}-${new Date(interviewReport.updatedAt).getTime()}"`;

                if (req.headers["if-none-match"] === etag) {
                    return res.status(304).end();
                }

                res.set({
                    "Content-Type": contentType,
                    "Content-Disposition": `inline; filename="${fileName}"`,
                    "Content-Length": fileBuffer.length,
                    "Cache-Control": "private, max-age=86400, stale-while-revalidate=3600",
                    "ETag": etag
                });
                return res.send(fileBuffer);
            }
        }

        // Fallback for older reports without originalResumeFile: render PDF from resumeText
        const sourceResume = interviewReport.resumeText || interviewReport.selfDescription;
        if (!sourceResume) {
            return res.status(404).json({ message: "No resume found for this report." });
        }

        const result = await generateResumePdf({
            resume: sourceResume,
            selfDescription: interviewReport.selfDescription,
            jobDescription: interviewReport.jobDescription
        });

        const fallbackBuffer = Buffer.from(result.pdfBuffer);
        const etag = `W/"fallback-orig-pdf-${interviewId}-${new Date(interviewReport.updatedAt).getTime()}"`;

        if (req.headers["if-none-match"] === etag) {
            return res.status(304).end();
        }

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="original-resume.pdf"',
            "Content-Length": fallbackBuffer.length,
            "Cache-Control": "private, max-age=86400, stale-while-revalidate=3600",
            "ETag": etag
        });
        return res.send(fallbackBuffer);
    } catch (error) {
        console.error("Error fetching original resume PDF:", error);
        res.status(500).json({ message: "Failed to fetch original resume PDF." });
    }
}

/**
 * @description Controller to transcribe audio recording using Gemini AI
 */
async function transcribeAudioController(req, res) {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "No audio file provided." });
        }

        const mimeType = req.file.mimetype || "audio/webm";
        const transcript = await transcribeAudio({
            audioBuffer: req.file.buffer,
            mimeType
        });

        res.status(200).json({
            success: true,
            transcript
        });
    } catch (error) {
        console.error("Audio transcription error:", error);
        res.status(500).json({ message: error.message || "Failed to transcribe audio." });
    }
}

module.exports = { 
    generateInterviewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    deleteInterviewReportController,
    generateResumePdfController, 
    getOriginalResumePdfController,
    optimizeResumeController,
    toggleTaskProgressController,
    evaluateAnswerController,
    transcribeAudioController
};

