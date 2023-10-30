import { pool } from "../config/database.js";
import "../config/dotenv.js";

const createTables = async () => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS Users (
        ID SERIAL PRIMARY KEY,
        name VARCHAR(30),
        email VARCHAR(30),
        isPlayingGame VARCHAR(30) DEFAULT 'N/A'
    );

    CREATE TABLE IF NOT EXISTS Game (
        GID SERIAL PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        email VARCHAR(30) NOT NULL,
        code VARCHAR(30) NOT NULL,
        link VARCHAR(30),
        Questions JSONB,
        CONSTRAINT fk_users_game FOREIGN KEY(email) REFERENCES Users(email)
    );

    CREATE TABLE IF NOT EXISTS User_progress (
        gid INT,
        email VARCHAR(30) NOT NULL,
        Progress JSONB,
        points VARCHAR(30),
        latest_time_date VARCHAR(30) DEFAULT 'N/A',
        CONSTRAINT fk_users_progress FOREIGN KEY(email) REFERENCES Users(email),
        CONSTRAINT fk_game_progress FOREIGN KEY(gid) REFERENCES Game(GID)
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
      ('Bob Johnson', 'bob@example.com', 'Football');`;
  pool.query(insertQuery, (err, res) => {
    if (err) {
      console.error("⚠️ error inserting trip", err);
      return;
    }

    console.log(`✅ ${trip.title} added successfully`);
  });
};

export default seedTripsTable;
