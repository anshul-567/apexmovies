require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const ADMIN_ID = '11111111-1111-1111-1111-111111111111';

// Cinema chains and iconic malls per city for authentic, distinguishable theaters
const THEATERS_BY_CITY = {
  "Agra": [
    { name: "PVR Cosmos Mall", address: "Cosmos Mall, Sanjay Place, Agra" },
    { name: "INOX TDI Mall", address: "TDI City Mall, Fatehabad Road, Agra" },
    { name: "Cinepolis Pacific Taj Mall", address: "Fatehabad Road, Tajganj, Agra" },
    { name: "SRS Cinemas Omaxe SRK", address: "Omaxe SRK Mall, Bypass Road, Agra" }
  ],
  "Ahmedabad": [
    { name: "PVR Acropolis Mall", address: "Acropolis Mall, Thaltej, Ahmedabad" },
    { name: "INOX Himalaya Mall", address: "Drive In Road, Memnagar, Ahmedabad" },
    { name: "Cinepolis Nexus Ahmedabad One", address: "Vastrapur Lake, Ahmedabad" },
    { name: "Miraj Cinemas City Pulse", address: "Gandhinagar-Ahmedabad Highway, Ahmedabad" }
  ],
  "Amritsar": [
    { name: "PVR Mall of Amritsar", address: "MBD Neopolis Mall, GT Road, Amritsar" },
    { name: "INOX Trillium Mall", address: "Trillium Mall, Circular Road, Amritsar" },
    { name: "Cinepolis Celebration Mall", address: "Bantony Estate, Batala Road, Amritsar" },
    { name: "MovieTime Alpha One", address: "Alpha International City, Amritsar" }
  ],
  "Aurangabad": [
    { name: "PVR Prozone Mall", address: "Prozone Mall, Chikalthana, Aurangabad" },
    { name: "INOX Tapadiya City Centre", address: "Town Centre, CIDCO, Aurangabad" },
    { name: "Mukta A2 Cinemas Fame", address: "Seven Hills, Jalna Road, Aurangabad" },
    { name: "Carnival Cinemas Big", address: "MGM Sports Complex, Aurangabad" }
  ],
  "Bengaluru": [
    { name: "PVR IMAX Forum South City", address: "Konanakunte Cross, Kanakapura Road, Bengaluru" },
    { name: "Cinepolis Nexus Shantiniketan", address: "Whitefield Main Road, Bengaluru" },
    { name: "PVR Director's Cut Forum Rex Walk", address: "Brigade Road, Bengaluru" },
    { name: "INOX Megaplex Mantri Square", address: "Sampige Road, Malleshwaram, Bengaluru" }
  ],
  "Bhopal": [
    { name: "PVR Aura Mall", address: "Aura Mall, Gulmohar Colony, Bhopal" },
    { name: "INOX DB City Mall", address: "DB City Mall, Arera Hills, Bhopal" },
    { name: "Cinepolis Aashima Mall", address: "Hoshangabad Road, Bawadiya Kalan, Bhopal" },
    { name: "Mukta A2 Cinemas People's Mall", address: "People's Campus, Bhanpur, Bhopal" }
  ],
  "Chandigarh": [
    { name: "PVR Elante Mall", address: "Elante Mall, Industrial Area Phase 1, Chandigarh" },
    { name: "INOX Nexus Centra", address: "Centra Mall, Industrial Area Phase 1, Chandigarh" },
    { name: "Cinepolis Jagat", address: "Sector 17 Commercial Complex, Chandigarh" },
    { name: "PVR VR Punjab Mall", address: "NH-21, Kharar Road, Chandigarh" }
  ],
  "Chennai": [
    { name: "PVR SPI Escape Express Avenue", address: "Express Avenue Mall, Royapettah, Chennai" },
    { name: "PVR Sathyam Cinemas", address: "Thiru Vi Ka Road, Royapettah, Chennai" },
    { name: "INOX Luxe Phoenix Marketcity", address: "Velachery Main Road, Chennai" },
    { name: "AGS Cinemas OMR Megaplex", address: "Navalur, OMR IT Corridor, Chennai" }
  ],
  "Coimbatore": [
    { name: "Broadway Cinemas Megaplex", address: "Kovai Broadway Mall, Avinashi Road, Coimbatore" },
    { name: "INOX Prozone Mall", address: "Prozone Mall, Sathy Road, Coimbatore" },
    { name: "PVR Brookefields Mall", address: "Brookefields Mall, Sukrawarpet, Coimbatore" },
    { name: "KG Cinemas Royale", address: "Bunglaw Street, Race Course, Coimbatore" }
  ],
  "Delhi NCR": [
    { name: "PVR Director's Cut Ambience", address: "Ambience Mall, Vasant Kunj, New Delhi" },
    { name: "PVR Superplex Mall of India", address: "Sector 18, Noida, Delhi NCR" },
    { name: "INOX Insignia Epicuria", address: "Nehru Place Metro Complex, New Delhi" },
    { name: "Cinepolis DLF Avenue Saket", address: "Press Enclave Marg, Saket, New Delhi" }
  ],
  "Dhanbad": [
    { name: "INOX Ozone Galleria Mall", address: "Saraidhela Main Road, Dhanbad" },
    { name: "PVR City Centre", address: "Luby Circular Road, Dhanbad" },
    { name: "Carnival Cinemas Rays", address: "Bank More, Dhanbad" },
    { name: "Glitz Cinemas Bartand", address: "Bartand Chowk, Dhanbad" }
  ],
  "Faridabad": [
    { name: "PVR Crown Interiorz Mall", address: "Mathura Road, Sector 35, Faridabad" },
    { name: "INOX EF3 Mall", address: "Sector 20A, Mathura Road, Faridabad" },
    { name: "SRS Cinemas Pristine Mall", address: "Sector 31, Faridabad" },
    { name: "PVR Pebble Downtown Mall", address: "Bata Chowk, Sector 12, Faridabad" }
  ],
  "Ghaziabad": [
    { name: "PVR Mahagun Metro Mall", address: "Sector 3, Vaishali, Ghaziabad" },
    { name: "INOX Shipra Mall", address: "Vaibhav Khand, Indirapuram, Ghaziabad" },
    { name: "Carnival Cinemas Pacific Mall", address: "Sahibabad Industrial Area, Ghaziabad" },
    { name: "Wave Cinemas Centerstage", address: "Kaushambi, Ghaziabad" }
  ],
  "Guwahati": [
    { name: "PVR City Centre Mall", address: "GS Road, Rukmini Gaon, Guwahati" },
    { name: "INOX Aurus Mall", address: "Dispur Supermarket, GS Road, Guwahati" },
    { name: "Cinepolis Dona Planet", address: "GS Road, ABC, Guwahati" },
    { name: "Gold Digital Cinema Narengi", address: "Narengi Tinali, Guwahati" }
  ],
  "Gwalior": [
    { name: "PVR DB City Mall", address: "Station Road, Padav, Gwalior" },
    { name: "INOX Central Mall", address: "Maharani Laxmibai Marg, Phool Bagh, Gwalior" },
    { name: "Cinepolis Deendayal City Mall", address: "MLB Road, Shinde Ki Chhawani, Gwalior" },
    { name: "Gold Digital DD City", address: "Lashkar, Gwalior" }
  ],
  "Howrah": [
    { name: "INOX Forum Rangoli Mall", address: "Girish Ghosh Road, Belur, Howrah" },
    { name: "PVR Avani Riverside Mall", address: "Jagat Banerjee Ghat Road, Shibpur, Howrah" },
    { name: "Miraj Cinemas Salkia", address: "Salkia School Road, Howrah" },
    { name: "Mukta A2 Cinemas Liluah", address: "GT Road, Liluah, Howrah" }
  ],
  "Hyderabad": [
    { name: "AMB Cinemas Gachibowli", address: "Sarath City Capital Mall, Gachibowli, Hyderabad" },
    { name: "PVR Next Galleria Mall", address: "Punjagutta Main Road, Hyderabad" },
    { name: "Prasad's Multiplex IMAX", address: "NTR Gardens, Necklace Road, Hyderabad" },
    { name: "Cinepolis Forum Sujana Mall", address: "Kukatpally Housing Board Colony, Hyderabad" }
  ],
  "Indore": [
    { name: "Apex Cineplex Vijay Nagar", address: "123 Vijay Nagar Square, AB Road, Indore" },
    { name: "Apex IMAX Palasia", address: "45 Palasia Road, Old Palasia, Indore" },
    { name: "PVR Treasure Island Mall", address: "MG Road, South Tukoganj, Indore" },
    { name: "INOX C21 Mall", address: "Scheme 54, PU-4 Commercial, AB Road, Indore" }
  ],
  "Jabalpur": [
    { name: "PVR South Avenue Mall", address: "Narmada Road, Katanga, Jabalpur" },
    { name: "INOX Samdariya Mall", address: "Marhatal, Civic Centre, Jabalpur" },
    { name: "Movie Magic Multiplex", address: "Gorakhpur Main Road, Jabalpur" },
    { name: "Carnival Cinemas Gold Star", address: "Russell Chowk, Jabalpur" }
  ],
  "Jaipur": [
    { name: "PVR Crystal Palm", address: "Sahkar Marg, Sardar Patel Marg, Jaipur" },
    { name: "INOX GT Central Mall", address: "Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur" },
    { name: "Cinepolis World Trade Park", address: "WTP Mall, Malviya Nagar, Jaipur" },
    { name: "Raj Mandir Heritage Cinema", address: "Bhagwan Das Road, Panch Batti, Jaipur" }
  ],
  "Jodhpur": [
    { name: "Carnival Cinemas Blue City Mall", address: "Circuit House Road, Jodhpur" },
    { name: "INOX Ansal Plaza", address: "Pal Road, Jodhpur" },
    { name: "Bioscope Cinemas Multiplex", address: "Shastri Nagar, Jodhpur" },
    { name: "Miraj Cinemas Ashapurna Mall", address: "Shastri Circle, Jodhpur" }
  ],
  "Kanpur": [
    { name: "PVR South X Mall", address: "Kidwai Nagar, Kanpur" },
    { name: "INOX Z Square Mall", address: "MG Road, The Mall, Kanpur" },
    { name: "Cinepolis Rave Moti", address: "Rawatpur, Gutaiya, Kanpur" },
    { name: "Rave 3 Multiplex", address: "Parbati Bagla Road, Tilak Nagar, Kanpur" }
  ],
  "Kochi": [
    { name: "PVR Lulu International Mall", address: "Edappally Junction, NH 47, Kochi" },
    { name: "Cinepolis Centre Square Mall", address: "MG Road, Shenoys, Kochi" },
    { name: "PVR Forum Mall Maradu", address: "Kundannoor, Maradu, Kochi" },
    { name: "Vanitha Vineetha Multiplex", address: "Edappally Toll, Kochi" }
  ],
  "Kolkata": [
    { name: "PVR Mani Square", address: "EM Bypass, Kankurgachi, Kolkata" },
    { name: "INOX Quest Mall", address: "Syed Amir Ali Avenue, Park Circus, Kolkata" },
    { name: "PVR South City Mall", address: "Prince Anwar Shah Road, Kolkata" },
    { name: "Cinepolis Acropolis Mall", address: "Rajdanga Main Road, Kasba, Kolkata" }
  ],
  "Kota": [
    { name: "Cinemax City Mall", address: "Jhalawar Road, Kota" },
    { name: "INOX Ahluwalia The Great Mall", address: "Aerodrome Circle, Kota" },
    { name: "PVR Opera Mall", address: "Indra Vihar, Kota" },
    { name: "Gold Digital Cinema Om Cine", address: "Gumanpura, Kota" }
  ],
  "Lucknow": [
    { name: "PVR Phoenix Palassio", address: "Amar Shaheed Path, Sector 7, Gomti Nagar, Lucknow" },
    { name: "INOX Riverside Mall", address: "Vipin Khand, Gomti Nagar, Lucknow" },
    { name: "Cinepolis One Awadh Center", address: "Vibhuti Khand, Gomti Nagar, Lucknow" },
    { name: "Wave Cinemas East End Mall", address: "TCG 1/1, Gomti Nagar, Lucknow" }
  ],
  "Ludhiana": [
    { name: "PVR MBD Neopolis Mall", address: "Ferozepur Road, Ludhiana" },
    { name: "INOX Silver Arc Mall", address: "Gurdev Nagar, Ferozepur Road, Ludhiana" },
    { name: "Cinepolis Pavilion Mall", address: "Old Session Courts, Fountain Chowk, Ludhiana" },
    { name: "PVR Flames Westend Mall", address: "Ferozepur Road, Ludhiana" }
  ],
  "Madurai": [
    { name: "INOX Vishaal de Mal", address: "Gokhale Road, Chinna Chokkikulam, Madurai" },
    { name: "PVR Milan Mall", address: "KK Nagar, Madurai" },
    { name: "Jazz Cinemas Big Bull", address: "Mattuthavani, Madurai" },
    { name: "Cinepolis Meenakshi Mall", address: "Bypass Road, Madurai" }
  ],
  "Meerut": [
    { name: "PVR Shopprix Mall", address: "Major Dhyan Chand Nagar, Delhi Road, Meerut" },
    { name: "INOX Melange Mall", address: "Pallavpuram Phase 1, Meerut" },
    { name: "Wave Cinemas ERA Mall", address: "Delhi Road, Rithani, Meerut" },
    { name: "Gold Cinema Rapic", address: "Begum Bridge Road, Meerut" }
  ],
  "Mumbai": [
    { name: "PVR ICON Phoenix Palladium", address: "High Street Phoenix, Lower Parel, Mumbai" },
    { name: "INOX Megaplex Inorbit", address: "Inorbit Mall, Malad West, Mumbai" },
    { name: "PVR Maison PVR Jio World Drive", address: "BKC, Bandra East, Mumbai" },
    { name: "Cinepolis Viviana Mall", address: "Eastern Express Highway, Thane-Mumbai" }
  ],
  "Nagpur": [
    { name: "PVR Empress City Mall", address: "Empress City, Sir Bezonji Mehta Road, Nagpur" },
    { name: "INOX Jaswant Tuli Mall", address: "Indora Square, Kamptee Road, Nagpur" },
    { name: "Cinepolis VR Nagpur", address: "Medical Square, Untkhana, Nagpur" },
    { name: "MovieMax Eternity Mall", address: "Variety Square, Sitabuldi, Nagpur" }
  ],
  "Nashik": [
    { name: "Cinemax City Centre Mall", address: "Untwadi Road, Lavate Nagar, Nashik" },
    { name: "INOX Pinnacle Mall", address: "Trimbak Road, Nashik" },
    { name: "PVR Regalia The Grand", address: "College Road, Nashik" },
    { name: "Mukta A2 Cinemas Star", address: "Mumbai-Agra Highway, Nashik" }
  ],
  "Navi Mumbai": [
    { name: "PVR Seawoods Grand Central", address: "Sector 40, Seawoods Railway Station, Navi Mumbai" },
    { name: "INOX Raghuleela Mall", address: "Sector 30A, Vashi, Navi Mumbai" },
    { name: "Cinepolis Little World Mall", address: "Sector 2, Kharghar, Navi Mumbai" },
    { name: "Carnival Cinemas Glitz", address: "CBD Belapur, Navi Mumbai" }
  ],
  "Patna": [
    { name: "PVR City Centre Patna", address: "Lodipur, Frazer Road, Patna" },
    { name: "Cinepolis P&M Mall", address: "Patliputra Industrial Area, Patna" },
    { name: "INOX Vasundhara Metro", address: "Boring Road, Patna" },
    { name: "Mona Cinema Gold Class", address: "East Gandhi Maidan, Patna" }
  ],
  "Pimpri-Chinchwad": [
    { name: "PVR Premier Plaza Mall", address: "Old Mumbai-Pune Highway, Chinchwad, Pune" },
    { name: "INOX Elpro City Square", address: "Chinchwad Gaon, Pimpri-Chinchwad" },
    { name: "Cinepolis Spine City Mall", address: "Moshi-Pradhikaran, PCMC" },
    { name: "Carnival Cinemas Premier", address: "MIDC Bhosari, Pimpri-Chinchwad" }
  ],
  "Prayagraj": [
    { name: "PVR Vinayak City Centre", address: "Civil Lines, Prayagraj" },
    { name: "INOX Atlantis Mall", address: "MG Marg, Civil Lines, Prayagraj" },
    { name: "Mukta A2 Psquare Mall", address: "Johnstonganj, Prayagraj" },
    { name: "SRS Cinemas Big", address: "Katra Main Road, Prayagraj" }
  ],
  "Pune": [
    { name: "PVR Market City Phoenix", address: "Viman Nagar, Nagar Road, Pune" },
    { name: "INOX Bund Garden Road", address: "Central Mall, Bund Garden Road, Pune" },
    { name: "Cinepolis Westend Mall", address: "Aundh Main Road, Pune" },
    { name: "PVR Pavillion Mall", address: "Senapati Bapat Road, Pune" }
  ],
  "Raipur": [
    { name: "PVR Magneto The Mall", address: "Labhandi, GE Road, Raipur" },
    { name: "INOX City Mall 36", address: "NH-6, GE Road, Raipur" },
    { name: "Cinepolis Colors Mall", address: "Pachpedi Naka, NH 43, Raipur" },
    { name: "Miraj Cinemas Ambuja Mall", address: "Vidhan Sabha Road, Raipur" }
  ],
  "Rajkot": [
    { name: "INOX R World Multiplex", address: "150 Feet Ring Road, Rajkot" },
    { name: "PVR Cosmoplex Mall", address: "Kalawad Road, Rajkot" },
    { name: "Cinepolis Crystal Mall", address: "Opp. Rani Tower, Kalawad Road, Rajkot" },
    { name: "Cosmo Multiplex Royale", address: "University Road, Rajkot" }
  ],
  "Ranchi": [
    { name: "PVR Nucleus Mall", address: "Circular Road, Lalpur, Ranchi" },
    { name: "INOX Spring City Mall", address: "Hinoo Main Road, Doranda, Ranchi" },
    { name: "Carnival Cinemas JD High Street", address: "Main Road, Hindpiri, Ranchi" },
    { name: "Fun Cinemas Mall", address: "Ratu Road, Ranchi" }
  ],
  "Srinagar": [
    { name: "INOX Shivpora Srinagar", address: "Badami Bagh Cantonment, Srinagar, Kashmir" },
    { name: "PVR Boulevard Grand", address: "Dal Lake Boulevard, Srinagar" },
    { name: "Cinepolis Lal Chowk", address: "Residency Road, Srinagar" },
    { name: "Broadway Cineplex Sonwar", address: "Sonwar Bagh, Srinagar" }
  ],
  "Surat": [
    { name: "Cinepolis Imperial Square", address: "Adajan-Hazira Road, Surat" },
    { name: "INOX VR Surat", address: "Dumas Road, Magdalla, Surat" },
    { name: "PVR Rahul Raj Mall", address: "Piplod Main Road, Surat" },
    { name: "Rajhans Prime Cinema", address: "Vesu Canal Road, Surat" }
  ],
  "Thane": [
    { name: "PVR Viviana Mall Megaplex", address: "Eastern Express Highway, Thane West" },
    { name: "INOX Korum Mall", address: "Mangal Pandey Road, Eastern Express Highway, Thane" },
    { name: "Cinepolis Hypercity Mall", address: "Ghodbunder Road, Kasarvadavali, Thane" },
    { name: "MovieMax Eternity", address: "Teen Hath Naka, Thane West" }
  ],
  "Vadodara": [
    { name: "PVR Inorbit Mall", address: "Gorwa Road, Subhanpura, Vadodara" },
    { name: "INOX Vadodara Central", address: "Sarabhai Campus, Alkapuri, Vadodara" },
    { name: "Cinepolis Eva Mall", address: "Manjalpur Main Road, Vadodara" },
    { name: "PVR Transcube Plaza", address: "Central Bus Terminal, Sayajiganj, Vadodara" }
  ],
  "Varanasi": [
    { name: "PVR IP Mall Sigra", address: "Sigra Main Road, Varanasi" },
    { name: "INOX JHV Mall", address: "Mall Road, Varanasi Cantt, Varanasi" },
    { name: "Cinepolis Kuber Complex", address: "Rathyatra Crossing, Varanasi" },
    { name: "IP Grand Cinema Bhelupur", address: "Durgakund Road, Varanasi" }
  ],
  "Vijayawada": [
    { name: "PVR Ripples Mall", address: "MG Road, Labbipet, Vijayawada" },
    { name: "INOX LEPL Centro", address: "MG Road, Fortune Murali Park, Vijayawada" },
    { name: "Cinepolis Power One Mall", address: "Autonagar Main Road, Vijayawada" },
    { name: "Trendset Multiplex IMAX", address: "Benz Circle, Vijayawada" }
  ],
  "Visakhapatnam": [
    { name: "PVR CMR Central", address: "Maddilapalem, NH 16, Visakhapatnam" },
    { name: "INOX Varun Beach", address: "Beach Road, Pandurangapuram, Visakhapatnam" },
    { name: "Cinepolis SBR Horizon", address: "Madhurawada, Visakhapatnam" },
    { name: "STBL Cine World VIP", address: "Gajuwaka Main Road, Visakhapatnam" }
  ]
};

