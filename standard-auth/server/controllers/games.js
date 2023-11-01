import { pool } from "../config/database.js";

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
    res.status(200).json(games.rows);
  } catch (err) {
    console.error("⚠️ error getting games", err);
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
};
