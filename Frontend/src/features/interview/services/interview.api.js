import axios from 'axios';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://3.26.169.210:3000",
    withCredentials: true
});


/**
 * 
 * @description Service function to generate an interview report by sending resume file, self-description and job description to the backend.
 */
export const generateInterviewReport = async ({ resumeFile, selfDescription, jobDescription }) => {
    const formData = new FormData();
    if (resumeFile) {
        formData.append("resume", resumeFile);
    }
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

/**
 * 
 * @description Service function to get the details of a specific interview report by its ID.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`, {
        headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    })
    console.log("API Response:", response.data);
    return response.data;
}

/**
 * 
 * @description Service function to get all interview reports of the logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")
    return response.data;
}

/**
 * 
 * @description Service function to delete an interview report by ID.
 */
export const deleteInterviewReport = async (interviewId) => {
    const response = await api.delete(`/api/interview/${interviewId}`);
    return response.data;
}

/**
 * 
 * @description Service function to get AI optimized resume suggestions for an interview report.
 */
export const optimizeResume = async (interviewReportId, regenerate = false) => {
    const response = await api.post("/api/interview/optimize-resume", { interviewReportId, regenerate });
    return response.data;
}

/**
 * 
 * @description Service function to download optimized resume as PDF.
 */
export const downloadResumePdf = async (interviewReportId) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, {}, {
        responseType: "blob"
    });
    return response.data;
}

/**
 * 
 * @description Service function to get the original uploaded resume PDF as blob.
 */
export const getOriginalResumePdf = async (interviewId) => {
    const response = await api.get(`/api/interview/resume/original/${interviewId}`, {
        responseType: "blob"
    });
    return response.data;
}

/**
 * 
 * @description Service function to toggle a roadmap task's completion status.
 */
export const toggleTaskProgress = async (interviewId, taskKey) => {
    const response = await api.patch(`/api/interview/report/${interviewId}/progress`, { taskKey });
    return response.data;
}

/**
 * 
 * @description Service function to evaluate a user's practice answer using AI.
 */
export const evaluateAnswer = async ({ interviewReportId, question, expectedAnswer, userAnswer, codeAnswer, language, category, mode }) => {
    const response = await api.post("/api/interview/evaluate-answer", {
        interviewReportId,
        question,
        expectedAnswer,
        userAnswer,
        codeAnswer,
        language,
        category,
        mode
    });
    return response.data;
}

/**
 * @description Service function to transcribe audio recording using Gemini AI
 */
export const transcribeAudio = async (formData) => {
    const response = await api.post("/api/interview/transcribe-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
}

