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
    },

    deleteById: (id) => {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM words WHERE id = ?";
            db.run(query, id, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(null);
            })
        })
    },

    findById: (id) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM words WHERE id = ?";
            db.get(query, id, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(results);
            })
        })
    },

    update: (id, updates) => {
        return new Promise((resolve, reject) => {
            const updateEng = "UPDATE words SET english = ? WHERE id = ?";
            const updateFin = "UPDATE words SET finnish = ? WHERE id = ?";
            const updateBoth = "UPDATE words SET english = ?, finnish = ? WHERE id = ?";

            if (updates.english === "") {
                //Updating only finnish
                db.run(updateFin, [updates.finnish, id], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(updates);
                })

            } else if (updates.finnish === "") {
                // Updating only english
                db.run(updateEng, [updates.english, id], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(updates);
                })

            } else {
                // Updating both
                db.run(updateBoth, [updates.english, updates.finnish, id], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(updates);
                })
            }
        })
    }
}

module.exports = databaseFunctions;