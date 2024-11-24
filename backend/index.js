const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
        console.error("Error connecting to database");
    } else {
        console.log("Connected to database");
    }
})

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, latitude INTEGER, longitude INTEGER);");
    db.run("INSERT INTO locations (latitude, longitude) VALUES (?, ?)", [60, 60]);
    db.run("INSERT INTO locations (latitude, longitude) VALUES (?, ?)", [40, 90]);
    db.all("SELECT * FROM locations", [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
    })
})

app.get("/api/locations", (req, res) => {
    db.all("SELECT * FROM locations", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    })
})

process.on("SIGINT", () => {
    db.close(() => {
        console.log("Database disconnected.");
        process.exit(0);
    });
})
//db.close();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
