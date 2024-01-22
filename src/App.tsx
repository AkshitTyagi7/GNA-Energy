import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Dashboard from './pages/Dashboard/Analytics/Dashboard';
import AnalysisTable from './pages/Dashboard/Analytics/AttributeAnalysis/attributteAnalysis/AnalysisTable';
import { DemoPage } from './pages/DemoPage';
import { PowerAtlas } from './pages/Dashboard/Analytics/Atlas/Atlas';
import ReCharts from './pages/Recharts';
import { LoginPage } from './pages/Login/Login';
import './App.css';
import Exchange  from './pages/Dashboard/Analytics/Exchange/Exchange';
import { MarketMontoring } from './pages/Dashboard/MarketMonitoring/MarketMonitoring';
import { BankingAnalytics } from './pages/Dashboard/BankingAnalytics/BankingAalytics';
import { ConsumptionAnalytics } from './pages/Dashboard/Consumption/Consumption';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <>
                <Sidebar />
                <div className="content">
                  <Outlet />
                </div>
              </>
            }
          >
            <Route index={true} element={<Dashboard />} />
            <Route path="demoPage" element={<DemoPage />} />
            <Route path="marketMonioring" element={<MarketMontoring />} />
           <Route path="bankingAnalytics" element={<BankingAnalytics />} />
            <Route path="discomAnalysis" element={<AnalysisTable />} />
            <Route path="consumptionAndGenerationAnalytics" element={<ConsumptionAnalytics />} />
            <Route path="exchangeAnalysis" element={<Exchange />} />
            <Route path="powerAtlas" element={<PowerAtlas />} />
            <Route path="recharts" element={<ReCharts />} />
            <Route path="attributeAnalysis" element={<AnalysisTable />} />
          </Route>

          <Route path="/document" element={<div>Document</div>} />
          <Route path="/gnai" element={<div>GNAi</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
