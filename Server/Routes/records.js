import express from "express";

module.exports = (db) => {
  const router = express.Router();

  router.get("/", (req, res) => {
    db.query("SELECT * FROM monthlyrecords", (err, results) => {
      if (err) {
        console.error("Error fetching members:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });

  return router;
};
