const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { devLogger } = require("./middlewares/loggermiddleware");
const app = express();


app.use(express.json());
app.use(cookieParser());

const clientUrls = (process.env.CLIENT_URL || "")
    .split(",")
    .map(u => u.trim())
    .filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        // Allow explicitly defined client URLs
        if (clientUrls.includes(origin)) return callback(null, true);

        // Allow any local dev origin (localhost or 127.0.0.1 on any port: 5173, 5174, etc.)
        if (/^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(devLogger);



/* using all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");


/*using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);


module.exports = app;