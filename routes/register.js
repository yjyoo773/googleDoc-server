const express = require("express");
const bcrypt = require("bcrypt")
const router = express.Router();
const User = require("../models/User")

// User Create Endpoint
router.post("/", (req, res) => {
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

module.exports = router