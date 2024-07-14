const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',  // or '127.0.0.1' if 'localhost' doesn't work
    port: 5432,         // Default PostgreSQL port is 5432
    user: 'postgres',
    password: '123',
    database: 'expdb'
});

// Attempt to connect to PostgreSQL
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database');

    // Example query
    client.query('SELECT NOW()', (err, result) => {
        release(); // Release the client back to the pool

        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log('Query result:', result.rows[0]);

        // Disconnect the client from the pool
        pool.end(() => {
            console.log('Pool has been disconnected');
        });
    });
});
