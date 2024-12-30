import { useState, useEffect } from 'react';
import { Routes, Route, useParams, Link } from 'react-router-dom';
import axios from 'axios';

function EditComponent() {
    let [wordPair, setPair] = useState(null);
    let { wordId } = useParams();
    const apiUrl = `/api/words`;

   useEffect(() => {
        const getWordPair = async () => {
            let hr = await axios.get(`${apiUrl}/${wordId}`);
            let data = hr.data;
            setPair(data);
        }
        getWordPair();
    }, [])

    if(!wordPair) {
        return <div><h1>Loading</h1></div>;
    }

    const handlePromptChange = (e) => {
            setPair({...wordPair, english: e.target.value});
     }

    const handleAnsChange = (e) => {
            setPair({ ...wordPair, finnish: e.target.value });
    }

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
            <h1>Edit word pair:</h1>
            <div className='input-fields'>
                <div>
                    <h3>English:</h3>
                    <input id="promptInput" type='text' value={wordPair.english} onChange={handlePromptChange}></input>
                </div>
                <div>
                    <h3>Finnish:</h3>
                    <input id="ansInput" type='text' value={wordPair.finnish} onChange={handleAnsChange}></input>
                </div>
            </div>
            <button onClick={handleSave}>Save changes</button>

        </div>
    )
}

export default EditComponent;