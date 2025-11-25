const User = require("../models/User");
const Connection = require("../models/Connection")

// exports.getUsers = async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json({ message: "Users fetched", data: users });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
// exports.getUsers = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const rejected = await Connection.find({
//             $or: [{ SenderId: userId }, { ReceiverId: userId }],
//             status: "rejected"
//         });

//         const rejectedUserIds = rejected.map(c =>
//             c.SenderId.toString() === userId ? c.ReceiverId.toString() : c.SenderId.toString()
//         );

//         const users = await User.find({
//             _id: { $nin: [userId, ...rejectedUserIds] }
//         });

//         res.json({ message: "Users fetched", data: users });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

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




