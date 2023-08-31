const express = require("express")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const router = express.Router()

// Login Endpoint
router.post('/', (req, res) => {
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

module.exports = router