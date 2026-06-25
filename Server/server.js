require("dotenv").config();
const app = require("./src/app");
const pool = require("./src/config/db");

const PORT = process.env.PORT || 3000;

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Database connected successfully");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});