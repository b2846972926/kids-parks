const db = require("../db");

const createTag = async (connection, tag) => {
  await connection.query("INSERT IGNORE INTO tags(tag) VALUES (?)", [tag]);
};

const getTagId = async (connection, tag) => {
  const [rows] = await connection.query(`SELECT id FROM tags WHERE tag = ?`, [
    tag,
  ]);
  return rows[0]?.id;
};

const getHotTags = async () => {
  const [rows] = await db.query(`
    SELECT t.tag, COUNT(*) AS tag_count
    FROM comment_to_tags AS ct
    JOIN tags AS t ON t.id = ct.tag_id
    GROUP BY t.tag
    ORDER BY tag_count DESC
    LIMIT 5
  `);
  return rows;
};

module.exports = {
  createTag,
  getTagId,
  getHotTags,
};
