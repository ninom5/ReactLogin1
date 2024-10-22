const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const app = express();
const port = 5000;


app.use(bodyParser.json());
app.use(cors());


const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "users",
  password: "BazaPodataka",
  port: 5432,
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    const result = await pool.query("SELECT * FROM userdata WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
