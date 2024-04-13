import React, { useState, useEffect } from "react";
import "./Settings.css";

// Function to format text by adding space before capital letters and capitalizing the first letter
const formatText = (text) => {
  const spacedText = text.replace(/([A-Z])/g, " $1");
  return spacedText.charAt(0).toUpperCase() + spacedText.slice(1);
};

// Options for scale selection
const scaleOptions = [
  { value: "normal", label: "Normal Scale" },
  { value: "thousands", label: "Thousands Scale" },
  { value: "millions", label: "Millions Scale" },
  { value: "billions", label: "Billions Scale" },
];

// Options for quarterly vs annual report selection
const showOptions = [
  { value: "true", label: "Show Quarterly Report" },
  { value: "false", label: "Show Annual Report" },
];

// Default settings for the component
const defaultSettings = {
  selectedOptions: {
    netIncome: true,
    totalRevenue: true,
    totalShareholderEquity: true,
  },
  scaleOption: "normal",
  showQuarterly: true,
};

const Settings = ({
  incomeStatementKeys,
  balanceSheetKeys,
  selectedOptions: initialSelectedOptions,
  scaleOption: initialScaleOption,
  showQuarterly: initialShowQuarterly,
  handleSubmit,
  handleClose,
  showModal,
}) => {
  const [selectedOptions, setSelectedOptions] = useState(
    initialSelectedOptions
  );
  const [scaleOption, setScaleOption] = useState(initialScaleOption);
  const [showQuarterly, setShowQuarterly] = useState(initialShowQuarterly);

  // Reset state when initial props change
  useEffect(() => {
    setSelectedOptions(initialSelectedOptions);
    setScaleOption(initialScaleOption);
    setShowQuarterly(initialShowQuarterly);
  }, [initialSelectedOptions, initialScaleOption, initialShowQuarterly]);

  // Handler for checkbox changes in option groups
  const handleOptionChange = (event) => {
    const { name, checked } = event.target;
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [name]: checked,
    }));
  };

  // Handler for radio button changes in scale options
  const handleScaleOptionChange = (event) => {
    setScaleOption(event.target.value);
  };

  // Handler for radio button changes in quarterly vs annual selection
  const handleShowQuarterlyChange = (event) => {
    setShowQuarterly(event.target.value === "true");
  };

  // Handler for submitting settings
  const handleLocalSubmit = () => {
    handleSubmit(scaleOption, showQuarterly, selectedOptions);
    handleClose();
  };

  // Handler for resetting settings to default
  const handleReset = () => {
    setSelectedOptions(defaultSettings.selectedOptions);
    setScaleOption(defaultSettings.scaleOption);
    setShowQuarterly(defaultSettings.showQuarterly);
    handleSubmit(
      defaultSettings.scaleOption,
      defaultSettings.showQuarterly,
      defaultSettings.selectedOptions
    );
    handleClose();
  };

  return (
    <div className="modal" style={{ display: showModal ? "block" : "none" }}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <h2>Settings</h2>

        <div className="options-container">
          <div className="option-group">
            <h3>Income Statement Options</h3>
            {incomeStatementKeys.map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  name={key}
                  checked={selectedOptions[key]}
                  onChange={handleOptionChange}
                />
                {formatText(key)}
              </label>
            ))}
          </div>

          <div className="option-group">
            <h3>Balance Sheet Options</h3>
            {balanceSheetKeys.map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  name={key}
                  checked={selectedOptions[key]}
                  onChange={handleOptionChange}
                />
                {formatText(key)}
              </label>
            ))}
          </div>

          <div className="option-group">
            <h3>Scale Options</h3>
            {scaleOptions.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  value={option.value}
                  checked={scaleOption === option.value}
                  onChange={handleScaleOptionChange}
                />
                {option.label}
              </label>
            ))}
          </div>

          <div className="option-group">
            <h3>Quarterly vs Annual</h3>
            {showOptions.map((option) => (
              <label key={option.value}>
                <input
                  type="radio"
                  value={option.value}
                  checked={showQuarterly === (option.value === "true")}
                  onChange={handleShowQuarterlyChange}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="button-group">
          <button className="submit-button" onClick={handleLocalSubmit}>
            {" "}
            Save settings{" "}
          </button>
          <button className="reset-button" onClick={handleReset}>
            {" "}
            Reset to Default{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
