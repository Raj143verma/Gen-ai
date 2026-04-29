require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/DB");
const { resume, selfDescription, jobDescription } = require("./src/services/temp")
const { generateInterviewReport } = require("./src/services/ai.service")


connectToDB()

generateInterviewReport({ resume, selfDescription, jobDescription }).then((report) => {
    console.log("Generated Interview Report:", report);
}).catch((error) => {
    console.error("Error generating interview report:", error);
});
  
app.listen(3000, async () => {
    console.log("Server is running on port 3000");


});

