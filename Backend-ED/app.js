const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fs = require('fs');  
const path = require('path');  
const helmet = require('helmet');
const cors = require('cors');

const bankRoutes=require("./routes/bankRoutes");
const documentRoutes = require('./routes/documentRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const employmentRoutes = require('./routes/employmentRoutes');
const salaryRoutes = require('./routes/salaryRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const personalDetailsRoutes = require("./routes/personalDetailsRoutes");

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Ensure logs directory exists before writing logs
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    console.log("✅ Logs directory created");
}

// Create a write stream (in append mode) for logging to a file
const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), { flags: "a" });

// Create a write stream (in append mode) for logging to a file
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });
app.use('/uploads', express.static('uploads'));


// Middlewares
app.use(morgan('dev'));  // Logs to the console in 'dev' format (for development)
app.use(morgan('combined', { stream: accessLogStream }));  // Logs to a file in 'combined' format (for production)

// Set additional middlewares
app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/ed/api/inventory', bankRoutes);
app.use('/ed/api/documentRoutes', documentRoutes);
app.use('/ed/api/emergencyRoutes', emergencyRoutes);
app.use('/ed/api/employeeRoutes', employeeRoutes);
app.use('/ed/api/employmentRoutes', employmentRoutes);
app.use('/ed/api/salaryRoutes', salaryRoutes);
app.use('/ed/api/certifications',certificationRoutes);
app.use("/ed/api/personal-details", personalDetailsRoutes);



app.get("/ed", (req, res) => {
  res.status(200).json({ status: "ok", message: `Service is healthy` });
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