async function provision4TheatersPerCity() {
  console.log('=== PROVISIONING AT LEAST 4 THEATERS & AUDITORIUM SCREENS PER CITY ===\n');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Fetch existing theaters
    const existingTheaters = (await client.query('SELECT name, city FROM theaters')).rows;
    const existingSet = new Set(existingTheaters.map(t => `${t.name.toLowerCase()}:::${t.city.toLowerCase()}`));

    let addedTheaters = 0;
    let addedScreens = 0;

    const SCREEN_PRESETS = [
      { name: 'Audi 1 4K Laser', rows: 8, cols: 10 },
      { name: 'IMAX 3D Grand Hall', rows: 10, cols: 12 },
      { name: 'Audi 3 Dolby Atmos', rows: 8, cols: 10 },
      { name: 'VIP Director Class Recliners', rows: 6, cols: 8 }
    ];

    for (const [city, theaterList] of Object.entries(THEATERS_BY_CITY)) {
      for (const th of theaterList) {
        const key = `${th.name.toLowerCase()}:::${city.toLowerCase()}`;
        let theaterId;

        if (!existingSet.has(key)) {
          const insertTh = await client.query(
            'INSERT INTO theaters (admin_id, name, city, address) VALUES ($1, $2, $3, $4) RETURNING id',
            [ADMIN_ID, th.name, city, th.address]
          );
          theaterId = insertTh.rows[0].id;
          addedTheaters++;
        } else {
          const findTh = await client.query('SELECT id FROM theaters WHERE LOWER(name) = LOWER($1) AND LOWER(city) = LOWER($2)', [th.name, city]);
          theaterId = findTh.rows[0].id;
        }

        // Ensure 4 diverse screens exist for this theater
        const existingScreens = (await client.query('SELECT name FROM screens WHERE theater_id = $1', [theaterId])).rows;
        const screenNameSet = new Set(existingScreens.map(s => s.name));

        for (const preset of SCREEN_PRESETS) {
          if (!screenNameSet.has(preset.name)) {
            const insScreen = await client.query(
              'INSERT INTO screens (theater_id, name, total_rows, total_columns) VALUES ($1, $2, $3, $4) RETURNING id',
              [theaterId, preset.name, preset.rows, preset.cols]
            );
            const scId = insScreen.rows[0].id;
            addedScreens++;

            // Create seat matrix (Front = regular, Middle = premium, Back = recliner)
            const rowLetters = Array.from({ length: preset.rows }, (_, i) => String.fromCharCode(65 + i));
            const seatValues = [];

            for (let rIdx = 0; rIdx < rowLetters.length; rIdx++) {
              const rowLabel = rowLetters[rIdx];
              let seatType = 'regular';
              if (rIdx >= preset.rows - 2 && preset.rows >= 6) {
                seatType = 'recliner';
              } else if (rIdx >= preset.rows - 4 && preset.rows >= 6) {
                seatType = 'premium';
              }

              for (let c = 1; c <= preset.cols; c++) {
                seatValues.push(`('${scId}', '${rowLabel}', ${c}, '${seatType}')`);
              }
            }

            if (seatValues.length > 0) {
              await client.query(`INSERT INTO seats (screen_id, row_label, seat_number, seat_type) VALUES ${seatValues.join(',')}`);
            }
          }
        }
      }
    }

    await client.query('COMMIT');
    console.log(`✓ Added ${addedTheaters} new theaters and ${addedScreens} auditorium screens across all 47 cities!`);

    // Verify theater count per city
    const finalCounts = (await client.query('SELECT city, COUNT(id) AS theater_count FROM theaters GROUP BY city ORDER BY theater_count ASC, city ASC')).rows;
    console.log('\n--- Final Theaters Per City Summary ---');
    console.table(finalCounts.slice(0, 10));
    console.log(`Total Cities: ${finalCounts.length}, Total Theaters in DB: ${finalCounts.reduce((sum, r) => sum + parseInt(r.theater_count), 0)}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to provision theaters:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

provision4TheatersPerCity();
