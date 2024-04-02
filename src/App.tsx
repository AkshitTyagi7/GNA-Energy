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

                  <Outlet />
              </>
            }
          >
            <Route index={true} element={
                            <div
                            className="content2"
                            style={{
                              // width: isMenuActive
                              //   ? "calc(100% - 210px)"
                              //   : "calc(100% - 100px)",
                              // left: isMenuActive ? "210px" : "100px",
                            }}
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
            path="/document"
            element={
              <Protected>
                <Sidebar2 />

                <div
                  className="content"

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
