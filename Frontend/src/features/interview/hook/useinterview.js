import { getAllInterviewReports,generateInterviewReport,getInterviewReportById} from "../services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context"



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
            setReport(response.interviewReport);
            return response.interviewReport;
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to generate report");
        } finally {
            setLoading(false);
        }
    }

    const getReportById = async (interviewId) => {
        console.log("-> [useInterview] Fetching interview report...");
        console.log("-> [useInterview] ID passed to API:", interviewId);
        setLoading(true);
        setError(null);
        try {
            const response = await getInterviewReportById(interviewId);
            console.log("<- [useInterview] API Response Success:", response);
            if (response && response.interviewReport) {
                setReport(response.interviewReport);
            } else if (response && response.data) {
                setReport(response.data);
            } else {
                setReport(response);
            }
        } catch (err) {
            console.error("<- [useInterview] API Error:", err.response?.data || err.message);
            setReport(null);
            setError(err.response?.data?.message || "Failed to load interview report. Please check the URL or try again.");
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

    return {
        loading,
        report,
        reports,
        error,
        generateReport,
        getReportById,
        getReports

    }
}
