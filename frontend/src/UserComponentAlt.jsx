import { useState, useEffect } from 'react';
import { Routes, Route, useParams, Link } from 'react-router-dom';
import axios from 'axios';

function UserComponentAlt() {
    // Array for the word pairs fetched from backend.
    let [words, setWords] = useState([]);
    // Array for the answers input by the user.
    let [answers, setAnswers] = useState([]);
    // State to keep track of the user's score.
    let [score, setScore] = useState(null);
    const apiUrl = `/api/words`;

    // Invokes fetchWords function when the page is loaded.
    useEffect(() => {
        /**
         * Fetches word pairs from the database and
         * sets them into the 'words' state.
         */
        const fetchWords = async () => {
            const hr = await axios.get(apiUrl);
            let data = hr.data;
            setWords(data);
        }

        fetchWords();
    }, []);

    /**
 * Handles changes made into the input fields for answer by the user.
 *
 *
 * @param {number} id The id of the word the user is giving the answer to.
 *                    Set as the key for the key value pair.
 * @param {String} ans The answer given by the user. From the event object
 *                     of the  on change event of the input field. Set as the
 *                     value in the key value pair.
 */
    const handleUserAnsChange = (id, ans) => {
        setAnswers((prevAnswers) => ({ ...prevAnswers, [id]: ans }));
    }

    /**
     * Handles checking the answer and counting the score when
     * user clicks the submit button.
     * Compares the correct finnish translation from the database
     * with the user's input. Ignores case.
     * Calls the setState for the score and updates it when the answer is correct.
     */
    const handleSubmit = () => {
        let scoreCount = 0;
        // Get keys from the answers object
        let ansKeys = Object.keys(answers);
        // Parsing the numbers in the key array.
        let parsedKeys = ansKeys.map(key => parseInt(key, answers.length));

        for (let i = 0; i < words.length; i++) {
            // Checking that the answer is not empty, and if it matches with the answer from the database.
            if (answers[parsedKeys[i]] !== undefined && words.find(answer => answer.id === parsedKeys[i]).english.toLowerCase() === answers[parsedKeys[i]].toLowerCase()) {
                scoreCount++;
            }
            setScore(scoreCount);
        }
    }

    // Mapping the array for the table element incliding the anser input fields.
    let arr = words.map((word) => (
        <tr key={word.id}>
            <td>{word.finnish}</td><td><input type='text' onChange={(e) => handleUserAnsChange(word.id, e.target.value)}></input></td>
        </tr>
    ))

    return(
        <div id="userView">
            <div>
                <p>To translate from English instead of Finnish click the button below:</p>
                <Link to="/" className='edit-link'>Translate from English</Link>
            </div>
            <div className='instructions'>
                <h1>Instructions</h1>
                <p>Answer into the fields provided in
                    the "English" column. Answer with
                    the English translation of the word provided
                    in Finnish in the "Finnish" column. Once you're done,
                    click the "Submit" button and you will get your score.
                </p>
                <p>You can leave fields empty.</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Finnish</th>
                        <th>English</th>
                    </tr>
                </thead>
                <tbody>
                    {arr}
                </tbody>
            </table>
            <button type='button' onClick={handleSubmit}>Submit</button>
            <div>
                {score != null && (
                    <p>
                        Your score: {score}/{words.length}
                    </p>
                )}
            </div>
        </div>
    )
}

export default UserComponentAlt;