import { useEffect, useState } from 'react'
import './App.css'

function App() {
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
    <li key={location.id}>
      {location.latitude} - {location.longitude}
    </li>
  ))
  return (
    <>
      <ul>{arr}</ul>
    </>
  )
}

export default App
