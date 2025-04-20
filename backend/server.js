const express = require("express");
const mysql = require("mysql2/promise");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const tagRoutes = require("./routes/tagRoutes");
const parkRoutes = require("./routes/parkRoutes");
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "0917268798a",
  database: "kids",
});

app.use("/api/users", userRoutes);
app.use("/api/parks", parkRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/tags", tagRoutes);

// //拿公園資料
// app.post("/api/park", async (req, res) => {
//   try {
//     const payload = req.body;
//     const response = await axios.post(
//       "https://taichungmelody.taichung.gov.tw/api/Park/QueryParks",
//       payload
//     );

//     const parks = response.data;
//     const parkIds = parks.data.pageData.map((p) => p.parkId);

//     //各公園平均評分
//     const [ratingRows] = await db.query(
//       `SELECT park_id, ROUND(AVG(rating), 1) AS average_rating ,COUNT(*) AS comment_count FROM comments WHERE park_id IN (?) GROUP BY park_id`,
//       [parkIds]
//     );
//     console.log(ratingRows);
//     //各公園TOP3標籤
//     const [topTagRows] = await db.query(
//       `SELECT c.park_id, t.tag, COUNT(*) AS tag_count
//         FROM comments c
//         JOIN comment_to_tags ct ON c.id = ct.comment_id
//         JOIN tags t ON ct.tag_id = t.id
//         WHERE c.park_id IN (?)
//         GROUP BY c.park_id, t.tag
//         ORDER BY c.park_id, tag_count DESC`,
//       [parkIds]
//     );
//     console.log(topTagRows);

//     const ratingMap = {};
//     const commentCountMap = {};
//     ratingRows.forEach((r) => {
//       ratingMap[r.park_id] = r.average_rating;
//       commentCountMap[r.park_id] = r.comment_count;
//     });
//     const tagMap = {};
//     topTagRows.forEach((r) => {
//       if (!tagMap[r.park_id]) tagMap[r.park_id] = [];
//       if (tagMap[r.park_id].length < 3) {
//         tagMap[r.park_id].push(r.tag);
//       }
//     });
//     const parkWithTags = parks.data.pageData.map((p) => {
//       return {
//         ...p,
//         avgRating:
//           ratingMap[p.parkId] != null ? Number(ratingMap[p.parkId]) : null,
//         topTags: tagMap[p.parkId] ?? [],
//         commentCount: commentCountMap[p.parkId] ?? 0,
//       };
//     });
//     const finalResult = {
//       dataSum: parks.data.dataSum,
//       pageNumber: parks.data.pageNumber,
//       pageSize: parks.data.pageSize,
//       pageData: parkWithTags,
//     };
//     res.json(finalResult);
//   } catch (error) {
//     res.status(500).json({ error: "請求失敗" });
//   }
// });

//拿指定公園資料
// app.get("/api/park/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const response = await axios.get(
//       `https://taichungmelody.taichung.gov.tw/api/Park/GetParkIntro/${id}`
//     );
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: "政府 API 請求失敗" });
//   }
// });

// //留言評分路由接資料庫
// app.post("/comments", async (req, res) => {
//   const connection = await db.getConnection();

//   try {
//     const { rating, nickname, text, parkId, tags } = req.body;
//     if (!rating || !nickname || !text || !parkId) {
//       return res.status(400).json({ error: "請填上所有資料" });
//     }

//     await connection.beginTransaction();

//     //留言部分

//     const [commentResult] = await connection.query(
//       `INSERT INTO comments(comment,nickname,rating,park_id) VALUES(?,?,?,?)`,
//       [text, nickname, rating, parkId]
//     );
//     const commentId = commentResult.insertId;
//     //標籤部分
//     if (Array.isArray(tags) && tags.length > 0) {
//       for (const tag of tags) {
//         await connection.query("INSERT IGNORE INTO tags(tag) VALUES (?)", [
//           tag,
//         ]);
//         //拿tag id
//         const [tagRows] = await connection.query(
//           `SELECT id  FROM tags WHERE tag =?`,
//           [tag]
//         );

//         //comment_to_tags
//         await connection.query(
//           `INSERT INTO comment_to_tags(comment_id,tag_id) VALUES (?,?)`,
//           [commentId, tagRows[0].id]
//         );
//       }
//     }

//     await connection.commit();
//     res.status(201).json({ message: "新增成功" });
//   } catch (error) {
//     await connection.rollback();
//     console.error(error);
//     res.status(500).json({ error: "請求失敗" });
//   } finally {
//     connection.release();
//   }
// });

// //某公園裡面的各評論
// app.get("/comments/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { sortBy } = req.query;

//     let orderby = "";

//     if (sortBy === "latest") {
//       orderby = "created_at DESC";
//     } else if (sortBy === "highest") {
//       orderby = "rating DESC";
//     } else if (sortBy === "lowest") {
//       orderby = "rating ";
//     } else {
//       orderby = "created_at";
//     }
//     const [rows] = await db.query(
//       `SELECT c.id,comment,nickname,rating,created_at,GROUP_CONCAT(t.tag) AS tags FROM comments AS c LEFT JOIN comment_to_tags AS ct ON ct.comment_id=c.id LEFT JOIN tags AS t ON t.id= ct.tag_id WHERE park_id = ? GROUP BY c.id ORDER BY ${orderby}`,
//       [id]
//     );
//     console.log(rows);

//     const format = rows.map((comment) => {
//       const tagsArray = comment.tags ? comment.tags.split(",") : [];
//       return {
//         ...comment,
//         tags: tagsArray,
//       };
//     });
//     res.json(format);
//   } catch (err) {
//     res.status(500).json({ error: "請求失敗" });
//   }
// });

// //全站熱門標籤TOP5
// app.get("/tags/hot", async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       `SELECT t.tag,COUNT(*) AS tag_count FROM comment_to_tags AS ct JOIN tags AS t ON t.id=ct.tag_id GROUP BY t.tag ORDER BY tag_count DESC LIMIT 5`
//     );
//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ error: "取得熱門標籤失敗" });
//   }
// });

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
