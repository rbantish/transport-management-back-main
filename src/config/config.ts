import dotenv from 'dotenv';
import * as fs from 'fs';

// Load environment variables
dotenv.config();

// Path to your SSL certificate (ca.pem) file
const sslCertPath = process.env.SSL_CERT_PATH || 'src/config/ca.pem'; // Make sure this path is correct

const config = {
  dbHost: process.env.DB_HOST || 'mysql-16d3e211-bantishramburn202100603-9552.c.aivencloud.com',
  dbUser: process.env.DB_USER || 'avnadmin',
  dbPassword: process.env.DB_PASSWORD || 'AVNS_vuu6-9QmVmeAfTkZ1Q0',
  dbName: process.env.DB_NAME || 'transport_system',
  dbPort: process.env.DB_PORT || '20038',
  ssl: {
    ca: fs.readFileSync(sslCertPath), // Load the SSL certificate
  }
};

export default config;
