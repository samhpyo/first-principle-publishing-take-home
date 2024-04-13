import React from 'react';
import FinancialData from './components/FinancialData';

function App() {
  return (
    <div className="App" style={{ margin: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Stock Financial Data</h1> 
      <div style={{ margin: '20px' }}> 
        <FinancialData symbol="IBM" />
      </div>
    </div>
  );
}

export default App;