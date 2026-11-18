import axios from 'axios';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
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
export const optimizeResume = async (interviewReportId) => {
    const response = await api.post("/api/interview/optimize-resume", { interviewReportId });
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
export const evaluateAnswer = async ({ interviewReportId, question, expectedAnswer, userAnswer }) => {
    const response = await api.post("/api/interview/evaluate-answer", {
        interviewReportId,
        question,
        expectedAnswer,
        userAnswer
    });
    return response.data;
}

