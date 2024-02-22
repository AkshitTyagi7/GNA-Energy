import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import { DemoPage } from './pages/DemoPage';
import { PowerAtlas } from './pages/Dashboard/Atlas/Atlas';
import ReCharts from './pages/Recharts';
import { LoginPage } from './pages/Login/Login';
import './App.css';
import { MarketMontoring } from './pages/Dashboard/MarketMonitoring/MarketMonitoring';
import { BankingAnalytics } from './pages/Dashboard/BankingAnalytics/BankingAalytics';
import { ConsumptionAnalytics } from './pages/Dashboard/Consumption/Consumption';
import { Protected, ProtectedPage } from './pages/Protected';
import { DashboardRoutes } from './Routes';
import { Gnai } from './pages/GNAi/Gnai';
import { useSelector } from 'react-redux';

function App() {
  const isMenuActive = useSelector((state: any) => state.menu.isActive);
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
                <div className="content" style={{
                      width:isMenuActive ? "calc(100% - 210px)" : "calc(100% - 100px)",
                      left:isMenuActive ? "210px" : "100px",
                      

                }}>
                  <Outlet />
                </div>
              </Protected>
            }
          >
            <Route index={true} element={<Dashboard />} />
            {
              DashboardRoutes.map((Proute, index) => {
                return <Route key={index} path={Proute.path} element={

                  Proute.notPrtoected ? Proute.element  :
                 <ProtectedPage children={Proute.element} pageId={"/"+Proute.path} /> 
                 } />
              }
              )
            }
          </Route>

          {/* <Route path="/document" element={<div>Document</div>} /> */}
          <Route path="/gnai" element={<div>
            <Sidebar />
         
            <ProtectedPage children={
            <div className="content" style={{
              width:isMenuActive ? "calc(100% - 210px)" : "calc(100% - 100px)",
              left:isMenuActive ? "210px" : "100px",
              

        }} >  <Gnai /></div>} pageId="/gnai" />
            </div>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
