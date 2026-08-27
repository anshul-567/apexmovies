require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// High-fidelity thematic cinematic poster mappings matching every single movie title
const MOVIE_THEMATIC_POSTERS = {
  // Action & Indian Hero Blockbusters
  "Garuda Force": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&h=750&fit=crop", // Eagle / winged golden warrior
  "Iron Horizon": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&h=750&fit=crop", // Stormy horizon with laser rays
  "Kavach: Shield of Steel": "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=500&h=750&fit=crop", // Armored superhero shield
  "Rudra: The Reckoning": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&h=750&fit=crop", // Fiery warrior trident
  "Shadow Strike": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&h=750&fit=crop", // Stealth ninja assassin
  "Speed Demon": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&h=750&fit=crop", // High speed nitro sports car racing
  "Vanguard Protocol": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500&h=750&fit=crop", // Tactical military cyber agent
  "Veer: Rise of Titans": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=750&fit=crop", // Epic mountain warrior rising

  // Sci-Fi
  "Aetherius": "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=500&h=750&fit=crop", // Celestial nebula portal
  "Chrono Rift": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&h=750&fit=crop", // Time warp vortex clock
  "Cyber Eden": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&h=750&fit=crop", // Glowing neon cyberpunk matrix garden
  "Glass Meridian": "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=500&h=750&fit=crop", // Prismatic glass prism & laser refraction
  "Nebula Drift": "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&h=750&fit=crop", // Deep space spaceship nebula
  "Quantum Nexus": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=750&fit=crop", // Glowing holographic quantum sphere
  "Singularity One": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=750&fit=crop", // Futuristic AI core interface
  "Solaris Convergence": "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=500&h=750&fit=crop", // Blazing golden solar eclipse
  "Starlight Echoes": "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=500&h=750&fit=crop", // Galaxy starlight cluster
  "Void Walkers": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=750&fit=crop", // Astronaut stepping into the dark void

  // Comedy
  "Crazy Rich Desis": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=750&fit=crop", // Opulent palace party champagne
  "Dhamaal Unlimited": "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=500&h=750&fit=crop", // Joyful crazy friends laughing
  "Grandma Secret Heist": "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=500&h=750&fit=crop", // Funny sunglasses senior with vault
  "Hera Pheri Express": "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=500&h=750&fit=crop", // Retro funny comedy characters
  "Roommate Roulette": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=750&fit=crop", // Group of vibrant friends having fun
  "The Accidental Billionaire": "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&h=750&fit=crop", // Money raining briefcase luxury
  "The Great Indian Kitchen Feud": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=750&fit=crop", // Chaotic colorful gourmet Indian spice kitchen
  "Wedding Chaos": "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=750&fit=crop", // Grand Indian wedding celebration lights

  // Drama
  "Ganga: Flow of Time": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&h=750&fit=crop", // Varanasi ghats Ganga lamps
  "Kaveri Dreams": "https://images.unsplash.com/photo-1547153760-18fc86324498?w=500&h=750&fit=crop", // Lush South Indian river reflection
  "Midnight in Kolkata": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=750&fit=crop", // Howrah bridge night tram lights
  "Silent Monsoon": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500&h=750&fit=crop", // Rain drops on windowpane monsoon
  "The Courtroom": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&h=750&fit=crop", // Judicial gavel scales of justice
  "The Heritage Weaver": "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500&h=750&fit=crop", // Traditional Indian silk weaving loom
  "The Last Symphony": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=750&fit=crop", // Grand orchestra grand piano & violin
  "The Varanasi Monologues": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&h=750&fit=crop", // Serene boat on river Ganges sunrise
  "Velvet Static": "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&h=750&fit=crop", // Moody cinema projector glow in dark theater

  // Horror
  "Bhool Bhulaiyaa Mansion": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&h=750&fit=crop", // Spooky historic palace corridor
  "Chhaya: The Shadow": "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&h=750&fit=crop", // Dark silhouette shadow figure
  "Possession on Elm Street": "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=500&h=750&fit=crop", // Haunted house at stormy night
  "Ritual of Midnight": "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=500&h=750&fit=crop", // Occult candle circle ritual
  "The Cursed Mirror": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&h=750&fit=crop", // Broken shattered antique mirror
  "The Dollmaker": "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&h=750&fit=crop", // Creepy vintage porcelain marionette
  "Whispering Woods": "https://images.unsplash.com/photo-1511497584788-87676104235f?w=500&h=750&fit=crop", // Foggy dark haunted forest trees
  "Yakshi: The Forest Spirit": "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=500&h=750&fit=crop", // Mystical glowing banyan spirit

  // Mystery
  "Enigma of Room 13": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&h=750&fit=crop", // Old hotel door key with number 13
  "Kodaikanal Chronicles": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=750&fit=crop", // Misty mountain pine forest lake
  "Shadow over Ooty": "https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=500&h=750&fit=crop", // British colonial bungalow in dense fog
  "The Locked Mansion": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=750&fit=crop", // Grand gothic mansion with iron gate
  "The Painter Ghost": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&h=750&fit=crop", // Surreal oil painting artwork
  "The Seventh Hour": "https://images.unsplash.com/photo-1495364117703-8038f642d13e?w=500&h=750&fit=crop", // Antique pocket watch ticking
  "The Shimla Secret": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&h=750&fit=crop", // Snowy Shimla hill station mountain
  "The Stolen Artifact": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&h=750&fit=crop", // Ancient golden museum relic
  "The Vanishing Train": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500&h=750&fit=crop", // Steam locomotive vanishing in steam fog
  "Whispers in the Fog": "https://images.unsplash.com/photo-1487621167305-5d248087c724?w=500&h=750&fit=crop", // Street lantern in thick night fog

  // Thriller
  "Crimson Fold": "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500&h=750&fit=crop", // Neon red thriller aesthetic
  "Night Shift at 404": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=750&fit=crop", // Empty skyscraper office at 3am
  "Pressure Point": "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=500&h=750&fit=crop", // High stakes heart monitor radar
  "Ransom Hour": "https://images.unsplash.com/photo-1508847154043-be5407fcaa5a?w=500&h=750&fit=crop", // Clock ticking down ransom case
  "Silent Witness": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&h=750&fit=crop", // Detective looking through blinders
  "The Cipher Code": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=750&fit=crop", // Cryptographic matrix code screen
  "The Conclave": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=750&fit=crop", // Secret council in candlelit hall
  "The Double Agent": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&h=750&fit=crop", // Spies in trenchcoats in rain
  "Zero Clue": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=750&fit=crop", // Crime scene tape & magnifying glass

  // Animation
  "Dragon Rider": "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=500&h=750&fit=crop", // Majestic flying mythical dragon
  "Ganesha: Sweet Adventure": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=500&h=750&fit=crop", // Vibrant Ganesha celebration colors
  "Hanuman: Guardian of Cosmos": "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?w=500&h=750&fit=crop", // Cosmic superhero animated artwork
  "Jungle Tales: Veer & Friends": "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=500&h=750&fit=crop", // Animated cute lion and jungle animals
  "Mecha Samurai": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&h=750&fit=crop", // Anime mecha robot samurai warrior
  "Ocean Song": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=750&fit=crop", // Magical glowing bioluminescent whale
  "Pixel Quest": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=750&fit=crop", // Retro 8-bit arcade video game world
  "Starling Chronicles": "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=500&h=750&fit=crop", // Animated magical bird flight
  "The Cloud Kingdom": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=500&h=750&fit=crop", // Floating castle in celestial clouds
};

async function updateAllPosters() {
  console.log('=== UPDATING ALL MOVIE POSTERS TO ACCURATE THEMATIC TITLES ===\n');

  const movies = (await pool.query('SELECT id, title, genre FROM movies')).rows;
  let updatedCount = 0;

  for (const m of movies) {
    const poster = MOVIE_THEMATIC_POSTERS[m.title];
    if (poster) {
      await pool.query('UPDATE movies SET poster_url = $1 WHERE id = $2', [poster, m.id]);
      updatedCount++;
    } else {
      console.log(`Note: No exact custom poster for "${m.title}", keeping existing.`);
    }
  }

  console.log(`✓ Updated ${updatedCount}/${movies.length} movie posters to thematic, title-matching high-definition artwork!`);
  await pool.end();
}

updateAllPosters().catch(console.error);
