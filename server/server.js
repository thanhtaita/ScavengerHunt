import "./config/dotenv.js";
import express, { query } from "express";
import cors from "cors";
import axios from "axios";
import queryString from "query-string";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { pool } from "./config/database.js";
import seedTripsTable from "./config/reset.js";
import gamesRouter from "./routes/games.js";
import { URL } from "url";
import url from "url";
import GamesController from "./controllers/games.js";
import { URLSearchParams } from "url";
import bodyParser from "body-parser";
import session from "express-session";
import { get } from "http";

const config = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOLGE_CLIENT_SECRET,
  authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  redirectUrl: process.env.REDIRECT_URL,
  clientUrl: process.env.CLIENT_URL,
  tokenSecret: process.env.TOKEN_SECRET,
  tokenExpiration: 3600000,
  postUrl: "https://jsonplaceholder.typicode.com/posts",
};

const authParams = queryString.stringify({
  client_id: config.clientId,
  redirect_uri: config.redirectUrl,
  response_type: "code",
  scope: "openid profile email",
  access_type: "offline",
  state: "standard_oauth",
  prompt: "consent",
});

const getTokenParams = (code) =>
  queryString.stringify({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: config.redirectUrl,
  });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://play-scavenger-hunt.netlify.app",
    ], // Allow access from any origin
    credentials: true,
  })
);

// Parse Cookie
app.use(cookieParser());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// app.use("", gamesRouter);

// function to get user info with token
const getUserInfo = (req) => {
  const cookie = req.headers["cookie"]
    ?.split("; ")
    .find((row) => row.startsWith("token" + "="));
  const token = cookie ? cookie.split("=")[1] : "";
  if (!token) return undefined;
  const { user } = jwt.verify(token, config.tokenSecret);
  return user;
};

