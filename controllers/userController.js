const User = require("../models/User");
const Connection = require("../models/Connection")






exports.getFeed = async (req, res) => {
  try {
    const meId = req.user.id;

   
    const acceptedConnections = await Connection.find({
      status: "accepted",
      $or: [{ fromUser: meId }, { toUser: meId }]
    });

    
    const friendIds = acceptedConnections.map(conn =>
      conn.fromUser.toString() === meId ? conn.toUser : conn.fromUser
    );

  
    const me = await User.findById(meId);
    if (!me) return res.status(404).json({ message: "User not found" });

    const ignoredIds = (me.ignoredUsers || []).map(id => id.toString());
    const rejectedIds = (me.rejectedUsers || []).map(id => id.toString());
    

   
    const excludeList = [meId, ...friendIds, ...ignoredIds, ...rejectedIds];

  
    const others = await User.find({ _id: { $nin: excludeList } })
      .select("name age gender bio hobbies");

    
    const shuffled = others.sort(() => Math.random() - 0.5);

    res.json({ message: "User feed", data: shuffled });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password"); 

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User fetched", data: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};









exports.updateUser = async (req, res) => {
  try {
    const myId = req.user.id;
    const targetId = req.params.id;

    if (myId !== targetId) {
      return res.status(403).json({ message: "You can only edit your own profile" });
    }

    const updated = await User.findByIdAndUpdate(targetId, req.body, { new: true })
      .select("-password"); 

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




exports.deleteUser = async (req, res) => {
  try {
    const myId = req.user.id;
    const targetId = req.params.id;

    if (myId !== targetId) {
      return res.status(403).json({ message: "You can only delete your own profile" });
    }

    const deleted = await User.findByIdAndDelete(targetId);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.clearCookie("token"); 
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





