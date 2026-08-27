-- ApexMovies Migration 005: 80+ Films across 8 Categories and 45+ Indian Cities with Theaters, Screens, Seats, and Shows

-- 1. Update Glass Meridian with high quality futuristic space photo
UPDATE movies
SET poster_url = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
    rating = 8.6,
    language = 'English',
    genre = 'Sci-Fi',
    status = 'now_showing'
WHERE id = 'a5555555-5555-5555-5555-555555555555' OR title ILIKE '%Glass Meridian%';

-- 2. Insert Films across all categories

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000100-0000-0000-0000-000000000100',
  'Iron Horizon',
  'A convoy runs a war-torn highway against the clock.',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
  125,
  'Action',
  'Hindi',
  '2026-06-15',
  'now_showing',
  8.2
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000101-0000-0000-0000-000000000101',
  'Vanguard Protocol',
  'An elite commando unit is deployed to rescue hostages from a high-tech fortress.',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
  135,
  'Action',
  'English',
  '2026-06-15',
  'now_showing',
  7.9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000102-0000-0000-0000-000000000102',
  'Rudra: The Reckoning',
  'A fearless undercover cop takes on an international syndicate in Mumbai.',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop',
  148,
  'Action',
  'Hindi',
  '2026-06-15',
  'now_showing',
  8.5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000103-0000-0000-0000-000000000103',
  'Shadow Strike',
  'A rogue agent races across global capitals to prevent a cyber-nuclear catastrophe.',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop',
  120,
  'Action',
  'English',
  '2026-06-15',
  'now_showing',
  7.6
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000104-0000-0000-0000-000000000104',
  'Garuda Force',
  'High-altitude border commandos defend an isolated outpost in extreme conditions.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
  140,
  'Action',
  'Telugu',
  '2026-06-15',
  'now_showing',
  8.3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000105-0000-0000-0000-000000000105',
  'Speed Demon',
  'Street racers and heist drivers unite for one final multi-million dollar score.',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=600&fit=crop',
  115,
  'Action',
  'Tamil',
  '2026-06-15',
  'now_showing',
  7.4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000106-0000-0000-0000-000000000106',
  'Blackout Point',
  'A tactical security team must escort an asset through a city in total grid collapse.',
  'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=400&h=600&fit=crop',
  128,
  'Action',
  'English',
  '2026-06-15',
  'now_showing',
  8.1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000107-0000-0000-0000-000000000107',
  'Veer: Rise of Titans',
  'A legendary warrior rises against an oppressive colonial tyrant.',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop',
  160,
  'Action',
  'Kannada',
  '2026-09-20',
  'upcoming',
  8.7
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000108-0000-0000-0000-000000000108',
  'Apex Hunter',
  'A bounty hunter becomes the prey when a contract goes wrong in neon-lit Tokyo.',
  'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&h=600&fit=crop',
  118,
  'Action',
  'English',
  '2026-09-20',
  'upcoming',
  7.8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000109-0000-0000-0000-000000000109',
  'Kavach: Shield of Steel',
  'A secret intelligence agency uncovers a weapon buried deep in the Himalayas.',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop',
  144,
  'Action',
  'Hindi',
  '2026-09-20',
  'upcoming',
  8.4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000110-0000-0000-0000-000000000110',
  'Nebula Drift',
  'A salvage crew stumbles onto a signal that should not exist.',
  'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
  138,
  'Sci-Fi',
  'English',
  '2026-06-15',
  'now_showing',
  8.4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000111-0000-0000-0000-000000000111',
  'Glass Meridian',
  'An orbital station drifts toward a border no one can see.',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
  142,
  'Sci-Fi',
  'English',
  '2026-06-15',
  'now_showing',
  8.6
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000112-0000-0000-0000-000000000112',
  'Quantum Nexus',
  'Scientists discover parallel timelines interacting through a gravitational anomaly.',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop',
  130,
  'Sci-Fi',
  'Hindi',
  '2026-06-15',
  'now_showing',
  8.1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000113-0000-0000-0000-000000000113',
  'Chrono Rift',
  'A chronologist travels back 48 hours to prevent the collapse of Earth magnetic core.',
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400&h=600&fit=crop',
  124,
  'Sci-Fi',
  'English',
  '2026-06-15',
  'now_showing',
  7.9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000114-0000-0000-0000-000000000114',
  'Cyber Eden',
  'In a city run by synthetic intelligence, a memory architect uncovers a ghost program.',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop',
  132,
  'Sci-Fi',
  'Tamil',
  '2026-06-15',
  'now_showing',
  8.3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000115-0000-0000-0000-000000000115',
  'Starlight Echoes',
  'Deep space explorers receive audio logs transmitted from their own future.',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop',
  145,
  'Sci-Fi',
  'English',
  '2026-06-15',
  'now_showing',
  8.8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000116-0000-0000-0000-000000000116',
  'Astra 9',
  'The first manned expedition to Jupiter moon Europa encounters an ancient biome.',
  'https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=400&h=600&fit=crop',
  136,
  'Sci-Fi',
  'Telugu',
  '2026-06-15',
  'now_showing',
  8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000117-0000-0000-0000-000000000117',
  'Solaris Convergence',
  'A dying sun begins pulsating in binary code towards the planetary colonies.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
  150,
  'Sci-Fi',
  'English',
  '2026-09-20',
  'upcoming',
  8.5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000118-0000-0000-0000-000000000118',
  'Singularity One',
  'The moment quantum computers gain sentient awareness changes human destiny forever.',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=600&fit=crop',
  122,
  'Sci-Fi',
  'Hindi',
  '2026-09-20',
  'upcoming',
  7.7
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000119-0000-0000-0000-000000000119',
  'Void Walkers',
  'Spacewalkers trapped outside an orbital shipyard must survive atmospheric re-entry.',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
  116,
  'Sci-Fi',
  'Malayalam',
  '2026-09-20',
  'upcoming',
  8.2
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000120-0000-0000-0000-000000000120',
  'Velvet Static',
  'Two estranged sisters reunite for one impossible night in Mumbai.',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop',
  112,
  'Drama',
  'English',
  '2026-06-15',
  'now_showing',
  8.9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000121-0000-0000-0000-000000000121',
  'The Varanasi Monologues',
  'Generations of classical musicians clash over preserving tradition versus modern jazz.',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=600&fit=crop',
  134,
  'Drama',
  'Hindi',
  '2026-06-15',
  'now_showing',
  9.1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000122-0000-0000-0000-000000000122',
  'Ganga: Flow of Time',
  'A heartwarming story of three generations rediscovering their roots on the riverbanks.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
  140,
  'Drama',
  'Hindi',
  '2026-06-15',
  'now_showing',
  8.6
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000123-0000-0000-0000-000000000123',
  'The Last Symphony',
  'A reclusive composer struggles to complete her magnum opus before losing her hearing.',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop',
  128,
  'Drama',
  'English',
  '2026-06-15',
  'now_showing',
  8.8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000124-0000-0000-0000-000000000124',
  'Kaveri Dreams',
  'An ambitious dancer from a small village battles society to reach the international stage.',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop',
  122,
  'Drama',
  'Tamil',
  '2026-06-15',
  'now_showing',
  8.4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000125-0000-0000-0000-000000000125',
  'Silent Monsoon',
  'During a relentless rainy season in Kerala, a family uncovers long-buried secrets.',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
  130,
  'Drama',
  'Malayalam',
  '2026-06-15',
  'now_showing',
  8.7
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000126-0000-0000-0000-000000000126',
  'Midnight in Kolkata',
  'A vintage bookstore owner finds love in the twilight years through handwritten letters.',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
  115,
  'Drama',
  'Bengali',
  '2026-06-15',
  'now_showing',
  8.5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000127-0000-0000-0000-000000000127',
  'The Courtroom',
  'A young legal aid attorney takes on a giant corporation in a landmark environmental trial.',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=600&fit=crop',
  145,
  'Drama',
  'Hindi',
  '2026-09-20',
  'upcoming',
  8.9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000128-0000-0000-0000-000000000128',
  'Autumn Shadows',
  'A retired professor and his estranged student reconnect over a forgotten archaeological site.',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop',
  118,
  'Drama',
  'English',
  '2026-09-20',
  'upcoming',
  8.2
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000129-0000-0000-0000-000000000129',
  'The Heritage Weaver',
  'Master weavers in Kanchipuram fight against industrial machines to preserve handloom silk.',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop',
  126,
  'Drama',
  'Telugu',
  '2026-09-20',
  'upcoming',
  8.3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000130-0000-0000-0000-000000000130',
  'Crimson Fold',
  'A detective unravels a conspiracy that folds time itself.',
  'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
  130,
  'Thriller',
  'English',
  '2026-06-15',
  'now_showing',
  8.3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000131-0000-0000-0000-000000000131',
  'The Cipher Code',
  'A cryptic message broadcast across airwaves leads an intelligence officer into a lethal trap.',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop',
  125,
  'Thriller',
  'Hindi',
  '2026-06-15',
  'now_showing',
  8.1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000132-0000-0000-0000-000000000132',
  'Night Shift at 404',
  'A night guard at an abandoned research facility realizes he is not alone inside.',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop',
  108,
  'Thriller',
  'Tamil',
  '2026-06-15',
  'now_showing',
  7.9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000133-0000-0000-0000-000000000133',
  'Black Ice',
  'A witness protection officer is ambushed on an icy Himalayan highway during a blizzard.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
  119,
  'Thriller',
  'English',
  '2026-06-15',
  'now_showing',
  8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000134-0000-0000-0000-000000000134',
  'Zero Clue',
  'A genius detective investigates three impossible bank robberies with zero fingerprints.',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
  136,
  'Thriller',
  'Telugu',
  '2026-06-15',
  'now_showing',
  8.5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000135-0000-0000-0000-000000000135',
  'The Conclave',
  'Secret power brokers gather in an isolated castle where members start mysteriously dying.',
  'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=400&h=600&fit=crop',
  122,
  'Thriller',
  'English',
  '2026-06-15',
  'now_showing',
  8.4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000136-0000-0000-0000-000000000136',
  'Ransom Hour',
  'A negotiator has exactly 90 minutes to save hostages before the building detonates.',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=600&fit=crop',
  110,
  'Thriller',
  'Hindi',
  '2026-06-15',
  'now_showing',
  7.7
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000137-0000-0000-0000-000000000137',
  'Silent Witness',
  'A deaf journalist accidentally captures evidence of high-level corruption on camera.',
  'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&h=600&fit=crop',
  127,
  'Thriller',
  'Malayalam',
  '2026-09-20',
  'upcoming',
  8.6
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000138-0000-0000-0000-000000000138',
  'The Double Agent',
  'An espionage specialist in Berlin must discover which of his superiors is a mole.',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
  132,
  'Thriller',
  'English',
  '2026-09-20',
  'upcoming',
  8.2
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000139-0000-0000-0000-000000000139',
  'Pressure Point',
  'Deep-sea divers trapped in an underwater habitat discover their oxygen line has been cut.',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
  114,
  'Thriller',
  'Hindi',
  '2026-09-20',
  'upcoming',
  7.9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000140-0000-0000-0000-000000000140',
  'Whispering Woods',
  'Campers in an ancient forest awaken an entity that feeds on fear and shadows.',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop',
  104,
  'Horror',
  'English',
  '2026-06-15',
  'now_showing',
  7.5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000141-0000-0000-0000-000000000141',
  'Bhoot Mahal',
  'A team of paranormal investigators explores a cursed 18th-century Rajasthani palace.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
  126,
  'Horror',
  'Hindi',
  '2026-06-15',
  'now_showing',
  8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000142-0000-0000-0000-000000000142',
  'The Cursed Mirror',
  'An antique mirror reflects demonic apparitions that begin stepping into the physical realm.',
  'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
  98,
  'Horror',
  'English',
  '2026-06-15',
  'now_showing',
  7.3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000143-0000-0000-0000-000000000143',
  'Yakshi: The Forest Spirit',
  'A folklore demon stalks loggers who desecrated her sacred grove.',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
  118,
  'Horror',
  'Malayalam',
  '2026-06-15',
  'now_showing',
  8.3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000144-0000-0000-0000-000000000144',
  'Abyss of the Damned',
  'Spelunkers explore an uncharted cavern system containing subterranean horrors.',
  'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=400&h=600&fit=crop',
  106,
  'Horror',
  'English',
  '2026-06-15',
  'now_showing',
  7.6
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000145-0000-0000-0000-000000000145',
  'Chhaya: The Shadow',
  'A young girl imaginary friend begins possessing members of her household.',
  'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&h=600&fit=crop',
  112,
  'Horror',
  'Hindi',
  '2026-06-15',
  'now_showing',
  7.8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000146-0000-0000-0000-000000000146',
  'Ritual of Midnight',
  'A secluded cult summons an ancient entity on the longest night of the year.',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop',
  102,
  'Horror',
  'Tamil',
  '2026-06-15',
  'now_showing',
  7.4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000147-0000-0000-0000-000000000147',
  'Possession on Elm Street',
  'A family moves into a rural estate where night brings terrifying hallucinations.',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
  110,
  'Horror',
  'English',
  '2026-09-20',
  'upcoming',
  7.9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000148-0000-0000-0000-000000000148',
  'Aatma: Unleashed',
  'An occult scholar accidentally unlocks a sealed Sanskrit grimoire in an old university.',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop',
  120,
  'Horror',
  'Telugu',
  '2026-09-20',
  'upcoming',
  8.1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000149-0000-0000-0000-000000000149',
  'The Dollmaker',
  'Porcelain dolls in an eccentric collector mansion begin moving when lights turn off.',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop',
  95,
  'Horror',
  'English',
  '2026-09-20',
  'upcoming',
  7.2
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000150-0000-0000-0000-000000000150',
  'Dragon Rider',
  'A young blacksmith discovers an ancient dragon egg and must unite warring realms.',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop',
  98,
  'Animation',
  'English',
  '2026-06-15',
  'now_showing',
  8.7
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000151-0000-0000-0000-000000000151',
  'Hanuman: Guardian of Cosmos',
  'An animated mythical adventure of Hanuman protecting cosmic realms from Asuras.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
  110,
  'Animation',
  'Hindi',
  '2026-06-15',
  'now_showing',
  9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000152-0000-0000-0000-000000000152',
  'Pixel Quest',
  'Video game characters embark on an adventure beyond their arcade cabinet screens.',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop',
  92,
  'Animation',
  'English',
  '2026-06-15',
  'now_showing',
  8.2
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000153-0000-0000-0000-000000000153',
  'Bheem: Rise of Thunder',
  'Young Bheem and his friends protect the magical forest from an encroaching empire.',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
  105,
  'Animation',
  'Hindi',
  '2026-06-15',
  'now_showing',
  8.5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000154-0000-0000-0000-000000000154',
  'Starling Chronicles',
  'A mechanical bird embarks on an odyssey to find the last botanical flower on Earth.',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
  88,
  'Animation',
  'English',
  '2026-06-15',
  'now_showing',
  8.8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000155-0000-0000-0000-000000000155',
  'Jungle Tales: Veer & Friends',
  'A joyful journey of wildlife friends preserving the pristine beauty of the Nilgiris.',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop',
  96,
  'Animation',
  'Tamil',
  '2026-06-15',
  'now_showing',
  8.1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000156-0000-0000-0000-000000000156',
  'Mecha Samurai',
  'A robotic samurai protects an ancient floating sky city from alien sky pirates.',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop',
  102,
  'Animation',
  'Japanese',
  '2026-06-15',
  'now_showing',
  8.6
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000157-0000-0000-0000-000000000157',
  'The Cloud Kingdom',
  'Two adventurous siblings build a flying glider to visit people living in the clouds.',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop',
  94,
  'Animation',
  'English',
  '2026-09-20',
  'upcoming',
  8.4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000158-0000-0000-0000-000000000158',
  'Ganesha: Sweet Adventure',
  'Little Ganesha embarks on a delightful mission across divine realms for modaks.',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=600&fit=crop',
  90,
  'Animation',
  'Telugu',
  '2026-09-20',
  'upcoming',
  8.9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000159-0000-0000-0000-000000000159',
  'Ocean Song',
  'A mermaid and a lighthouse keeper son solve the enigma of disappearing marine lights.',
  'https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=400&h=600&fit=crop',
  100,
  'Animation',
  'English',
  '2026-09-20',
  'upcoming',
  8.3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000160-0000-0000-0000-000000000160',
  'Hera Pheri Express',
  'Three broke roommates accidentally receive a briefcase containing millions in diamonds.',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop',
  135,
  'Comedy',
  'Hindi',
  '2026-06-15',
  'now_showing',
  8.8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000161-0000-0000-0000-000000000161',
  'Wedding Chaos',
  'A big fat Indian destination wedding turns completely upside down with eccentric guests.',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=600&fit=crop',
  128,
  'Comedy',
  'Hindi',
  '2026-06-15',
  'now_showing',
  8.1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000162-0000-0000-0000-000000000162',
  'The Accidental Billionaire',
  'A lazy pet store employee is named sole heir to a reclusive tech mogul fortune.',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop',
  110,
  'Comedy',
  'English',
  '2026-06-15',
  'now_showing',
  7.7
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000163-0000-0000-0000-000000000163',
  'Chennai Express 2',
  'A hilarious cross-country road trip full of miscommunications and high-speed chases.',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=600&fit=crop',
  140,
  'Comedy',
  'Tamil',
  '2026-06-15',
  'now_showing',
  8.3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000164-0000-0000-0000-000000000164',
  'Roommate Roulette',
  'Three polar opposite personalities are forced to share a cramped flat in Bengaluru.',
  'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=400&h=600&fit=crop',
  115,
  'Comedy',
  'Kannada',
  '2026-06-15',
  'now_showing',
  8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000165-0000-0000-0000-000000000165',
  'The Great Indian Kitchen Feud',
  'Two rival street food chefs start a culinary war that engulfs the entire neighborhood.',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop',
  120,
  'Comedy',
  'Hindi',
  '2026-06-15',
  'now_showing',
  8.2
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000166-0000-0000-0000-000000000166',
  'Crazy Rich Desis',
  'A modest groom tries to survive an extravagant high-society Delhi bachelor weekend.',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
  125,
  'Comedy',
  'Hindi',
  '2026-06-15',
  'now_showing',
  7.9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000167-0000-0000-0000-000000000167',
  'Grandma Secret Heist',
  'A gang of energetic senior citizens decides to rob an unfair bank to fund their retirement home.',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop',
  108,
  'Comedy',
  'Telugu',
  '2026-09-20',
  'upcoming',
  8.4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000168-0000-0000-0000-000000000168',
  'Boss on Leave',
  'When the strict CEO disappears, employees turn the corporate office into a party hub.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
  105,
  'Comedy',
  'English',
  '2026-09-20',
  'upcoming',
  7.5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000169-0000-0000-0000-000000000169',
  'Dhamaal Unlimited',
  'Five bumbling detectives compete to solve a ridiculous kidnapping case with zero clues.',
  'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
  130,
  'Comedy',
  'Hindi',
  '2026-09-20',
  'upcoming',
  8.6
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000170-0000-0000-0000-000000000170',
  'The Locked Mansion',
  'A wealthy patriarch dies in a locked room; all seven heirs have motives and dark pasts.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
  132,
  'Mystery',
  'Hindi',
  '2026-06-15',
  'now_showing',
  8.7
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000171-0000-0000-0000-000000000171',
  'Whispers in the Fog',
  'A seaside lighthouse keeper disappears, leaving behind a cryptic journal of ship signals.',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop',
  120,
  'Mystery',
  'English',
  '2026-06-15',
  'now_showing',
  8.2
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000172-0000-0000-0000-000000000172',
  'The Shimla Secret',
  'A murder in a colonial hill station uncovers an unsolved theft from 75 years ago.',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop',
  138,
  'Mystery',
  'Hindi',
  '2026-06-15',
  'now_showing',
  8.9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000173-0000-0000-0000-000000000173',
  'Enigma of Room 13',
  'Every guest who checks into Room 13 checks out with no memory of the previous night.',
  'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
  115,
  'Mystery',
  'Tamil',
  '2026-06-15',
  'now_showing',
  8
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000174-0000-0000-0000-000000000174',
  'The Vanishing Train',
  'An express train enters a mountain tunnel and never comes out on the other side.',
  'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
  128,
  'Mystery',
  'English',
  '2026-06-15',
  'now_showing',
  8.5
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000175-0000-0000-0000-000000000175',
  'The Painter Ghost',
  'A restored masterpiece reveals hidden bloodstains and coordinates under ultraviolet light.',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop',
  114,
  'Mystery',
  'Malayalam',
  '2026-06-15',
  'now_showing',
  8.3
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000176-0000-0000-0000-000000000176',
  'Kodaikanal Chronicles',
  'A young botanist finds rare plants growing only around a long-forgotten grave.',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
  122,
  'Mystery',
  'Tamil',
  '2026-06-15',
  'now_showing',
  8.1
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000177-0000-0000-0000-000000000177',
  'The Seventh Hour',
  'A serial riddler gives police exactly 60 minutes between each clue before the next crime.',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop',
  126,
  'Mystery',
  'Hindi',
  '2026-09-20',
  'upcoming',
  8.4
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000178-0000-0000-0000-000000000178',
  'Shadow over Ooty',
  'A retired judge starts receiving letters written by a defendant he convicted 30 years ago.',
  'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop',
  135,
  'Mystery',
  'Telugu',
  '2026-09-20',
  'upcoming',
  8.6
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  'a0000179-0000-0000-0000-000000000179',
  'The Stolen Artifact',
  'A priceless ancient idol disappears during a high-security museum gala in Delhi.',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=600&fit=crop',
  118,
  'Mystery',
  'English',
  '2026-09-20',
  'upcoming',
  7.9
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;

