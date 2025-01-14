import { useState, useEffect } from 'react';
import { Routes, Route, useParams, Link } from 'react-router-dom';
import axios from 'axios';

/**
 * The edit component allows users to edit word pairs
 * already submitted to the database.
 *
 * Includes input fields for finnish and english versions of the word,
 * and has a save button that saves the changes made to the word pair by the
 * user.
 *
 * @returns {JSX.Element} Edit component that allows users to edit word pairs.
 */
function EditComponent() {
    let [wordPair, setPair] = useState(null);
    // ID from the current route.
    let { wordId } = useParams();
    const apiUrl = `/api/words`;

    // Upon loading the page invokes getWordPair function.
   useEffect(() => {
        /**
         * Fetches the specific word pair according to the ID
         * from the current route.
         */
        const getWordPair = async () => {
            let hr = await axios.get(`${apiUrl}/${wordId}`);
            let data = hr.data;
            setPair(data);
        }
        getWordPair();
    }, [])

    // Checking if the word pair has been fetched and set into the stare.
    // If the wordPair has not yet been fetched, function returns div element
    // with "Loading" text.
    if(!wordPair) {
        return <div><h1>Loading</h1></div>;
    }

    /**
     * Handles input changes made to the corresponding input field.
     * Calls setState (setPair) to update the "english"
     * key value pair in the wordPair object.
     *
     * @param {Event} e the Event object for the on change event for the input
     *                  field. Used to access the input fields value to update
     *                  the word pair's setState function.
     */
    const handlePromptChange = (e) => {
            setPair({...wordPair, english: e.target.value});
     }

    /**
     * Handles input changes made to the corresponding input field.
     * Calls setState (setPair) to update the "finnish"
     * key value pair in the wordPair object.
     *
     * @param {Event} e the Event object for the on change event for the input
     *                  field. Used to access the input fields value to update
     *                  the word pair's setState function.
     */
    const handleAnsChange = (e) => {
            setPair({ ...wordPair, finnish: e.target.value });
    }

    /**
     * Handles sending patch requests to backend to save changes
     * to the word pair made by the user. Alerts user if no changes
     * were detected.
     */
      const handleSave = () => {
        const saveWordPair = async () => {
            if (wordPair.english === "" && wordPair.finnish === "") {
                alert("Both fields empty, no changes made!");
            } else {
                await axios.patch(`${apiUrl}/${wordId}`, wordPair);
                alert("Your changes have been saved successfully!");
            }
        }
        saveWordPair();
    }

    return(
        <div>
            <div className='instructions'>
                <h1>Instructions</h1>
                <p>Input you changes into the given fields
                    and click "Save changes" to save the changes you made.
                    You can change both or only the English or Finnish version
                    of the word. Leaving a field empty will result in no changes
                    in that field.
                </p>
            </div>
            <h1>Edit word pair:</h1>
            <div className='input-fields'>
                <div>
                    <h2>English:</h2>
                    <input id="promptInput" type='text' value={wordPair.english} onChange={handlePromptChange}></input>
                </div>
                <div>
                    <h2>Finnish:</h2>
                    <input id="ansInput" type='text' value={wordPair.finnish} onChange={handleAnsChange}></input>
                </div>
            </div>
            <button onClick={handleSave}>Save changes</button>
        </div>
    )
}

export default EditComponent;