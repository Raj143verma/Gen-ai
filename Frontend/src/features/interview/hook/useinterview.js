import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    deleteInterviewReport,
    optimizeResume,
    downloadResumePdf,
    getOriginalResumePdf,
    toggleTaskProgress,
    evaluateAnswer,
    transcribeAudio
} from "../services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context"

// Module-level in-memory blob caches to eliminate duplicate downloads
const pdfBlobCache = new Map();
const originalPdfBlobCache = new Map();

export const useInterview = () => {

 const context = useContext(InterviewContext); 
 
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports, error, setError } = context;

    const generateReport = async ({ resumeFile, selfDescription, jobDescription }) => {
        setLoading(true);
        setError(null);
        try { 
            const response = await generateInterviewReport({ resumeFile, selfDescription, jobDescription });
            const interviewReport = response?.interviewReport ?? response;
            setReport(interviewReport);
            return interviewReport;
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to generate report");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const getReportById = async (interviewId) => {
        console.log("-> [useInterview] Fetching interview report for ID:", interviewId);
        setLoading(true);
        setError(null);
        try {
            const response = await getInterviewReportById(interviewId);
            console.log("<- [useInterview] API Response Success:", response);
            const interviewReport = response?.interviewReport ?? response?.data ?? response;
            setReport(interviewReport);
            return interviewReport;
        } catch (err) {
            console.error("<- [useInterview] API Error:", err.response?.data || err.message);
            setReport(null);
            setError(err.response?.data?.message || "Failed to load interview report. Please check the URL or try again.");
            return null;
        } finally {
            setLoading(false);
        } 
    }  

    const getReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllInterviewReports();
            setReports(response.interviewReports);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to fetch reports");
        } finally {
            setLoading(false);
        }
    }

    const deleteReport = async (interviewId) => {
        try {
            await deleteInterviewReport(interviewId);
            setReports((prev) => prev.filter((item) => item._id !== interviewId));
            if (report?._id === interviewId) {
                setReport(null);
            }
        } catch (err) {
            console.error("Failed to delete report:", err);
            throw err;
        }
    }

    const getOptimizedResume = async (interviewReportId, regenerate = false) => {
        if (regenerate) {
            pdfBlobCache.delete(interviewReportId);
        }
        const response = await optimizeResume(interviewReportId, regenerate);
        return response?.optimizedResume ?? response;
    }

    const downloadResume = async (interviewReportId, title = "optimized-resume") => {
        let pdfBlob = pdfBlobCache.get(interviewReportId);
        if (!pdfBlob) {
            pdfBlob = await downloadResumePdf(interviewReportId);
            pdfBlobCache.set(interviewReportId, pdfBlob);
        }
        const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
        const link = document.createElement("a");
        const safeName = String(title || "optimized-resume")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        link.href = url;
        link.setAttribute("download", `${safeName || "optimized-resume"}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => window.URL.revokeObjectURL(url), 2000);
    }

    const toggleTask = async (interviewId, taskKey) => {
        // Optimistic UI update
        setReport((prev) => {
            if (!prev || prev._id !== interviewId) return prev;
            const current = Array.isArray(prev.completedTasks) ? prev.completedTasks : [];
            const exists = current.includes(taskKey);
            return {
                ...prev,
                completedTasks: exists
                    ? current.filter((k) => k !== taskKey)
                    : [...current, taskKey]
            };
        });

        try {
            const response = await toggleTaskProgress(interviewId, taskKey);
            if (Array.isArray(response?.completedTasks)) {
                setReport((prev) => (prev && prev._id === interviewId ? { ...prev, completedTasks: response.completedTasks } : prev));
            }
        } catch (err) {
            console.error("Failed to save task progress:", err);
            // Revert on failure by re-toggling
            setReport((prev) => {
                if (!prev || prev._id !== interviewId) return prev;
                const current = Array.isArray(prev.completedTasks) ? prev.completedTasks : [];
                const exists = current.includes(taskKey);
                return {
                    ...prev,
                    completedTasks: exists
                        ? current.filter((k) => k !== taskKey)
                        : [...current, taskKey]
                };
            });
        }
    }

    const checkPracticeAnswer = async ({ interviewReportId, question, expectedAnswer, userAnswer, codeAnswer, language, category, mode }) => {
        const response = await evaluateAnswer({
            interviewReportId,
            question,
            expectedAnswer,
            userAnswer,
            codeAnswer,
            language,
            category,
            mode
        });
        if (response?.practiceHistory && Array.isArray(response.practiceHistory)) {
            setReport((prev) => (prev && prev._id === interviewReportId ? { ...prev, practiceHistory: response.practiceHistory } : prev));
        }
        return response?.evaluation ?? response;
    }

    const fetchOriginalResumePdf = async (interviewId) => {
        let blob = originalPdfBlobCache.get(interviewId);
        if (!blob) {
            blob = await getOriginalResumePdf(interviewId);
            originalPdfBlobCache.set(interviewId, blob);
        }
        return blob;
    }

    const transcribeVoiceAudio = async (audioBlob) => {
        const formData = new FormData();
        formData.append("audio", audioBlob, "answer-audio.webm");
        const res = await transcribeAudio(formData);
        return res?.transcript || "";
    }

    return {
        loading,
        report,
        reports,
        error,
        generateReport,
        getReportById,
        getReports,
        deleteReport,
        getOptimizedResume,
        downloadResume,
        fetchOriginalResumePdf,
        toggleTask,
        checkPracticeAnswer,
        transcribeVoiceAudio
    }
}
