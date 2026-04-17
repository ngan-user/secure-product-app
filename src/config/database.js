const mysql = require('mysql2/promise');
const { logger } = require('../utils/logger');

// ✅ DB SECURITY: Dùng biến môi trường, KHÔNG hard-code
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'mysql',
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'appuser',
  password: process.env.DB_PASSWORD,          // bắt buộc từ env
  database: process.env.DB_NAME     || 'productdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // ✅ SSL cho production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
  // ✅ Timeout để tránh connection leak
  connectTimeout: 10000,
  acquireTimeout: 10000,
  timeout: 10000,
  // ✅ Ngăn multiple statements (SQL Injection mitigation)
  multipleStatements: false,
});

async function testConnection() {
  const conn = await pool.getConnection();
  await conn.query('SELECT 1');
  conn.release();
}

module.exports = { pool, testConnection };
