// const express = require("express");
// const { getSwipeCandidates, swipeUser, getFriends } = require("../controllers/userController");
// const authMiddleware = require("../middleware/authMiddleware");

// const router = express.Router();


// router.get("/swipe", authMiddleware, getSwipeCandidates);

// router.post("/swipe", authMiddleware, swipeUser);


// router.get("/friends", authMiddleware, getFriends);

// module.exports = router;


const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");





router.get("/", controller.getUsers);


router.get("/:id", controller.getUserById);


router.put("/:id", controller.updateUser);


router.delete("/:id", controller.deleteUser);

module.exports = router;


