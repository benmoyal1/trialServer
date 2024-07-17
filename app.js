const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// PostgreSQL connection configuration
const pool = new Pool({
  user: "postgres",
  host: "postgres-db", // Change to your Docker host IP if necessary
  database: "postgres",
  password: "123",
  port: 5432,
});

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  try {
    res.status(200).json({ hey: "you are good" });
  } catch (err) {
    res.status(500);
  }
});
// Endpoint to create a table, insert data, and return results
app.post("/create_db", async (req, res) => {
  try {
    // Create a table
    await createTable();

    // Insert data into the table
    await insertData();

    // Fetch data from the table
    const data = await fetchData();

    // Return data in the response
    res.status(200).json(data);
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Error processing request");
  }
});

// Function to create a table
async function createTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INT NOT NULL
      )
    `);
  } finally {
    client.release();
  }
}

// Function to insert data into the table
async function insertData() {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO users (name, age) VALUES 
      ('Alice', 30),
      ('Bob', 25),
      ('Charlie', 35)
    `);
  } finally {
    client.release();
  }
}

// Function to fetch data from the table
async function fetchData() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users");
    return result.rows;
  } finally {
    client.release();
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
