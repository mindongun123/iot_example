import '../help/togglebutton.css';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { useEffect } from 'react';

function ToggleButton({ img, bg, effect, normal, lightId, action }) {
  const [isOn, setIsOn] = useState(action === 'ON');

  useEffect(() => {
    setIsOn(action === 'ON');
  }, [action]);

  console.log('ac', action);
  console.log('isOn', isOn);

  const handleToggle = async () => {
    const newStatus = !isOn;
    console.log('newStatus', newStatus);
    const msg = newStatus ? 'ON' : 'OFF';
    console.log('msg', msg);
    setIsOn(newStatus); // Cập nhật trạng thái mới

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device: lightId, action: msg })
    };

    try {
      const response = await fetch('http://localhost:3800/action/', requestOptions);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}. Response: ${errorText}`);
      }
    } catch (error) {
      console.error('Error toggling light:', error.message);
    }
  };

  return (
    <div className="toggle-button row-switch-controller" style={{ background: bg }}>
      <div className={`img-container ${isOn ? effect : normal}`}>
        {img}
      </div>
      <Form.Check
        type="switch"
        id="custom-switch"
        checked={isOn}
        onChange={handleToggle}
      />
    </div>
  );
}

export default ToggleButton;
