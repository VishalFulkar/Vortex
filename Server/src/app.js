const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth.route")
const folderRoute = require("./routes/folder.route")
const fileRoute = require("./routes/file.route")
const cookieParser = require("cookie-parser")
const fs = require('fs');
const app = express();

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

//Routes
app.use("/api/auth", authRoute);
app.use("/api/folder", folderRoute);
app.use("/api/file", fileRoute);

module.exports = app;