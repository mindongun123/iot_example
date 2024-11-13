import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar';

//styles
import './App.css';

// components
import Dasboard from './components/body/dasboard';
import History from './components/body/history';
import DataSensor from './components/body/datasensor';
import Profile from './components/body/profile';
import Test from './components/body/test';

function App() {
  return (
    <Router>
      <Sidebar />
      <div className='content'>
        <Routes>
          <Route path="/datasensor" element={<DataSensor />} />
          <Route path="/history" element={<History />} />
          <Route path="/test" element={<Test />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Dasboard />} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;
