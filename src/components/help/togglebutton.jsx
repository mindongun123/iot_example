import '../help/togglebutton.css';

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { BoxImage } from './box';

const ToggleButton = () => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  return (
    <div className="d-flex row-switch-controller m-2">
      <BoxImage index={1} params={22} />
      <Form className="toggle-button ">
        <Form.Check
          type="switch"
          id="custom-switch"
          checked={isOn}
          onChange={handleToggle}
        />
      </Form>
    </div>
  );
};

export default ToggleButton;
