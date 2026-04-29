import axios from 'axios';


const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});


/**
 * 
 * @description Service function to generate an interview report by sending resume file, self-description and job description to the backend.
 */
export const generateInterviewReport = async ({ resumeFile, selfDescription, jobDescription }) => {
 const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
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