-- 3. Insert Theaters across 45+ Indian Cities

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000100-0000-0000-0000-000000000100',
  '11111111-1111-1111-1111-111111111111',
  'PVR ICON Phoenix Palladium',
  'Mumbai',
  'High Street Phoenix, Lower Parel, Mumbai'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000101-0000-0000-0000-000000000101',
  '11111111-1111-1111-1111-111111111111',
  'PVR Director''s Cut Ambience',
  'Delhi NCR',
  'Ambience Mall, Vasant Kunj, New Delhi'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000102-0000-0000-0000-000000000102',
  '11111111-1111-1111-1111-111111111111',
  'PVR IMAX Forum South City',
  'Bengaluru',
  'Kanakapura Road, Bengaluru'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000103-0000-0000-0000-000000000103',
  '11111111-1111-1111-1111-111111111111',
  'AMB Cinemas Gachibowli',
  'Hyderabad',
  'Sarath City Capital Mall, Gachibowli, Hyderabad'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000104-0000-0000-0000-000000000104',
  '11111111-1111-1111-1111-111111111111',
  'SPI Palazzo Nexus Vijaya Mall',
  'Chennai',
  'Vadapalani, Chennai'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000105-0000-0000-0000-000000000105',
  '11111111-1111-1111-1111-111111111111',
  'INOX Quest Mall',
  'Kolkata',
  '33 Syed Amir Ali Avenue, Park Circus, Kolkata'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000106-0000-0000-0000-000000000106',
  '11111111-1111-1111-1111-111111111111',
  'PVR Market City Phoenix',
  'Pune',
  'Viman Nagar, Pune'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000107-0000-0000-0000-000000000107',
  '11111111-1111-1111-1111-111111111111',
  'PVR Acropolis Mall',
  'Ahmedabad',
  'Thaltej, SG Highway, Ahmedabad'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000108-0000-0000-0000-000000000108',
  '11111111-1111-1111-1111-111111111111',
  'INOX World Trade Park',
  'Jaipur',
  'Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000109-0000-0000-0000-000000000109',
  '11111111-1111-1111-1111-111111111111',
  'Cinepolis Imperial Square',
  'Surat',
  'Pal Hazira Road, Adajan, Surat'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000110-0000-0000-0000-000000000110',
  '11111111-1111-1111-1111-111111111111',
  'PVR Phoenix United Mall',
  'Lucknow',
  'Kanpur Road, Alambagh, Lucknow'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000111-0000-0000-0000-000000000111',
  '11111111-1111-1111-1111-111111111111',
  'INOX Z Square Mall',
  'Kanpur',
  'MG Road, Kanpur'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000112-0000-0000-0000-000000000112',
  '11111111-1111-1111-1111-111111111111',
  'PVR Empress City Mall',
  'Nagpur',
  'Sir Bezonji Mehta Road, Nagpur'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000113-0000-0000-0000-000000000113',
  '11111111-1111-1111-1111-111111111111',
  'Apex Cineplex Vijay Nagar',
  'Indore',
  '123 Vijay Nagar Square, Indore'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000114-0000-0000-0000-000000000114',
  '11111111-1111-1111-1111-111111111111',
  'Cinepolis Viviana Mall',
  'Thane',
  'Eastern Express Highway, Thane West'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000115-0000-0000-0000-000000000115',
  '11111111-1111-1111-1111-111111111111',
  'PVR DB City Mall',
  'Bhopal',
  'Arera Hills, Bhopal'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000116-0000-0000-0000-000000000116',
  '11111111-1111-1111-1111-111111111111',
  'INOX Varun Beach',
  'Visakhapatnam',
  'Beach Road, Maharanipeta, Visakhapatnam'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000117-0000-0000-0000-000000000117',
  '11111111-1111-1111-1111-111111111111',
  'PVR City One Mall',
  'Pimpri-Chinchwad',
  'Old Mumbai Pune Highway, Pimpri'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000118-0000-0000-0000-000000000118',
  '11111111-1111-1111-1111-111111111111',
  'Cinepolis P&M Mall',
  'Patna',
  'Patliputra Industrial Area, Patna'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000119-0000-0000-0000-000000000119',
  '11111111-1111-1111-1111-111111111111',
  'Inox Seven Seas Mall',
  'Vadodara',
  'Fatehgunj, Vadodara'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000120-0000-0000-0000-000000000120',
  '11111111-1111-1111-1111-111111111111',
  'PVR Mahagun Metro Mall',
  'Ghaziabad',
  'Vaishali, Ghaziabad'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000121-0000-0000-0000-000000000121',
  '11111111-1111-1111-1111-111111111111',
  'PVR Pavilion Mall',
  'Ludhiana',
  'Fountain Chowk, Ludhiana'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000122-0000-0000-0000-000000000122',
  '11111111-1111-1111-1111-111111111111',
  'MovieMax TDI Mall',
  'Agra',
  'Fatehabad Road, Tajganj, Agra'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000123-0000-0000-0000-000000000123',
  '11111111-1111-1111-1111-111111111111',
  'Cinemax City Centre Mall',
  'Nashik',
  'Untwadi Road, Nashik'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000124-0000-0000-0000-000000000124',
  '11111111-1111-1111-1111-111111111111',
  'PVR Crown Interiorz Mall',
  'Faridabad',
  'Mathura Road, Faridabad'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000125-0000-0000-0000-000000000125',
  '11111111-1111-1111-1111-111111111111',
  'Wave Cinemas Shopprix Mall',
  'Meerut',
  'Delhi Road, Meerut'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000126-0000-0000-0000-000000000126',
  '11111111-1111-1111-1111-111111111111',
  'INOX R World',
  'Rajkot',
  'Kasturba Road, Rajkot'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000127-0000-0000-0000-000000000127',
  '11111111-1111-1111-1111-111111111111',
  'PVR IP Sigra Mall',
  'Varanasi',
  'Sigra, Varanasi'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000128-0000-0000-0000-000000000128',
  '11111111-1111-1111-1111-111111111111',
  'INOX Shivpora',
  'Srinagar',
  'Sonwar Bagh, Srinagar, Jammu and Kashmir'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000129-0000-0000-0000-000000000129',
  '11111111-1111-1111-1111-111111111111',
  'PVR Prozone Mall',
  'Aurangabad',
  'MIDC Industrial Area, Chikalthana, Aurangabad'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000130-0000-0000-0000-000000000130',
  '11111111-1111-1111-1111-111111111111',
  'INOX Ozone Galleria Mall',
  'Dhanbad',
  'Saraidhela, Dhanbad, Jharkhand'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000131-0000-0000-0000-000000000131',
  '11111111-1111-1111-1111-111111111111',
  'Cinepolis Mall of Amritsar',
  'Amritsar',
  'Grand Trunk Road, Amritsar'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000132-0000-0000-0000-000000000132',
  '11111111-1111-1111-1111-111111111111',
  'PVR Seawoods Grand Central',
  'Navi Mumbai',
  'Sector 40, Nerul, Navi Mumbai'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000133-0000-0000-0000-000000000133',
  '11111111-1111-1111-1111-111111111111',
  'PVR Vinayak City Centre',
  'Prayagraj',
  'Civil Lines, Prayagraj'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000134-0000-0000-0000-000000000134',
  '11111111-1111-1111-1111-111111111111',
  'PVR Nucleus Mall',
  'Ranchi',
  'Circular Road, Lalpur, Ranchi'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000135-0000-0000-0000-000000000135',
  '11111111-1111-1111-1111-111111111111',
  'Miraj Cinemas Avani Riverside',
  'Howrah',
  'Jagat Banerjee Ghat Road, Howrah'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000136-0000-0000-0000-000000000136',
  '11111111-1111-1111-1111-111111111111',
  'Broadway Cinemas Megaplex',
  'Coimbatore',
  'Avinashi Road, Aerodrome Post, Coimbatore'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000137-0000-0000-0000-000000000137',
  '11111111-1111-1111-1111-111111111111',
  'MovieMax South Avenue Mall',
  'Jabalpur',
  'Narmada Road, Jabalpur'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000138-0000-0000-0000-000000000138',
  '11111111-1111-1111-1111-111111111111',
  'PVR DB City Gwalior',
  'Gwalior',
  'Race Course Road, Gwalior'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000139-0000-0000-0000-000000000139',
  '11111111-1111-1111-1111-111111111111',
  'PVR Ripples Mall',
  'Vijayawada',
  'MG Road, Labbipet, Vijayawada'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000140-0000-0000-0000-000000000140',
  '11111111-1111-1111-1111-111111111111',
  'Carnival Cinemas Blue City Mall',
  'Jodhpur',
  'Circuit House Road, Jodhpur'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000141-0000-0000-0000-000000000141',
  '11111111-1111-1111-1111-111111111111',
  'Inox Vishaal De Mal',
  'Madurai',
  'Gokhale Road, Chinna Chokikulam, Madurai'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000142-0000-0000-0000-000000000142',
  '11111111-1111-1111-1111-111111111111',
  'PVR Magneto The Mall',
  'Raipur',
  'Labhandi, GE Road, Raipur'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000143-0000-0000-0000-000000000143',
  '11111111-1111-1111-1111-111111111111',
  'Cinemax City Mall',
  'Kota',
  'Jhalawar Road, Kota, Rajasthan'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000144-0000-0000-0000-000000000144',
  '11111111-1111-1111-1111-111111111111',
  'PVR City Centre Mall',
  'Guwahati',
  'GS Road, Christian Basti, Guwahati'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000145-0000-0000-0000-000000000145',
  '11111111-1111-1111-1111-111111111111',
  'PVR Elante Mall',
  'Chandigarh',
  'Industrial Area Phase 1, Chandigarh'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  'b0000146-0000-0000-0000-000000000146',
  '11111111-1111-1111-1111-111111111111',
  'PVR Lulu International Mall',
  'Kochi',
  'Edappally, Kochi, Kerala'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;

