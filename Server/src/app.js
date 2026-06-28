const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth.route")
const folderRoute = require("./routes/folder.route")
const cookieParser = require("cookie-parser")
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Routes
app.use("/api/auth", authRoute);
app.use("/api/folder", folderRoute);

module.exports = app;