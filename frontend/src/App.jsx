import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import UserComponent from './UserComponent';
import AdminComponent from './AdminComponent';
import EditComponent from './EditComponent';
import './App.css';

function App() {
  return (
    <BrowserRouter>
    <>
      <nav className="navi">
        <ul>
          <li className='nav-item'>
            <Link to="/">Learn!</Link>
          </li>
          <li className='last-nav-item'>
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </nav>
      </>
      <Routes>
        <Route path='/' element={<UserComponent />}></Route>
        <Route path='admin/' element={<AdminComponent />}></Route>
        <Route path='edit/:wordId' element={<EditComponent />}></Route>
      </Routes>
    </BrowserRouter >
  )
}

export default App
