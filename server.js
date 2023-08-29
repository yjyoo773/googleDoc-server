const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config()

const User = require("./models/User")

const Document = require("./models/Document")

// ENV VARIABLES

const PORT = process.env.PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000"

const app = express()
app.use(express.json())

// User Create Endpoint
app.post("/register", (req, res) => {
    // hash password
    bcrypt
    .hash(req.body.password, 10)
    .then((hashedPW) => {
        // create a new user instance and collect data
        const user = new User({
            email: req.body.email,
            password: hashedPW,
        })

        // save new user
        user.save()
        .then((result) =>{
            res.status(201).send({
                message: `User ${req.body.email} created successfully`,
                result,
            })
        })
        .catch((error) => {
            res.status(500).send({
                message: "Error creating user",
                error,
            })
        })
    })
    .catch((error) => {
        res.status(500).send({
            message: "Password was not hashed successfully",
            error,
        })
    })
})

// Login Endpoint
app.post('/login', (req, res) => {
    // check if email exists
    User.findOne({email: req.body.email})
    .then((user) => {
        bcrypt.compare(req.body.password, user.password)
        .then((passwordCheck) => {
            if(!passwordCheck) {
                return res.status(400).send({
                    message: "Passwords do not match",
                    error,
                })
            }

            // create JWT Token
            const token = jwt.sign(
                {
                    userId: user._id,
                    userEmail: user.email,
                },
                "RANDOM-TOKEN",
                {expiresIn: "24h"}
            )

            // return success response
            res.status(200).send({
                message: "Login successful",
                email: user.email,
                token,
            })
        })
        .catch((error) => {
            res.status(400).send({
                message: "Passwords do not match",
                error
            })
        })
    })
    // Catch error if email does not exist
    .catch((error) => {
        res.status(404).send({
            message: "Email not found",
            error
        })
    })
})


const dbConnect = require("./db/dbConnect");
dbConnect()


const defaultValue = ""

const io = require('socket.io')(PORT, {
    cors: {
        origin: CLIENT_URL,
        methods: ['GET', 'POST']
    }
})

io.on("connection", socket => {
    socket.on('get-document', async documentId => {
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit('load-document', document.data)

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })

        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
    })
})

async function findOrCreateDocument(id) {
    if (id === null) return

    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })

}

// const PORT = process.env.PORT || 5000;
app.listen(5050, () => {
  console.log(`Server is running on port ${PORT}`);
});