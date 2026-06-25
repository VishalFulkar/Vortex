const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth.route")
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/auth", authRoute);

module.exports = app;