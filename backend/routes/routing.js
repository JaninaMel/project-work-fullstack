const db = require("../db/dbFunctions.js");
const express = require('express');
const wordRouter = express.Router();

//TODO: Add error handling.

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

// Deletes word pairs from the database
wordRouter.delete("/:wordId", async (req, res) => {
    const id = parseInt(req.params.wordId);
    try {
        await db.deleteById(id);
        res.status(204).send("Deleted successfully.");
    } catch (error) {

    }
})

// Get word pair based on ID.
wordRouter.get("/:wordId", async (req, res) => {
    const id = parseInt(req.params.wordId);
    try {
        const wordPair = await db.findById(id);

        if (!wordPair) {
            return res.status(404).json({ error: "Nothing found with given ID." })
        }

        res.status(200).json(wordPair);
    } catch (error) {
        console.error(error);
    }
})

module.exports = wordRouter;