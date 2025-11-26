
const Connection = require("../models/Connection");
const User = require("../models/User");


exports.sendRequest = async (req, res) => {
    try {
        const fromUser = req.user.id; 
        const toUser = req.params.id; 

        if (fromUser === toUser) {
            return res.status(400).json({ message: "You cannot send request to yourself" });
        }

       
        let connection = await Connection.findOne({
            $or: [
                { fromUser, toUser },
                { fromUser: toUser, toUser: fromUser }
            ]
        });

        if (connection) {
            return res.status(400).json({ message: "Connection already exists" });
        }

        const newRequest = await Connection.create({
            fromUser,
            toUser,
            status: "pending"
        });

        res.json({ message: "Request sent", data: newRequest });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.acceptRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const requestId = req.params.id;

        console.log(userId, requestId)
        console.log(await Connection.find({}))
        const connection = await Connection.findOne({ _id: requestId, fromUser: userId });

        console.log(connection)
        if (!connection) {
            return res.status(404).json({ message: "Request not found" });
        }

        connection.status = "accepted";
        await connection.save();

        res.json({ message: "Request accepted", data: connection });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.rejectRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const requestId = req.params.id;

        const connection = await Connection.findOne({ _id: requestId, fromUser: userId });

        if (!connection) {
            return res.status(404).json({ message: "Request not found" });
        }

        connection.status = "rejected";
        await connection.save();

        res.json({ message: "Request rejected", data: connection });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.ignoreUser = async (req, res) => {
    try {
        const fromUser = req.user.id;  
        const toUser = req.params.id;   

        let connection = await Connection.findOne({
            $or: [
                { fromUser, toUser },
                { fromUser: toUser, toUser: fromUser }
            ]
        });

        if (!connection) {
            connection = await Connection.create({
                fromUser,
                toUser,
                status: "ignored"
            });
        } else {
            connection.status = "ignored";
            await connection.save();
        }

        res.json({ message: "User ignored successfully", data: connection });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// exports.requestsSent = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const sent = await Connection.find({
//             fromUser: userId,
//             status: "pending"
//         }).populate("toUser", "name -_id");

//         res.json({ message: "Sent requests", data: sent });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };



// exports.requestsReceived = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const received = await Connection.find({
//             toUser: userId,
//             status: "pending"
//         }).populate("fromUser", "-password");

//         res.json({ message: "Received requests", data: received });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };



exports.getConnections = async (req, res) => {
    try {
        const userId = req.user.id;

        const friends = await Connection.find({
            $or: [
                { fromUser: userId, status: "accepted" },
                { toUser: userId, status: "accepted" }
            ]
        })
            .populate("fromUser", "-password")
            .populate("toUser", "-password");

        res.json({ message: "Accepted connections", data: friends });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// exports.getConnections = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const connections = await Connection.find({
//             status: "accepted",
//             $or: [
//                 { fromUser: userId },
//                 { toUser: userId }
//             ]
//         })
//         .populate("fromUser", "-password")
//         .populate("toUser", "-password");

        
//         const friends = connections.map(conn => {
//             if (conn.fromUser._id.toString() === userId) {
//                 return conn.toUser;  
//             } else {
//                 return conn.fromUser; 
//             }
//         });

//         res.json({
//             message: "Accepted friends",
//             data: friends
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

