import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MenuLeft from './components/header/MenuLeft';

//styles
import './App.css'

// components
import Dasboard from './components/body/dasboard';
import History from './components/body/history';
import DataSensor from './components/body/datasensor';
import Profile from './components/body/profile';


function App() {
  return (
    <Router>
      <MenuLeft />
      <div className='content'>
        <Routes>
          <Route path="/datasensor" element={<DataSensor />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Dasboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
