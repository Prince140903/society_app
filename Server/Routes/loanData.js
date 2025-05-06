const express = require("express");

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

  router.get("/filter", (req, res) => {
    const search = req.query.search || "";
    const order = req.query.order || "DEFAULT";
    const page = parseInt(req.query.page) || 1; //  page 1
    const limit = parseInt(req.query.limit) || 10; //  10 members per page
    const offset = (page - 1) * limit;
    const memberId = req.query.member_id || null;
    const year = req.query.year || null;

    let sqlQuery = `
    SELECT 
      member_id, 
      name, 
      opening_deposit, 
      cummulative_deposit, 
      m_term_loan, 
      m_term_installments, 
      e_term_loan, 
      e_term_installments, 
      share_money, 
      DATE(record_date) as record_date 
    FROM monthlyrecords 
    WHERE 1=1`;

    let countQuery = "SELECT COUNT(*) as total FROM monthlyrecords WHERE 1=1"; // Query to get the total count
    let values = [];

    if (search) {
      sqlQuery += " AND name LIKE ?";
      values.push(`%${search}%`);
    }

    if (year) {
      const [startYr, endYr] = year.split("-").map((y) => parseInt(y));
      const startDate = `${startYr}-04-22`;
      const endDate = `${endYr}-03-22`;

      sqlQuery += " AND record_date BETWEEN ? AND ?";
      countQuery += " AND record_date BETWEEN ? AND ?";
      values.push(startDate, endDate);
    }

    if (memberId) {
      sqlQuery += " AND member_id = ?";
      countQuery += " AND member_id = ?";
      values.push(memberId);
    }

    if (order === "ASC") {
      sqlQuery += " ORDER BY name ASC";
    } else if (order === "DESC") {
      sqlQuery += " ORDER BY name DESC";
    }

    sqlQuery += " LIMIT ? OFFSET ?";
    values.push(limit, offset);

    db.query(
      countQuery,
      values.slice(0, values.length - 2),
      (countErr, countResults) => {
        if (countErr) {
          console.error("Error fetching total count:", countErr);
          return res.status(500).json({ error: countErr.message });
        }
        const totalRecords = countResults[0].total;

        db.query(sqlQuery, values, (err, results) => {
          if (err) {
            console.error("Error fetching members:", err);
            return res.status(500).json({ error: err.message }); // Use a valid status code (500 for server error)
          }
          res
            .status(200)
            .json({ loanData: results, totalRecords: totalRecords }); // Ensure success status code (200)
        });
      }
    );
  });

  return router;
};
