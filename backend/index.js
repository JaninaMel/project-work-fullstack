const express = require('express');
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const wordRouter = require("./routes/routing.js");

// Serves static files from "public"
app.use(express.static(path.join(__dirname, "public")));
// Parses JSON requests
app.use(express.json());
// Routes requests under "api/words"
app.use("/api/words", wordRouter);

/**
 * Starts the server and listens to the given port.
 */
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
