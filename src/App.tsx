import React from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import { DemoPage } from "./pages/DemoPage";
import { PowerAtlas } from "./pages/Dashboard/Atlas/Atlas";
import { LoginPage } from "./pages/Login/Login";
import "./App.css";
import { MarketMontoring } from "./pages/Dashboard/MarketMonitoring/MarketMonitoring";
import { BankingAnalytics } from "./pages/Dashboard/BankingAnalytics/BankingAalytics";
import { ConsumptionAnalytics } from "./pages/Dashboard/Consumption/Consumption";
import { Protected, ProtectedPage } from "./pages/Protected";
import { DashboardRoutes } from "./Routes";
import { Gnai } from "./pages/GNAi/Gnai";
import { useSelector } from "react-redux";
import { Documents } from "./pages/Documents/Documents";
import { Sidebar2 } from "./layout/Sidebar2";
import { Login2 } from "./pages/Login/Login2";
import MarketMonitoring from "./pages/MarketMonitoringCERC/MarketMonitoring";

function App() {
  const isMenuActive = useSelector((state: any) => state.menu.isActive);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
    
          <Route path="/" element={      <Protected><Navigate to="/dashboard" /></Protected>} />
          <Route path="/login" element={<Login2 />} />

          <Route
            path="/dashboard"
            element={
              <>
                <Sidebar2 />

                  <Outlet
                    />
              </>
            }
          >
            <Route index={true} element={
                            <div
                            className="content2"

                          >
            <Dashboard /></div>} />
            {DashboardRoutes.map((Proute, index) => {
              return (
                <Route
                  key={index}
                  path={Proute.path}
                  element={
                    Proute.notPrtoected ? (
                      Proute.element
                    ) : (
                      <div
                      className={Proute.noDefaultPadding ? "content2" : "content"}
                    >
                      <ProtectedPage
                        children={Proute.element}
                        pageId={"/" + Proute.path}
                      /></div>
                    )
                  }
                />
              );
            })}
          </Route>

          {/* <Route path="/document" element={<div>Document</div>} /> */}
          <Route
            path="/gnai"
            element={
              <Protected>
                <Sidebar2 />
                <div
                      className="content"

                    >
                <ProtectedPage
                  children={
               
                      <Gnai />
                  }
                  pageId="/gnai"
                />
                </div>
              </Protected>
            }
          />
          <Route
            path="/marketMonitoring"
            element={
              <Protected>
                {/* <Sidebar2 /> */}
                <div
                      className=""
                    >
                <ProtectedPage
                  children={
                      <MarketMonitoring />
                  }
                  pageId="/marketMonitoring"
                />
                </div>
              </Protected>
            }
          />
          <Route
            path="/document"
            element={
              <Protected>
                <Sidebar2 />

                <div
                  className="content2"

                >
                  <Documents />
                </div>
                </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
