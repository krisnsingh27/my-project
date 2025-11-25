// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/connectionController");


// router.post("/", controller.sendRequest);


// router.get("/:userId", controller.getPendingRequests);


// router.put("/:id", controller.updateRequest);


// router.delete("/:id", controller.deleteConnection);

// router.put("/rejected/:id", controller.rejectedUser);


// module.exports = router;



const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
    sendRequest,
    acceptRequest,
    rejectRequest,
    ignoreUser,
    requestsSent,
    requestsReceived,
    getConnections
} = require("../controllers/connectionController");

router.post("/request/:id", auth, sendRequest);
router.put("/accept/:id", auth, acceptRequest);
router.put("/reject/:id", auth, rejectRequest);
router.put("/ignore/:id", auth, ignoreUser);

router.get("/sent", auth, requestsSent);
router.get("/received", auth, requestsReceived);
router.get("/friends", auth, getConnections);

module.exports = router;

