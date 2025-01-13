import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

/**
 * A component that allows for adding and deleting word pairs and allows the
 * user to access the edit page for word pairs as well.
 *
 * Includes input fields for adding finnish and english versions for a word and
 * a save button to save the new word pair. Also provides a delete button for deleting
 * word pairs and a link to the edit page where they can be then edited.
 *
 *
 * @returns {JSX.Element} Admin component for adding, deleting and accessing the editing for word pairs.
 */
function AdminComponent() {
    let [words, setWords] = useState([]);
    let [prompt, setPrompt] = useState("");
    let [ans, setAns] = useState("");
    const apiUrl = `/api/words`;

    /**
     * Fetches the word pairs from the backend.
     */
    const fetchWords = async () => {
        const hr = await axios.get(apiUrl);
        let data = hr.data;
        setWords(data);
    }

    // Upon loading the page, invokes fetchWords.
    useEffect(() => {
        fetchWords();
    }, []);

    /**
     * Handles input changes made in to the corresponding input field.
     * Sets the input field value into the propmt state.
     */
    const handlePromptChange =() => {
        const input = document.getElementById("promptInput");
        const inputValue = input.value;
        setPrompt(inputValue);
    }

    /**
     * Handles input changes made in to the corresponding input field.
     * Sets the input field value into the ans state.
     */
    const handleAnsChange = () => {
        const input = document.getElementById("ansInput");
        const inputValue = input.value;
        setAns(inputValue);
    }

    /**
     * Handles OnClick-event for the save button.
     * Sends new word pairs to the backend to be saved to
     * the database.
     */
    const handleSave = () => {
        if (prompt !== "" && ans !== "") {
            const word = {
                english: prompt,
                finnish: ans
            }
            const saveWord = async () => {
                await axios.post(apiUrl, word);
                fetchWords();
            }
            saveWord();
        } else {
            alert("Both fields must be filled to add a new word pair!");
        }
    }

    /**
     * Sends a delete request to the backend for a word pair to be
     * deleted from the database.
     * @param {Event} e the Event object for the on click event. Used
     *                  for getting the id for the word pair to be deleted.
     */
    const handleDelete = (e) => {
        const deleteWordPair = async () => {
            await axios.delete(`${apiUrl}/${e.target.id}`);
            fetchWords();
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
            <div className='instructions'>
                <h1>Instructions</h1>
                <p>- Add new word pairs by inputting the word and
                    its translation in the fields below, then click the save button
                    to save the word pair.
                    <br></br>
                    <br></br>
                    - Delete word pairs by clicking the delete button next to the word
                    pair you wish to delete. The word pair will be permanently deleted.
                    <br></br>
                    <br></br>
                    - Edit word pairs by clicking the edit button next to the word pair
                    you wish to edit. This will take you to different view where you
                    can edit the word pair.
                    </p>
            </div>
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