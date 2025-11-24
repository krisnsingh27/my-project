
const Connection = require("../models/Connection");


exports.sendRequest = async (req, res) => {
    try {
        const { SenderId, ReceiverId } = req.body;

        if (SenderId === ReceiverId) {
            return res.status(400).json({ message: "Cannot send request to yourself" });
        }

      
        const existing = await Connection.findOne({ SenderId, ReceiverId });
        if (existing) {
            return res.status(400).json({ message: "Request already sent", data: existing });
        }

        const request = await Connection.create({
            SenderId,
            ReceiverId,
            status: "pending"
        });

        res.status(201).json({ message: "Connection request sent", data: request });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.updateRequest = async (req, res) => {
    try {
        const { status } = req.body;
        const requestId = req.params.id;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Use accepted or rejected" });
        }

        const request = await Connection.findByIdAndUpdate(
            requestId,
            { status },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.json({ message: "Request updated", data: request });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.getPendingRequests = async (req, res) => {
    try {
        const userId = req.params.userId;

        const requests = await Connection.find({
            ReceiverId: userId,
            status: "pending"
        }).populate("SenderId", "name email gender");

        res.json({ message: "Pending requests", data: requests });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




exports.deleteConnection = async (req, res) => {
    try {
        const requestId = req.params.id;

        const deleted = await Connection.findByIdAndDelete(requestId);

        if (!deleted) {
            return res.status(404).json({ message: "Connection not found" });
        }

        res.json({ message: "Connection deleted" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.rejectedUser = async (req, res) => {
    try {
        const userA = req.user.id; 
        const userB = req.params.id;

        let connection = await Connection.findOne({
            $or: [
                { fromUser: userA, toUser: userB },
                { fromUser: userB, toUser: userA }
            ]
        });

        if (!connection) {
           
            connection = await Connection.create({
                fromUser: userA,
                toUser: userB,
                status: "ignored"
            });
        } else {
            connection.status = "ignored";
            await connection.save();
        }

        res.json({ message: "User ignored", data: connection });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

