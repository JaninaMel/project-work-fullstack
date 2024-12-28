import { useEffect, useState } from 'react';
import axios from 'axios';

// TODO: add deleting word pairs and editing word pairs.

function AdminComponent() {
    let [words, setWords] = useState([]);
    let [prompt, setPromt] = useState("");
    let [ans, setAns] = useState("");
    const apiUrl = `/api/words`;

    const fetchIt = async () => {
        const hr = await axios.get(apiUrl);
        let data = hr.data;
        setWords(data);
    }

    useEffect(() => {
        fetchIt();
    }, []);

    const handlePromptChange = () => {
        const input = document.getElementById("promptInput");
        const inputValue = input.value;
        setPromt(inputValue);
    }

    const handleAnsChange = () => {
        const input = document.getElementById("ansInput");
        const inputValue = input.value;
        setAns(inputValue);
    }

    const handleSave = () => {
        const word = {
            english: prompt,
            finnish: ans
        }
        const saveWord = async () => {
            await axios.post(apiUrl, word);
            fetchIt();
        }
        saveWord();
    }

    let arr = words.map((word) => (
        <div key={word.id} className='word-pair'>
            <li>{word.english} - {word.finnish}</li>
        </div>
    ))
    return (
        <div className='admin-view'>
        <div className='word-adder'>
            <h2>Add new word:</h2>
            <div className='input-fields'>
                <div>
            <h3>English:</h3>
            <input id="promptInput" type='text' onChange={handlePromptChange}></input>
            </div><div>
            <h3>Finnish:</h3>
            <input id="ansInput" type='text' onChange={handleAnsChange}></input>
                    </div>
                </div>
            <button onClick={handleSave}>Save</button>
        </div>
        <h2>Current word pairs:</h2>
        <ul>
            {arr}
        </ul>
        </div>
    )
}

export default AdminComponent;