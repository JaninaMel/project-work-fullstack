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
    <tr key={location.id}>
      <th>{location.latitude}</th><th>{location.longitude}</th>
    </tr>
  ))
  return (
    <>
    <table>
      <tr>
        <th>English</th>
        <th>Finnish</th>
      </tr>
      {arr}
    </table>
    </>
  )
}

export default App
