const db = require("../db");

const tagModel = require("./tagModel");
const commentToTagsModel = require("./commentToTagsModel");
const createComment = async (
  connection,
  { text, nickname, rating, parkId, tags = [] }
) => {
  const [commentResult] = await connection.query(
    `INSERT INTO comments(comment, nickname, rating, park_id) VALUES (?, ?, ?, ?)`,
    [text, nickname, rating, parkId]
  );
  const commentId = commentResult.insertId;

  for (const tag of tags) {
    await tagModel.createTag(connection, tag);

    const tagId = await tagModel.getTagId(connection, tag);

    await commentToTagsModel.createCommentToTags(connection, commentId, tagId);
  }
};

const getCommentByParkId = async (id, sortBy) => {
  let orderby = "";

  if (sortBy === "latest") {
    orderby = "created_at DESC";
  } else if (sortBy === "highest") {
    orderby = "rating DESC";
  } else if (sortBy === "lowest") {
    orderby = "rating ";
  } else {
    orderby = "created_at";
  }
  const [rows] = await db.query(
    `SELECT c.id,comment,nickname,rating,created_at,GROUP_CONCAT(t.tag) AS tags FROM comments AS c LEFT JOIN comment_to_tags AS ct ON ct.comment_id=c.id LEFT JOIN tags AS t ON t.id= ct.tag_id WHERE park_id = ? GROUP BY c.id ORDER BY ${orderby}`,
    [id]
  );

  const format = rows.map((comment) => {
    const tagsArray = comment.tags ? comment.tags.split(",") : [];
    return {
      ...comment,
      tags: tagsArray,
    };
  });

  return format;
};

const getAvgRating = async (parkIds) => {
  const [rows] = await db.query(
    `SELECT park_id, ROUND(AVG(rating), 1) AS average_rating ,COUNT(*) AS comment_count FROM comments WHERE park_id IN (?) GROUP BY park_id`,
    [parkIds]
  );
  return rows;
};

const getTopTags = async (parkIds) => {
  const [topTagRows] = await db.query(
    `SELECT c.park_id, t.tag, COUNT(*) AS tag_count
        FROM comments c
        JOIN comment_to_tags ct ON c.id = ct.comment_id
        JOIN tags t ON ct.tag_id = t.id
        WHERE c.park_id IN (?)
        GROUP BY c.park_id, t.tag
        ORDER BY c.park_id, tag_count DESC`,
    [parkIds]
  );
  return topTagRows;
};

const deleteCommentById = async (commentId) => {
  const [result] = await db.query(`DELETE FROM comments WHERE id = ?`, [
    commentId,
  ]);
  return result;
};
module.exports = {
  createComment,
  getCommentByParkId,
  getAvgRating,
  getTopTags,
  deleteCommentById,
};
