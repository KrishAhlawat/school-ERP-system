// Test database connection
const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'school_erp_db',
    user: 'postgres',
    password: 'Krish_',
  });

  try {
    await client.connect();
    console.log('✅ Database connection successful!');
    const result = await client.query('SELECT NOW()');
    console.log('Current time:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Try with school_user
    console.log('\n🔄 Trying with school_user...');
    const client2 = new Client({
      host: 'localhost',
      port: 5432,
      database: 'school_erp_db',
      user: 'school_user',
      password: 'school_password123',
    });
    
    try {
      await client2.connect();
      console.log('✅ school_user connection successful!');
      await client2.end();
    } catch (error2) {
      console.error('❌ school_user connection failed:', error2.message);
    }
  } finally {
    await client.end();
  }
}

testConnection();