const express = require("express");
const App = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

App.use(cors());
App.options("*", cors());

//Middlewares
App.use(bodyParser.json());
App.use(express.json());

//Routes
const membersRouter = require("./Routes/members");

// Connect to MySQL
const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.pass,
  database: process.env.database,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected");
});

App.use("/api/members", membersRouter(db));

App.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy"); // Remove the header
  next();
});

App.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:4000");
});
