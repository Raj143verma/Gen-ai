import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import '../style/interview.scss'
import { useInterview } from '../hook/useinterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'




// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ICON COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const IconMic = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
)

const IconSquare = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
)

const IconVolume = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
)

const IconVolumeX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
)

const IconCode = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const IconMap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
)

const IconChevron = ({ open }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

const IconTarget = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const IconLightbulb = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="10" y1="22" x2="14" y2="22" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
)

const IconCheckCircle = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const IconArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const IconFileText = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const IconDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const IconBarChart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const IconAward = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
)

const IconTrendingUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const IconZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const IconShieldCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
)

const IconPlay = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const IconTerminal = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
)

const CODE_TEMPLATES = {
  javascript: `// JavaScript Solution
function solution(input) {
  // Write your code here
  return input;
}

// Test example
console.log(solution("Ready"));`,
  typescript: `// TypeScript Solution
function solution(input: any): any {
  // Write your code here
  return input;
}

console.log(solution("Ready"));`,
  python: `# Python Solution
def solution(data):
    # Write your code here
    return data

# Test example
print(solution("Ready"))`,
  java: `// Java Solution
public class Solution {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Ready");
    }
}`,
  cpp: `// C++ Solution
#include <iostream>
using namespace std;

int main() {
    // Write your code here
    cout << "Ready" << endl;
    return 0;
}`,
  sql: `-- SQL Query Solution
SELECT * 
FROM table_name
LIMIT 10;`
};

