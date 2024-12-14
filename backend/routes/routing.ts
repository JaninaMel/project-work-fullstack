const db = require("../db/dbFunctions.ts");
const express = require('express');
const wordRouter = express.Router();

wordRouter.get("/", async (req, res) => {
    try {
        const words = await db.findAll();
        res.status(200).json(words);
    } catch (error) {
        console.error(error);
        res.status(404).send("Could not find anything.");
    }
})

module.exports = wordRouter;