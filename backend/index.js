const express = require('express');
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const wordRouter = require("./routes/routing.js");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/api/words", wordRouter);

/*process.on("SIGINT", () => {
    db.close(() => {
        console.log("Database disconnected.");
        process.exit(0);
    });
})*/
//db.close();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
