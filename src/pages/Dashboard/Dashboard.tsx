import React from "react";
import "./Dashboard.css";
import { NavLink } from "react-router-dom";

function DashBoardItem({title, to}: {title: string, to: string}) {
  return (
    <NavLink to={`${to}`} className="dashboard-item" >
      <h3 className="text-white text-2xl ">{title}</h3>
    </NavLink>
  );
  
}
export default function Dashboard() {
  return (
  <div className="dashboard p-10 mt-5">
    <h2 className="mb-10 text-4xl text-center">GNA Energy Data and Analytics Capability Center (GDACC)</h2>
    <div className="flex flex-row flex-wrap gap-10 justify-center">
    <DashBoardItem title="Market Monitoring" to="marketmonitoring" />
    <DashBoardItem title="Discom Analytics" to="discomAnalysis"/>
    <DashBoardItem title="Exchange Analytics" to="exchangeAnalysis" />
    <DashBoardItem title="Power Atlas" to="powerAtlas" />
    <DashBoardItem title="Banking Analytics" to="bankingAnalytics" />
    <DashBoardItem title="Consumption and Generation Analytics" to="consumptionAndGenerationAnalytics" />
    <DashBoardItem title="Price Forecast" to="priceForecasting" />
    <DashBoardItem title="Demand Forecast" to="demandForecasting" />
    <DashBoardItem title="Grid Frequency Profile" to="gridFrequencyProfile" />

  </div>
  <div
  className="text-center mt-8 text-gray-500"
  >2024 GNA Energy Private Limited. All Rights Reserved</div>
  </div>
  );
}