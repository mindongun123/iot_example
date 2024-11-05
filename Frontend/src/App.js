import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar';

//styles
import './App.css';

// components
import Dasboard from './components/body/dasboard';
import History from './components/body/history';
import DataSensor from './components/body/datasensor';
import Profile from './components/body/profile';
import Test from './components/body/test';

const App = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.classList.remove("alert-background");
  }, [location]);

  return (
    <>
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
    </>
  );
};

const MainApp = () => (
  <Router>
    <App />
  </Router>
);

export default MainApp;
