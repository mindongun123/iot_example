import '../help/togglebutton.css';

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { BoxImage } from './box';




function ToggleButton({ img , bg}) {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="toggle-button row-switch-controller" style={{background: bg}}>
      <div className={isOn ? 'img-container on' : 'img-container off'}>
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

