import '../help/togglebutton.css';
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

function ToggleButton({ img, bg, effect, normal, lightId, action }) {
  const [isOn, setIsOn] = useState(action === 'ON');
  const [isLoading, setIsLoading] = useState(false); // Trạng thái chờ phản hồi từ backend

  useEffect(() => {
    setIsOn(action === 'ON');
  }, [action]);

  const handleToggle = async () => {
    if (isLoading) return;  
    const newStatus = !isOn;
    const msg = newStatus ? 'ON' : 'OFF';

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3800/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ device: lightId, action: msg })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}. Response: ${errorText}`);
      }

      setIsOn(newStatus);
    } catch (error) {
      console.error('Error toggling light:', error.message);
    } finally {
      setIsLoading(false); 
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
        disabled={isLoading}  
      />
    </div>
  );
}

export default ToggleButton;
