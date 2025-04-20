const db = require("../db");

const createCommentToTags = async (connection = db, commentId, tagId) => {
  await connection.query(
    `INSERT INTO comment_to_tags(comment_id, tag_id) VALUES (?, ?)`,
    [commentId, tagId]
  );
};

module.exports = {
  createCommentToTags,
};
