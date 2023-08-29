const mongoose = require("mongoose");
require("dotenv").config()

async function dbConnect() {
    mongoose.connect(
        process.env.DB_URL,
    )
        .then(() => console.log("Connected to database!"))
        .catch((err) => console.error("Error connecting database", err))
}

module.exports = dbConnect;