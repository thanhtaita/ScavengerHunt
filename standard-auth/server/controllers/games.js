import { pool } from "../config/database.js";

const getGames = async (req, res) => {
  try {
    const games = await pool.query("SELECT * FROM Game");
    res.status(200).json(games.rows);
  } catch (err) {
    console.error("⚠️ error getting games", err);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM Users");
    res.status(200).json(users.rows);
  } catch (err) {
    console.error("⚠️ error getting users", err);
  }
};

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

export default { getGames, getUsers, createUser, getUser };
