require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SPECIFIC_FIXES = {
  'Apex Hunter': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
  'Solaris Convergence': 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&h=600&fit=crop',
  'The Conclave': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop',
  'Rudra: The Reckoning': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=600&fit=crop',
  'Vanguard Protocol': 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&h=600&fit=crop',
  'Kavach: Shield of Steel': 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=600&fit=crop',
  'Bheem: Rise of Thunder': 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&h=600&fit=crop',
  'The Stolen Artifact': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=600&fit=crop',
  'Dragon Rider': 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=400&h=600&fit=crop',
};

async function fixRemaining() {
  for (const [title, url] of Object.entries(SPECIFIC_FIXES)) {
    await pool.query('UPDATE movies SET poster_url = $1 WHERE title = $2', [url, title]);
  }
  const total = await pool.query('SELECT count(*) as total, count(DISTINCT poster_url) as unique_posters FROM movies');
  console.log('Final Totals:', total.rows[0]);
  await pool.end();
}

fixRemaining().catch(console.error);
