import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminComponent() {
    let [words, setWords] = useState([]);
    let [prompt, setPrompt] = useState("");
    let [ans, setAns] = useState("");
    const apiUrl = `/api/words`;

    // Fetching word pair data from the backend.
    const fetchIt = async () => {
        const hr = await axios.get(apiUrl);
        let data = hr.data;
        setWords(data);
    }

    useEffect(() => {
        fetchIt();
    }, []);

    // Handles the changes made by the user to the "english" input field.
    const handlePromptChange = () => {
        const input = document.getElementById("promptInput");
        const inputValue = input.value;
        setPrompt(inputValue);
    }

    // Handles the changes made by the user to the "finnish" input field.
    const handleAnsChange = () => {
        const input = document.getElementById("ansInput");
        const inputValue = input.value;
        setAns(inputValue);
    }

    // Handles saving new word pairs.
    const handleSave = () => {
        if (prompt !== "" && ans !== "") {
            const word = {
                english: prompt,
                finnish: ans
            }
            const saveWord = async () => {
                await axios.post(apiUrl, word);
                fetchIt();
            }
            saveWord();
        } else {
            alert("Both fields must be filled to add a new word pair!");
        }
    }

    // Handles  deleting word pairs.
    const handleDelete = (e) => {
        const deleteWordPair = async () => {
            await axios.delete(`${apiUrl}/${e.target.id}`);
            fetchIt();
        }
        deleteWordPair();
    }

    // Mapping the array for listing all the arrays into the UI.
    let arr = words.map((word) => (
        <div key={word.id} className='word-pair-element'>
        <div className='word-pair'>
            <p>{word.english} - {word.finnish}</p>
        </div>
            <button onClick={handleDelete} id={word.id}>Delete</button>
            <Link to={`/edit/${word.id}`} className='edit-link'>Edit</Link>
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
        <div>
            {arr}
        </div>
        </div>
    )
}

export default AdminComponent;