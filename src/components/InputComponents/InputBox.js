import React from "react";
import "./styles.css";

onKeyDown={handleKeyDown}

const InputBox = ({ label, value, onChange, onKeyPress, placeholder }) => (
  // Component for rendering an input box with label
  <div>
    <label htmlFor="symbolInput">{label}</label>
    <input
      type="text"
      id="symbolInput"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  </div>
);

export default InputBox;
