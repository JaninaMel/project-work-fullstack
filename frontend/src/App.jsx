import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import UserComponent from './UserComponent';
import AdminComponent from './AdminComponent';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <>
      <nav className="navi">
        <ul>
          <li className='nav-item'>
            <Link to="/">Main Page</Link>
          </li>
          <li className='last-nav-item'>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      </>
      <Routes>
        <Route path='/' element={<UserComponent />}></Route>
        <Route path='admin/' element={<AdminComponent />}></Route>
      </Routes>
    </BrowserRouter >
  )
}

export default App
