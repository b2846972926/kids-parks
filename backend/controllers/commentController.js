const commentModel = require("../models/commentModel");
const db = require("../db");

const handleCreateComment = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { rating, nickname, text, parkId, tags = [] } = req.body;
    if (!rating || !nickname || !text || !parkId) {
      return res.status(400).json({ error: "請填上所有資料" });
    }
    await connection.beginTransaction();
    await commentModel.createComment(connection, {
      rating,
      text,
      parkId,
      nickname,
      tags,
    });
    await connection.commit();
    res.status(201).json({ message: "新增成功" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "請求失敗" });
  } finally {
    connection.release();
  }
};

const handleGetCommentByParkId = async (req, res) => {
  try {
    const id = req.params.id;
    const { sortBy } = req.query;
    const result = await commentModel.getCommentByParkId(id, sortBy);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "請求失敗" });
  }
};
const handleDeleteCommentById = async (req, res) => {
  try {
    const commentId = req.params.id;
    const result = await commentModel.deleteCommentById(commentId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "找不到這筆留言" });
    }
    res.json({ message: "留言刪除成功" });
  } catch (error) {
    res.status(500).json({ error: "刪除失敗" });
  }
};
module.exports = {
  handleCreateComment,
  handleGetCommentByParkId,
  handleDeleteCommentById,
};
