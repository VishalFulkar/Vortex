const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const UserModel = require("../models/user.model")

async function register(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword
        });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 3600000
        });
        res.status(201).json({
            message: "User created successfully",
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }

}

async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    try {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({
                message: "Invalid Credentials"
            })
        }
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET)

        res.cookie("token", token);

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });

    }
}

module.exports = { register, login }