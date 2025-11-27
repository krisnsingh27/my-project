const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return regex.test(password);
};



exports.signup = async (req, res) => {
    try {
        const { name, email, password, age, gender, bio, hobby } = req.body;


        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }


        if (!validatePassword(password)) {
            return res.status(400).json({
                message: "Password must contain uppercase, lowercase, number and be at least 6 characters"
            });
        }


        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            bio,
            hobby
        });

        res.status(201).json({
            message: "Signup successful"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });




        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "10d" }
        );
        

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,      
            sameSite: "lax",
            path: "/",
            maxAge: 10 * 24 * 60 * 60 * 1000
        });


        res.status(200).json({ message: "Login successful" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }



};

exports.logout = (req,res) => {
    res.clearCookie("token");
    res.status(200).json({message:"Logout successful"});

};




