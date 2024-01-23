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
import { Protected, ProtectedPage } from './pages/Protected';
import { DashboardRoutes } from './Routes';

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
              <Protected>
                <Sidebar />
                <div className="content">
                  <Outlet />
                </div>
              </Protected>
            }
          >
            <Route index={true} element={<Dashboard />} />
            {
              DashboardRoutes.map((route, index) => {
                return <Route key={index} path={route.path} element={
                 <ProtectedPage children={route.element} pageId={"/"+route.path} /> 
                 } />
              }
              )
            }
          </Route>

          <Route path="/document" element={<div>Document</div>} />
          <Route path="/gnai" element={<div>GNAi</div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
