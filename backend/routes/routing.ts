const db = require("../db/dbFunctions.ts");
const express = require('express');
const wordRouter = express.Router();

// Fetches all word pairs from database.
wordRouter.get("/", async (req, res) => {
    try {
        const words = await db.findAll();
        res.status(200).json(words);
    } catch (error) {
        console.error(error);
        res.status(404).send("Could not find anything.");
    }
})

//Inserts new word pairs into the database.
wordRouter.post("/", async (req, res) => {
    try {
        const wordPair = await db.addNew(req.body);
        res.status(201).json(wordPair);
    } catch (error) {
        res.status(400).json(error);
    }
})

module.exports = wordRouter;