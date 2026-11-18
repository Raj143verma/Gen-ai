const mongoose = require('mongoose');


/**
 * - job description schema : string
 * - resume text : string
 * - self description : string
 * 
 *  - match score: number
 * 
 *  - Technical questions :
 *   [{
 *      question: " ",
 *      intention: " ",
 *      answer: " ",
 * 
 *}]
 * 
 *  - Behavioral questions
 * {
 *       question: " ",
 *      intention: " ",
 *     answer: " ",
 * 
 * }
 *  - skill gaps : [{
 *     skill: " ",
 *      serverity: " ",
 *     type : string,}
 *     enum : ["low", "medium", "high"]
 * }]
 *  - preparation plan : [{
 *     day: number,
 *     focus: string,
 *     tasks: [string]
 * 
 * }]
 */




const technicalQuestionSchema = new mongoose.Schema({
    question: { 
        type: String,
     required: [true, "question is required"]
    },
    intention: {
        type: String,
        required: [true, "intention is required"]
    },
    answer: {
        type: String,
            required: [true, "answer is required"]
    }
},{
    _id: false
})

 const behavioralQuestionSchema = new mongoose.Schema({
      question: { 
        type: String,
     required: [true, "question is required"]
    },
    intention: {
        type: String,
        required: [true, "intention is required"]
    },
    answer: {
        type: String,
            required: [true, "answer is required"]
    }
 },{
    _id: false
 })

 const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "severity is required"]
    }
 },{ _id: false })

 const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "day is required"]
    },
    focus: {
        type: String,
        required: [true, "focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "at least one task is required"]
    }]
 },{
    _id: false
 })

const interviewReportSchema = new mongoose.Schema({
    jobDescription: { 
        type: String,
     required: [true, "job description is required"]

    },
    resumeText: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min : 0,
        max : 100,
    },
    
    technicalQuestions: [ technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    completedTasks: {
        type: [String],
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title: {
        type: String,
        required: [true, " job  title is required"] 
    }

}, {
    timestamps: true
}) 

const interviewReport = mongoose.model('InterviewReport', interviewReportSchema);

module.exports = interviewReport;