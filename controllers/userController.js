const User = require("../models/User");
const Connection = require("../models/Connection")



exports.getFeed = async (req, res) => {
    try {
       
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

       
        const excludeList = [
            ...(currentUser.friends || []).map(id => id.toString()),
            ...(currentUser.ignoredUsers || []).map(id => id.toString()),
            ...(currentUser.rejectedUsers || []).map(id => id.toString()),
            currentUser._id.toString()
        ];

        
        let feedUsers = await User.find({
            _id: { $nin: excludeList },            
            ignoredUsers: { $ne: currentUser._id }, 
            rejectedUsers: { $ne: currentUser._id } 
           
        }).select("-password -friends -ignoredUsers -rejectedUsers -__v");

       
        feedUsers = feedUsers.sort(() => Math.random() - 0.5);

       
        const formattedFeed = feedUsers.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            gender: user.gender,
            bio: user.bio,
            hobbies: Array.isArray(user.hobbies)
                ? user.hobbies
                : typeof user.hobbies === "string"
                    ? user.hobbies.split(",").map(s => s.trim())
                    : []
        }));

       
        res.status(200).json({
            message: "User feed",
            data: formattedFeed
        });

    } catch (err) {
        console.error("Feed error:", err);
        res.status(500).json({ error: err.message || "Server error" });
    }
};



exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User fetched", data: user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};





exports.updateUser = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } 
        );

        if (!updated) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User updated", data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);

        if (!deleted) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




