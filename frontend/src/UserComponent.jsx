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

    let arr = words.map((word) => (
        <tr key={word.id}>
            <td>{word.english}</td><td><input type='text' onChange={handleChange()}></input></td>
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
    </div>
    )
}

export default UserComponent;