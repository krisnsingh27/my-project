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
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware"); 




router.post("/profile/create", authMiddleware, userController.createProfile);



router.get("/profile", authMiddleware, userController.getProfile);



router.put("/profile/update/:id", authMiddleware, userController.updateProfile);


router.delete("/profile/delete/:id", authMiddleware, userController.deleteProfile);


router.get("/suggestions", authMiddleware, userController.getSuggestions);


router.post("/swipe", authMiddleware, userController.swipeUser);


router.get("/friends", authMiddleware, userController.getFriends);

module.exports = router;

