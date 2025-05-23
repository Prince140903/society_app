const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    db.query("SELECT * FROM members", (err, results) => {
      if (err) {
        console.error("Error fetching members:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  router.get("/filter", (req, res) => {
    const search = req.query.search || "";
    const order = req.query.order || "DEFAULT";
    const page = parseInt(req.query.page) || 1; // Default page 1
    const limit = parseInt(req.query.limit) || 10; // Default 10 members per page
    const offset = (page - 1) * limit;

    let sqlQuery = "SELECT * FROM members WHERE 1=1"; // 1=1 trick
    let countQuery = "SELECT COUNT(*) as total FROM members WHERE 1=1"; // Query to get the total count
    let values = [];

    if (search) {
      sqlQuery += " AND name LIKE ?";
      values.push(`%${search}%`);
    }

    if (order === "ASC") {
      sqlQuery += " ORDER BY name ASC";
    } else if (order === "DESC") {
      sqlQuery += " ORDER BY name DESC";
    }

    sqlQuery += " LIMIT ? OFFSET ?";
    values.push(limit, offset);

    db.query(countQuery, values, (countErr, countResults) => {
      if (countErr) {
        console.error("Error fetching total count:", countErr);
        return res.status(500).json({ error: countErr.message });
      }
      const totalMembers = countResults[0].total;

      db.query(sqlQuery, values, (err, results) => {
        if (err) {
          console.error("Error fetching members:", err);
          return res.status(500).json({ error: err.message }); // Use a valid status code (500 for server error)
        }
        res.status(200).json({ members: results, totalMembers: totalMembers }); // Ensure success status code (200)
      });
    });
  });

  router.post("/add", (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const query = "INSERT INTO members (name) VALUES (?)";

    db.query(query, [name], (err, results) => {
      if (err) {
        console.error("Error inserting into database:", err);
        return res.status(500).json({ message: "Error adding member" });
      }
      res
        .status(200)
        .json({ message: "Member added successfully", id: results.insertId });
    });
  });

  router.delete("/delete", (req, res) => {
    const { member_id } = req.body;

    if (!member_id) {
      return res.status(400).json({ message: "Member ID is required" });
    }

    const query = "DELETE FROM members WHERE member_id = (?)";

    db.query(query, [member_id], (err, results) => {
      if (err) {
        console.error("Error deleting member:", err);
        return res.status(500).json({ message: "Error deleting member" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Member not found" });
      }

      res.status(200).json({ message: "Member deleted successfully" });
    });
  });

  return router;
};
