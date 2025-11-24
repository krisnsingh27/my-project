const express = require("express");
const router = express.Router();
const controller = require("../controllers/connectionController");


router.post("/", controller.sendRequest);


router.get("/:userId", controller.getPendingRequests);


router.put("/:id", controller.updateRequest);


router.delete("/:id", controller.deleteConnection);

router.put("/rejected/:id", controller.rejectedUser);


module.exports = router;

