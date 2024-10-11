const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoute.js");
const subjectRoutes = require("./routes/subjectRoute.js");
const questionRoute = require("./routes/questionRoute.js");
const startExamRoute = require("./routes/startExamRoute.js");
const answerRoutes= require("./routes/answerRoute.js");
const resultRoutes = require('./routes/resultRoute.js')

const cors = require('cors');

const path = require("path");
const { fileURLToPath } = require("url");
const { dirname } = "path";


dotenv.config();
connectDB();

// rest object
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './dist')));

// auth routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/question", questionRoute);
app.use("/api/v1/start-exam", startExamRoute);
app.use('/api/v1/answer', answerRoutes);
app.use('/api/v1/result', resultRoutes);

app.use("*",function(req, res){
  res.sendFile(path.join(__dirname, './dist/index.html'))
})

app.listen(process.env.PORT, () => {
  console.log("Application is running now");
});