-- 4. Create Screens for Each Theater

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000100-0000-0000-0000-000000000100', 'b0000100-0000-0000-0000-000000000100', 'Audi 1 4K Laser', 8, 10),
  ('c0000101-0000-0000-0000-000000000101', 'b0000100-0000-0000-0000-000000000100', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000102-0000-0000-0000-000000000102', 'b0000101-0000-0000-0000-000000000101', 'Audi 1 4K Laser', 8, 10),
  ('c0000103-0000-0000-0000-000000000103', 'b0000101-0000-0000-0000-000000000101', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000104-0000-0000-0000-000000000104', 'b0000102-0000-0000-0000-000000000102', 'Audi 1 4K Laser', 8, 10),
  ('c0000105-0000-0000-0000-000000000105', 'b0000102-0000-0000-0000-000000000102', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000106-0000-0000-0000-000000000106', 'b0000103-0000-0000-0000-000000000103', 'Audi 1 4K Laser', 8, 10),
  ('c0000107-0000-0000-0000-000000000107', 'b0000103-0000-0000-0000-000000000103', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000108-0000-0000-0000-000000000108', 'b0000104-0000-0000-0000-000000000104', 'Audi 1 4K Laser', 8, 10),
  ('c0000109-0000-0000-0000-000000000109', 'b0000104-0000-0000-0000-000000000104', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000110-0000-0000-0000-000000000110', 'b0000105-0000-0000-0000-000000000105', 'Audi 1 4K Laser', 8, 10),
  ('c0000111-0000-0000-0000-000000000111', 'b0000105-0000-0000-0000-000000000105', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000112-0000-0000-0000-000000000112', 'b0000106-0000-0000-0000-000000000106', 'Audi 1 4K Laser', 8, 10),
  ('c0000113-0000-0000-0000-000000000113', 'b0000106-0000-0000-0000-000000000106', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000114-0000-0000-0000-000000000114', 'b0000107-0000-0000-0000-000000000107', 'Audi 1 4K Laser', 8, 10),
  ('c0000115-0000-0000-0000-000000000115', 'b0000107-0000-0000-0000-000000000107', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000116-0000-0000-0000-000000000116', 'b0000108-0000-0000-0000-000000000108', 'Audi 1 4K Laser', 8, 10),
  ('c0000117-0000-0000-0000-000000000117', 'b0000108-0000-0000-0000-000000000108', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000118-0000-0000-0000-000000000118', 'b0000109-0000-0000-0000-000000000109', 'Audi 1 4K Laser', 8, 10),
  ('c0000119-0000-0000-0000-000000000119', 'b0000109-0000-0000-0000-000000000109', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000120-0000-0000-0000-000000000120', 'b0000110-0000-0000-0000-000000000110', 'Audi 1 4K Laser', 8, 10),
  ('c0000121-0000-0000-0000-000000000121', 'b0000110-0000-0000-0000-000000000110', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000122-0000-0000-0000-000000000122', 'b0000111-0000-0000-0000-000000000111', 'Audi 1 4K Laser', 8, 10),
  ('c0000123-0000-0000-0000-000000000123', 'b0000111-0000-0000-0000-000000000111', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000124-0000-0000-0000-000000000124', 'b0000112-0000-0000-0000-000000000112', 'Audi 1 4K Laser', 8, 10),
  ('c0000125-0000-0000-0000-000000000125', 'b0000112-0000-0000-0000-000000000112', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000126-0000-0000-0000-000000000126', 'b0000113-0000-0000-0000-000000000113', 'Audi 1 4K Laser', 8, 10),
  ('c0000127-0000-0000-0000-000000000127', 'b0000113-0000-0000-0000-000000000113', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000128-0000-0000-0000-000000000128', 'b0000114-0000-0000-0000-000000000114', 'Audi 1 4K Laser', 8, 10),
  ('c0000129-0000-0000-0000-000000000129', 'b0000114-0000-0000-0000-000000000114', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000130-0000-0000-0000-000000000130', 'b0000115-0000-0000-0000-000000000115', 'Audi 1 4K Laser', 8, 10),
  ('c0000131-0000-0000-0000-000000000131', 'b0000115-0000-0000-0000-000000000115', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000132-0000-0000-0000-000000000132', 'b0000116-0000-0000-0000-000000000116', 'Audi 1 4K Laser', 8, 10),
  ('c0000133-0000-0000-0000-000000000133', 'b0000116-0000-0000-0000-000000000116', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000134-0000-0000-0000-000000000134', 'b0000117-0000-0000-0000-000000000117', 'Audi 1 4K Laser', 8, 10),
  ('c0000135-0000-0000-0000-000000000135', 'b0000117-0000-0000-0000-000000000117', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000136-0000-0000-0000-000000000136', 'b0000118-0000-0000-0000-000000000118', 'Audi 1 4K Laser', 8, 10),
  ('c0000137-0000-0000-0000-000000000137', 'b0000118-0000-0000-0000-000000000118', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000138-0000-0000-0000-000000000138', 'b0000119-0000-0000-0000-000000000119', 'Audi 1 4K Laser', 8, 10),
  ('c0000139-0000-0000-0000-000000000139', 'b0000119-0000-0000-0000-000000000119', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000140-0000-0000-0000-000000000140', 'b0000120-0000-0000-0000-000000000120', 'Audi 1 4K Laser', 8, 10),
  ('c0000141-0000-0000-0000-000000000141', 'b0000120-0000-0000-0000-000000000120', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000142-0000-0000-0000-000000000142', 'b0000121-0000-0000-0000-000000000121', 'Audi 1 4K Laser', 8, 10),
  ('c0000143-0000-0000-0000-000000000143', 'b0000121-0000-0000-0000-000000000121', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000144-0000-0000-0000-000000000144', 'b0000122-0000-0000-0000-000000000122', 'Audi 1 4K Laser', 8, 10),
  ('c0000145-0000-0000-0000-000000000145', 'b0000122-0000-0000-0000-000000000122', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000146-0000-0000-0000-000000000146', 'b0000123-0000-0000-0000-000000000123', 'Audi 1 4K Laser', 8, 10),
  ('c0000147-0000-0000-0000-000000000147', 'b0000123-0000-0000-0000-000000000123', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000148-0000-0000-0000-000000000148', 'b0000124-0000-0000-0000-000000000124', 'Audi 1 4K Laser', 8, 10),
  ('c0000149-0000-0000-0000-000000000149', 'b0000124-0000-0000-0000-000000000124', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000150-0000-0000-0000-000000000150', 'b0000125-0000-0000-0000-000000000125', 'Audi 1 4K Laser', 8, 10),
  ('c0000151-0000-0000-0000-000000000151', 'b0000125-0000-0000-0000-000000000125', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000152-0000-0000-0000-000000000152', 'b0000126-0000-0000-0000-000000000126', 'Audi 1 4K Laser', 8, 10),
  ('c0000153-0000-0000-0000-000000000153', 'b0000126-0000-0000-0000-000000000126', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000154-0000-0000-0000-000000000154', 'b0000127-0000-0000-0000-000000000127', 'Audi 1 4K Laser', 8, 10),
  ('c0000155-0000-0000-0000-000000000155', 'b0000127-0000-0000-0000-000000000127', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000156-0000-0000-0000-000000000156', 'b0000128-0000-0000-0000-000000000128', 'Audi 1 4K Laser', 8, 10),
  ('c0000157-0000-0000-0000-000000000157', 'b0000128-0000-0000-0000-000000000128', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000158-0000-0000-0000-000000000158', 'b0000129-0000-0000-0000-000000000129', 'Audi 1 4K Laser', 8, 10),
  ('c0000159-0000-0000-0000-000000000159', 'b0000129-0000-0000-0000-000000000129', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000160-0000-0000-0000-000000000160', 'b0000130-0000-0000-0000-000000000130', 'Audi 1 4K Laser', 8, 10),
  ('c0000161-0000-0000-0000-000000000161', 'b0000130-0000-0000-0000-000000000130', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000162-0000-0000-0000-000000000162', 'b0000131-0000-0000-0000-000000000131', 'Audi 1 4K Laser', 8, 10),
  ('c0000163-0000-0000-0000-000000000163', 'b0000131-0000-0000-0000-000000000131', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000164-0000-0000-0000-000000000164', 'b0000132-0000-0000-0000-000000000132', 'Audi 1 4K Laser', 8, 10),
  ('c0000165-0000-0000-0000-000000000165', 'b0000132-0000-0000-0000-000000000132', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000166-0000-0000-0000-000000000166', 'b0000133-0000-0000-0000-000000000133', 'Audi 1 4K Laser', 8, 10),
  ('c0000167-0000-0000-0000-000000000167', 'b0000133-0000-0000-0000-000000000133', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000168-0000-0000-0000-000000000168', 'b0000134-0000-0000-0000-000000000134', 'Audi 1 4K Laser', 8, 10),
  ('c0000169-0000-0000-0000-000000000169', 'b0000134-0000-0000-0000-000000000134', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000170-0000-0000-0000-000000000170', 'b0000135-0000-0000-0000-000000000135', 'Audi 1 4K Laser', 8, 10),
  ('c0000171-0000-0000-0000-000000000171', 'b0000135-0000-0000-0000-000000000135', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000172-0000-0000-0000-000000000172', 'b0000136-0000-0000-0000-000000000136', 'Audi 1 4K Laser', 8, 10),
  ('c0000173-0000-0000-0000-000000000173', 'b0000136-0000-0000-0000-000000000136', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000174-0000-0000-0000-000000000174', 'b0000137-0000-0000-0000-000000000137', 'Audi 1 4K Laser', 8, 10),
  ('c0000175-0000-0000-0000-000000000175', 'b0000137-0000-0000-0000-000000000137', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000176-0000-0000-0000-000000000176', 'b0000138-0000-0000-0000-000000000138', 'Audi 1 4K Laser', 8, 10),
  ('c0000177-0000-0000-0000-000000000177', 'b0000138-0000-0000-0000-000000000138', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000178-0000-0000-0000-000000000178', 'b0000139-0000-0000-0000-000000000139', 'Audi 1 4K Laser', 8, 10),
  ('c0000179-0000-0000-0000-000000000179', 'b0000139-0000-0000-0000-000000000139', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000180-0000-0000-0000-000000000180', 'b0000140-0000-0000-0000-000000000140', 'Audi 1 4K Laser', 8, 10),
  ('c0000181-0000-0000-0000-000000000181', 'b0000140-0000-0000-0000-000000000140', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000182-0000-0000-0000-000000000182', 'b0000141-0000-0000-0000-000000000141', 'Audi 1 4K Laser', 8, 10),
  ('c0000183-0000-0000-0000-000000000183', 'b0000141-0000-0000-0000-000000000141', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000184-0000-0000-0000-000000000184', 'b0000142-0000-0000-0000-000000000142', 'Audi 1 4K Laser', 8, 10),
  ('c0000185-0000-0000-0000-000000000185', 'b0000142-0000-0000-0000-000000000142', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000186-0000-0000-0000-000000000186', 'b0000143-0000-0000-0000-000000000143', 'Audi 1 4K Laser', 8, 10),
  ('c0000187-0000-0000-0000-000000000187', 'b0000143-0000-0000-0000-000000000143', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000188-0000-0000-0000-000000000188', 'b0000144-0000-0000-0000-000000000144', 'Audi 1 4K Laser', 8, 10),
  ('c0000189-0000-0000-0000-000000000189', 'b0000144-0000-0000-0000-000000000144', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000190-0000-0000-0000-000000000190', 'b0000145-0000-0000-0000-000000000145', 'Audi 1 4K Laser', 8, 10),
  ('c0000191-0000-0000-0000-000000000191', 'b0000145-0000-0000-0000-000000000145', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('c0000192-0000-0000-0000-000000000192', 'b0000146-0000-0000-0000-000000000146', 'Audi 1 4K Laser', 8, 10),
  ('c0000193-0000-0000-0000-000000000193', 'b0000146-0000-0000-0000-000000000146', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;

-- 5. Generate Physical Seats for all Screens

DO $$
DECLARE
  sc RECORD;
  r TEXT;
  n INT;
  rows_standard TEXT[] := ARRAY['A','B','C','D','E','F','G','H'];
  rows_imax TEXT[] := ARRAY['A','B','C','D','E','F','G','H','I','J'];
  seat_type TEXT;
BEGIN
  FOR sc IN SELECT id, total_rows, total_columns FROM screens WHERE id >= 'c0000100-0000-0000-0000-000000000100' LOOP
    IF sc.total_rows = 8 THEN
      FOREACH r IN ARRAY rows_standard LOOP
        seat_type := CASE WHEN r IN ('G','H') THEN 'premium' ELSE 'regular' END;
        FOR n IN 1..sc.total_columns LOOP
          INSERT INTO seats (screen_id, row_label, seat_number, seat_type)
          VALUES (sc.id, r, n, seat_type)
          ON CONFLICT (screen_id, row_label, seat_number) DO NOTHING;
        END LOOP;
      END LOOP;
    ELSE
      FOREACH r IN ARRAY rows_imax LOOP
        seat_type := CASE WHEN r IN ('I','J') THEN 'recliner' WHEN r IN ('G','H') THEN 'premium' ELSE 'regular' END;
        FOR n IN 1..sc.total_columns LOOP
          INSERT INTO seats (screen_id, row_label, seat_number, seat_type)
          VALUES (sc.id, r, n, seat_type)
          ON CONFLICT (screen_id, row_label, seat_number) DO NOTHING;
        END LOOP;
      END LOOP;
    END IF;
  END LOOP;
END $$;

-- 6. Generate Shows Across Today, Tomorrow, and Next Days for Theaters

DO $$
DECLARE
  m_id UUID;
  sc RECORD;
  show_id UUID;
  base_p NUMERIC;
  off_hr INT;
  dur INT;
  h_offsets INT[] := ARRAY[2, 6, 10, 26, 30, 50, 54];
BEGIN
  FOR sc IN SELECT id, theater_id FROM screens WHERE id >= 'c0000100-0000-0000-0000-000000000100' LOOP
    FOR m_id, dur IN SELECT id, duration_mins FROM movies WHERE status = 'now_showing' ORDER BY random() LIMIT 3 LOOP
      FOREACH off_hr IN ARRAY h_offsets LOOP
        base_p := (ARRAY[200, 250, 300, 350, 420])[1 + floor(random() * 5)::int];
        show_id := gen_random_uuid();
        
        INSERT INTO shows (id, movie_id, screen_id, start_time, end_time, base_price)
        VALUES (
          show_id,
          m_id,
          sc.id,
          now() + (off_hr || ' hours')::interval,
          now() + (off_hr || ' hours')::interval + ((dur + 15) || ' minutes')::interval,
          base_p
        ) ON CONFLICT DO NOTHING;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- 7. Materialize Show Seats for All Newly Created Shows

DO $$
DECLARE
  show_row RECORD;
  seat_row RECORD;
  multiplier NUMERIC;
BEGIN
  FOR show_row IN 
    SELECT sh.id AS show_id, sh.screen_id, sh.base_price 
    FROM shows sh
    LEFT JOIN show_seats ss ON ss.show_id = sh.id
    WHERE ss.id IS NULL
  LOOP
    FOR seat_row IN SELECT id AS seat_id, seat_type FROM seats WHERE screen_id = show_row.screen_id LOOP
      multiplier := CASE seat_row.seat_type
        WHEN 'premium' THEN 1.5
        WHEN 'recliner' THEN 2.0
        ELSE 1.0
      END;
      INSERT INTO show_seats (show_id, seat_id, status, price)
      VALUES (show_row.show_id, seat_row.seat_id, 'available', ROUND(show_row.base_price * multiplier, 2))
      ON CONFLICT (show_id, seat_id) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
