const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: Number,
    gender: { type: String, enum: ["male", "female", "other"] },
    bio: String,
    hobbies: [String],
    category: String,
    profilePic: String,

    swipes: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            liked: Boolean 
        }
    ],

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);




