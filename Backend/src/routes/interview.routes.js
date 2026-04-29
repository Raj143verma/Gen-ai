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
 * @route GET /api/interview/resume/pdf
 * @desc Generate a resume PDF based on user self description, resume and job description.
 * @access Private
 */

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);

module.exports = interviewRouter;