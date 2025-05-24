const { Client } = require('pg');
require('dotenv').config();

// Ambil database URL dari variabel lingkungan
const connectionString = process.env.DATABASE_URL;

console.log('Trying to connect with URL:', connectionString);

// Buat klien koneksi
const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Coba connect dan test query
async function testConnection() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database!');

    const res = await client.query('SELECT current_timestamp as time');
    console.log('Current database time:', res.rows[0].time);

    await client.end();
    console.log('Connection closed successfully.');
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
  }
}

testConnection();
