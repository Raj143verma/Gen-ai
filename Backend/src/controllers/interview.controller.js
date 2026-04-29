const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf, generateOptimizedResume } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const mongoose = require("mongoose")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterviewReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription, title } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

   

    const resumeText = resumeContent.text;

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resumeText: resumeText,
        selfDescription,
        jobDescription,
        title: title || "Job Interview Report",
        ...interViewReportByAi
    })

    console.log(resumeText);

    res.status(201).json({
        success: true,
        message: "Interview report generated successfully.",
        interviewReportId: interviewReport._id
    })
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
    const interviewReports = await interviewReportModel.find({
    user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

   

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description  Controller to generate resume PDF based on user self description, resume and job description.
 */

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params;
    
    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }
     const { selfDescription, jobDescription, resume } = interviewReport;

     const result = await generateResumePdf({
        resume,
        selfDescription,
        jobDescription
     });

    
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="resume.pdf"'
        });
        res.send(result.pdfBuffer);
}

/**
 * @description Controller to optimize resume based on interview report.
 */
async function optimizeResumeController(req, res) {
    try {
        const { interviewReportId } = req.body;
        
        // Find the interview report
        const interviewReport = await interviewReportModel.findById(interviewReportId);
        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." });
        }

        const { selfDescription, jobDescription, resumeText } = interviewReport;

        const optimizedResume = await generateOptimizedResume({
            resume: resumeText,
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

module.exports = { 
    generateInterviewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController, 
    optimizeResumeController 
};

