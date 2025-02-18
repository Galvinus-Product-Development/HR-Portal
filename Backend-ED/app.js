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

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Create a write stream (in append mode) for logging to a file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });

// Middlewares
app.use(morgan('dev'));  // Logs to the console in 'dev' format (for development)
app.use(morgan('combined', { stream: accessLogStream }));  // Logs to a file in 'combined' format (for production)

// Set additional middlewares
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/inventory', bankRoutes);
app.use('/api/documentRoutes', documentRoutes);
app.use('/api/emergencyRoutes', emergencyRoutes);
app.use('/api/employeeRoutes', employeeRoutes);
app.use('/api/employmentRoutes', employmentRoutes);
app.use('/api/salaryRoutes', salaryRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
