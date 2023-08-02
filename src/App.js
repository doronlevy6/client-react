import React from 'react';
import { Route, Link, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import GradePage from './components/GradePage';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

const Sidebar = () => (
  <div className='sidebar'>
    <ul>
      <li>
        <Link to='/'>Login Page</Link>
      </li>
      <li>
        <Link to='/welcome'>Welcome Page</Link>
      </li>
      <li>
        <Link to='/grade'>Grade Page</Link>
      </li>
    </ul>
  </div>
);

const Content = () => (
  <div className='content'>
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/welcome' element={<WelcomePage />} />
      <Route path='/grade' element={<GradePage />} />
    </Routes>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className='app-layout'>
        <Sidebar />
        <Content />
      </div>
    </AuthProvider>
  );
}

export default App;
