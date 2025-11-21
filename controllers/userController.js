const User = require("../models/User");


exports.createProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { age, gender, bio, hobbies, category, profilePic } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.age || user.bio || (user.hobbies && user.hobbies.length > 0)) {
            return res.status(400).json({ message: "Profile already exists. Use updateProfile to modify it." });
        }

        user.age = age;
        user.gender = gender;
        user.bio = bio;
        user.hobbies = hobbies;
        user.category = category;
        user.profilePic = profilePic;

        await user.save();
        res.status(200).json({ message: "Profile created successfully", user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId).select(
            "name email age gender bio hobbies category profilePic friends swipes"
        ).populate(
            "friends",
            "name age gender bio hobbies category profilePic"
        );

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ profile: user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { age, gender, bio, hobbies, category, profilePic } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { age, gender, bio, hobbies, category, profilePic },
            { new: true }
        );

        res.status(200).json({ message: "Profile updated successfully", user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        
        await User.updateMany(
            {},
            {
                $pull: {
                    friends: userId,
                    swipes: { user: userId }
                }
            }
        );

        res.status(200).json({ message: "Profile deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getSuggestions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        const excludedIds = [
            userId,
            ...user.friends,
            ...user.swipes.map(s => s.user)
        ];

        const suggestions = await User.find({ _id: { $nin: excludedIds } });

        res.status(200).json({ suggestions });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.swipeUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { targetUserId, liked } = req.body;

        if (!targetUserId || typeof liked !== "boolean") {
            return res.status(400).json({ message: "targetUserId and liked (true/false) are required" });
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) return res.status(404).json({ message: "Target user not found" });

    
        user.swipes.push({ user: targetUserId, liked });
        await user.save();

        
        if (liked) {
            const targetSwiped = targetUser.swipes.find(s => s.user.toString() === userId && s.liked);
            if (targetSwiped) {
                user.friends.push(targetUserId);
                targetUser.friends.push(userId);

                await user.save();
                await targetUser.save();

                return res.status(200).json({ message: "It's a match!", friends: user.friends });
            }
        }

        res.status(200).json({ message: liked ? "User liked" : "User rejected" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getFriends = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).populate(
            "friends",
            "name age gender bio hobbies category profilePic"
        );

        res.status(200).json({ friends: user.friends });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
