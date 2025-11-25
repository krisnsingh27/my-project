const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "ignored"], 
        default: "pending",
    },
}, { timestamps: true });

module.exports = mongoose.model("Connection", ConnectionSchema);


