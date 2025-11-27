


const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/userController");





router.get("/feed", auth, controller.getFeed);

router.get("/:id", auth, controller.getUserById);


router.put("/:id", auth, controller.updateUser);


router.delete("/:id", auth, controller.deleteUser);

module.exports = router;


