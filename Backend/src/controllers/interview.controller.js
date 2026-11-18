const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const { generateInterviewReport, generateResumePdf, generateOptimizedResume, evaluateInterviewAnswer } = require("../services/ai.service");
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
        if (req.file) {
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

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

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
            .select("-resumeText -selfDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

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

        const result = await generateResumePdf({
            resume: sourceResume,
            selfDescription,
            jobDescription
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="optimized-resume.pdf"'
        });
        res.send(result.pdfBuffer);
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
        const { interviewReportId } = req.body;
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

        const optimizedResume = await generateOptimizedResume({
            resume: resumeText || selfDescription,
            selfDescription,
            jobDescription
        });

        res.status(200).json({
            message: "Resume optimized successfully.",
            optimizedResume
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
        const { interviewReportId, question, expectedAnswer, userAnswer } = req.body;

        if (!question || !userAnswer || !userAnswer.trim()) {
            return res.status(400).json({ message: "Please write your answer before checking." });
        }

        let jobDescription = "";
        if (interviewReportId && mongoose.Types.ObjectId.isValid(interviewReportId)) {
            const report = await interviewReportModel
                .findOne({ _id: interviewReportId, user: req.user.id })
                .select("jobDescription");
            jobDescription = report?.jobDescription || "";
        }

        const evaluation = await evaluateInterviewAnswer({
            question,
            expectedAnswer,
            userAnswer: userAnswer.trim(),
            jobDescription
        });

        res.status(200).json({
            message: "Answer evaluated successfully.",
            evaluation
        });
    } catch (error) {
        console.error("Error evaluating answer:", error);
        res.status(500).json({ message: "Failed to evaluate your answer." });
    }
}

module.exports = { 
    generateInterviewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    deleteInterviewReportController,
    generateResumePdfController, 
    optimizeResumeController,
    toggleTaskProgressController,
    evaluateAnswerController
};

