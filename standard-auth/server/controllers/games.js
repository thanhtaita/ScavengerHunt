import { pool } from "../config/database.js";

const joinGame = async (uid, gameId) => {
  try {
    console.log("Inside Join Game");
    const selectQuery = `
      SELECT * 
      FROM user_progress 
      WHERE email = $1 AND gid = $2
    `;
    console.log(uid,parseInt(gameId, 10), gameId);
    const existingEntry = await pool.query(selectQuery, [uid, parseInt(gameId, 10)]);

    if (existingEntry.rowCount > 0) {
      // Entry already exists, you can either return a specific message or just return true
      return true;
    }

    // If it doesn't exist, create a new entry.
    const insertQuery = `
      INSERT INTO user_progress (gid, email, solvedClues, points, latest_time_date)
      VALUES ($1, $2, '', '0', 'N/A')
    `;
    await pool.query(insertQuery, [parseInt(gameId, 10), uid]);

    return true;

  }catch (err) {
    console.error("⚠️ error creating DB entry", err);
    throw err; // propagate the error
  }
}

const getGameDeets = async (gameId) => {
  try {
    console.log("Fetching from games database ...")
    const game = await pool.query("SELECT * FROM games WHERE gid = $1", [gameId]);

    if (game.rows.length === 0) {
      return null; // or throw an error if you prefer
    }

    const gameDetails = game.rows[0];
    const cluesCount = gameDetails.hints ? gameDetails.hints.length : 0; // Assuming hints is an array

    return {
      id: gameDetails.gid,
      name: gameDetails.name,
      startDate: gameDetails.startDate, // Assuming you have a startDate column
      endDate: gameDetails.endDate,     // Assuming you have an endDate column
      description: gameDetails.description,
      clues: cluesCount
    };
  } catch (err) {
    console.error("⚠️ error getting game details", err);
    throw err; // propagate the error
  }
};

const verifyQR = async (uid, gameId, result) => {
  try {
    console.log("Accessing DB inside verifyQR ...");
    
    const selectUserProgressQuery = `
      SELECT solvedclues
      FROM user_progress
      WHERE email = $1 AND gid = $2
    `;
    const userProgressRes = await pool.query(selectUserProgressQuery, [uid, gameId]);
    if (userProgressRes.rowCount === 0) {
      return false;
    }

    let solvedClues = userProgressRes.rows[0].solvedclues;

    // Parse the solvedClues string into an array
    let cluesArray = solvedClues ? JSON.parse(solvedClues) : [];

    const nextClueIndex = cluesArray.length;

    const selectGameHintsQuery = `
      SELECT hints
      FROM games
      WHERE GID = $1
    `;
    const gameHintsRes = await pool.query(selectGameHintsQuery, [gameId]);

    if (gameHintsRes.rowCount === 0) {
      return false;
    }

    const hints = gameHintsRes.rows[0].hints;

    if (!hints[nextClueIndex]) {
      return false;
    }

    if (hints[nextClueIndex].QR_text === result) {
      // Add the new clue ID to the cluesArray
      cluesArray.push(hints[nextClueIndex].id);

      // Convert the cluesArray back into a string
      solvedClues = JSON.stringify(cluesArray);

      const updateTimestampQuery = `
        UPDATE user_progress
        SET latest_time_date = TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS'), solvedclues = $3
        WHERE email = $1 AND gid = $2
      `;

      await pool.query(updateTimestampQuery, [uid, gameId, solvedClues]);
      return true;
    }
    return false;
  } catch (err) {
    console.error("⚠️ error accessing DB", err);
  } 
};


// get all users
const getUsers = async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM Users");
    res.status(200).json(users.rows);
  } catch (err) {
    console.error("⚠️ error getting users", err);
  }
};

// get a user by email
const getUser = async (email) => {
  const selectQuery = `SELECT * FROM Users WHERE email = $1`;
  const values = [email];
  try {
    const res = await pool.query(selectQuery, values);
    return res.rows[0];
  } catch (err) {
    console.error("⚠️ error getting user", err);
  }
};

// check if user exists
const existedUser = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    console.log(user);
    if (user) return true;
    return false;
  } catch (err) {
    console.error("⚠️ error getting user", err);
  }
};

// create new user
const createUser = async (name, email) => {
  const insertQuery = `INSERT INTO Users (name, email) VALUES ($1, $2)`;
  const values = [name, email];
  try {
    const res = await pool.query(insertQuery, values);
    console.log("🎉 user created successfully");
  } catch (err) {
    console.error("⚠️ error creating user", err);
  }
};

// get all games
const getGames = async (req, res) => {
  try {
    const games = await pool.query("SELECT * FROM Games");
    
    // Transform the data to match the expected format
    const transformedGames = games.rows.map(game => ({
      id: game.gid,
      name: game.name,
      startDate: game.starttime, // Assuming 'starttime' is the column name in the 'Games' table
      clues: game.hints ? game.hints.length : 0 // Assuming 'hints' is an array
    }));

    res.status(200).json(transformedGames);
  } catch (err) {
    console.error("⚠️ error getting games", err);
    res.status(500).json({ error: "Internal server error." }); // It's a good practice to send a response in case of errors
  }
};

const createGame = async (email) => {
  try {
    const insertQuery = `INSERT INTO Games (email) VALUES ($1)`;
    const values = [email];
    const res = await pool.query(insertQuery, values);
    console.log("🎉 game created successfully");
  } catch (err) {
    console.error("⚠️ error creating game", err);
  }
};
export default { getGames, getUsers, createUser, getUser, existedUser, verifyQR, getGameDeets, joinGame };
