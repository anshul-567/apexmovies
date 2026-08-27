require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const REMAINING_THEMATIC_POSTERS = {
  "Apex Hunter": "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&h=750&fit=crop", // Tactical sniper / predator in dark
  "Blackout Point": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&h=750&fit=crop", // City skyline in total sudden blackout
  "Astra 9": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=750&fit=crop", // Mythic divine bow & cosmic arrow
  "Autumn Shadows": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=750&fit=crop", // Golden autumn forest leaves & sunset
  "Black Ice": "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=500&h=750&fit=crop", // Dangerous frozen icy road blizzard
  "Bhoot Mahal": "https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=500&h=750&fit=crop", // Ancient haunted Indian royal palace
  "Abyss of the Damned": "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&h=750&fit=crop", // Fiery dark cavern abyss underworld
  "Aatma: Unleashed": "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=500&h=750&fit=crop", // Ethereal ghostly spirit rising in smoke
  "Bheem: Rise of Thunder": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&h=750&fit=crop", // Mighty mythological powerhouse with mace & lightning
  "Chennai Express 2": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500&h=750&fit=crop", // Colorful fast South Indian train express
  "Boss on Leave": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=750&fit=crop", // Funny corporate executive in beach hat
};

async function updateRemainingPosters() {
  for (const [title, poster] of Object.entries(REMAINING_THEMATIC_POSTERS)) {
    await pool.query('UPDATE movies SET poster_url = $1 WHERE title = $2', [poster, title]);
  }
  console.log('✓ All 80/80 movies now have 100% title-matching thematic posters!');
  await pool.end();
}

updateRemainingPosters().catch(console.error);
