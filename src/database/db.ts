import mysql from 'mysql2/promise';
import config from '../config/config'; // Load your database configurations

export const db = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  port: Number(config.dbPort),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: config.ssl.ca, // Use the SSL certificate from config
  }
});
