const express = require("express");

const router = express.Router();

const commentController = require("../controllers/commentController");
const authenticateToken = require("../middleware/authenticateToken");
router.post("/", authenticateToken, commentController.handleCreateComment);
router.get("/:id", commentController.handleGetCommentByParkId);
router.delete(
  "/:id",
  authenticateToken,
  commentController.handleDeleteCommentById
);

module.exports = router;
