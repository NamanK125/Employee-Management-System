const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'api',
    password: '12345678',
    port: 5432, 
  });
  async function query(text, params) {
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
  
  module.exports = {
    query,
  };