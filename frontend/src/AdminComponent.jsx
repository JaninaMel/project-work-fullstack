import { useEffect, useState } from 'react';

function AdminComponent() {
    let [locations, setLocations] = useState([]);
    let [prompt, setPromt] = useState("");
    let [ans, setAns] = useState("");
    const apiUrl = `/api/locations`;

    useEffect(() => {
        const fetchIt = async () => {
            const hr = await fetch(apiUrl);
            const data = await hr.json();
            setLocations(data);
        }

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

    const handleSave = () => {}

    let arr = locations.map((location) => (
        <div key={location.id} className='word-pair'>
            <li>{location.latitude} - {location.longitude}</li>
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