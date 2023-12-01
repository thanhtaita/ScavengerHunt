import { pool } from "../config/database.js";
import moment from "moment-timezone";


//Joining a game. [Creates new entry if new game]
const joinGame = async (uid, gameId) => { 
  try {
    console.log("Inside Join Game");
    const selectQuery = `
      SELECT * 
      FROM user_progress 
      WHERE email = $1 AND gid = $2
    `;
    console.log(uid, parseInt(gameId, 10), gameId);
    const existingEntry = await pool.query(selectQuery, [
      uid,
      parseInt(gameId, 10),
    ]);

    if (existingEntry.rowCount > 0) {
      // Entry already exists, you can either return a specific message or just return true
      return true;
    }

    // If it doesn't exist, create a new entry.
    const insertQuery = `
      INSERT INTO user_progress (gid, email, solvedClues, unsolvedClues, points, latest_time_date)
      VALUES ($1, $2, '', '', '0', 'N/A')
    `;
    await pool.query(insertQuery, [parseInt(gameId, 10), uid]);

    return true;
  } catch (err) {
    console.error("⚠️ error creating DB entry", err);
    throw err; // propagate the error
  }
};

//Gets game description from the database to display in the game page. 
const getGameDeets = async (gameId) => {
  try {
    console.log("Fetching from games database ...");
    const game = await pool.query("SELECT * FROM games WHERE gid = $1", [
      gameId,
    ]);

    if (game.rows.length === 0) {
      return null; // or throw an error if you prefer
    }

    const gameDetails = game.rows[0];
    const cluesCount = gameDetails.hints ? gameDetails.hints.length : 0; // Assuming hints is an array

    return {
      id: gameDetails.gid,
      name: gameDetails.name,
      startDate: gameDetails.startDate, // Assuming you have a startDate column
      endDate: gameDetails.endDate, // Assuming you have an endDate column
      description: gameDetails.description,
      clues: cluesCount,
    };
  } catch (err) {
    console.error("⚠️ error getting game details", err);
    throw err; // propagate the error
  }
};

//verifying scanned QR code with the in game(actual) QR code. 
const verifyQR = async (uid, gameId, QR_value) => {
  try {
    console.log("Accessing DB inside verifyQR ...");

    const selectUserProgressQuery = `
      SELECT solvedclues, unsolvedClues
      FROM user_progress
      WHERE email = $1 AND gid = $2
    `;

    let solvedCluesArray=[];
    let unsolvedCluesArray=[];
    const userProgressRes = await pool.query(selectUserProgressQuery, [uid, gameId]);
    // Assuming that 'solvedclues' and 'unsolvedclues' are stored as JSON strings
    if (userProgressRes.rowCount > 0) {
      solvedCluesArray = JSON.parse(userProgressRes.rows[0].solvedclues || '[]');
      unsolvedCluesArray = JSON.parse(userProgressRes.rows[0].unsolvedclues || '[]');
      // Now 'solvedClues' and 'unsolvedClues' are arrays extracted from the database
    } else { //when empty user progress, solvedClues is empty (default) and the empty unsolvedClues will be populated (to atleast 1) below while adjusting.
      const isCreated = await GamesController.joinGame(uid, gameId); 
    }


    console.log(solvedCluesArray, unsolvedCluesArray);
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

    let foundIndex = -1;
    for (let i = 0; i < unsolvedCluesArray.length; i++) {
        const hintIndex = unsolvedCluesArray[i];
        console.log(hints[hintIndex].QR_text,QR_value);
        if (hints[hintIndex].QR_text === QR_value) {
            foundIndex = hintIndex;
            break;
        }
    }

    // If a match is found, update the solved and unsolved clues arrays
    if (foundIndex !== -1) {
        // Add to solved clues
        solvedCluesArray.push(foundIndex);

        // Remove from unsolved clues
        const indexInUnsolved = unsolvedCluesArray.indexOf(foundIndex);
        if (indexInUnsolved !== -1) {
            unsolvedCluesArray.splice(indexInUnsolved, 1);
        }
        let solvedClues = JSON.stringify(solvedCluesArray);
        let unsolvedClues = JSON.stringify(unsolvedCluesArray);

        const currentTimeCST = moment().tz("America/Chicago").format('YYYY-MM-DD HH:mm:ss');

        const updateTimestampQuery = `
        UPDATE user_progress
        SET latest_time_date = $5, solvedclues = $3, unsolvedclues = $4
        WHERE email = $1 AND gid = $2
        `;

        await pool.query(updateTimestampQuery, [uid, gameId, solvedClues, unsolvedClues, currentTimeCST]);
        return true;

    }
    return false;
  } catch (err) {
    console.error("⚠️ error accessing DB", err);
  }
};


