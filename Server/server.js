require("dotenv").config();
const app = require("./src/app");
const initDB = require("./src/config/initDB");

const PORT = process.env.PORT || 3000;

// Initialize Database
initDB();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});