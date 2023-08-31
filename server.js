const express = require("express")

require('dotenv').config()

const loginRouter = require("./routes/login")
const registerRouter = require("./routes/register")
const auth = require("./auth")

// ENV VARIABLES
const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())
app.use("/login", loginRouter)
app.use("/register", registerRouter)

const httpServer = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

app.get('/', (req,res) => {
    res.json({message: "Hello world"})
})

app.get('/auth-endpoint', auth, (req, res) => {
    res.json({message: "Authorized"})
})

// connect to database
const dbConnect = require("./db/dbConnect");
const io = require("./socket")(httpServer)
dbConnect()
