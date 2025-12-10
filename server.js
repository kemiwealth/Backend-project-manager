// const express = require('express');
// const morgan = require('morgan');
// const cors = require("cors")
// const mongoose = require('mongoose');
// // const projectRoutes = require('./routes/projectRoutes')

// // Set up all variables in the .env file
// require('dotenv').config();


// // Database Connection
// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log('Successfully connected to MongoDB!'))
// .catch(err => console.error('Connection error', err));


// const PORT = process.env.PORT || 4000;
// const app = express();


// const allowedOrigins = [
//   process.env.FRONTEND_URL,                 // deployed frontend
//   "http://localhost:5173"                   // local frontend for development
// ];


// // ========= Middlewares =================
// app.use(morgan('dev')); // logger
// app.use(express.json()); // body parser
// // app.use(cors({origin: [ process.env.FRONTEND_URL, "http://localhost:5173", "https://backend-project-manager-4934.onrender.com"], credentials: true,}));

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));

// // ========= Routes ======================
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/projects', require('./routes/projectRoutes'));
// app.use('/api', require('./routes/taskRoutes'));

// // Use this route to setup the API documentation
// app.get('/', (req, res) => {
//     res.send('Welcome to my API!');
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port: ${PORT}`)
// });


const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const mongoose = require('mongoose');
require('dotenv').config();

// Routes
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch(err => console.error('Connection error', err));

const PORT = process.env.PORT || 4000;
const app = express();

// Allowed origins
const allowedOrigins = [
  "https://kw-frontend-project-manager.netlify.app",
  "http://localhost:5173"
];

// ========== Middlewares ==========
app.use(morgan('dev'));
app.use(express.json());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ========== Routes ==========
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', taskRoutes);

// Default API route
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

// Error handling middleware for CORS or other errors
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
