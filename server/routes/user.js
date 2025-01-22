const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/register", userController.registerUser, userController.loginUser);
router.post("/login", userController.loginUser);
router.get("/me", userController.checkUserAuth, userController.getMe);
router.get("/search", userController.checkUserAuth, userController.searchUser);
router.put("/:userId", userController.checkUserAuth, userController.updateUser);
router.delete(
  "/:userId",
  userController.checkUserAuth,
  userController.deleteUser
);

module.exports = router;
