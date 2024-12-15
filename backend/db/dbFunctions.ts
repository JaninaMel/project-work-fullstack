const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
        console.error("Error connecting to database");
    } else {
        console.log("Connected to database");
    }
})

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, english VARCHAR, finnish VARCHAR);");
    db.run("INSERT INTO words (english, finnish) VALUES (?, ?)", ["Dog", "Koira"]);
    db.run("INSERT INTO words (english, finnish) VALUES (?, ?)", ["Cat", "Kissa"]);
    db.run("INSERT INTO words (english, finnish) VALUES (?, ?)", ["Donkey", "Aasi"]);
    db.all("SELECT * FROM words", [], (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
    })
})

const databaseFunctions = {
    findAll: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECt * FROM words", (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            })
        })
    },

    addNew: (wordPair) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO words (english, finnish) VALUES (?,?)";
            db.run(query, [wordPair.english, wordPair.finnish], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                const word = {
                    english: wordPair.english,
                    finnish: wordPair.finnish
                }
                resolve(wordPair);
            })
        })
    }
}

module.exports = databaseFunctions;