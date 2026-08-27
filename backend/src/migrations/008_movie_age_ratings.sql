-- Migration 008: Add age_rating certification and content advisory
ALTER TABLE movies
ADD COLUMN IF NOT EXISTS age_rating VARCHAR(10) DEFAULT 'UA 13+';

-- Update age ratings intelligently based on genre and title:
-- Animation / Family -> 'U' (Universal / All Ages)
UPDATE movies SET age_rating = 'U'
WHERE genre = 'Animation' OR title IN ('Ganesha: Sweet Adventure', 'Hanuman: Guardian of Cosmos', 'Jungle Tales: Veer & Friends', 'The Cloud Kingdom', 'Ocean Song');

-- Horror / Dark Thrillers -> 'A' (Adults 18+)
UPDATE movies SET age_rating = 'A'
WHERE genre = 'Horror' OR title IN ('Possession on Elm Street', 'Ritual of Midnight', 'The Cursed Mirror', 'The Dollmaker', 'Whispering Woods', 'Yakshi: The Forest Spirit', 'Chhaya: The Shadow', 'Abyss of the Damned', 'Aatma: Unleashed', 'Crimson Fold');

-- Action / Crime / Thriller / Mystery / Drama -> 'UA 16+'
UPDATE movies SET age_rating = 'UA 16+'
WHERE title IN ('Rudra: The Reckoning', 'Garuda Force', 'Shadow Strike', 'Vanguard Protocol', 'Speed Demon', 'The Cipher Code', 'The Conclave', 'The Double Agent', 'Night Shift at 404', 'Pressure Point', 'Ransom Hour', 'Zero Clue', 'The Courtroom');

-- Default remaining Comedy / Drama / Sci-Fi -> 'UA 13+' (Parental Guidance for under 13)
UPDATE movies SET age_rating = 'UA 13+'
WHERE age_rating IS NULL OR (age_rating NOT IN ('U', 'A', 'UA 16+'));
