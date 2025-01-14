const db = require("../db/dbFunctions.js");
const express = require('express');
const wordRouter = express.Router();

/**
 * Fetches all word pairs from the database.
 *
 * @name GET /
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @returns {void} Responds with the word pairs array or gives an error.
 */
wordRouter.get("/", async (req, res) => {
    try {
        const words = await db.findAll();
        res.status(200).json(words);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Nothing found in the database." });
    }
})

/**
 * Inserts new word pairs into the database.
 *
 * @name POST /
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @returns {void} Responds with the new word pair or gives an error.
 */
wordRouter.post("/", async (req, res) => {
    try {
        const wordPair = await db.addNew(req.body);
        res.status(201).json(wordPair);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Invalid data format." });
    }
})

/**
 * Deletes a word pair from the database based on given ID.
 *
 * @name DELETE /:wordId
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @returns {void} Gives a success response or an error.
 */
wordRouter.delete("/:wordId", async (req, res) => {
    const id = parseInt(req.params.wordId);

    // Checks if the id is a number.
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID." });
    }

    try {
        await db.deleteById(id);
        res.status(204).json({ msg: "Deleted successfully." });
    } catch ({ status, error }) {
        console.error(error);

        if (status == 404) {
            return res.status(404).json({ error: `Word pair with ${id} not found.` });
        }
        res.status(500).json({ error: `Internal server error.` });
    }
})


/**
 * Fetches a word pair from the database based on given ID.
 *
 * @name GET /:wordId
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @returns {void} Responds with the word pair or gives an error.
 */
wordRouter.get("/:wordId", async (req, res) => {
    const id = parseInt(req.params.wordId);

    // Checks if the id is a number.
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID." });
    }

    try {
        const wordPair = await db.findById(id);

        // Checks if the word pair exists
        if (!wordPair) {
            return res.status(404).json({ error: `Word pair with ${id} not found.` });
        }

        res.status(200).json(wordPair);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
})

/**
 * Updates a word pair in the database based on given ID.
 *
 * @name PATCH /:wordId
 * @param {express.Request} req request object
 * @param {express.Response} res response object
 * @returns {void} Responds with updated word pair ir gives an error.
 */
wordRouter.patch("/:wordId", async (req, res) => {
    const id = parseInt(req.params.wordId);

    // Checks if the id is a number.
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID." });
    }

    try {
        const wordPair = await db.update(id, req.body);
        res.status(200).json(wordPair);
    } catch ({ status, error }) {
        console.error(error);
        if (status == 404) {
            return res.status(404).json({ error: `Word pair with ${id} not found.` });
        } else if (status == 500) {
            return res.status(500).json({ error: `Internal server error.` });
        }

        res.status(400).json({ error: "Invalid data format." });
    }
})

module.exports = wordRouter;