const sqlite3 = require('sqlite3').verbose();
const Joi = require("joi");

/**
 * Sqlite in-memory databse created upon running the app.
 */
const db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
        console.error("Error connecting to database");
    } else {
        console.log("Connected to database");
    }
});

/*
Initializing the database with a table and some example data.
*/
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
    });
});

/*
Schema for validating the received objects.
Checks that values are string, are within a certain range and
have been issued a value to begin with.
*/
const schema = Joi.object({
    english: Joi.string().min(1).max(255).required(),
    finnish: Joi.string().min(1).max(255).required(),
});

/*
Schema for validating the received objects from patch
requests.
Checks that values are string and within a certain range.
Allows values to be empty.
Checks that 'id' is number.
*/
const schemaUpdate = Joi.object({
    id: Joi.number(),
    english: Joi.string().min(1).max(255).allow(''),
    finnish: Joi.string().min(1).max(255).allow(''),
});

/**
 * Object that contains all of the database functions.
 */
const databaseFunctions = {
    /**
     * Fetches all word pairs from the database.
     *
     * @returns {Promise<Object[]>} Resolves with an array of word pairs from the database.
     */
    findAll: () => {
        return new Promise((resolve, reject) => {
            // Query to select all from words table.
            db.all("SELECt * FROM words", (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            })
        })
    },
    /**
     * Adds a new word pair into the database.
     *
     * @param {Object} wordPair object containing 'english' and 'finnish' key value pairs.
     * @returns {Promise<Object>} Resolves with the wordPair parameter.
     */
    addNew: (wordPair) => {
        return new Promise((resolve, reject) => {
            // Validating the object received from frontend.
            const { error } = schema.validate(wordPair);
            if (error) {
                reject(error);
                return;
            }
            // Query to insert new row into words table
            const query = "INSERT INTO words (english, finnish) VALUES (?,?)";
            db.run(query, [wordPair.english, wordPair.finnish], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(wordPair);
            })
        })
    },

    /**
     * Deletes a word pair with the given ID from the database.
     *
     * @param {number} id ID of the word pair to be deleted.
     * @returns {Promise<null>} Resolves after successful deletion.
     */
    deleteById: (id) => {
        return new Promise((resolve, reject) => {
            const errObj = { status: 404, error: null };
            const idQuery = "SELECT * FROM words WHERE id = ?";
            // Query to check if the row with the given ID exists.
            db.get(idQuery, id, (err, results) => {
                if (err) {
                    errObj.error = err;
                    errObj.status = 500;
                    reject(err);
                    return;
                }

                if (results == null) {
                    errObj.error = new Error("ID not found in database.");
                    reject(errObj);
                    return;
                }
            });
            // Query to delete a row from words table
            const query = "DELETE FROM words WHERE id = ?";
            db.run(query, id, (err) => {
                if (err) {
                    errObj.error = err;
                    errObj.status = 500;
                    reject(errObj);
                    return;
                }

                resolve(null);
            })
        })
    },

    /**
     * Fetches a word pair from the database with the given ID.
     *
     * @param {number} id ID of the word pair to be fetched.
     * @returns {Promise<Object>} Resolves with fetched word pair.
     */
    findById: (id) => {
        return new Promise((resolve, reject) => {
            // Query to select a specific row from words table
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

    /**
     * Updates a specific word pair in the database with the given ID.
     *
     * @param {number} id ID of the word pair to be updated.
     * @param {Object} updates Object with the updates for the word pair.
     * @returns {Promise<Object>} Resolves with the updated word pair.
     */
    update: (id, updates) => {
        return new Promise((resolve, reject) => {
            const errObj = { status: 400, error: null };
            // Validating the object received from the frontend.
            const { error } = schemaUpdate.validate(updates);
            if (error) {
                errObj.error = error;
                reject(errObj);
                return;
            }
            //Setting error object status to 404 after validation.
            errObj.status = 404;
            const updateEng = "UPDATE words SET english = ? WHERE id = ?";
            const updateFin = "UPDATE words SET finnish = ? WHERE id = ?";
            const updateBoth = "UPDATE words SET english = ?, finnish = ? WHERE id = ?";
            const query = "SELECT * FROM words WHERE id = ?";
            // Checking if the word pair with the given ID exists in the database.
            db.get(query, id, (err, results) => {
                if (err) {
                    errObj.error = err;
                    errObj.status = 500;
                    reject(errObj);
                    return;
                }

                if (results == null) {
                    errObj.error = new Error("ID not found in database.");
                    reject(errObj);
                    return;
                }
            });

            if (updates.english === "" || updates.english === null) {
                // Query to update the finnish column in a specific row.
                db.run(updateFin, [updates.finnish, id], (err) => {
                    if (err) {
                        errObj.error = err;
                        errObj.status = 500;
                        reject(errObj);
                        return;
                    }
                    resolve(updates);
                });
            } else if (updates.finnish === "" || updates.finnish === null) {
                // Query to update the english column in a specific row.
                db.run(updateEng, [updates.english, id], (err) => {
                    if (err) {
                        errObj.error = err;
                        errObj.status = 500;
                        reject(errObj);
                        return;
                    }
                    resolve(updates);
                });
            } else {
                // Query to update both finnish and english columns in a specidic row.
                db.run(updateBoth, [updates.english, updates.finnish, id], (err) => {
                    if (err) {
                        errObj.error = err;
                        errObj.status = 500;
                        reject(errObj);
                        return;
                    }
                    resolve(updates);
                });
            }
        });
    }
}

module.exports = databaseFunctions;