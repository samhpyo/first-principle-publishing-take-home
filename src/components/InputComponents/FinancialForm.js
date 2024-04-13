import React from "react";

const FinancialForm = ({ symbol, onSubmit, onChange, error, loading }) => (
  // Form component for inputting stock symbol
  <form onSubmit={onSubmit}>
    <label htmlFor="symbolInput">Enter Stock Symbol: </label>
    <input
      type="text"
      id="symbolInput"
      value={symbol}
      onChange={onChange}
      placeholder="e.g., AAPL, MSFT, GOOGL"
    />
    <button type="submit">Submit</button>
    {loading ? <div>Loading...</div> : null}
    {error ? <div>{error}</div> : null}
  </form>
);

export default FinancialForm;
