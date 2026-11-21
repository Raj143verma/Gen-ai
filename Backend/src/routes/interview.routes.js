const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

const interviewRouter = express.Router();


/**
 * @route POST /api/interview/generate
 * @desc Generate an interview report based on resume, self-description, and job description
 * @access Private
 */

interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController);

/**
 * @route POST /api/interview/optimize-resume
 * @desc Optimize user resume based on job description and skill gaps
 * @access Private
 */
interviewRouter.post("/optimize-resume", authMiddleware.authUser, interviewController.optimizeResumeController);

/**
 * @route POST /api/interview/evaluate-answer
 * @desc Evaluate user's practice answer to an interview question using AI
 * @access Private
 */
interviewRouter.post("/evaluate-answer", authMiddleware.authUser, interviewController.evaluateAnswerController);

/**
 * @route PATCH /api/interview/report/:interviewId/progress
 * @desc Toggle roadmap task completion status
 * @access Private
 */
interviewRouter.patch("/report/:interviewId/progress", authMiddleware.authUser, interviewController.toggleTaskProgressController);

/**
 * @route GET /api/interview/report/:interviewId
 * @desc Get the details of a specific interview report by its ID
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);


/**
 * @route GET /api/interview/
 * @desc Get all interview reports of the logged in user
 * @access Private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);

/**
 * @route DELETE /api/interview/:interviewId
 * @desc Delete a specific interview report of the logged in user
 * @access Private
 */
interviewRouter.delete("/:interviewId", authMiddleware.authUser, interviewController.deleteInterviewReportController);

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @desc Generate a resume PDF based on user self description, resume and job description.
 * @access Private
 */

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);

/**
 * @route GET /api/interview/resume/original/:interviewId
 * @desc Get the original uploaded resume PDF of the interview report
 * @access Private
 */
interviewRouter.get("/resume/original/:interviewId", authMiddleware.authUser, interviewController.getOriginalResumePdfController);

/**
 * @route POST /api/interview/transcribe-audio
 * @desc Transcribe audio recording into text using Gemini AI
 * @access Private
 */
interviewRouter.post("/transcribe-audio", authMiddleware.authUser, upload.single("audio"), interviewController.transcribeAudioController);

module.exports = interviewRouter;