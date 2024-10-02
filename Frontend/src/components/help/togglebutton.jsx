import '../help/togglebutton.css';

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';




function ToggleButton({ img , bg, effect, normal }) {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="toggle-button row-switch-controller" style={{background: bg}}>
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