const IconExternalLink = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUB-COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Expandable question card with practice mode, Dual-Engine Voice Mode & Coding Editor */
const QuestionCard = ({ index, question, intention, answer, interviewId, onEvaluate, onTranscribeAudio, isTechnical = false }) => {
  const [open, setOpen] = useState(false)
  const [practiceOpen, setPracticeOpen] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")
  const [checking, setChecking] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [checkError, setCheckError] = useState("")

  // Coding Editor State
  const isCodeLikely = isTechnical || /code|implement|function|algorithm|query|class|write a/i.test(question);
  const [practiceMode, setPracticeMode] = useState(isCodeLikely ? "code" : "text"); // 'code' | 'text'
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [codeAnswer, setCodeAnswer] = useState(CODE_TEMPLATES["javascript"]);
  const [consoleOutput, setConsoleOutput] = useState(null);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedOptCode, setCopiedOptCode] = useState(false);
  const codeEditorRef = useRef(null);

  // Voice Mode State
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false)
  const [voiceLang, setVoiceLang] = useState("en-IN") // Default: English (India)
  const recognitionRef = useRef(null)
  const timerRef = useRef(null)
  const isRecordingRef = useRef(false)
  const baseTextRef = useRef("")
  const hasLiveTextRef = useRef(false)
  const usedVoiceRef = useRef(false)

  // MediaRecorder refs for guaranteed audio capture & AI transcription
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const audioStreamRef = useRef(null)

  const SpeechRecognition = typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

  useEffect(() => {
    return () => {
      isRecordingRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* ignore */ }
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try { mediaRecorderRef.current.stop(); } catch { /* ignore */ }
      }
      if (audioStreamRef.current) {
        try { audioStreamRef.current.getTracks().forEach((t) => t.stop()); } catch { /* ignore */ }
      }
      if (typeof window !== "undefined" && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeakQuestion = () => {
    if (typeof window === "undefined" || !('speechSynthesis' in window)) return;

    if (isSpeakingQuestion) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);

    setIsSpeakingQuestion(true);
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceRecording = async () => {
    setCheckError("");
    baseTextRef.current = userAnswer.trim();
    hasLiveTextRef.current = false;
    usedVoiceRef.current = true;
    audioChunksRef.current = [];

    let stream = null;
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
      }
    } catch (micErr) {
      console.error("Microphone permission error:", micErr);
      setCheckError("Microphone access denied. Browser me microphone permission allow karein.");
      return;
    }

    // 1. Start MediaRecorder for guaranteed audio capture
    if (stream && typeof MediaRecorder !== "undefined") {
      try {
        let mimeType = "";
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) mimeType = "audio/webm;codecs=opus";
        else if (MediaRecorder.isTypeSupported("audio/webm")) mimeType = "audio/webm";
        else if (MediaRecorder.isTypeSupported("audio/mp4")) mimeType = "audio/mp4";

        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        recorder.start(250);
        mediaRecorderRef.current = recorder;
      } catch (recErr) {
        console.warn("MediaRecorder start notice:", recErr);
      }
    }

    // 2. Start Web Speech Recognition for live typing
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = voiceLang;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const live = (baseTextRef.current + " " + finalTranscript + " " + interimTranscript)
            .replace(/\s+/g, " ")
            .trim();

          if (live) {
            setUserAnswer(live);
            hasLiveTextRef.current = true;
          }
        };

        recognition.onerror = (event) => {
          console.warn("Speech recognition notice:", event.error);
          if (event.error === "not-allowed") {
            setCheckError("Microphone permission denied. Browser me mic allow karein.");
          }
        };

        recognition.onend = () => {
          if (isRecordingRef.current) {
            setTimeout(() => {
              if (isRecordingRef.current && recognitionRef.current) {
                try {
                  recognitionRef.current.start();
                } catch {
                  /* ignore */
                }
              }
            }, 120);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (speechErr) {
        console.warn("Speech recognition start notice:", speechErr);
      }
    }

    isRecordingRef.current = true;
    setIsRecording(true);
    setRecordingSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopVoiceRecording = async () => {
    isRecordingRef.current = false;
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    }

    let audioBlob = null;
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
        if (audioChunksRef.current.length > 0) {
          audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorderRef.current.mimeType || "audio/webm"
          });
        }
      } catch (err) {
        console.warn("MediaRecorder stop error:", err);
      }
      mediaRecorderRef.current = null;
    }

    if (audioStreamRef.current) {
      try {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch {
        /* ignore */
      }
      audioStreamRef.current = null;
    }

    if (!hasLiveTextRef.current && audioBlob && audioBlob.size > 500 && onTranscribeAudio) {
      setTranscribing(true);
      try {
        const aiTranscript = await onTranscribeAudio(audioBlob);
        if (aiTranscript && aiTranscript.trim()) {
          const finalAnswer = (baseTextRef.current + " " + aiTranscript).replace(/\s+/g, " ").trim();
          setUserAnswer(finalAnswer);
        } else if (!userAnswer) {
          setCheckError("Voice capture nahi ho saki. Please microphone check karein ya type karein.");
        }
      } catch (err) {
        console.error("AI voice transcription error:", err);
        if (!userAnswer) {
          setCheckError("Audio transcribe nahi ho paya. Please type karke answer karein.");
        }
      } finally {
        setTranscribing(false);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const formatTime = (totalSec) => {
    const mins = String(Math.floor(totalSec / 60)).padStart(2, "0");
    const secs = String(totalSec % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Coding Editor Functions
  const handleLanguageChange = (newLang) => {
    setCodeLanguage(newLang);
    if (!codeAnswer || Object.values(CODE_TEMPLATES).includes(codeAnswer.trim())) {
      setCodeAnswer(CODE_TEMPLATES[newLang] || "");
    }
    setConsoleOutput(null);
  };

  const handleResetCode = () => {
    setCodeAnswer(CODE_TEMPLATES[codeLanguage] || "");
    setConsoleOutput(null);
  };

  const handleCopyCode = (text, type = "current") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "optimized") {
      setCopiedOptCode(true);
      setTimeout(() => setCopiedOptCode(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCodeKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (practiceMode === "code") {
        runCodeInSandbox();
      } else {
        handleCheckAnswer();
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const val = e.target.value;
      const updated = val.substring(0, start) + "  " + val.substring(end);
      setCodeAnswer(updated);
      setTimeout(() => {
        if (codeEditorRef.current) {
          codeEditorRef.current.selectionStart = codeEditorRef.current.selectionEnd = start + 2;
        }
      }, 0);
    } else if (e.key === "Enter") {
      const start = e.target.selectionStart;
      const val = e.target.value;
      const lineStart = val.lastIndexOf("\n", start - 1) + 1;
      const currentLine = val.substring(lineStart, start);
      const match = currentLine.match(/^\s+/);
      const indent = match ? match[0] : "";
      if (indent.length > 0) {
        e.preventDefault();
        const updated = val.substring(0, start) + "\n" + indent + val.substring(start);
        setCodeAnswer(updated);
        setTimeout(() => {
          if (codeEditorRef.current) {
            codeEditorRef.current.selectionStart = codeEditorRef.current.selectionEnd = start + 1 + indent.length;
          }
        }, 0);
      }
    }
  };

  const runCodeInSandbox = () => {
    setCheckError("");
    if (codeLanguage !== "javascript") {
      setConsoleOutput({
        type: "info",
        logs: [
          `[Notice]: Instant sandbox execution runs in client JavaScript environment.`,
          `For ${codeLanguage.toUpperCase()}, click 'AI Evaluate Code' below to test logic, edge cases, and Big-O complexity.`
        ],
        time: 0
      });
      return;
    }

    setIsRunningCode(true);
    const logs = [];
    const customConsole = {
      log: (...args) => logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ")),
      error: (...args) => logs.push("[ERROR] " + args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ")),
      warn: (...args) => logs.push("[WARN] " + args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" ")),
      info: (...args) => logs.push("[INFO] " + args.map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a))).join(" "))
    };

    const startTime = performance.now();
    try {
      const runFn = new Function("console", codeAnswer);
      const result = runFn(customConsole);
      const elapsed = Math.round(performance.now() - startTime);

      if (result !== undefined) {
        logs.push(`↳ Return value: ${typeof result === "object" ? JSON.stringify(result, null, 2) : String(result)}`);
      }

      setConsoleOutput({
        type: "success",
        logs: logs.length > 0 ? logs : ["Code executed cleanly with no output."],
        time: elapsed
      });
    } catch (err) {
      const elapsed = Math.round(performance.now() - startTime);
      setConsoleOutput({
        type: "error",
        logs: [`Error: ${err.message}`],
        time: elapsed
      });
    } finally {
      setIsRunningCode(false);
    }
  };

  const handleCheckAnswer = async () => {
    if (isRecording) {
      await stopVoiceRecording();
    }
    const hasText = Boolean(userAnswer && userAnswer.trim());
    const hasCode = Boolean(codeAnswer && codeAnswer.trim());

    if (!hasText && !hasCode) {
      setCheckError(practiceMode === "code" ? "Pehle code editor me apna solution likhein." : "Pehle apna answer likhein ya mic se bolein.");
      return;
    }
    if (!interviewId || !onEvaluate || checking) return;

    setChecking(true);
    setCheckError("");
    try {
      const isCodeMode = hasCode && (isTechnical || practiceMode === "code");
      const result = await onEvaluate({
        interviewReportId: interviewId,
        question,
        expectedAnswer: answer,
        userAnswer: hasText ? userAnswer.trim() : "",
        codeAnswer: isCodeMode ? codeAnswer.trim() : "",
        language: codeLanguage,
        category: isTechnical ? "technical" : "behavioral",
        mode: isCodeMode ? "code" : (usedVoiceRef.current ? "voice" : "text")
      });
      setFeedback(result);
    } catch (err) {
      setCheckError(err.response?.data?.message || "Could not evaluate your answer right now.");
    } finally {
      setChecking(false);
    }
  };

  const scoreTier = feedback
    ? feedback.score >= 8 ? "high" : feedback.score >= 5 ? "medium" : "low"
    : "medium";

  const codeLines = (codeAnswer || "").split("\n");

  return (
    <div className={`question-card ${open ? 'question-card--open' : ''}`}>
      <button className="question-card__header" onClick={() => setOpen((o) => !o)}>
        <span className="question-card__num">{String(index + 1).padStart(2, '0')}</span>
        <span className="question-card__q">{question}</span>
        <span className="question-card__chevron"><IconChevron open={open} /></span>
      </button>
      {open && (
        <div className="question-card__body">
          <div className="question-card__listen-bar">
            <button
              type="button"
              className={`voice-btn voice-btn--listen ${isSpeakingQuestion ? 'is-active' : ''}`}
              onClick={toggleSpeakQuestion}
              title={isSpeakingQuestion ? "Stop audio" : "Listen to interviewer speak this question"}
            >
              {isSpeakingQuestion ? <IconVolumeX /> : <IconVolume />}
              <span>{isSpeakingQuestion ? "Stop Audio" : "Listen to Question"}</span>
            </button>
          </div>

          <div className="question-card__row">
            <span className="question-card__label"><IconTarget /> Intention</span>
            <p className="question-card__text">{intention}</p>
          </div>
          <div className="question-card__row">
            <span className="question-card__label"><IconLightbulb /> Key Points</span>
            <p className="question-card__text">{answer}</p>
          </div>

          <div className="practice-box">
            <div className="practice-box__head-row">
              <button
                type="button"
                className="practice-box__toggle"
                onClick={() => setPracticeOpen((p) => !p)}
              >
                {practiceOpen ? "Hide Practice Area" : "Practice Your Answer"}
              </button>

              {practiceOpen && (
                <div className="practice-box__mode-switch-wrapper">
                  {isTechnical && (
                    <div className="practice-mode-pills">
                      <button
                        type="button"
                        className={`practice-mode-pill ${practiceMode === 'code' ? 'practice-mode-pill--active' : ''}`}
                        onClick={() => setPracticeMode('code')}
                      >
                        <IconCode />
                        <span>Code Editor</span>
                      </button>
                      <button
                        type="button"
                        className={`practice-mode-pill ${practiceMode === 'text' ? 'practice-mode-pill--active' : ''}`}
                        onClick={() => setPracticeMode('text')}
                      >
                        <IconMic />
                        <span>Voice / Text</span>
                      </button>
                    </div>
                  )}

                  {(!isTechnical || practiceMode === 'text') && (
                    <div className="practice-box__voice-controls">
                      <button
                        type="button"
                        className={`voice-btn ${isRecording ? 'voice-btn--recording' : 'voice-btn--record'}`}
                        onClick={toggleRecording}
                        disabled={transcribing}
                        title={isRecording ? "Click to stop recording" : "Click to speak your answer with microphone"}
                      >
                        {isRecording ? <IconSquare /> : <IconMic />}
                        <span>{isRecording ? "Stop Recording" : "Speak Answer"}</span>
                      </button>

                      <select
                        className="voice-lang-select"
                        value={voiceLang}
                        onChange={(e) => setVoiceLang(e.target.value)}
                        disabled={isRecording || transcribing}
                        title="Select voice recognition accent/language"
                      >
                        <option value="en-IN">EN (India)</option>
                        <option value="en-US">EN (US)</option>
                        <option value="hi-IN">Hindi</option>
                      </select>

                      {isRecording && (
                        <div className="voice-live-badge">
                          <span className="voice-pulse-dot" />
                          <span>Recording: {formatTime(recordingSeconds)}</span>
                        </div>
                      )}

                      {transcribing && (
                        <div className="voice-transcribing-badge">
                          <span className="voice-pulse-dot" />
                          <span>Transcribing audio with AI...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {practiceOpen && (
              <div className="practice-box__content">
                {isTechnical && practiceMode === "code" ? (
                  <div className="code-editor-box">
                    {/* Top Editor Toolbar */}
                    <div className="code-editor-toolbar">
                      <div className="code-editor-toolbar__left">
                        <span className="code-editor-dot code-editor-dot--red" />
                        <span className="code-editor-dot code-editor-dot--yellow" />
                        <span className="code-editor-dot code-editor-dot--green" />
                        <select
                          className="code-lang-select"
                          value={codeLanguage}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          title="Select programming language"
                        >
                          <option value="javascript">JavaScript (Node/ES6)</option>
                          <option value="typescript">TypeScript</option>
                          <option value="python">Python 3</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++ (GCC)</option>
                          <option value="sql">SQL</option>
                        </select>
                        <span className="code-lines-badge">{codeLines.length} lines</span>
                      </div>

                      <div className="code-editor-toolbar__right">
                        <button
                          type="button"
                          className="code-tool-btn"
                          onClick={handleResetCode}
                          title="Reset code to starter template"
                        >
                          <IconRefresh />
                          <span>Reset</span>
                        </button>

                        <button
                          type="button"
                          className={`code-tool-btn ${copiedCode ? 'code-tool-btn--copied' : ''}`}
                          onClick={() => handleCopyCode(codeAnswer, 'current')}
                          title="Copy current code"
                        >
                          {copiedCode ? <IconCheck /> : <IconCopy />}
                          <span>{copiedCode ? "Copied" : "Copy"}</span>
                        </button>

                        <button
                          type="button"
                          className="code-tool-btn code-tool-btn--run"
                          onClick={runCodeInSandbox}
                          disabled={isRunningCode}
                          title="Run code in local sandbox (Ctrl+Enter)"
                        >
                          <IconPlay />
                          <span>{isRunningCode ? "Running..." : "Run Code"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Main Code Editor Body */}
                    <div className="code-editor-body">
                      <div className="code-gutter">
                        {codeLines.map((_, i) => (
                          <div key={i} className="code-gutter__line">{i + 1}</div>
                        ))}
                      </div>
                      <textarea
                        ref={codeEditorRef}
                        className="code-textarea"
                        value={codeAnswer}
                        onChange={(e) => setCodeAnswer(e.target.value)}
                        onKeyDown={handleCodeKeyDown}
                        placeholder="Write your code solution here..."
                        rows={Math.max(8, Math.min(22, codeLines.length + 1))}
                        spellCheck={false}
                        autoCapitalize="none"
                        autoComplete="off"
                      />
                    </div>

                    {/* Interactive Output Console */}
                    {consoleOutput && (
                      <div className="code-console">
                        <div className="code-console__header">
                          <div className="code-console__title">
                            <IconTerminal />
                            <span>Terminal / Console Output</span>
                            {consoleOutput.time > 0 && (
                              <span className="code-console__time">⏱️ {consoleOutput.time}ms</span>
                            )}
                          </div>
                          <button
                            type="button"
                            className="code-console__clear"
                            onClick={() => setConsoleOutput(null)}
                          >
                            Clear
                          </button>
                        </div>
                        <div className={`code-console__body code-console__body--${consoleOutput.type}`}>
                          {consoleOutput.logs.map((log, i) => (
                            <div key={i} className="code-console__line">{log}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Optional approach explanation */}
                    <div className="code-notes-wrapper">
                      <input
                        type="text"
                        className="code-notes-input"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Approach notes or complexity thoughts (optional)..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="practice-box__textarea-wrapper">
                    <textarea
                      className={`practice-box__textarea ${isRecording ? 'practice-box__textarea--recording' : ''}`}
                      rows={4}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder={
                        isRecording
                          ? "Mic is active! Start speaking, your words will appear here live..."
                          : transcribing
                          ? "Transcribing your audio with AI..."
                          : "Type your answer or click 'Speak Answer' to speak using your microphone..."
                      }
                    />
                    {userAnswer && !isRecording && !transcribing && (
                      <button
                        type="button"
                        className="practice-box__clear-btn"
                        onClick={() => setUserAnswer("")}
                        title="Clear text"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}

                {checkError && <p className="practice-box__error">{checkError}</p>}

                <div className="practice-box__actions">
                  <button
                    type="button"
                    className="iv-action-btn iv-action-btn--primary"
                    onClick={handleCheckAnswer}
                    disabled={checking || transcribing || (!userAnswer.trim() && !codeAnswer.trim())}
                  >
                    {checking ? "AI Evaluating..." : isTechnical && practiceMode === 'code' ? "⚡ AI Evaluate Code" : "Check with AI"}
                  </button>
                </div>

                {feedback && (
                  <div className="practice-feedback">
                    <div className="practice-feedback__head">
                      <div className="practice-feedback__title-group">
                        <span>AI Engineering Evaluation</span>
                        {feedback.complexity && (feedback.complexity.time !== "N/A" || feedback.complexity.space !== "N/A") && (
                          <div className="practice-feedback__complexity-pills">
                            {feedback.complexity.time && feedback.complexity.time !== "N/A" && (
                              <span className="complexity-pill complexity-pill--time">
                                ⏱️ Time: <strong>{feedback.complexity.time}</strong>
                              </span>
                            )}
                            {feedback.complexity.space && feedback.complexity.space !== "N/A" && (
                              <span className="complexity-pill complexity-pill--space">
                                💾 Space: <strong>{feedback.complexity.space}</strong>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <span className={`practice-feedback__score practice-feedback__score--${scoreTier}`}>
                        {feedback.score} / 10
                      </span>
                    </div>

                    {/* Edge Cases Breakdown */}
                    {feedback.edgeCases && (feedback.edgeCases.handled?.length > 0 || feedback.edgeCases.missed?.length > 0) && (
                      <div className="practice-feedback__edge-cases">
                        {feedback.edgeCases.handled?.length > 0 && (
                          <div className="edge-case-group edge-case-group--handled">
                            <span className="edge-case-label">✓ Edge Cases Handled:</span>
                            <div className="edge-case-tags">
                              {feedback.edgeCases.handled.map((ec, i) => (
                                <span key={i} className="edge-case-tag edge-case-tag--handled">{ec}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {feedback.edgeCases.missed?.length > 0 && (
                          <div className="edge-case-group edge-case-group--missed">
                            <span className="edge-case-label">⚠️ Edge Cases to Watch:</span>
                            <div className="edge-case-tags">
                              {feedback.edgeCases.missed.map((ec, i) => (
                                <span key={i} className="edge-case-tag edge-case-tag--missed">{ec}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {feedback.strengths?.length > 0 && (
                      <div className="practice-feedback__group">
                        <strong>Strengths</strong>
                        <ul>
                          {feedback.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                        </ul>
                      </div>
                    )}

                    {feedback.improvements?.length > 0 && (
                      <div className="practice-feedback__group">
                        <strong>To Improve</strong>
                        <ul>
                          {feedback.improvements.map((imp, idx) => <li key={idx}>{imp}</li>)}
                        </ul>
                      </div>
                    )}

                    {/* Reference Optimized Code */}
                    {feedback.optimizedCode && (
                      <div className="practice-feedback__code-section">
                        <div className="practice-feedback__code-header">
                          <span>✨ Reference Optimized Implementation</span>
                          <button
                            type="button"
                            className="code-tool-btn"
                            onClick={() => handleCopyCode(feedback.optimizedCode, "optimized")}
                          >
                            {copiedOptCode ? <IconCheck /> : <IconCopy />}
                            <span>{copiedOptCode ? "Copied" : "Copy Solution"}</span>
                          </button>
                        </div>
                        <pre className="practice-feedback__code-block">
                          <code>{feedback.optimizedCode}</code>
                        </pre>
                      </div>
                    )}

                    {feedback.improvedAnswer && (
                      <div className="practice-feedback__group">
                        <strong>Ideal Solution & Walkthrough</strong>
                        <p>{feedback.improvedAnswer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/** Preparation day card with interactive checklist */
const DayCard = ({ day, focus, tasks, completedTasks, onToggleTask }) => {
  const [open, setOpen] = useState(day === 1)
  const taskList = tasks || []
  const doneCount = taskList.filter((_, i) => completedTasks.includes(`day-${day}-${i}`)).length

  return (
    <div className={`day-card ${open ? 'day-card--open' : ''}`}>
      <button className="day-card__header" onClick={() => setOpen((o) => !o)}>
        <span className="day-card__badge">Day {day}</span>
        <span className="day-card__focus">{focus}</span>
        {taskList.length > 0 && (
          <span className={`day-card__count ${doneCount === taskList.length ? 'day-card__count--done' : ''}`}>
            {doneCount}/{taskList.length}
          </span>
        )}
        <span className="day-card__chevron"><IconChevron open={open} /></span>
      </button>
      {open && (
        <ul className="day-card__tasks">
          {taskList.map((t, i) => {
            const taskKey = `day-${day}-${i}`
            const isDone = completedTasks.includes(taskKey)
            return (
              <li key={taskKey} className={`day-card__task day-card__task--checkable ${isDone ? 'day-card__task--done' : ''}`}>
                <label className="day-card__task-label">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onToggleTask(taskKey)}
                  />
                  <span>{t}</span>
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN SECTIONS rendered in center panel
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TechnicalSection = ({ questions, interviewId, onEvaluate, onTranscribeAudio }) => (
  <section className="content-section">
    <div className="content-section__header">
      <span className="content-section__icon"><IconCode /></span>
      <h2 className="content-section__title">Technical Questions</h2>
      <span className="section-count">{(questions || []).length}</span>
    </div>
    <div className="question-list">
      {(questions || []).map((q, i) => (
        <QuestionCard
          key={i}
          index={i}
          interviewId={interviewId}
          onEvaluate={onEvaluate}
          onTranscribeAudio={onTranscribeAudio}
          isTechnical={true}
          {...q}
        />
      ))}
    </div>
  </section>
)

const BehavioralSection = ({ questions, interviewId, onEvaluate, onTranscribeAudio }) => (
  <section className="content-section">
    <div className="content-section__header">
      <span className="content-section__icon"><IconUsers /></span>
      <h2 className="content-section__title">Behavioral Questions</h2>
      <span className="section-count">{(questions || []).length}</span>
    </div>
    <div className="question-list">
      {(questions || []).map((q, i) => (
        <QuestionCard
          key={i}
          index={i}
          interviewId={interviewId}
          onEvaluate={onEvaluate}
          onTranscribeAudio={onTranscribeAudio}
          isTechnical={false}
          {...q}
        />
      ))}
    </div>
  </section>
)

const RoadmapSection = ({ plan, completedTasks = [], onToggleTask }) => {
  const days = plan || []
  const totalTasks = days.reduce((acc, d) => acc + (d.tasks?.length || 0), 0)
  const completedCount = days.reduce(
    (acc, d) => acc + (d.tasks || []).filter((_, i) => completedTasks.includes(`day-${d.day}-${i}`)).length,
    0
  )
  const percent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  return (
    <section className="content-section">
      <div className="content-section__header">
        <span className="content-section__icon"><IconMap /></span>
        <h2 className="content-section__title">7-Day Road Map</h2>
        {totalTasks > 0 && (
          <span className="section-count">{percent}%</span>
        )}
      </div>

      {totalTasks > 0 && (
        <div className="roadmap-progress">
          <div className="roadmap-progress__meta">
            <span>Preparation Progress</span>
            <span>{completedCount} / {totalTasks} tasks completed</span>
          </div>
          <div className="roadmap-progress__track">
            <div className="roadmap-progress__fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      <div className="day-list">
        {days.map((d, idx) => (
          <DayCard
            key={d.day ?? idx}
            completedTasks={completedTasks}
            onToggleTask={onToggleTask}
            {...d}
          />
        ))}
      </div>
    </section>
  )
}

const renderFormattedInline = (text) => {
  if (!text) return "";
  const parts = String(text).split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const renderTextWithKeywords = (text, keywords = [], isHighlightEnabled = true, selectedKeyword = null) => {
  if (!text) return "";
  if (!isHighlightEnabled || !keywords || keywords.length === 0) {
    return renderFormattedInline(text);
  }

  const validKw = keywords
    .map((k) => String(k).trim())
    .filter((k) => k.length >= 2)
    .sort((a, b) => b.length - a.length);

  if (validKw.length === 0) {
    return renderFormattedInline(text);
  }

  const escaped = validKw.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const kwRegex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  const boldParts = String(text).split(/(\*\*.*?\*\*)/g);

  return boldParts.map((boldPart, bIdx) => {
    const isBold = boldPart.startsWith("**") && boldPart.endsWith("**");
    const content = isBold ? boldPart.slice(2, -2) : boldPart;

    const kwParts = content.split(kwRegex);
    const rendered = kwParts.map((sub, sIdx) => {
      const match = validKw.find((k) => k.toLowerCase() === sub.toLowerCase());
      if (match) {
        const isSelected = selectedKeyword && selectedKeyword.toLowerCase() === match.toLowerCase();
        return (
          <mark
            key={sIdx}
            className={`ats-highlight-mark ${isSelected ? "ats-highlight-mark--selected" : ""}`}
            title={`🎯 ATS Target Keyword: ${match}`}
          >
            {sub}
          </mark>
        );
      }
      return sub;
    });

    if (isBold) {
      return <strong key={bIdx}>{rendered}</strong>;
    }
    return <React.Fragment key={bIdx}>{rendered}</React.Fragment>;
  });
};

const AtsHighlighterBar = ({
  matchedKeywords = [],
  highlightAts,
  setHighlightAts,
  selectedKeyword,
  setSelectedKeyword
}) => {
  if (!matchedKeywords || matchedKeywords.length === 0) return null;

  return (
    <div className="ats-highlighter-toolbar">
      <div className="ats-toolbar-top">
        <div className="ats-toolbar-left">
          <button
            type="button"
            className={`ats-toggle-btn ${highlightAts ? "ats-toggle-btn--active" : ""}`}
            onClick={() => setHighlightAts((prev) => !prev)}
            title="Toggle ATS keyword highlights in the resume"
          >
            <span className="ats-toggle-sparkle">✨</span>
            <span className="ats-toggle-label">
              ATS Keyword Highlighter: <strong>{highlightAts ? "ON" : "OFF"}</strong>
            </span>
          </button>
          <span className="ats-match-counter">
            🎯 <strong>{matchedKeywords.length}</strong> Target JD Keywords Matched
          </span>
        </div>

        {selectedKeyword && (
          <button
            type="button"
            className="ats-clear-focus-btn"
            onClick={() => setSelectedKeyword(null)}
          >
            Clear Filter ({selectedKeyword}) ×
          </button>
        )}
      </div>

      <div className="ats-chips-wrapper">
        <span className="ats-chips-label">Matched Keywords:</span>
        <div className="ats-chips-list">
          {matchedKeywords.map((kw, idx) => {
            const isSelected = selectedKeyword && selectedKeyword.toLowerCase() === kw.toLowerCase();
            return (
              <button
                key={idx}
                type="button"
                className={`ats-chip ${isSelected ? "ats-chip--selected" : ""}`}
                onClick={() => {
                  if (!highlightAts) setHighlightAts(true);
                  setSelectedKeyword(isSelected ? null : kw);
                }}
                title={`Click to focus ${kw} in resume`}
              >
                <span className="ats-chip-dot">●</span>
                <span>{kw}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ResumeBulletDiffPanel = ({ bulletDiffs = [], matchedKeywords = [] }) => {
  const [filterSection, setFilterSection] = useState("all");
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!bulletDiffs || bulletDiffs.length === 0) {
    return (
      <div className="diff-empty-state">
        <p>No bullet diff comparisons available for this resume.</p>
      </div>
    );
  }

  const filteredDiffs = bulletDiffs.filter((item) => {
    if (filterSection === "all") return true;
    const sec = (item.section || "").toLowerCase();
    if (filterSection === "summary") return sec.includes("summary");
    if (filterSection === "experience") return sec.includes("experience");
    if (filterSection === "projects") return sec.includes("project");
    return true;
  });

  const handleCopyBullet = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getImpactBadgeClass = (impactType) => {
    const t = String(impactType || "").toLowerCase();
    if (t.includes("metric") || t.includes("impact")) return "diff-badge--metrics";
    if (t.includes("action") || t.includes("verb")) return "diff-badge--verbs";
    if (t.includes("keyword") || t.includes("jd")) return "diff-badge--keywords";
    return "diff-badge--default";
  };

  return (
    <div className="bullet-diff-container">
      <div className="diff-header-banner">
        <div className="diff-header-text">
          <div className="diff-header-title-row">
            <span className="diff-title-icon"><IconCheckCircle /></span>
            <h3 className="diff-header-title">Before vs After Visual Bullet Diff</h3>
            <span className="diff-count-badge">{bulletDiffs.length} Statements Enhanced</span>
          </div>
          <p className="diff-header-desc">
            Direct side-by-side comparison showing how your original resume statements were transformed into high-impact, ATS-optimized bullet points with quantifiable metrics and action verbs.
          </p>
        </div>

        <div className="diff-filter-tabs">
          <button
            type="button"
            className={`diff-filter-pill ${filterSection === "all" ? "diff-filter-pill--active" : ""}`}
            onClick={() => setFilterSection("all")}
          >
            All ({bulletDiffs.length})
          </button>
          <button
            type="button"
            className={`diff-filter-pill ${filterSection === "summary" ? "diff-filter-pill--active" : ""}`}
            onClick={() => setFilterSection("summary")}
          >
            Summary ({bulletDiffs.filter((d) => (d.section || "").toLowerCase().includes("summary")).length})
          </button>
          <button
            type="button"
            className={`diff-filter-pill ${filterSection === "experience" ? "diff-filter-pill--active" : ""}`}
            onClick={() => setFilterSection("experience")}
          >
            Experience ({bulletDiffs.filter((d) => (d.section || "").toLowerCase().includes("experience")).length})
          </button>
          <button
            type="button"
            className={`diff-filter-pill ${filterSection === "projects" ? "diff-filter-pill--active" : ""}`}
            onClick={() => setFilterSection("projects")}
          >
            Projects ({bulletDiffs.filter((d) => (d.section || "").toLowerCase().includes("project")).length})
          </button>
        </div>
      </div>

      <div className="diff-cards-grid">
        {filteredDiffs.map((diff, idx) => (
          <div key={idx} className="diff-comparison-card">
            <div className="diff-card-meta">
              <div className="diff-section-tag">
                <span className="diff-section-indicator" />
                <span className="diff-section-name">{diff.section}</span>
              </div>
              <span className={`diff-impact-badge ${getImpactBadgeClass(diff.impactType)}`}>
                {diff.impactType || "Optimized"}
              </span>
            </div>

            <div className="diff-split-grid">
              <div className="diff-column diff-column--before">
                <div className="diff-column-header">
                  <span className="diff-status-pill diff-status-pill--before">ORIGINAL / BEFORE</span>
                </div>
                <div className="diff-bullet-body">
                  <p className="diff-bullet-text diff-bullet-text--original">
                    {diff.original}
                  </p>
                </div>
              </div>

              <div className="diff-column diff-column--after">
                <div className="diff-column-header">
                  <span className="diff-status-pill diff-status-pill--after">✨ ATS TAILORED / AFTER</span>
                  <button
                    type="button"
                    className={`diff-copy-btn ${copiedIndex === idx ? "diff-copy-btn--copied" : ""}`}
                    onClick={() => handleCopyBullet(diff.optimized, idx)}
                    title="Copy optimized bullet"
                  >
                    {copiedIndex === idx ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>
                <div className="diff-bullet-body">
                  <p className="diff-bullet-text diff-bullet-text--optimized">
                    {renderTextWithKeywords(diff.optimized, matchedKeywords, true, null)}
                  </p>
                </div>
              </div>
            </div>

            {diff.improvement && (
              <div className="diff-card-footer">
                <span className="diff-footer-icon">💡</span>
                <span className="diff-footer-text">
                  <strong>Key Upgrade:</strong> {diff.improvement}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ResumePaperView = ({ data, matchedKeywords = [], highlightAts = true, selectedKeyword = null }) => {
  if (!data) return null;
  const name = data.name || "Candidate Name";
  const title = data.title || "";
  const contact = data.contact || {};
  const contactParts = [
    contact.phone,
    contact.email,
    contact.linkedin ? (String(contact.linkedin).startsWith("http") ? <a key="li" href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : "LinkedIn") : null,
    contact.github ? (String(contact.github).startsWith("http") ? <a key="gh" href={contact.github} target="_blank" rel="noreferrer">GitHub</a> : "GitHub") : null,
    contact.location
  ].filter(Boolean);

  return (
    <div className="resume-paper-page">
      <div className="paper-header">
        <h1 className="paper-name">{name}</h1>
        {title && <div className="paper-subtitle">{title}</div>}
        <div className="paper-contact">
          {contactParts.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && " | "}
              {item}
            </React.Fragment>
          ))}
        </div>
      </div>

      {data.summary && (
        <div className="paper-section">
          <div className="paper-section-title">Summary</div>
          <p className="paper-summary-text">
            {renderTextWithKeywords(data.summary, matchedKeywords, highlightAts, selectedKeyword)}
          </p>
        </div>
      )}

      {Array.isArray(data.education) && data.education.length > 0 && (
        <div className="paper-section">
          <div className="paper-section-title">Education</div>
          {data.education.map((edu, idx) => (
            <div key={idx} className="paper-entry">
              <div className="paper-row-between">
                <span className="paper-bold">{edu.institution}</span>
                <span>{edu.date}</span>
              </div>
              {(edu.degree || edu.location) && (
                <div className="paper-row-between">
                  <span className="paper-italic">{edu.degree}</span>
                  <span className="paper-italic">{edu.location}</span>
                </div>
              )}
              {edu.coursework && (
                <div className="paper-coursework">
                  – Relevant Coursework: {renderTextWithKeywords(edu.coursework, matchedKeywords, highlightAts, selectedKeyword)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {Array.isArray(data.skills) && data.skills.length > 0 && (
        <div className="paper-section">
          <div className="paper-section-title">Technical Skills</div>
          <div className="paper-skills-table">
            {data.skills.map((s, idx) => (
              <div key={idx} className="paper-skills-row">
                <span className="paper-skills-label">{s.category}</span>
                <span className="paper-skills-val">
                  {renderTextWithKeywords(s.items, matchedKeywords, highlightAts, selectedKeyword)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(data.experience) && data.experience.length > 0 && (
        <div className="paper-section">
          <div className="paper-section-title">Experience</div>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="paper-entry">
              <div className="paper-row-between">
                <span className="paper-bold">{exp.title}</span>
                <span>{exp.date}</span>
              </div>
              {(exp.company || exp.location) && (
                <div className="paper-row-between">
                  <span className="paper-italic">{exp.company}</span>
                  <span className="paper-italic">{exp.location}</span>
                </div>
              )}
              {Array.isArray(exp.bullets) && (
                <ul className="paper-bullet-list">
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="paper-bullet-item">
                      {renderTextWithKeywords(b, matchedKeywords, highlightAts, selectedKeyword)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {Array.isArray(data.projects) && data.projects.length > 0 && (
        <div className="paper-section">
          <div className="paper-section-title">Projects</div>
          {data.projects.map((proj, idx) => (
            <div key={idx} className="paper-entry">
              <div className="paper-row-between">
                <span className="paper-bold">{proj.title}</span>
                <span className="paper-italic">{proj.linkText || "Github Link"}</span>
              </div>
              {proj.techStack && (
                <div className="paper-tech-line">
                  – <strong>Tech:</strong> {renderTextWithKeywords(proj.techStack, matchedKeywords, highlightAts, selectedKeyword)}
                </div>
              )}
              {Array.isArray(proj.bullets) && (
                <ul className="paper-bullet-list">
                  {proj.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="paper-bullet-item">
                      {renderTextWithKeywords(b, matchedKeywords, highlightAts, selectedKeyword)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {Array.isArray(data.achievements) && data.achievements.length > 0 && (
        <div className="paper-section">
          <div className="paper-section-title">Achievements</div>
          <ul className="paper-bullet-list">
            {data.achievements.map((ach, idx) => (
              <li key={idx} className="paper-bullet-item">
                {renderTextWithKeywords(ach, matchedKeywords, highlightAts, selectedKeyword)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const ResumeDocumentViewer = ({ text, matchedKeywords = [], highlightAts = true, selectedKeyword = null }) => {
  if (!text) return null;
  const lines = text.trim().split("\n");

  return (
    <div className="resume-doc-view">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={idx} className="resume-doc-view__spacer" />;
        }

        if (line.startsWith("# ") || (idx === 0 && line.length < 50 && !line.includes(":") && !line.includes("@"))) {
          const name = line.replace(/^#\s*/, "");
          return <h1 key={idx} className="resume-doc-view__name">{name}</h1>;
        }

        if (line.startsWith("## ") || (/^[A-Z\s/&-]{3,35}$/.test(line) && !line.includes("@") && !line.includes("http"))) {
          const title = line.replace(/^##\s*/, "");
          return <h2 key={idx} className="resume-doc-view__section-title">{title}</h2>;
        }

        if (line.startsWith("### ")) {
          const sub = line.replace(/^###\s*/, "");
          return <h3 key={idx} className="resume-doc-view__sub-title">{sub}</h3>;
        }

        if (line.startsWith("- ") || line.startsWith("* ")) {
          const content = line.replace(/^[-*]\s*/, "");
          return (
            <div key={idx} className="resume-doc-view__bullet">
              <span className="resume-doc-view__bullet-dot">•</span>
              <span className="resume-doc-view__bullet-text">
                {renderTextWithKeywords(content, matchedKeywords, highlightAts, selectedKeyword)}
              </span>
            </div>
          );
        }

        if (line.includes("@") || line.includes("|") || line.toLowerCase().includes("phone") || line.toLowerCase().includes("linkedin") || line.toLowerCase().includes("github")) {
          return <div key={idx} className="resume-doc-view__contact">{renderFormattedInline(line)}</div>;
        }

        return (
          <p key={idx} className="resume-doc-view__p">
            {renderTextWithKeywords(line, matchedKeywords, highlightAts, selectedKeyword)}
          </p>
        );
      })}
    </div>
  );
};

const OptimizedResumeSection = ({
  interviewId,
  optimizedResume,
  loadingResume,
  resumeError,
  onGenerate,
  onDownload,
  downloadingPdf,
  onFetchOriginalPdf
}) => {
  const [subTab, setSubTab] = useState("tailored");
  const [copied, setCopied] = useState(false);
  const [originalPdfUrl, setOriginalPdfUrl] = useState(null);
  const [loadingOriginalPdf, setLoadingOriginalPdf] = useState(false);
  const [originalPdfError, setOriginalPdfError] = useState(null);

  // ATS Keyword Highlighter state
  const [highlightAts, setHighlightAts] = useState(true);
  const [selectedKeyword, setSelectedKeyword] = useState(null);

  const fetchOriginalPdf = () => {
    if (!interviewId || !onFetchOriginalPdf || loadingOriginalPdf) return;
    setLoadingOriginalPdf(true);
    setOriginalPdfError(null);
    onFetchOriginalPdf(interviewId)
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
        setOriginalPdfUrl(url);
      })
      .catch((err) => {
        console.error("Failed to load original resume PDF:", err);
        setOriginalPdfError("Failed to load original uploaded PDF. Please try again.");
      })
      .finally(() => {
        setLoadingOriginalPdf(false);
      });
  };

  const handleSubTabChange = (tab) => {
    setSubTab(tab);
    if (tab === "original" && !originalPdfUrl && !loadingOriginalPdf) {
      fetchOriginalPdf();
    }
  };

  useEffect(() => {
    return () => {
      if (originalPdfUrl) {
        window.URL.revokeObjectURL(originalPdfUrl);
      }
    };
  }, [originalPdfUrl]);

  const handleCopy = () => {
    const textToCopy = optimizedResume?.modifiedResumeText || "";
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy:", err);
    });
  };

  const modifiedText = optimizedResume?.modifiedResumeText || "";
  const resumeData = optimizedResume?.resumeData || null;
  const keyChanges = optimizedResume?.keyChanges || [];
  const matchedKeywords = optimizedResume?.matchedKeywords || [];
  const suggestions = optimizedResume?.suggestions || [];
  const bulletDiffs = optimizedResume?.bulletDiffs || [];

  return (
    <section className="content-section">
      <div className="content-section__header resume-header-bar">
        <div className="resume-header-bar__title-group">
          <span className="content-section__icon"><IconFileText /></span>
          <div>
            <h2 className="content-section__title">
              {subTab === 'original'
                ? "Original Resume"
                : subTab === 'diff'
                ? "Before vs After Bullet Diff"
                : subTab === 'changes'
                ? "What Was Changed"
                : "Tailored Resume"}
            </h2>
            <p className="resume-header-bar__subtitle">
              {subTab === 'original'
                ? "Your original resume uploaded at the start of the interview."
                : subTab === 'diff'
                ? "Side-by-side comparison of original bullets vs ATS-optimized statements."
                : subTab === 'changes'
                ? "Summary of ATS keywords integrated and strategic improvements made."
                : "Your resume modified in-place to match this job description while preserving your exact format."}
            </p>
          </div>
        </div>

        <div className="resume-header-bar__actions">
          {subTab === 'original' && originalPdfUrl && (
            <a
              href={originalPdfUrl}
              download="original-resume.pdf"
              className="iv-action-btn"
              title="Download original uploaded resume PDF"
            >
              <IconDownload />
              Download Original PDF
            </a>
          )}

          {subTab !== 'original' && modifiedText && (
            <>
              <button
                type="button"
                className={`iv-action-btn ${copied ? 'iv-action-btn--success' : ''}`}
                onClick={handleCopy}
                title="Copy full resume text"
              >
                {copied ? <IconCheck /> : <IconCopy />}
                {copied ? "Copied!" : "Copy Resume"}
              </button>

              <button
                type="button"
                className="iv-action-btn"
                onClick={() => onGenerate(true)}
                disabled={loadingResume}
                title="Re-tailor resume"
              >
                <IconRefresh />
                Re-Tailor
              </button>

              <button
                type="button"
                className="iv-action-btn iv-action-btn--primary"
                onClick={onDownload}
                disabled={downloadingPdf}
              >
                <IconDownload />
                {downloadingPdf ? "Generating PDF..." : "Download PDF"}
              </button>
            </>
          )}
        </div>
      </div>

      {loadingResume && (
        <div className="resume-box">
          <div className="resume-box__spinner" />
          <p className="resume-box__muted">
            Analyzing your resume and job description... Modifying bullets and keywords in-place.
          </p>
        </div>
      )}

      {resumeError && !loadingResume && (
        <div className="resume-box">
          <p className="resume-box__error">{resumeError}</p>
          <button type="button" className="iv-action-btn" onClick={() => onGenerate(false)}>
            Try Again
          </button>
        </div>
      )}

      {optimizedResume && !loadingResume && (
        <div className="resume-container">
          <div className="resume-subtabs">
            <button
              type="button"
              className={`resume-subtab ${subTab === 'tailored' ? 'resume-subtab--active' : ''}`}
              onClick={() => handleSubTabChange('tailored')}
            >
              Tailored Resume
            </button>
            <button
              type="button"
              className={`resume-subtab ${subTab === 'diff' ? 'resume-subtab--active' : ''}`}
              onClick={() => handleSubTabChange('diff')}
            >
              Before vs After Diff ({bulletDiffs.length})
            </button>
            <button
              type="button"
              className={`resume-subtab ${subTab === 'changes' ? 'resume-subtab--active' : ''}`}
              onClick={() => handleSubTabChange('changes')}
            >
              What Was Changed ({keyChanges.length})
            </button>
            <button
              type="button"
              className={`resume-subtab ${subTab === 'original' ? 'resume-subtab--active' : ''}`}
              onClick={() => handleSubTabChange('original')}
            >
              Original Resume
            </button>
          </div>

          {subTab === 'tailored' && (
            <div className="resume-tailored-section">
              <AtsHighlighterBar
                matchedKeywords={matchedKeywords}
                highlightAts={highlightAts}
                setHighlightAts={setHighlightAts}
                selectedKeyword={selectedKeyword}
                setSelectedKeyword={setSelectedKeyword}
              />
              <div className="resume-paper-wrapper">
                {resumeData ? (
                  <ResumePaperView
                    data={resumeData}
                    matchedKeywords={matchedKeywords}
                    highlightAts={highlightAts}
                    selectedKeyword={selectedKeyword}
                  />
                ) : (
                  <div className="resume-card-wrap">
                    <ResumeDocumentViewer
                      text={modifiedText}
                      matchedKeywords={matchedKeywords}
                      highlightAts={highlightAts}
                      selectedKeyword={selectedKeyword}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {subTab === 'diff' && (
            <ResumeBulletDiffPanel
              bulletDiffs={bulletDiffs}
              matchedKeywords={matchedKeywords}
            />
          )}

          {subTab === 'changes' && (
            <div className="resume-changes-panel">
              {keyChanges.length > 0 && (
                <div className="resume-block">
                  <h3 className="resume-block__title">Key Improvements Made</h3>
                  <ul className="resume-change-list">
                    {keyChanges.map((change, i) => (
                      <li key={i} className="resume-change-item">
                        <span className="resume-change-icon"><IconCheckCircle /></span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {matchedKeywords.length > 0 && (
                <div className="resume-block">
                  <h3 className="resume-block__title">Matched Job Keywords</h3>
                  <div className="skill-tags">
                    {matchedKeywords.map((kw, i) => (
                      <span key={i} className="skill-tag skill-tag--low">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="resume-block">
                  <h3 className="resume-block__title">Interview Recommendations</h3>
                  <ul className="resume-change-list">
                    {suggestions.map((sug, i) => (
                      <li key={i} className="resume-change-item">
                        <span className="resume-change-icon"><IconLightbulb /></span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {subTab === 'original' && (
            <div className="original-pdf-view-wrapper">
              {loadingOriginalPdf && (
                <div className="resume-box">
                  <div className="resume-box__spinner" />
                  <p className="resume-box__muted">Loading original uploaded resume...</p>
                </div>
              )}

              {originalPdfError && !loadingOriginalPdf && (
                <div className="resume-box">
                  <p className="resume-box__error">{originalPdfError}</p>
                  <button type="button" className="iv-action-btn" onClick={fetchOriginalPdf}>
                    Retry
                  </button>
                </div>
              )}

              {originalPdfUrl && !loadingOriginalPdf && (
                <iframe
                  src={`${originalPdfUrl}#toolbar=0&navpanes=0`}
                  title="Original Uploaded Resume"
                  className="original-pdf-embedded-frame"
                />
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENT — CandidateAnalyticsDashboard
// Candidate Analytics & Readiness Cockpit
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CandidateAnalyticsDashboard = ({
  analysis,
  onNavigate
}) => {
  const matchScore = Number(analysis?.matchScore) || 0;
  const technicalQuestions = analysis?.technicalQuestions || analysis?.questions || [];
  const behavioralQuestions = analysis?.behavioralQuestions || [];
  const skillGaps = analysis?.skillGaps || [];
  const preparationPlan = analysis?.preparationPlan || analysis?.roadmap || [];
  const completedTasks = Array.isArray(analysis?.completedTasks) ? analysis.completedTasks : [];
  const practiceHistory = Array.isArray(analysis?.practiceHistory) ? analysis.practiceHistory : [];
  const optimizedResume = analysis?.optimizedResume;

  // 1. Roadmap Burndown & Velocity
  const allRoadmapTasks = [];
  const dayBreakdown = preparationPlan.map((dayPlan, dayIdx) => {
    const dayNum = Number(dayPlan.day) || (dayIdx + 1);
    const tasks = Array.isArray(dayPlan.tasks) ? dayPlan.tasks : [];
    const dayTaskKeys = tasks.map((_, tIdx) => `day-${dayNum}-task-${tIdx}`);
    const doneForDay = dayTaskKeys.filter(k => completedTasks.includes(k)).length;
    const dayTotal = tasks.length || 1;
    const dayPct = Math.min(100, Math.round((doneForDay / dayTotal) * 100));

    tasks.forEach((tText, tIdx) => {
      allRoadmapTasks.push({
        key: `day-${dayNum}-task-${tIdx}`,
        day: dayNum,
        focus: dayPlan.focus || `Day ${dayNum}`,
        task: tText
      });
    });

    return {
      dayNum,
      focus: dayPlan.focus || `Day ${dayNum} Focus`,
      totalTasks: tasks.length,
      doneTasks: doneForDay,
      dayPct
    };
  });

  const totalTasks = allRoadmapTasks.length || 1;
  const completedCount = completedTasks.length;
  const roadmapPct = Math.min(100, Math.round((completedCount / totalTasks) * 100));

  // 2. Practice Calculations
  const totalQuestions = (technicalQuestions.length + behavioralQuestions.length) || 1;
  const uniquePracticed = new Set(practiceHistory.map(p => p.question)).size;
  const practiceCoveragePct = Math.min(100, Math.round((uniquePracticed / totalQuestions) * 100));

  const techPracticeAttempts = practiceHistory.filter(p => p.category === "technical");
  const behPracticeAttempts = practiceHistory.filter(p => p.category === "behavioral");

  const avgScoreCalc = (list) => {
    if (!list.length) return null;
    const sum = list.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
    return (sum / list.length).toFixed(1);
  };

  const overallAvgScore = avgScoreCalc(practiceHistory) || (matchScore ? (matchScore / 10).toFixed(1) : "7.5");
  const techAvgScore = avgScoreCalc(techPracticeAttempts) || "8.0";
  const behAvgScore = avgScoreCalc(behPracticeAttempts) || "7.8";

  // 3. Skill Gaps Breakdown
  const highGaps = skillGaps.filter(g => g.severity === "high");
  const medGaps = skillGaps.filter(g => g.severity === "medium");
  const lowGaps = skillGaps.filter(g => g.severity === "low");

  // Mitigation progress: completed roadmap tasks & practiced questions mitigate skill gaps
  const skillMitigationPct = Math.min(100, Math.round(35 + (roadmapPct * 0.45) + (practiceCoveragePct * 0.2)));

  // 4. Overall Interview Readiness Index (Weighted Composite)
  // 35% Profile Match + 25% Roadmap Velocity + 25% Practice Mastery + 15% Skill Mitigation
  const readinessIndex = Math.min(100, Math.max(20, Math.round(
    (matchScore * 0.35) +
    (roadmapPct * 0.25) +
    (Math.min(100, Math.round(Number(overallAvgScore) * 10)) * 0.25) +
    (skillMitigationPct * 0.15)
  )));

  let tier = {
    title: "Tier 1: Interview Ready",
    label: "High Probability Offer",
    badgeClass: "cad-tier--ready",
    summary: "Your profile alignment, roadmap execution velocity, and practice scores put you in the top 10% candidate bracket for this role. Maintain your edge with final mock interview polish!",
    probability: "86% – 94% Clearance Likelihood",
    color: "#059669"
  };

  if (readinessIndex < 48) {
    tier = {
      title: "Tier 4: Foundation Building",
      label: "Early Preparation",
      badgeClass: "cad-tier--early",
      summary: "You are currently in the initial setup phase. Focus on Day 1–3 core roadmap concepts and complete your first technical coding challenge to boost readiness.",
      probability: "35% – 48% Clearance Likelihood",
      color: "#dc2626"
    };
  } else if (readinessIndex < 70) {
    tier = {
      title: "Tier 3: Moderate Readiness",
      label: "Active Progression",
      badgeClass: "cad-tier--moderate",
      summary: "Steady progress underway! Target your high-severity skill gaps and solve remaining roadmap tasks to push past the 70% threshold.",
      probability: "56% – 70% Clearance Likelihood",
      color: "#b45309"
    };
  } else if (readinessIndex < 85) {
    tier = {
      title: "Tier 2: Strong Contender",
      label: "Final Polish Needed",
      badgeClass: "cad-tier--strong",
      summary: "Solid capability foundation. Finish remaining roadmap tasks, practice STAR behavioral questions, and verify your code Big-O complexities.",
      probability: "73% – 85% Clearance Likelihood",
      color: "#0f766e"
    };
  }

  // 5. Dynamic Smart Recommendations Engine
  const recommendations = [];
  if (highGaps.length > 0) {
    recommendations.push({
      icon: <IconAlert />,
      type: "risk",
      title: `High Risk Skill Gap: ${highGaps[0].skill}`,
      desc: "This competency is explicitly required in the target Job Description. Prioritize practicing coding problems and conceptual questions around it.",
      ctaText: "Review Roadmap Plan",
      action: () => onNavigate("roadmap")
    });
  }
  if (roadmapPct < 55) {
    recommendations.push({
      icon: <IconMap />,
      type: "roadmap",
      title: `Advance Roadmap Milestone (${roadmapPct}% Done)`,
      desc: `${totalTasks - completedCount} tasks pending across your 7-day preparation roadmap. Completing Day 1 & Day 2 tasks elevates readiness score by +12%.`,
      ctaText: "Go to Roadmap",
      action: () => onNavigate("roadmap")
    });
  }
  if (practiceHistory.length < 2) {
    recommendations.push({
      icon: <IconCode />,
      type: "code",
      title: "Code Sandbox Practice Recommended",
      desc: "Practice answering questions in the Coding Editor to get AI Big-O Time & Space complexity grading and edge case diagnostics.",
      ctaText: "Solve Technical Questions",
      action: () => onNavigate("technical")
    });
  }
  recommendations.push({
    icon: <IconFileText />,
    type: "ats",
    title: "ATS-Optimized 1-Page Resume",
    desc: `Profile match score is ${matchScore}%. Review the Before vs After diffs and download your 1-page ATS-tailored PDF to maximize interview shortlisting.`,
    ctaText: "View Tailored Resume",
    action: () => onNavigate("resume")
  });

  return (
    <div className="cad-dashboard">
      {/* ── Top Header ── */}
      <div className="cad-header">
        <div>
          <div className="cad-header__badge">
            <IconTrendingUp />
            <span>Candidate Intelligence & Readiness Cockpit</span>
          </div>
          <h2 className="cad-header__title">{analysis?.title || "Role Preparation"}</h2>
          <p className="cad-header__subtitle">
            Real-time capability audit, skill gap mitigations, preparation velocity, and hiring probability breakdown.
          </p>
        </div>
        <div className="cad-header__actions">
          <button type="button" className="cad-btn cad-btn--primary" onClick={() => onNavigate("technical")}>
            <IconCode />
            <span>Practice Coding</span>
          </button>
          <button type="button" className="cad-btn cad-btn--secondary" onClick={() => onNavigate("roadmap")}>
            <IconMap />
            <span>Resume Roadmap</span>
          </button>
        </div>
      </div>

      {/* ── Hero Readiness Index Gauge & Verdict ── */}
      <div className="cad-hero-grid">
        {/* Left: Circular Readiness Meter */}
        <div className="cad-hero-card cad-gauge-card">
          <div className="cad-gauge-wrapper">
            <svg viewBox="0 0 36 36" className="cad-gauge-svg">
              <path
                className="cad-gauge-track"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="cad-gauge-fill"
                strokeDasharray={`${readinessIndex}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="cad-gauge-content">
              <span className="cad-gauge-num">{readinessIndex}%</span>
              <span className="cad-gauge-label">READINESS</span>
            </div>
          </div>
          <div className="cad-gauge-meta">
            <span className="cad-gauge-status" style={{ color: tier.color }}>{tier.label}</span>
            <span className="cad-gauge-prob">{tier.probability}</span>
          </div>
        </div>

        {/* Right: Readiness Verdict & Composite Formula Breakdown */}
        <div className="cad-hero-card cad-verdict-card">
          <div className="cad-verdict-header">
            <div className="cad-verdict-tag" style={{ borderColor: `${tier.color}40`, background: `${tier.color}15`, color: tier.color }}>
              <IconAward />
              <span>{tier.title}</span>
            </div>
            <span className="cad-verdict-badge">AI Interviewer Assessment</span>
          </div>
          <p className="cad-verdict-text">{tier.summary}</p>

          <div className="cad-formula-box">
            <div className="cad-formula-title">
              <IconZap />
              <span>Composite Readiness Weighting Model</span>
            </div>
            <div className="cad-formula-pills">
              <div className="cad-formula-pill">
                <span className="cad-formula-pill__val">{matchScore}%</span>
                <span className="cad-formula-pill__label">JD Match (35%)</span>
              </div>
              <div className="cad-formula-pill">
                <span className="cad-formula-pill__val">{roadmapPct}%</span>
                <span className="cad-formula-pill__label">Roadmap (25%)</span>
              </div>
              <div className="cad-formula-pill">
                <span className="cad-formula-pill__val">{practiceCoveragePct > 0 ? `${practiceCoveragePct}%` : `${overallAvgScore}/10`}</span>
                <span className="cad-formula-pill__label">Practice (25%)</span>
              </div>
              <div className="cad-formula-pill">
                <span className="cad-formula-pill__val">{skillMitigationPct}%</span>
                <span className="cad-formula-pill__label">Mitigation (15%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Readiness Pillars ── */}
      <div className="cad-pillars-grid">
        {/* Pillar 1: ATS & Profile Match */}
        <div className="cad-pillar-card" onClick={() => onNavigate("resume")}>
          <div className="cad-pillar-top">
            <div className="cad-pillar-icon cad-pillar-icon--blue"><IconTarget /></div>
            <span className="cad-pillar-badge">Match Score</span>
          </div>
          <div className="cad-pillar-value">{matchScore}%</div>
          <p className="cad-pillar-title">ATS & JD Alignment</p>
          <div className="cad-pillar-meta">
            <span>Keywords: {optimizedResume?.matchedKeywords?.length || 12}+</span>
            <span>Tailored: {optimizedResume ? "Generated" : "Pending"}</span>
          </div>
          <div className="cad-pillar-bar">
            <div className="cad-pillar-bar__fill" style={{ width: `${matchScore}%`, background: '#3b82f6' }} />
          </div>
          <span className="cad-pillar-cta">View Tailored Resume →</span>
        </div>

        {/* Pillar 2: Roadmap Velocity */}
        <div className="cad-pillar-card" onClick={() => onNavigate("roadmap")}>
          <div className="cad-pillar-top">
            <div className="cad-pillar-icon cad-pillar-icon--purple"><IconMap /></div>
            <span className="cad-pillar-badge">Roadmap</span>
          </div>
          <div className="cad-pillar-value">{completedCount}/{totalTasks}</div>
          <p className="cad-pillar-title">7-Day Task Execution</p>
          <div className="cad-pillar-meta">
            <span>Velocity: {roadmapPct}%</span>
            <span>Days: {preparationPlan.length || 7}</span>
          </div>
          <div className="cad-pillar-bar">
            <div className="cad-pillar-bar__fill" style={{ width: `${roadmapPct}%`, background: '#818cf8' }} />
          </div>
          <span className="cad-pillar-cta">Open Roadmap Checklist →</span>
        </div>

        {/* Pillar 3: Technical Mastery */}
        <div className="cad-pillar-card" onClick={() => onNavigate("technical")}>
          <div className="cad-pillar-top">
            <div className="cad-pillar-icon cad-pillar-icon--emerald"><IconCode /></div>
            <span className="cad-pillar-badge">Tech Score</span>
          </div>
          <div className="cad-pillar-value">{techAvgScore}<span className="cad-pillar-unit">/10</span></div>
          <p className="cad-pillar-title">Coding & System Design</p>
          <div className="cad-pillar-meta">
            <span>Questions: {technicalQuestions.length}</span>
            <span>Practiced: {techPracticeAttempts.length}</span>
          </div>
          <div className="cad-pillar-bar">
            <div className="cad-pillar-bar__fill" style={{ width: `${Math.min(100, Math.round(Number(techAvgScore) * 10))}%`, background: '#10b981' }} />
          </div>
          <span className="cad-pillar-cta">Open Coding Sandbox →</span>
        </div>

        {/* Pillar 4: Behavioral & Soft Skills */}
        <div className="cad-pillar-card" onClick={() => onNavigate("behavioral")}>
          <div className="cad-pillar-top">
            <div className="cad-pillar-icon cad-pillar-icon--amber"><IconUsers /></div>
            <span className="cad-pillar-badge">STAR Score</span>
          </div>
          <div className="cad-pillar-value">{behAvgScore}<span className="cad-pillar-unit">/10</span></div>
          <p className="cad-pillar-title">Behavioral & Leadership</p>
          <div className="cad-pillar-meta">
            <span>Questions: {behavioralQuestions.length}</span>
            <span>Mode: Voice & Text</span>
          </div>
          <div className="cad-pillar-bar">
            <div className="cad-pillar-bar__fill" style={{ width: `${Math.min(100, Math.round(Number(behAvgScore) * 10))}%`, background: '#f59e0b' }} />
          </div>
          <span className="cad-pillar-cta">Practice STAR Answers →</span>
        </div>
      </div>

      {/* ── Skill Gap Risk & Mitigation Matrix ── */}
      <div className="cad-section-card">
        <div className="cad-section-header">
          <div className="cad-section-header__left">
            <div className="cad-section-icon cad-section-icon--alert"><IconAlert /></div>
            <div>
              <h3 className="cad-section-title">Skill Gap Risk & Mitigation Matrix</h3>
              <p className="cad-section-desc">Identified capability mismatches against the Job Description and their remediation status.</p>
            </div>
          </div>
          <div className="cad-gap-counts">
            <span className="cad-gap-pill cad-gap-pill--high">{highGaps.length} High Risk</span>
            <span className="cad-gap-pill cad-gap-pill--medium">{medGaps.length} Medium</span>
            <span className="cad-gap-pill cad-gap-pill--low">{lowGaps.length} Low</span>
          </div>
        </div>

        <div className="cad-gap-grid">
          {skillGaps.map((gap, gIdx) => {
            const isHigh = gap.severity === "high";
            const isMed = gap.severity === "medium";
            return (
              <div key={gIdx} className={`cad-gap-item cad-gap-item--${gap.severity}`}>
                <div className="cad-gap-item__top">
                  <span className={`cad-gap-severity-badge cad-gap-severity-badge--${gap.severity}`}>
                    {gap.severity.toUpperCase()}
                  </span>
                  <span className="cad-gap-impact">
                    {isHigh ? "High Round Impact" : isMed ? "Moderate Factor" : "Secondary Skill"}
                  </span>
                </div>
                <div className="cad-gap-skill-name">{gap.skill}</div>
                <p className="cad-gap-advice">
                  {isHigh
                    ? "Critical requirement in JD; interviewers frequently drill down on this in technical interviews."
                    : isMed
                    ? "Valued skillset that separates solid candidates from great ones."
                    : "Beneficial bonus skill that provides additional interview talking points."}
                </p>
                <button
                  type="button"
                  className="cad-gap-action-btn"
                  onClick={() => onNavigate("roadmap")}
                >
                  <span>View Mitigation in Roadmap</span>
                  <IconArrowRight />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 7-Day Roadmap Burndown Velocity ── */}
      <div className="cad-section-card">
        <div className="cad-section-header">
          <div className="cad-section-header__left">
            <div className="cad-section-icon cad-section-icon--map"><IconMap /></div>
            <div>
              <h3 className="cad-section-title">7-Day Preparation Roadmap Velocity</h3>
              <p className="cad-section-desc">Track completion across daily focus areas. Click any day to jump directly into the actionable checklist.</p>
            </div>
          </div>
          <span className="cad-roadmap-summary-badge">{completedCount} of {totalTasks} Tasks Completed ({roadmapPct}%)</span>
        </div>

        <div className="cad-roadmap-days-list">
          {dayBreakdown.map((d) => (
            <div
              key={d.dayNum}
              className={`cad-roadmap-day-row ${d.dayPct === 100 ? 'cad-roadmap-day-row--complete' : ''}`}
              onClick={() => onNavigate("roadmap")}
            >
              <div className="cad-day-row__left">
                <span className="cad-day-badge">Day {d.dayNum}</span>
                <span className="cad-day-focus">{d.focus}</span>
              </div>
              <div className="cad-day-row__right">
                <div className="cad-day-progress">
                  <div className="cad-day-progress__bar">
                    <div
                      className="cad-day-progress__fill"
                      style={{
                        width: `${d.dayPct}%`,
                        background: d.dayPct === 100 ? '#10b981' : d.dayPct > 0 ? '#818cf8' : 'rgba(255,255,255,0.1)'
                      }}
                    />
                  </div>
                  <span className="cad-day-progress__text">{d.doneTasks}/{d.totalTasks}</span>
                </div>
                <span className="cad-day-jump-link">Open Day →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Practice Performance Tracker ── */}
      <div className="cad-section-card">
        <div className="cad-section-header">
          <div className="cad-section-header__left">
            <div className="cad-section-icon cad-section-icon--award"><IconAward /></div>
            <div>
              <h3 className="cad-section-title">Practice Log & Code Complexity Tracker</h3>
              <p className="cad-section-desc">Evaluations from the Code Sandbox and Voice/STAR practice modules.</p>
            </div>
          </div>
          <div className="cad-practice-summary-pills">
            <span className="cad-summary-pill">Avg Score: {overallAvgScore}/10</span>
            <span className="cad-summary-pill">{practiceHistory.length} Attempts</span>
          </div>
        </div>

        {practiceHistory.length > 0 ? (
          <div className="cad-practice-list">
            {practiceHistory.slice(0, 6).map((item, pIdx) => (
              <div key={pIdx} className="cad-practice-card">
                <div className="cad-practice-card__top">
                  <div className="cad-practice-card__badges">
                    <span className={`cad-cat-badge cad-cat-badge--${item.category || "technical"}`}>
                      {item.category === "behavioral" ? "Behavioral" : "Technical"}
                    </span>
                    <span className="cad-mode-badge">
                      {item.mode === "code" ? "Code Sandbox" : item.mode === "voice" ? "Voice STT" : "Text"}
                    </span>
                    {item.language && item.mode === "code" && (
                      <span className="cad-lang-badge">{item.language}</span>
                    )}
                  </div>
                  <span className={`cad-score-badge cad-score-badge--${Number(item.score) >= 8 ? 'high' : Number(item.score) >= 5 ? 'med' : 'low'}`}>
                    Score: {item.score}/10
                  </span>
                </div>

                <div className="cad-practice-question">{item.question}</div>

                {(item.timeComplexity || item.spaceComplexity) && (
                  <div className="cad-complexity-row">
                    {item.timeComplexity && (
                      <span className="cad-comp-pill">⏱️ Time: {item.timeComplexity}</span>
                    )}
                    {item.spaceComplexity && (
                      <span className="cad-comp-pill">💾 Space: {item.spaceComplexity}</span>
                    )}
                  </div>
                )}

                {Array.isArray(item.strengths) && item.strengths.length > 0 && (
                  <div className="cad-practice-feedback-snippet">
                    <strong>AI Strength:</strong> {item.strengths[0]}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="cad-practice-empty">
            <div className="cad-practice-empty__icon"><IconCode /></div>
            <h4>No Practice Submissions Yet</h4>
            <p>
              Test yourself on technical questions using the Coding Editor (with Big-O complexity feedback) or practice behavioral questions with Voice Mode.
            </p>
            <div className="cad-practice-empty__actions">
              <button type="button" className="cad-btn cad-btn--primary" onClick={() => onNavigate("technical")}>
                <IconCode />
                <span>Try First Coding Question</span>
              </button>
              <button type="button" className="cad-btn cad-btn--secondary" onClick={() => onNavigate("behavioral")}>
                <IconUsers />
                <span>Practice Behavioral Question</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── AI Strategic Recommendations (Next Best Actions) ── */}
      <div className="cad-section-card cad-recommendations-card">
        <div className="cad-section-header">
          <div className="cad-section-header__left">
            <div className="cad-section-icon cad-section-icon--zap"><IconZap /></div>
            <div>
              <h3 className="cad-section-title">AI Interviewer Next Best Actions</h3>
              <p className="cad-section-desc">Highest-leverage preparation steps to increase your interview clearance probability.</p>
            </div>
          </div>
        </div>

        <div className="cad-rec-grid">
          {recommendations.map((rec, rIdx) => (
            <div key={rIdx} className="cad-rec-item">
              <div className="cad-rec-item__icon">{rec.icon}</div>
              <div className="cad-rec-item__content">
                <h4 className="cad-rec-item__title">{rec.title}</h4>
                <p className="cad-rec-item__desc">{rec.desc}</p>
                <button type="button" className="cad-rec-item__btn" onClick={rec.action}>
                  <span>{rec.ctaText}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const NAV_ITEMS = [
  { key: 'analytics',  label: 'Readiness & Analytics', icon: <IconBarChart /> },
  { key: 'technical',  label: 'Technical questions',  icon: <IconCode /> },
  { key: 'behavioral', label: 'Behavioral questions', icon: <IconUsers /> },
  { key: 'roadmap',    label: 'Road Map',             icon: <IconMap /> },
  { key: 'resume',     label: 'Optimized Resume',     icon: <IconFileText /> },
]

const Interview = () => {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const currentId = interviewId;
  const isValidId = Boolean(currentId && /^[0-9a-fA-F]{24}$/.test(currentId));
  
  console.log("[InterviewPage] extracted parameter interviewId:", interviewId);
  console.log("[InterviewPage] is MongoDB ID syntax valid?:", isValidId ? "Yes" : "No");
  
  const { report, getReportById, getOptimizedResume, downloadResume, fetchOriginalResumePdf, toggleTask, checkPracticeAnswer, transcribeVoiceAudio, loading, error } = useInterview()
  const { handleLogout } = useAuth()
  const [activeSection, setActiveSection] = useState('analytics')
  const [optimizedResume, setOptimizedResume] = useState(null)
  const [loadingResume, setLoadingResume] = useState(false)
  const [resumeError, setResumeError] = useState(null)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [pdfError, setPdfError] = useState(null)

  useEffect(() => {
    setOptimizedResume(null)
    setResumeError(null)
    setPdfError(null)
  }, [currentId])

  useEffect(() => {
    if (isValidId && (!report || report._id !== currentId)) {
      getReportById(currentId)
    }
  }, [currentId, isValidId, report])

  const loadOptimizedResume = async (regenerate = false) => {
    if (!currentId || loadingResume) return
    setLoadingResume(true)
    setResumeError(null)
    try {
      const data = await getOptimizedResume(currentId, regenerate)
      setOptimizedResume(data)
    } catch (err) {
      setResumeError(err.response?.data?.message || "Failed to optimize resume.")
    } finally {
      setLoadingResume(false)
    }
  }

  const handleTabClick = (key) => {
    setActiveSection(key)
    if (key === 'resume' && !optimizedResume && !loadingResume) {
      loadOptimizedResume(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!currentId || downloadingPdf) return
    setDownloadingPdf(true)
    setPdfError(null)
    try {
      await downloadResume(currentId, analysis?.title)
    } catch (err) {
      setPdfError(err.response?.data?.message || "Failed to generate resume PDF. Please try again.")
    } finally {
      setDownloadingPdf(false)
    }
  }

  const onLogout = async () => {
    await handleLogout()
    navigate("/login")
  }

  const analysis = report && report._id === currentId ? report : null;

  if (!isValidId) {
     return (
      <div className="interview-page error-state">
        <p>Invalid interview report ID. Please check the URL.</p>
      </div>
    )
  }

  if (loading && !analysis) {
    return (
      <div className="interview-page loading-state">
        <p>Loading interview report...</p>
      </div>
    )
  }

  if (error && !analysis) {
    return (
      <div className="interview-page error-state">
        <p>{error || "Failed to load interview report. Please check the URL or try again."}</p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="interview-page loading-state">
        <p>Loading interview report...</p>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'analytics':  return (
        <CandidateAnalyticsDashboard
          analysis={analysis}
          onNavigate={handleTabClick}
          onDownloadPdf={handleDownloadPdf}
          downloadingPdf={downloadingPdf}
        />
      )
      case 'technical':  return (
        <TechnicalSection
          questions={analysis?.technicalQuestions || analysis?.questions || []}
          interviewId={currentId}
          onEvaluate={checkPracticeAnswer}
          onTranscribeAudio={transcribeVoiceAudio}
        />
      )
      case 'behavioral': return (
        <BehavioralSection
          questions={analysis?.behavioralQuestions || analysis?.questions || []}
          interviewId={currentId}
          onEvaluate={checkPracticeAnswer}
          onTranscribeAudio={transcribeVoiceAudio}
        />
      )
      case 'roadmap':    return (
        <RoadmapSection
          plan={analysis?.preparationPlan || analysis?.roadmap || []}
          completedTasks={analysis?.completedTasks || []}
          onToggleTask={(taskKey) => toggleTask(currentId, taskKey)}
        />
      )
      case 'resume':     return (
        <OptimizedResumeSection
          interviewId={currentId}
          optimizedResume={optimizedResume}
          loadingResume={loadingResume}
          resumeError={resumeError}
          onGenerate={loadOptimizedResume}
          onDownload={handleDownloadPdf}
          downloadingPdf={downloadingPdf}
          onFetchOriginalPdf={fetchOriginalResumePdf}
        />
      )
      default:           return null
    }
  }

  return (
    <main className="interview-page">

      {/* ── Left Sidebar ─────────────────────────────────── */}
      <aside className="iv-sidebar">
        <button type="button" className="iv-back-btn" onClick={() => navigate("/home")}>
          <IconArrowLeft />
          Back to Home
        </button>

        {analysis?.title && (
          <div className="iv-report-title" title={analysis.title}>
            {analysis.title}
          </div>
        )}

        <nav className="iv-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`iv-nav__item ${activeSection === item.key ? 'iv-nav__item--active' : ''}`}
              onClick={() => handleTabClick(item.key)}
            >
              <span className="iv-nav__icon">{item.icon}</span>
              <span className="iv-nav__label">{item.label}</span>
            </button>
          ))}
        </nav>

        <button type="button" className="iv-logout-btn" onClick={onLogout}>
          <IconLogout />
          Logout
        </button>
      </aside>

      {/* ── Vertical Divider ─────────────────────────────── */}
      <div className="iv-divider" />

      {/* ── Center Content ───────────────────────────────── */}
      <div className="iv-content">
        <div className="iv-content__inner">
          {renderContent()}
        </div>
      </div>

      {/* ── Vertical Divider ─────────────────────────────── */}
      <div className="iv-divider" />

      {/* ── Right Panel — Match Score + Skill Gaps ────────── */}
      <aside className="iv-right-panel">

        {/* Match Score */}
        <div className="rp-score">
          <div className="score-ring">
            <svg viewBox="0 0 36 36" className="score-ring__svg">
              <circle className="score-ring__track" cx="18" cy="18" r="15.9" />
              <circle
                className="score-ring__fill"
                cx="18" cy="18" r="15.9"
                strokeDasharray={`${analysis?.matchScore || 0} ${100 - (analysis?.matchScore || 0)}`}
                strokeDashoffset="25"
              />
            </svg>
            <span className="score-ring__value">{analysis?.matchScore || 0}</span>
          </div>
          <p className="rp-score__label">Match Score</p>
          <button
            type="button"
            className={`rp-analytics-btn ${activeSection === 'analytics' ? 'rp-analytics-btn--active' : ''}`}
            onClick={() => handleTabClick('analytics')}
          >
            <IconBarChart />
            <span>Readiness Cockpit</span>
          </button>
        </div>

        {/* Skill Gaps */}
        <div className="rp-section">
          <div className="rp-section__header">
            <span className="rp-section__icon"><IconAlert /></span>
            <h3 className="rp-section__title">Skill Gaps</h3>
          </div>
          <div className="skill-tags">
            {analysis?.skillGaps?.map((gap, i) => (
              <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                {gap.skill}
              </span>
            ))}
          </div>
        </div>

        {/* Download Resume PDF */}
        <div className="rp-section rp-download">
          {pdfError && <p className="rp-download__error">{pdfError}</p>}
          <button
            type="button"
            className="rp-download__btn"
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
          >
            <IconDownload />
            {downloadingPdf ? "Generating PDF..." : "Download Resume PDF"}
          </button>
        </div>

      </aside>

    </main>
  )
}

export default Interview