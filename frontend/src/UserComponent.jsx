import { useEffect, useState } from 'react';
import axios from 'axios';

function UserComponent() {
    let [words, setWords] = useState([]);
    const apiUrl = `/api/words`;

    useEffect(() => {
        const fetchIt = async () => {
            const hr = await axios.get(apiUrl);
            let data = hr.data;
            setWords(data);
        }

        fetchIt();
    }, []);

    //TODO:
    //Implement handling changes for the answers in inputs.
    const handleChange = () => {}

    //TODO:
    //Implement handling for the event for pressing submit.
    const handleSubmit = () => {}

    let arr = words.map((word) => (
        <tr key={word.id}>
            <td>{word.english}</td><td><input type='text' onChange={handleChange}></input></td>
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
    </div>
    )
}

export default UserComponent;