//Order Randomizing based on gameId and userId.
function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    // Convert to 32bit integer and make sure it's positive
    hash = Math.abs(hash | 0); 
  }
  return hash;
}
function seededRandom(seed) {
  const a = 1664525;
  const c = 1013904223;
  const m = 4294967296; // 2**32

  seed = (a * seed + c) % m;
  return seed / m;
}
function generateClueOrder(numClues, userId, gameId) {
  const userSeed = stringToSeed(userId); // Convert userId to a seed number
  const combinedSeed = userSeed * gameId;
  console.log("Combined Seed", combinedSeed);
  console.log("User ID", userId);
  console.log("Game ID", gameId);
  const indices = Array.from({ length: numClues }, (_, i) => i);
  
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(combinedSeed + i) * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  console.log("indices inside function", indices);
  return indices;
}

const getClues = async (uid, gid) => {
  try{
    console.log("Inside Get clues (gameController)");
    console.log(uid);
    console.log(gid);
    // Fetch solved clues for the user and game
    const selectUserProgressQuery = `
      SELECT solvedclues, unsolvedClues
      FROM user_progress
      WHERE email = $1 AND gid = $2
    `;

    let solvedClues=[];
    let unsolvedClues=[];
    const userProgressRes = await pool.query(selectUserProgressQuery, [uid, gid]);
    // Assuming that 'solvedclues' and 'unsolvedclues' are stored as JSON strings
    if (userProgressRes.rowCount > 0) {
      solvedClues = JSON.parse(userProgressRes.rows[0].solvedclues || '[]');
      unsolvedClues = JSON.parse(userProgressRes.rows[0].unsolvedclues || '[]');
      // Now 'solvedClues' and 'unsolvedClues' are arrays extracted from the database
    } else { //when empty user progress, solvedClues is empty (default) and the empty unsolvedClues will be populated (to atleast 1) below while adjusting.
      const isCreated = await GamesController.joinGame(uid, gameId); 
    }

    console.log("Solved Clues & Unsolved Clues before processing");
    console.log(solvedClues);
    console.log(unsolvedClues);
    
    // Fetch all clues for the game
    const selectGameHintsQuery = `
      SELECT hints
      FROM games
      WHERE GID = $1
    `;
    const gameHintsRes = await pool.query(selectGameHintsQuery, [gid]);
    if (gameHintsRes.rowCount === 0) {
      return { solvedClues: [], otherClues: [] };
    }

    //getting start date and time 
      const startDatequery = `
      SELECT starttime
      FROM games
      WHERE GID = $1
    `;
    const startTimeResult= await pool.query(startDatequery, [gid]);
    const startTime = new Date (startTimeResult.rows[0].starttime);

    //current time and date
    const currentTime = new Date();

    // Calculate the difference in milliseconds and minutes
    const differenceInMilliseconds = currentTime - startTime;
    const differenceInMinutes = differenceInMilliseconds / 1000 / 60;
    console.log("Time passed");
    console.log(currentTime);
    console.log(startTime);

    //defining interval in minutes 
    const interval = 15;

    const numberofIntervals = Math.floor(differenceInMinutes / interval);

    const allClues = gameHintsRes.rows[0].hints;
    const n_solvedClues = solvedClues.length;
    const n_unsolvedClues = unsolvedClues.length;
    const total_clues = allClues.length;
    const clueOrder = generateClueOrder(total_clues, uid, gid);
    const n_revealedClues= Math.min(total_clues, numberofIntervals+1); //clues revealed from time passing.
    // const n_revealedClues = 2;

    //Adjusting solvedClues and unsolvedClues to reflect the latest status. 
    if(n_solvedClues+n_unsolvedClues<n_revealedClues){
      unsolvedClues = unsolvedClues.concat(clueOrder.slice(n_solvedClues+n_unsolvedClues,n_revealedClues));//adding the extra clues to the unsolvedClues. 
    }
    else if (n_unsolvedClues==0){//after adding all the adables. if there's no clues to solve. 
      if (total_clues==n_solvedClues)//if the user has solved clues.
        unsolvedClues = [];
      else{ //clues are left, but user is ahead of the timer. The user is given 1 clue from the shuffled deck. 
        unsolvedClues = unsolvedClues.concat(clueOrder[n_solvedClues+n_unsolvedClues+1]);
      }
    }

    const newSolvedClues = JSON.stringify(solvedClues);
    const newUnsolvedClues = JSON.stringify(unsolvedClues);
    
    console.log("Solved and Unsolved clues after processing");
    console.log(newSolvedClues);
    console.log(newUnsolvedClues);
    // console.log(allClues);
    console.log("standard cluesorder functioncall", clueOrder);
    // console.log("hardcoded call", generateClueOrder(5, "karrthik.reddyusa@gmail.com", 46));
    console.log(n_revealedClues);
    console.log(n_solvedClues);
    console.log(n_unsolvedClues);
    
    //update the update solvedClues, unsolvedClues, points to the DB
    const updateUserProgressQuery = `
    UPDATE user_progress
    SET solvedclues = $1, unsolvedclues = $2
    WHERE email = $3 AND gid = $4
    `;
    await pool.query(updateUserProgressQuery, [newSolvedClues, newUnsolvedClues, uid, gid]);
    //"['1','2']"
    
    // with the indexes in solvedClues and unsolvedClues, the description from allCLues is retreived and added to solvedCluesDescrip and unsolvedCluesDescrip
    const solvedCluesDescrip = solvedClues.map(index => allClues[index].clueText);
    const unsolvedCluesDescrip = unsolvedClues.map(index => allClues[index].clueText);
    
    console.log("returned descriptoins.");
    console.log(solvedCluesDescrip);
    console.log(unsolvedCluesDescrip);


    return { solvedCluesDescrip, unsolvedCluesDescrip, total_clues };
    
  } catch (err){
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
    const data = await getMyGame(email);
    console.log("🎉 game created successfully");
    if (!data) return null;
    else return data;
  } catch (err) {
    console.error("⚠️ error creating game", err);
  }
};

