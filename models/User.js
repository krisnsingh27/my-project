const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: Number,
    gender: { type: String, enum: ["male", "female", "other"] ,default:"male"},
    bio: String,
    hobby: [String],

    friends: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], default: [] },
    ignoredUsers: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], default: [] },
    rejectedUsers: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], default: [] },


  
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);




