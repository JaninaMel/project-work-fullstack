import { useEffect, useState } from 'react';

function UserComponent() {
    let [words, setWords] = useState([]);
    const apiUrl = `/api/words`;

    useEffect(() => {
        const fetchIt = async () => {
            const hr = await fetch(apiUrl);
            const data = await hr.json();
            setWords(data);
        }

        fetchIt();
    }, []);

    let arr = words.map((word) => (
        <tr key={word.id}>
            <td>{word.english}</td><td>answer here</td>
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