// Verify auth
const auth = (req, res, next) => {
  try {
    const user = getUserInfo(req);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    return next();
  } catch (err) {
    console.error("Error: ", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

app.get("/", async function (req, res) {
  GamesController.getGames(req, res);
  // res.send("Hello World!");
  // const user = getUserInfo(req);
});

app.get("/mygame", auth, async function (req, res) {
  console.log("getting my game");
  const user = getUserInfo(req);
  const email = user.email;
  console.log("done getting email");
  let data = await GamesController.getMyGame(email);
  if (!data) {
    data = await GamesController.createGame(email);
  }
  res.json({
    url: `${config.clientUrl}/mygame/${data.gid}`,
  });
});

app.get("/mygame/:id", auth, async function (req, res) {
  console.log("getting my game");
  const { id } = req.params;
  console.log(id);
  const data = await GamesController.getGame(id);
  console.log(data);
  res.json(data);
});

app.post("/mygame/:id", auth, async function (req, res) {
  console.log("updating my game");
  const { id } = req.params;
  console.log(id);
  let published = req.query.published;
  if (published) {
    published = req.query.published === "true";
    // console.log(published);
    const data = await GamesController.updatePublishedGame(id, published);
    console.log(data);
  } else {
    const body = req.body;
    console.log(body);
    const data = await GamesController.updateGameInfo(id, body);
    console.log(data);
  }
  return res.send({ message: "success" });
});

app.post("/mygame/:gId/:hintId", auth, async function (req, res) {
  console.log("updating clue game");
  const { gId, hintId } = req.params;
  console.log(gId);
  const body = req.body;
  console.log(body);
  // update clue info only
  const data = await GamesController.updateClueInfo(gId, body);

  if (data) {
    return res.send(data);
  }
});

app.post("/", auth, async function (req, res) {
  const form = new URL(req.url);
  const email = form.searchParams.get("email");
  const data = await GamesController.createGame(email);
  console.log(email);
  if (data) {
    return res.json("");
  }
});

app.get("/unsolve/:gId", auth, async function (req, res) {
  console.log("getting unsolve game", req.params);
  const { gId } = req.params;
  const uId = getUserInfo(req).email;
  const data = await GamesController.unsolvedGameInfo(uId, gId);
  console.log(data);
  console.log("done getting unsolve game");
  if (data) {
    return res.send(data);
  }
  res.send("");
});

app.get("/auth/url", (_, res) => {
  res.json({
    url: `${config.authUrl}?${authParams}`,
  });
});

app.get("/auth/token", async (req, res) => {
  const { code } = req.query;
  if (!code)
    return res
      .status(400)
      .json({ message: "Authorization code must be provided" });
  try {
    // Get all parameters needed to hit authorization server
    const tokenParam = getTokenParams(code);
    // Exchange authorization code for access token (id token is returned here too)
    const {
      data: { id_token },
    } = await axios.post(`${config.tokenUrl}?${tokenParam}`);
    if (!id_token) return res.status(400).json({ message: "Auth error" });
    // Get user info from id token
    const { email, name, picture } = jwt.decode(id_token);
    const user = { name, email, picture };
    // Check if user exists in DB
    console.log("user logging");
    const userExists = await GamesController.existedUser(email);
    if (!userExists) {
      // Create user in DB
      console.log("create a new user");
      await GamesController.createUser(name, email);
    }

    // Sign a new token
    const token = jwt.sign({ user }, config.tokenSecret, {
      expiresIn: 360000,
    });
    // Set cookies for user
    res.cookie("token", token, {
      maxAge: 360000,
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });
    // You can choose to store user in a DB instead
    res.json({
      user,
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// so we know the token (or is it a refresh_token?) is stored inside cookies
app.get("/auth/logged_in", (req, res) => {
  // seedTripsTable();
  try {
    // Get token from cookie,
    console.log("get token from cookie");
    console.log(req.headers["cookie"]);
    const cookie = req.headers["cookie"]
      .split("; ")
      .find((row) => row.startsWith("token" + "="));
    const token = cookie ? cookie.split("=")[1] : "";
    console.log(token);
    if (!token) return res.json({ loggedIn: false });
    const { user } = jwt.verify(token, config.tokenSecret);

    console.log("get user info");
    res.json({ loggedIn: true, user });
  } catch (err) {
    res.json({ loggedIn: false });
  }
});

app.post("/auth/logout", auth, (req, res) => {
  // Clear the "token" cookie
  console.log("clear the token cookie");
  const user = getUserInfo(req);
  const newToken = jwt.sign({ user }, config.tokenSecret, {
    expiresIn: config.tokenExpiration,
  });
  // Reset token in cookie
  res.cookie("token", newToken, {
    maxAge: 0,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.json({ message: "Logged out" });
});

app.get("/user/posts", auth, async (_, res) => {
  try {
    const { data } = await axios.get(config.postUrl);
    res.json({ posts: data?.slice(0, 5) });
  } catch (err) {
    console.error("Error: ", err);
  }
});

app.get("/game/:gameId", auth, async function (req, res) {
  try {
    console.log("inside server processing database call ...");
    const gameId = parseInt(req.params.gameId, 10); // Extract gameId from the route parameter and convert to number
    console.log(gameId);
    if (isNaN(gameId)) {
      return res.status(400).json({ error: "Invalid game ID format." });
    }

    const gameDetails = await GamesController.getGameDeets(gameId);

    if (!gameDetails) {
      console.log("hi");
      return res.status(404).json({ error: "Game not found." });
    }

    res.json(gameDetails);
  } catch (err) {
    console.error("Error fetching game details:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

//get clue information for a user from the database.
app.post("/progress", async function (req, res) {
  try {
    const { uid, gameId } = req.body;
    console.log(uid);
    console.log(gameId);
    console.log("Fetching clues from database ... ");
    const clues = await GamesController.getClues(uid, gameId);
    res.json(clues);
  } catch (err) {
    console.error("Error fetching clues from the database", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

//Verifying Scanned QR code.
app.post("/verifyQR", async (req, res) => {
  try {
    // Extract data from the request body
    const { uid, result, gameId } = req.body;

    // Call the verifyQR function from GamesController
    const isVerified = await GamesController.verifyQR(uid, gameId, result);

    // Send the result back to the client
    res.json({ success: isVerified });
  } catch (error) {
    console.error("Error verifying QR:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/startGame", auth, async (req, res) => {
  try {
    const gameId = parseInt(req.query.gameId, 10);
    const uid = req.query.uid;
    console.log(uid);
    console.log(gameId);

    if (!gameId || !uid) {
      return res
        .status(400)
        .json({ success: false, message: "Missing gameId or uid." });
    }
    const isCreated = await GamesController.joinGame(uid, gameId);
    if (isCreated) {
      res.json({ success: true });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Failed to join the game." });
    }
  } catch (error) {
    console.error("Error starting game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/playerview/:id", async function (req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const leaderboard = await GamesController.leaderboardInfo(id);
    console.log("in the server: ", leaderboard);
    res.json(leaderboard);
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const PORT = process.env.PORT || 9999;

app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
