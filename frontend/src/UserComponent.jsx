import { useEffect, useState } from 'react';

function UserComponent() {
    let [locations, setLocations] = useState([]);
    const apiUrl = `/api/locations`;

    useEffect(() => {
        const fetchIt = async () => {
            const hr = await fetch(apiUrl);
            const data = await hr.json();
            setLocations(data);
        }

        fetchIt();
    }, []);

    let arr = locations.map((location) => (
        <tr key={location.id}>
            <td>{location.latitude}</td><td>{location.longitude}</td>
        </tr>
    ))
    return (
        <div>
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