const express = require('express');
const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
    host: 'localhost',  // or '127.0.0.1' if 'localhost' doesn't work
    port: 5432,         // Default PostgreSQL port is 5432
    user: 'postgres',
    password: '123',
    database: 'expdb'
});

const app = express();
const port = 3000;

// Endpoint to check database connection
app.get('/check-connection', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    res.status(200).send('Connected to PostgreSQL database successfully!');
  } catch (err) {
    console.error('Error connecting to the database', err);
    res.status(500).send('Failed to connect to the PostgreSQL database.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
