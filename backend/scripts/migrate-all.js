require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function migrateAll() {
  console.log('=== RUNNING ALL APEXMOVIES MIGRATIONS ON TARGET DATABASE ===\n');

  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  const migrationFiles = [
    '001_init.sql',
    '002_seed.sql',
    '003_features.sql',
    '004_indian_cities_and_theaters.sql',
    '005_expanded_films_cities_theaters.sql',
    '006_discount_offers.sql',
    '007_reviews_and_memberships.sql',
    '008_movie_age_ratings.sql',
    '009_giftcards_wallet_cancellations.sql'
  ];

  try {
    for (const file of migrationFiles) {
      const filePath = path.join(__dirname, '../src/migrations', file);
      if (fs.existsSync(filePath)) {
        console.log(`Running migration: ${file}...`);
        const sql = fs.readFileSync(filePath, 'utf-8');
        await client.query(sql);
        console.log(`✓ ${file} executed successfully.`);
      }
    }

    console.log('\n=== ALL MIGRATIONS COMPLETED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrateAll();
