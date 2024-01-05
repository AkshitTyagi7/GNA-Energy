import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Dashboard from './pages/Dashboard/Analytics/Dashboard';
import AnalysisTable from './pages/Dashboard/Analytics/AttributeAnalysis/attributteAnalysis/AnalysisTable';
import RealTime from './pages/Dashboard/Analytics/RealTime/RealTime';

function App() {
  return (
    <div className="App">


      <BrowserRouter>
        <Sidebar />
        <div className='content'>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route  path="/dashboard">
              <Route index={true} element={<Dashboard />} />
              <Route path="marketMonioring" element={<div>Market Monioring</div>} />
              <Route path="discomAnalysis" element={<div>Discom Analysis</div>} />
              <Route path="exchangeAnalysis" element={<div>Exchange Analysis</div>} />
              <Route path="landingCostCircular" element={<div>Landing Cost Circular</div>} />
              <Route path="powerAtlas" element={<div>Power Atlas</div>} />
              <Route path="realTimeAnalysis" element={<RealTime />} />
              <Route path="attributeAnalysis" element={<AnalysisTable />} />
            </Route>
            <Route path="/document" element={<div>Document</div>} />
            <Route path="/gnai" element={<div>GNAi</div>} />

          </Routes>
        </div>
      </BrowserRouter>
    </div>

  );
}

export default App;
