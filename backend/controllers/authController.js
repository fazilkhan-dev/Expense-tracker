const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// REGISTER USER
const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // CHECK IF USER EXISTS
        const userExists = await User.findOne({ email });

        if (userExists) {

            return res.status(400).json({
                message: "User already exists",
            });

        }

        // HASH PASSWORD
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // CREATE USER
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // GENERATE TOKEN
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d",
            }
        );

        // RESPONSE
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};




// LOGIN USER
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // FIND USER
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "Invalid credentials",
            });

        }

        // CHECK PASSWORD
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid credentials",
            });

        }

        // GENERATE TOKEN
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d",
            }
        );

        // RESPONSE
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};




// GET CURRENT USER
const getMe = async (req, res) => {

    res.status(200).json(req.user);

};




// EXPORTS
module.exports = {
    registerUser,
    loginUser,
    getMe,
};