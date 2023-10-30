import express from "express";
import GamesController from "../controllers/games.js";

const router = express.Router();

router.get("/", GamesController.getGames);

export default router;
