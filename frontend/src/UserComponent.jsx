import { useEffect, useState } from 'react';
import { Routes, Route, useParams, Link } from 'react-router-dom';
import axios from 'axios';

// TODO: possibly add a list for the words users got wrong.

/**
 * A component for users to train the words in the database,
 * by providing finnish translations to the given english words.
 *
 * Includes and array with input fields where the user is able to
 * give their answer and a button to submit the user's answer which
 * then reveals them their score.
 *
 * @returns {JSX.Element} for users to train the word pairs and get their results.
 */
function UserComponent() {
    // Array for the word pairs fetched from backend.
    let [words, setWords] = useState([]);
    // Array for the answers input by the user.
    let [answers, setAnswers] = useState([]);
    // State to keep track of the user's score.
    let [score, setScore] = useState(null);
    const apiUrl = `/api/words`;

    // Invokes fetchWords function when the page is loaded.
    useEffect(() => {
        const fetchWords = async () => {
            const hr = await axios.get(apiUrl);
            let data = hr.data;
            setWords(data);
        }

        fetchWords();
    }, []);

    /*
    Asked AI about how this function should be called so I can have
    the ID and get the event target value. Also had issues with setting
    the state with the spread operator alone, so AI adviced to use prevState
    in the setState call.
    */
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
        setAnswers((prevAnswers) => ({...prevAnswers, [id]: ans}));
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
            if (answers[parsedKeys[i]] !== undefined && words.find(answer => answer.id === parsedKeys[i]).finnish.toLowerCase() === answers[parsedKeys[i]].toLowerCase()) {
                scoreCount++;
            }
            setScore(scoreCount);
        }
    }

    // Mapping the array for the table element incliding the anser input fields.
    let arr = words.map((word) => (
        <tr key={word.id}>
            <td>{word.english}</td><td><input type='text' onChange={(e) => handleUserAnsChange(word.id, e.target.value)}></input></td>
        </tr>
    ))

    return (
        <div id="userView">
            <div>
                <p>To translate from Finnish instead of English click the button below:</p>
                <Link to={`/alt`} className='edit-link'>Translate from Finnish</Link>
            </div>
            <div className='instructions'>
                <h1>Instructions</h1>
                <p>Answer into the fields provided in
                    the "Finnish" column. Answer with
                    the Finnish translation of the word provided
                    in English in the "English" column. Once you're done,
                    click the "Submit" button and you will get your score.
                </p>
                <p>You can leave fields empty.</p>
            </div>
    <table>
        <thead>
        <tr>
            <th>English</th>
            <th>Finnish</th>
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

export default UserComponent;