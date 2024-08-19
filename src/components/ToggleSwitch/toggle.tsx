import React from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = ({ label, onChange, activeSwitch }) => {
  return (
    <div className="d-flex justify-content-end">
      <span className="toggleLabel">{label}</span>
      <div className="toggle-switch">
        <input type="checkbox" className="checkbox" name={label} id={label} onChange={onChange} checked={activeSwitch}/>
        <label className="label" htmlFor={label}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
