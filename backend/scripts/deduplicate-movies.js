require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function cleanupDuplicates() {
  console.log('Cleaning up duplicate movie titles...');
  // Delete duplicate rows created by migration 005 where an original movie id already exists
  await pool.query(`
    DELETE FROM shows WHERE movie_id IN (
      SELECT id FROM movies WHERE id != 'a1111111-1111-1111-1111-111111111111' AND id != 'a2222222-2222-2222-2222-222222222222' AND id != 'a3333333-3333-3333-3333-333333333333' AND id != 'a5555555-5555-5555-5555-555555555555' AND title IN ('Nebula Drift', 'Iron Horizon', 'Velvet Static', 'Glass Meridian')
    );
    DELETE FROM movie_favorites WHERE movie_id IN (
      SELECT id FROM movies WHERE id != 'a1111111-1111-1111-1111-111111111111' AND id != 'a2222222-2222-2222-2222-222222222222' AND id != 'a3333333-3333-3333-3333-333333333333' AND id != 'a5555555-5555-5555-5555-555555555555' AND title IN ('Nebula Drift', 'Iron Horizon', 'Velvet Static', 'Glass Meridian')
    );
    DELETE FROM movies WHERE id != 'a1111111-1111-1111-1111-111111111111' AND id != 'a2222222-2222-2222-2222-222222222222' AND id != 'a3333333-3333-3333-3333-333333333333' AND id != 'a5555555-5555-5555-5555-555555555555' AND title IN ('Nebula Drift', 'Iron Horizon', 'Velvet Static', 'Glass Meridian');
  `);
  console.log('Cleanup complete!');
  await pool.end();
}

cleanupDuplicates().catch(console.error);