// get a game by email
const getMyGame = async (email) => {
  try {
    const selectQuery = `SELECT * FROM Games WHERE email = $1`;
    const values = [email];
    const data = await pool.query(selectQuery, values);
    console.log("🎉 get my game successfully");
    if (!data) return null;
    else return data.rows[0];
  } catch (err) {
    console.error("⚠️ error creating game", err);
  }
};

const getGame = async (gid) => {
  try {
    const selectQuery = `SELECT * FROM Games WHERE gid = $1`;
    const values = [gid];
    const data = await pool.query(selectQuery, values);
    console.log("🎉 get game successfully");
    return data.rows[0];
  } catch (err) {
    console.error("⚠️ error getting game", err);
  }
};

const updateGameInfo = async (gid, body) => {
  try {
    const updateQuery = `UPDATE Games SET name = $1, description = $2, starttime = $3, endtime = $4 WHERE gid = $5`;
    const values = [
      body.gameName,
      body.gameDescription,
      body.startTime,
      body.endTime,
      gid,
    ];
    console.log(values);
    const res = await pool.query(updateQuery, values);
    console.log("🎉 game info updated successfully");
  } catch (err) {
    console.error("⚠️ error updating game", err);
  }
};

const updateClueInfo = async (gid, body) => {
  try {
    const updateQuery = `UPDATE Games SET hints = $1 WHERE gid = $2`;
    const values = [JSON.stringify(body), gid];
    console.log(values);
    const res = await pool.query(updateQuery, values);
    console.log("🎉 clue info updated successfully");
  } catch (err) {
    console.error("⚠️ error updating clue info", err);
  }
};

const leaderboardInfo = async (gid) => {
  try {
    const selectQuery = `SELECT * FROM user_progress WHERE gid = $1`;
    const values = [gid];
    const data = await pool.query(selectQuery, values);
    console.log("🎉 get leaderboards successful");
    // console.log(data.rows);
    return data.rows;
  } catch (err) {
    console.error("⚠️ error getting game", err);
  }
}
export default {
  getGames,
  getGame,
  getUsers,
  createUser,
  getUser,
  existedUser,
  getMyGame,
  createGame,
  updateGameInfo,
  updateClueInfo,
  verifyQR,
  getGameDeets,
  joinGame,
  leaderboardInfo,
  getClues,
};
