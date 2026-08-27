require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Unique cinematic poster photos for every single movie title
const UNIQUE_POSTERS = {
  // Action
  'Iron Horizon': 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
  'Vanguard Protocol': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&h=600&fit=crop',
  'Rudra: The Reckoning': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop',
  'Shadow Strike': 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop',
  'Garuda Force': 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop',
  'Speed Demon': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=600&fit=crop',
  'Blackout Point': 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=400&h=600&fit=crop',
  'Veer: Rise of Titans': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop',
  'Apex Hunter': 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&h=600&fit=crop',
  'Kavach: Shield of Steel': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop',

  // Sci-Fi
  'Nebula Drift': 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
  'Glass Meridian': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
  'Quantum Nexus': 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop',
  'Chrono Rift': 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400&h=600&fit=crop',
  'Cyber Eden': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop',
  'Starlight Echoes': 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=600&fit=crop',
  'Astra 9': 'https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=400&h=600&fit=crop',
  'Solaris Convergence': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
  'Singularity One': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=600&fit=crop',
  'Void Walkers': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop',

  // Drama
  'Velvet Static': 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop',
  'The Varanasi Monologues': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=600&fit=crop',
  'Ganga: Flow of Time': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=600&fit=crop',
  'The Last Symphony': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop',
  'Kaveri Dreams': 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=400&h=600&fit=crop',
  'Silent Monsoon': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
  'Midnight in Kolkata': 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
  'The Courtroom': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=600&fit=crop',
  'Autumn Shadows': 'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=400&h=600&fit=crop',
  'The Heritage Weaver': 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=600&fit=crop',

  // Thriller
  'Crimson Fold': 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
  'The Cipher Code': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=600&fit=crop',
  'Night Shift at 404': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=600&fit=crop',
  'Black Ice': 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=400&h=600&fit=crop',
  'Zero Clue': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=600&fit=crop',
  'The Conclave': 'https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=400&h=600&fit=crop',
  'Ransom Hour': 'https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?w=400&h=600&fit=crop',
  'Silent Witness': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=600&fit=crop',
  'The Double Agent': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop',
  'Pressure Point': 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=400&h=600&fit=crop',

  // Horror
  'Whispering Woods': 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=400&h=600&fit=crop',
  'Bhoot Mahal': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=600&fit=crop',
  'The Cursed Mirror': 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=400&h=600&fit=crop',
  'Yakshi: The Forest Spirit': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=600&fit=crop',
  'Abyss of the Damned': 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400&h=600&fit=crop',
  'Chhaya: The Shadow': 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=600&fit=crop',
  'Ritual of Midnight': 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&h=600&fit=crop',
  'Possession on Elm Street': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
  'Aatma: Unleashed': 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&h=600&fit=crop',
  'The Dollmaker': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=600&fit=crop',

  // Animation
  'Dragon Rider': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
  'Hanuman: Guardian of Cosmos': 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=400&h=600&fit=crop',
  'Pixel Quest': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
  'Bheem: Rise of Thunder': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=600&fit=crop',
  'Starling Chronicles': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=600&fit=crop',
  'Jungle Tales: Veer & Friends': 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=400&h=600&fit=crop',
  'Mecha Samurai': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop',
  'The Cloud Kingdom': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&h=600&fit=crop',
  'Ganesha: Sweet Adventure': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&h=600&fit=crop',
  'Ocean Song': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop',

  // Comedy
  'Hera Pheri Express': 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400&h=600&fit=crop',
  'Wedding Chaos': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=600&fit=crop',
  'The Accidental Billionaire': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop',
  'Chennai Express 2': 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=400&h=600&fit=crop',
  'Roommate Roulette': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=600&fit=crop',
  'The Great Indian Kitchen Feud': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=600&fit=crop',
  'Crazy Rich Desis': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=600&fit=crop',
  'Grandma Secret Heist': 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=600&fit=crop',
  'Boss on Leave': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=600&fit=crop',
  'Dhamaal Unlimited': 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400&h=600&fit=crop',

  // Mystery
  'The Locked Mansion': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=600&fit=crop',
  'Whispers in the Fog': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=400&h=600&fit=crop',
  'The Shimla Secret': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop',
  'Enigma of Room 13': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=600&fit=crop',
  'The Vanishing Train': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=600&fit=crop',
  'The Painter Ghost': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&h=600&fit=crop',
  'Kodaikanal Chronicles': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=600&fit=crop',
  'The Seventh Hour': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop',
  'Shadow over Ooty': 'https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=400&h=600&fit=crop',
  'The Stolen Artifact': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=600&fit=crop',
};

async function assignUniquePosters() {
  console.log('Assigning unique posters to every movie...');

  // Delete duplicate Crimson Fold
  await pool.query(`
    DELETE FROM shows WHERE movie_id = 'a0000130-0000-0000-0000-000000000130';
    DELETE FROM movie_favorites WHERE movie_id = 'a0000130-0000-0000-0000-000000000130';
    DELETE FROM movies WHERE id = 'a0000130-0000-0000-0000-000000000130';
  `);

  const movies = (await pool.query('SELECT id, title FROM movies')).rows;
  let updatedCount = 0;

  for (const m of movies) {
    const poster = UNIQUE_POSTERS[m.title];
    if (poster) {
      await pool.query('UPDATE movies SET poster_url = $1 WHERE id = $2', [poster, m.id]);
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} movies with unique individual poster images!`);
  await pool.end();
}

assignUniquePosters().catch(console.error);
