import { pool } from "../config/database.js";
import "../config/dotenv.js";

const createTables = async () => {
  const createTablesQuery = `
    DROP TABLE IF EXISTS Users CASCADE;
    CREATE TABLE IF NOT EXISTS Users (
        ID SERIAL PRIMARY KEY,
        name VARCHAR(30),
        email VARCHAR(30) UNIQUE,
        mygame INT DEFAULT 0,
        playingGames INT DEFAULT 0
    );
    
    DROP TABLE IF EXISTS Games CASCADE;
    CREATE TABLE IF NOT EXISTS Games (
        GID SERIAL PRIMARY KEY,
        name VARCHAR(30),
        email VARCHAR(30) NOT NULL,
        code VARCHAR(30),
        link VARCHAR(30),
        startTime VARCHAR(30) DEFAULT 'N/A',
        endTime VARCHAR(30) DEFAULT 'N/A',
        hints JSONB DEFAULT '{}'::JSONB,
        description VARCHAR(30),
        CONSTRAINT fk_users_game FOREIGN KEY(email) REFERENCES Users(email)
    );

    DROP TABLE IF EXISTS User_progress CASCADE;
    CREATE TABLE IF NOT EXISTS User_progress (
        gid INT,
        email VARCHAR(30) NOT NULL,
        solvedClues VARCHAR(100),
        points VARCHAR(30),
        latest_time_date VARCHAR(30) DEFAULT 'N/A',
        CONSTRAINT fk_users_progress FOREIGN KEY(email) REFERENCES Users(email),
        CONSTRAINT fk_game_progress FOREIGN KEY(gid) REFERENCES Games(GID)
    );
  `;

  try {
    const res = await pool.query(createTablesQuery);
    console.log("🎉 trips table created successfully");
  } catch (err) {
    console.error("⚠️ error creating trips table", err);
  }
};

const seedTripsTable = async () => {
  await createTables();
  const insertQuery = `
      INSERT INTO Users (name, email, isPlayingGame) VALUES
      ('John Doe', 'john@example.com', 'Chess'),
      ('Alice Smith', 'alice@example.com', 'N/A'),
      ('Bob Johnson', 'bob@example.com', 'Football'),
      ('Eve Williams', 'eve@example.com', 'N/A');

      INSERT INTO Games (name, email, code, link, Questions) VALUES
    ('Chess Game', 'john@example.com', 'CHS1', 'https://chessgame.com', '{"difficulty": "medium", "categories": ["Strategy", "Board Games"]}'),
    ('Football Game', 'bob@example.com', 'FTB1', 'https://footballgame.com', '{"difficulty": "hard", "categories": ["Sports", "Simulation"]}');  
      `;
  pool.query(insertQuery, (err, res) => {
    if (err) {
      console.error("⚠️ error inserting", err);
      return;
    }

    console.log(`✅ Inserted successfully`);
  });
};

export default seedTripsTable;

/*
INSERT INTO Users (name, email, isPlayingGame) VALUES
    ('Alice', 'alice@email.com', 'Yes'),
    ('Bob', 'bob@email.com', 'No'),
    ('Charlie', 'charlie@email.com', 'Yes');

-- Sample data for Games table
INSERT INTO Games (name, email, code, link, startTime, endTime, hints, description) VALUES
    ('Game 1', 'alice@email.com', 'ABC123', 'http://game1.com', '2023-10-31 10:00:00', '2023-10-31 12:00:00', '{"hint1": "Something", "hint2": "Another thing"}', 'Description for Game 1'),
    ('Game 2', 'bob@email.com', 'DEF456', 'http://game2.com', '2023-11-01 14:00:00', '2023-11-01 16:00:00', '{"hint1": "Another hint", "hint2": "More hints"}', 'Description for Game 2'),
    ('Game 3', 'charlie@email.com', 'GHI789', 'http://game3.com', '2023-11-05 09:00:00', '2023-11-05 11:00:00', '{"hint1": "Hint for Game 3", "hint2": "Final hint"}', 'Description for Game 3');

-- Sample data for User_progress table
INSERT INTO User_progress (gid, email, solvedClues, points, latest_time_date) VALUES
    (1, 'alice@email.com', 'Clue1, Clue2, Clue3', '100', '2023-10-31 11:30:00'),
    (2, 'bob@email.com', 'ClueA, ClueB', '80', '2023-11-01 15:30:00'),
    (3, 'charlie@email.com', 'ClueX, ClueY, ClueZ', '120', '2023-11-05 10:30:00');
*/
