const fs = require('fs');
const path = require('path');

const ADMIN_ID = '11111111-1111-1111-1111-111111111111';

// 1. Genres and at least 10 films per genre (Action, Sci-Fi, Drama, Thriller, Horror, Animation, Comedy, Mystery)
const MOVIES_BY_GENRE = {
  'Action': [
    { title: 'Iron Horizon', desc: 'A convoy runs a war-torn highway against the clock.', poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop', duration: 125, lang: 'Hindi', rating: 8.2, status: 'now_showing' },
    { title: 'Vanguard Protocol', desc: 'An elite commando unit is deployed to rescue hostages from a high-tech fortress.', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop', duration: 135, lang: 'English', rating: 7.9, status: 'now_showing' },
    { title: 'Rudra: The Reckoning', desc: 'A fearless undercover cop takes on an international syndicate in Mumbai.', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop', duration: 148, lang: 'Hindi', rating: 8.5, status: 'now_showing' },
    { title: 'Shadow Strike', desc: 'A rogue agent races across global capitals to prevent a cyber-nuclear catastrophe.', poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop', duration: 120, lang: 'English', rating: 7.6, status: 'now_showing' },
    { title: 'Garuda Force', desc: 'High-altitude border commandos defend an isolated outpost in extreme conditions.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop', duration: 140, lang: 'Telugu', rating: 8.3, status: 'now_showing' },
    { title: 'Speed Demon', desc: 'Street racers and heist drivers unite for one final multi-million dollar score.', poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=600&fit=crop', duration: 115, lang: 'Tamil', rating: 7.4, status: 'now_showing' },
    { title: 'Blackout Point', desc: 'A tactical security team must escort an asset through a city in total grid collapse.', poster: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=400&h=600&fit=crop', duration: 128, lang: 'English', rating: 8.1, status: 'now_showing' },
    { title: 'Veer: Rise of Titans', desc: 'A legendary warrior rises against an oppressive colonial tyrant.', poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop', duration: 160, lang: 'Kannada', rating: 8.7, status: 'upcoming' },
    { title: 'Apex Hunter', desc: 'A bounty hunter becomes the prey when a contract goes wrong in neon-lit Tokyo.', poster: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&h=600&fit=crop', duration: 118, lang: 'English', rating: 7.8, status: 'upcoming' },
    { title: 'Kavach: Shield of Steel', desc: 'A secret intelligence agency uncovers a weapon buried deep in the Himalayas.', poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop', duration: 144, lang: 'Hindi', rating: 8.4, status: 'upcoming' },
  ],
  'Sci-Fi': [
    { title: 'Nebula Drift', desc: 'A salvage crew stumbles onto a signal that should not exist.', poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', duration: 138, lang: 'English', rating: 8.4, status: 'now_showing' },
    { title: 'Glass Meridian', desc: 'An orbital station drifts toward a border no one can see.', poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop', duration: 142, lang: 'English', rating: 8.6, status: 'now_showing' },
    { title: 'Quantum Nexus', desc: 'Scientists discover parallel timelines interacting through a gravitational anomaly.', poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop', duration: 130, lang: 'Hindi', rating: 8.1, status: 'now_showing' },
    { title: 'Chrono Rift', desc: 'A chronologist travels back 48 hours to prevent the collapse of Earth magnetic core.', poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400&h=600&fit=crop', duration: 124, lang: 'English', rating: 7.9, status: 'now_showing' },
    { title: 'Cyber Eden', desc: 'In a city run by synthetic intelligence, a memory architect uncovers a ghost program.', poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop', duration: 132, lang: 'Tamil', rating: 8.3, status: 'now_showing' },
    { title: 'Starlight Echoes', desc: 'Deep space explorers receive audio logs transmitted from their own future.', poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop', duration: 145, lang: 'English', rating: 8.8, status: 'now_showing' },
    { title: 'Astra 9', desc: 'The first manned expedition to Jupiter moon Europa encounters an ancient biome.', poster: 'https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=400&h=600&fit=crop', duration: 136, lang: 'Telugu', rating: 8.0, status: 'now_showing' },
    { title: 'Solaris Convergence', desc: 'A dying sun begins pulsating in binary code towards the planetary colonies.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop', duration: 150, lang: 'English', rating: 8.5, status: 'upcoming' },
    { title: 'Singularity One', desc: 'The moment quantum computers gain sentient awareness changes human destiny forever.', poster: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=600&fit=crop', duration: 122, lang: 'Hindi', rating: 7.7, status: 'upcoming' },
    { title: 'Void Walkers', desc: 'Spacewalkers trapped outside an orbital shipyard must survive atmospheric re-entry.', poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop', duration: 116, lang: 'Malayalam', rating: 8.2, status: 'upcoming' },
  ],
  'Drama': [
    { title: 'Velvet Static', desc: 'Two estranged sisters reunite for one impossible night in Mumbai.', poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop', duration: 112, lang: 'English', rating: 8.9, status: 'now_showing' },
    { title: 'The Varanasi Monologues', desc: 'Generations of classical musicians clash over preserving tradition versus modern jazz.', poster: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=600&fit=crop', duration: 134, lang: 'Hindi', rating: 9.1, status: 'now_showing' },
    { title: 'Ganga: Flow of Time', desc: 'A heartwarming story of three generations rediscovering their roots on the riverbanks.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop', duration: 140, lang: 'Hindi', rating: 8.6, status: 'now_showing' },
    { title: 'The Last Symphony', desc: 'A reclusive composer struggles to complete her magnum opus before losing her hearing.', poster: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop', duration: 128, lang: 'English', rating: 8.8, status: 'now_showing' },
    { title: 'Kaveri Dreams', desc: 'An ambitious dancer from a small village battles society to reach the international stage.', poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop', duration: 122, lang: 'Tamil', rating: 8.4, status: 'now_showing' },
    { title: 'Silent Monsoon', desc: 'During a relentless rainy season in Kerala, a family uncovers long-buried secrets.', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop', duration: 130, lang: 'Malayalam', rating: 8.7, status: 'now_showing' },
    { title: 'Midnight in Kolkata', desc: 'A vintage bookstore owner finds love in the twilight years through handwritten letters.', poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop', duration: 115, lang: 'Bengali', rating: 8.5, status: 'now_showing' },
    { title: 'The Courtroom', desc: 'A young legal aid attorney takes on a giant corporation in a landmark environmental trial.', poster: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=600&fit=crop', duration: 145, lang: 'Hindi', rating: 8.9, status: 'upcoming' },
    { title: 'Autumn Shadows', desc: 'A retired professor and his estranged student reconnect over a forgotten archaeological site.', poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop', duration: 118, lang: 'English', rating: 8.2, status: 'upcoming' },
    { title: 'The Heritage Weaver', desc: 'Master weavers in Kanchipuram fight against industrial machines to preserve handloom silk.', poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop', duration: 126, lang: 'Telugu', rating: 8.3, status: 'upcoming' },
  ],
  'Thriller': [
    { title: 'Crimson Fold', desc: 'A detective unravels a conspiracy that folds time itself.', poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop', duration: 130, lang: 'English', rating: 8.3, status: 'now_showing' },
    { title: 'The Cipher Code', desc: 'A cryptic message broadcast across airwaves leads an intelligence officer into a lethal trap.', poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop', duration: 125, lang: 'Hindi', rating: 8.1, status: 'now_showing' },
    { title: 'Night Shift at 404', desc: 'A night guard at an abandoned research facility realizes he is not alone inside.', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop', duration: 108, lang: 'Tamil', rating: 7.9, status: 'now_showing' },
    { title: 'Black Ice', desc: 'A witness protection officer is ambushed on an icy Himalayan highway during a blizzard.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop', duration: 119, lang: 'English', rating: 8.0, status: 'now_showing' },
    { title: 'Zero Clue', desc: 'A genius detective investigates three impossible bank robberies with zero fingerprints.', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop', duration: 136, lang: 'Telugu', rating: 8.5, status: 'now_showing' },
    { title: 'The Conclave', desc: 'Secret power brokers gather in an isolated castle where members start mysteriously dying.', poster: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=400&h=600&fit=crop', duration: 122, lang: 'English', rating: 8.4, status: 'now_showing' },
    { title: 'Ransom Hour', desc: 'A negotiator has exactly 90 minutes to save hostages before the building detonates.', poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=600&fit=crop', duration: 110, lang: 'Hindi', rating: 7.7, status: 'now_showing' },
    { title: 'Silent Witness', desc: 'A deaf journalist accidentally captures evidence of high-level corruption on camera.', poster: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&h=600&fit=crop', duration: 127, lang: 'Malayalam', rating: 8.6, status: 'upcoming' },
    { title: 'The Double Agent', desc: 'An espionage specialist in Berlin must discover which of his superiors is a mole.', poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop', duration: 132, lang: 'English', rating: 8.2, status: 'upcoming' },
    { title: 'Pressure Point', desc: 'Deep-sea divers trapped in an underwater habitat discover their oxygen line has been cut.', poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop', duration: 114, lang: 'Hindi', rating: 7.9, status: 'upcoming' },
  ],
  'Horror': [
    { title: 'Whispering Woods', desc: 'Campers in an ancient forest awaken an entity that feeds on fear and shadows.', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop', duration: 104, lang: 'English', rating: 7.5, status: 'now_showing' },
    { title: 'Bhoot Mahal', desc: 'A team of paranormal investigators explores a cursed 18th-century Rajasthani palace.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop', duration: 126, lang: 'Hindi', rating: 8.0, status: 'now_showing' },
    { title: 'The Cursed Mirror', desc: 'An antique mirror reflects demonic apparitions that begin stepping into the physical realm.', poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop', duration: 98, lang: 'English', rating: 7.3, status: 'now_showing' },
    { title: 'Yakshi: The Forest Spirit', desc: 'A folklore demon stalks loggers who desecrated her sacred grove.', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop', duration: 118, lang: 'Malayalam', rating: 8.3, status: 'now_showing' },
    { title: 'Abyss of the Damned', desc: 'Spelunkers explore an uncharted cavern system containing subterranean horrors.', poster: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=400&h=600&fit=crop', duration: 106, lang: 'English', rating: 7.6, status: 'now_showing' },
    { title: 'Chhaya: The Shadow', desc: 'A young girl imaginary friend begins possessing members of her household.', poster: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&h=600&fit=crop', duration: 112, lang: 'Hindi', rating: 7.8, status: 'now_showing' },
    { title: 'Ritual of Midnight', desc: 'A secluded cult summons an ancient entity on the longest night of the year.', poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop', duration: 102, lang: 'Tamil', rating: 7.4, status: 'now_showing' },
    { title: 'Possession on Elm Street', desc: 'A family moves into a rural estate where night brings terrifying hallucinations.', poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop', duration: 110, lang: 'English', rating: 7.9, status: 'upcoming' },
    { title: 'Aatma: Unleashed', desc: 'An occult scholar accidentally unlocks a sealed Sanskrit grimoire in an old university.', poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop', duration: 120, lang: 'Telugu', rating: 8.1, status: 'upcoming' },
    { title: 'The Dollmaker', desc: 'Porcelain dolls in an eccentric collector mansion begin moving when lights turn off.', poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop', duration: 95, lang: 'English', rating: 7.2, status: 'upcoming' },
  ],
  'Animation': [
    { title: 'Dragon Rider', desc: 'A young blacksmith discovers an ancient dragon egg and must unite warring realms.', poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop', duration: 98, lang: 'English', rating: 8.7, status: 'now_showing' },
    { title: 'Hanuman: Guardian of Cosmos', desc: 'An animated mythical adventure of Hanuman protecting cosmic realms from Asuras.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop', duration: 110, lang: 'Hindi', rating: 9.0, status: 'now_showing' },
    { title: 'Pixel Quest', desc: 'Video game characters embark on an adventure beyond their arcade cabinet screens.', poster: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop', duration: 92, lang: 'English', rating: 8.2, status: 'now_showing' },
    { title: 'Bheem: Rise of Thunder', desc: 'Young Bheem and his friends protect the magical forest from an encroaching empire.', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop', duration: 105, lang: 'Hindi', rating: 8.5, status: 'now_showing' },
    { title: 'Starling Chronicles', desc: 'A mechanical bird embarks on an odyssey to find the last botanical flower on Earth.', poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop', duration: 88, lang: 'English', rating: 8.8, status: 'now_showing' },
    { title: 'Jungle Tales: Veer & Friends', desc: 'A joyful journey of wildlife friends preserving the pristine beauty of the Nilgiris.', poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop', duration: 96, lang: 'Tamil', rating: 8.1, status: 'now_showing' },
    { title: 'Mecha Samurai', desc: 'A robotic samurai protects an ancient floating sky city from alien sky pirates.', poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop', duration: 102, lang: 'Japanese', rating: 8.6, status: 'now_showing' },
    { title: 'The Cloud Kingdom', desc: 'Two adventurous siblings build a flying glider to visit people living in the clouds.', poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop', duration: 94, lang: 'English', rating: 8.4, status: 'upcoming' },
    { title: 'Ganesha: Sweet Adventure', desc: 'Little Ganesha embarks on a delightful mission across divine realms for modaks.', poster: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=600&fit=crop', duration: 90, lang: 'Telugu', rating: 8.9, status: 'upcoming' },
    { title: 'Ocean Song', desc: 'A mermaid and a lighthouse keeper son solve the enigma of disappearing marine lights.', poster: 'https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=400&h=600&fit=crop', duration: 100, lang: 'English', rating: 8.3, status: 'upcoming' },
  ],
  'Comedy': [
    { title: 'Hera Pheri Express', desc: 'Three broke roommates accidentally receive a briefcase containing millions in diamonds.', poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop', duration: 135, lang: 'Hindi', rating: 8.8, status: 'now_showing' },
    { title: 'Wedding Chaos', desc: 'A big fat Indian destination wedding turns completely upside down with eccentric guests.', poster: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=600&fit=crop', duration: 128, lang: 'Hindi', rating: 8.1, status: 'now_showing' },
    { title: 'The Accidental Billionaire', desc: 'A lazy pet store employee is named sole heir to a reclusive tech mogul fortune.', poster: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop', duration: 110, lang: 'English', rating: 7.7, status: 'now_showing' },
    { title: 'Chennai Express 2', desc: 'A hilarious cross-country road trip full of miscommunications and high-speed chases.', poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=600&fit=crop', duration: 140, lang: 'Tamil', rating: 8.3, status: 'now_showing' },
    { title: 'Roommate Roulette', desc: 'Three polar opposite personalities are forced to share a cramped flat in Bengaluru.', poster: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=400&h=600&fit=crop', duration: 115, lang: 'Kannada', rating: 8.0, status: 'now_showing' },
    { title: 'The Great Indian Kitchen Feud', desc: 'Two rival street food chefs start a culinary war that engulfs the entire neighborhood.', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop', duration: 120, lang: 'Hindi', rating: 8.2, status: 'now_showing' },
    { title: 'Crazy Rich Desis', desc: 'A modest groom tries to survive an extravagant high-society Delhi bachelor weekend.', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop', duration: 125, lang: 'Hindi', rating: 7.9, status: 'now_showing' },
    { title: 'Grandma Secret Heist', desc: 'A gang of energetic senior citizens decides to rob an unfair bank to fund their retirement home.', poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop', duration: 108, lang: 'Telugu', rating: 8.4, status: 'upcoming' },
    { title: 'Boss on Leave', desc: 'When the strict CEO disappears, employees turn the corporate office into a party hub.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop', duration: 105, lang: 'English', rating: 7.5, status: 'upcoming' },
    { title: 'Dhamaal Unlimited', desc: 'Five bumbling detectives compete to solve a ridiculous kidnapping case with zero clues.', poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop', duration: 130, lang: 'Hindi', rating: 8.6, status: 'upcoming' },
  ],
  'Mystery': [
    { title: 'The Locked Mansion', desc: 'A wealthy patriarch dies in a locked room; all seven heirs have motives and dark pasts.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop', duration: 132, lang: 'Hindi', rating: 8.7, status: 'now_showing' },
    { title: 'Whispers in the Fog', desc: 'A seaside lighthouse keeper disappears, leaving behind a cryptic journal of ship signals.', poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=600&fit=crop', duration: 120, lang: 'English', rating: 8.2, status: 'now_showing' },
    { title: 'The Shimla Secret', desc: 'A murder in a colonial hill station uncovers an unsolved theft from 75 years ago.', poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop', duration: 138, lang: 'Hindi', rating: 8.9, status: 'now_showing' },
    { title: 'Enigma of Room 13', desc: 'Every guest who checks into Room 13 checks out with no memory of the previous night.', poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop', duration: 115, lang: 'Tamil', rating: 8.0, status: 'now_showing' },
    { title: 'The Vanishing Train', desc: 'An express train enters a mountain tunnel and never comes out on the other side.', poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop', duration: 128, lang: 'English', rating: 8.5, status: 'now_showing' },
    { title: 'The Painter Ghost', desc: 'A restored masterpiece reveals hidden bloodstains and coordinates under ultraviolet light.', poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&h=600&fit=crop', duration: 114, lang: 'Malayalam', rating: 8.3, status: 'now_showing' },
    { title: 'Kodaikanal Chronicles', desc: 'A young botanist finds rare plants growing only around a long-forgotten grave.', poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop', duration: 122, lang: 'Tamil', rating: 8.1, status: 'now_showing' },
    { title: 'The Seventh Hour', desc: 'A serial riddler gives police exactly 60 minutes between each clue before the next crime.', poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop', duration: 126, lang: 'Hindi', rating: 8.4, status: 'upcoming' },
    { title: 'Shadow over Ooty', desc: 'A retired judge starts receiving letters written by a defendant he convicted 30 years ago.', poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop', duration: 135, lang: 'Telugu', rating: 8.6, status: 'upcoming' },
    { title: 'The Stolen Artifact', desc: 'A priceless ancient idol disappears during a high-security museum gala in Delhi.', poster: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=600&fit=crop', duration: 118, lang: 'English', rating: 7.9, status: 'upcoming' },
  ]
};

// 2. 45 Indian Cities with real Theaters
const INDIAN_CITIES_THEATERS = [
  { city: 'Mumbai', name: 'PVR ICON Phoenix Palladium', address: 'High Street Phoenix, Lower Parel, Mumbai' },
  { city: 'Delhi NCR', name: "PVR Director's Cut Ambience", address: 'Ambience Mall, Vasant Kunj, New Delhi' },
  { city: 'Bengaluru', name: 'PVR IMAX Forum South City', address: 'Kanakapura Road, Bengaluru' },
  { city: 'Hyderabad', name: 'AMB Cinemas Gachibowli', address: 'Sarath City Capital Mall, Gachibowli, Hyderabad' },
  { city: 'Chennai', name: 'SPI Palazzo Nexus Vijaya Mall', address: 'Vadapalani, Chennai' },
  { city: 'Kolkata', name: 'INOX Quest Mall', address: '33 Syed Amir Ali Avenue, Park Circus, Kolkata' },
  { city: 'Pune', name: 'PVR Market City Phoenix', address: 'Viman Nagar, Pune' },
  { city: 'Ahmedabad', name: 'PVR Acropolis Mall', address: 'Thaltej, SG Highway, Ahmedabad' },
  { city: 'Jaipur', name: 'INOX World Trade Park', address: 'Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur' },
  { city: 'Surat', name: 'Cinepolis Imperial Square', address: 'Pal Hazira Road, Adajan, Surat' },
  { city: 'Lucknow', name: 'PVR Phoenix United Mall', address: 'Kanpur Road, Alambagh, Lucknow' },
  { city: 'Kanpur', name: 'INOX Z Square Mall', address: 'MG Road, Kanpur' },
  { city: 'Nagpur', name: 'PVR Empress City Mall', address: 'Sir Bezonji Mehta Road, Nagpur' },
  { city: 'Indore', name: 'Apex Cineplex Vijay Nagar', address: '123 Vijay Nagar Square, Indore' },
  { city: 'Thane', name: 'Cinepolis Viviana Mall', address: 'Eastern Express Highway, Thane West' },
  { city: 'Bhopal', name: 'PVR DB City Mall', address: 'Arera Hills, Bhopal' },
  { city: 'Visakhapatnam', name: 'INOX Varun Beach', address: 'Beach Road, Maharanipeta, Visakhapatnam' },
  { city: 'Pimpri-Chinchwad', name: 'PVR City One Mall', address: 'Old Mumbai Pune Highway, Pimpri' },
  { city: 'Patna', name: 'Cinepolis P&M Mall', address: 'Patliputra Industrial Area, Patna' },
  { city: 'Vadodara', name: 'Inox Seven Seas Mall', address: 'Fatehgunj, Vadodara' },
  { city: 'Ghaziabad', name: 'PVR Mahagun Metro Mall', address: 'Vaishali, Ghaziabad' },
  { city: 'Ludhiana', name: 'PVR Pavilion Mall', address: 'Fountain Chowk, Ludhiana' },
  { city: 'Agra', name: 'MovieMax TDI Mall', address: 'Fatehabad Road, Tajganj, Agra' },
  { city: 'Nashik', name: 'Cinemax City Centre Mall', address: 'Untwadi Road, Nashik' },
  { city: 'Faridabad', name: 'PVR Crown Interiorz Mall', address: 'Mathura Road, Faridabad' },
  { city: 'Meerut', name: 'Wave Cinemas Shopprix Mall', address: 'Delhi Road, Meerut' },
  { city: 'Rajkot', name: 'INOX R World', address: 'Kasturba Road, Rajkot' },
  { city: 'Varanasi', name: 'PVR IP Sigra Mall', address: 'Sigra, Varanasi' },
  { city: 'Srinagar', name: 'INOX Shivpora', address: 'Sonwar Bagh, Srinagar, Jammu and Kashmir' },
  { city: 'Aurangabad', name: 'PVR Prozone Mall', address: 'MIDC Industrial Area, Chikalthana, Aurangabad' },
  { city: 'Dhanbad', name: 'INOX Ozone Galleria Mall', address: 'Saraidhela, Dhanbad, Jharkhand' },
  { city: 'Amritsar', name: 'Cinepolis Mall of Amritsar', address: 'Grand Trunk Road, Amritsar' },
  { city: 'Navi Mumbai', name: 'PVR Seawoods Grand Central', address: 'Sector 40, Nerul, Navi Mumbai' },
  { city: 'Prayagraj', name: 'PVR Vinayak City Centre', address: 'Civil Lines, Prayagraj' },
  { city: 'Ranchi', name: 'PVR Nucleus Mall', address: 'Circular Road, Lalpur, Ranchi' },
  { city: 'Howrah', name: 'Miraj Cinemas Avani Riverside', address: 'Jagat Banerjee Ghat Road, Howrah' },
  { city: 'Coimbatore', name: 'Broadway Cinemas Megaplex', address: 'Avinashi Road, Aerodrome Post, Coimbatore' },
  { city: 'Jabalpur', name: 'MovieMax South Avenue Mall', address: 'Narmada Road, Jabalpur' },
  { city: 'Gwalior', name: 'PVR DB City Gwalior', address: 'Race Course Road, Gwalior' },
  { city: 'Vijayawada', name: 'PVR Ripples Mall', address: 'MG Road, Labbipet, Vijayawada' },
  { city: 'Jodhpur', name: 'Carnival Cinemas Blue City Mall', address: 'Circuit House Road, Jodhpur' },
  { city: 'Madurai', name: 'Inox Vishaal De Mal', address: 'Gokhale Road, Chinna Chokikulam, Madurai' },
  { city: 'Raipur', name: 'PVR Magneto The Mall', address: 'Labhandi, GE Road, Raipur' },
  { city: 'Kota', name: 'Cinemax City Mall', address: 'Jhalawar Road, Kota, Rajasthan' },
  { city: 'Guwahati', name: 'PVR City Centre Mall', address: 'GS Road, Christian Basti, Guwahati' },
  { city: 'Chandigarh', name: 'PVR Elante Mall', address: 'Industrial Area Phase 1, Chandigarh' },
  { city: 'Kochi', name: 'PVR Lulu International Mall', address: 'Edappally, Kochi, Kerala' }
];

let sql = `-- ApexMovies Migration 005: 80+ Films across 8 Categories and 45+ Indian Cities with Theaters, Screens, Seats, and Shows

-- 1. Update Glass Meridian with high quality futuristic space photo
UPDATE movies
SET poster_url = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
    rating = 8.6,
    language = 'English',
    genre = 'Sci-Fi',
    status = 'now_showing'
WHERE id = 'a5555555-5555-5555-5555-555555555555' OR title ILIKE '%Glass Meridian%';

-- 2. Insert Films across all categories
`;

let movieIndex = 100;
const insertedMovieIds = [];

for (const [genre, movies] of Object.entries(MOVIES_BY_GENRE)) {
  for (const m of movies) {
    const id = `a${String(movieIndex).padStart(7, '0')}-0000-0000-0000-${String(movieIndex).padStart(12, '0')}`;
    insertedMovieIds.push(id);
    const releaseDate = m.status === 'now_showing' ? '2026-06-15' : '2026-09-20';
    sql += `
INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating)
VALUES (
  '${id}',
  '${m.title.replace(/'/g, "''")}',
  '${m.desc.replace(/'/g, "''")}',
  '${m.poster}',
  ${m.duration},
  '${genre}',
  '${m.lang}',
  '${releaseDate}',
  '${m.status}',
  ${m.rating}
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  poster_url = EXCLUDED.poster_url,
  duration_mins = EXCLUDED.duration_mins,
  genre = EXCLUDED.genre,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  rating = EXCLUDED.rating;
`;
    movieIndex++;
  }
}

sql += `\n-- 3. Insert Theaters across 45+ Indian Cities\n`;

let theaterIndex = 100;
const theaterIds = [];

for (const t of INDIAN_CITIES_THEATERS) {
  const id = `b${String(theaterIndex).padStart(7, '0')}-0000-0000-0000-${String(theaterIndex).padStart(12, '0')}`;
  theaterIds.push({ id, city: t.city, name: t.name });
  sql += `
INSERT INTO theaters (id, admin_id, name, city, address)
VALUES (
  '${id}',
  '${ADMIN_ID}',
  '${t.name.replace(/'/g, "''")}',
  '${t.city.replace(/'/g, "''")}',
  '${t.address.replace(/'/g, "''")}'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address;
`;
  theaterIndex++;
}

sql += `\n-- 4. Create Screens for Each Theater\n`;

let screenIndex = 100;
const screenIds = [];

for (let i = 0; i < theaterIds.length; i++) {
  const t = theaterIds[i];
  const sc1 = `c${String(screenIndex).padStart(7, '0')}-0000-0000-0000-${String(screenIndex).padStart(12, '0')}`;
  screenIndex++;
  const sc2 = `c${String(screenIndex).padStart(7, '0')}-0000-0000-0000-${String(screenIndex).padStart(12, '0')}`;
  screenIndex++;

  screenIds.push({ id: sc1, theater_id: t.id, name: 'Audi 1 4K Laser' });
  screenIds.push({ id: sc2, theater_id: t.id, name: 'IMAX Audi 2' });

  sql += `
INSERT INTO screens (id, theater_id, name, total_rows, total_columns)
VALUES
  ('${sc1}', '${t.id}', 'Audi 1 4K Laser', 8, 10),
  ('${sc2}', '${t.id}', 'IMAX Audi 2', 10, 12)
ON CONFLICT (id) DO NOTHING;
`;
}

sql += `\n-- 5. Generate Physical Seats for all Screens\n`;
sql += `
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
`;

sql += `\n-- 6. Generate Shows Across Today, Tomorrow, and Next Days for Theaters\n`;
sql += `
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
`;

sql += `\n-- 7. Materialize Show Seats for All Newly Created Shows\n`;
sql += `
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
`;

const migrationPath = path.join(__dirname, '..', 'src', 'migrations', '005_expanded_films_cities_theaters.sql');
fs.writeFileSync(migrationPath, sql, 'utf8');
console.log('Migration 005 created successfully at:', migrationPath);
