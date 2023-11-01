import { pool } from "../config/database.js";
import "../config/dotenv.js";

const createTables = async () => {
  const createTablesQuery = `
    DROP TABLE IF EXISTS Users CASCADE;
    CREATE TABLE IF NOT EXISTS Users (
        ID SERIAL PRIMARY KEY,
        name VARCHAR(30),
        email VARCHAR(30) UNIQUE,
        isPlayingGame VARCHAR(30) DEFAULT 'N/A'
    );
    
    DROP TABLE IF EXISTS Games CASCADE;
    CREATE TABLE IF NOT EXISTS Games (
        GID SERIAL PRIMARY KEY,
        name VARCHAR(30),
        email VARCHAR(30) NOT NULL,
        code VARCHAR(30),
        link VARCHAR(30),
        hints JSONB,
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
