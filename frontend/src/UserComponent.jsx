import { useEffect, useState } from 'react';
import axios from 'axios';

function UserComponent() {
    // Array for the word pairs fetched from backend.
    let [words, setWords] = useState([]);
    // Array for the answers input by the user.
    let [answers, setAnswers] = useState([]);
    // State to keep track of the user's score.
    let [score, setScore] = useState(null);
    const apiUrl = `/api/words`;

    useEffect(() => {
        const fetchIt = async () => {
            const hr = await axios.get(apiUrl);
            let data = hr.data;
            setWords(data);
        }

        fetchIt();
    }, []);

    // Handles changes made into the input fields by the user.
    const handleUserAnsChange = (id, ans) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers, [id]: ans
        }))
    }

    // Handles clicking the submit button.
    // User gets a score based on how many they got correct.
    const handleSubmit = () => {
        let scoreCount = 0;
        if (answers === undefined || answers.length == 0) {
            return;
        }
        for (let i = 0; i < words.length; i++) {
            if (answers[i+1] !== undefined && words[i].finnish.toLowerCase() === answers[i+1].toLowerCase()) {
                scoreCount++;
            }
            setScore(scoreCount);
        }
    }

    let arr = words.map((word) => (
        <tr key={word.id}>
            <td>{word.english}</td><td><input type='text' onChange={(e) => handleUserAnsChange(word.id, e.target.value)}></input></td>
        </tr>
    ))
    return (
        <div id="userView">
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