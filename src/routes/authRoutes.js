const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register route
router.post('/register', async (req, res) => {
    try {
        // Check if user already exists
        console.log(`User trying to register ${req.body.email}`);
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).send('Email already registered.');
        }

        // Create and save the user
        user = new User({
            email: req.body.email,
            password: req.body.password
        });
        await user.save();

        // Respond with success
        res.status(201).send('User registered successfully.');
    } catch (error) {
        res.status(500).send('Error registering the user.');
    }
});

//Login route
router.post('/login', async (req, res) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send('Cannot find user.');
        }

        // Check the password
        if (await bcrypt.compare(req.body.password, user.password)) {
            // Create JWT token
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '10min'
            });
            console.log(`${user._id}-logged in!`);
            // Send the token to the user
            res.status(200);
            res.header('Authorization', `Bearer ${token}`).send('Logged in successfully.');
        } else {
            res.status(400).send('Password is incorrect.');
        }
    } catch (error) {
        res.status(500).send('Error logging in the user.');
    }
});
module.exports = router;