import React from "react";
import "./Dashboard.css";
import { NavLink } from "react-router-dom";

function DashBoardItem({title, to}: {title: string, to: string}) {
  return (
    <NavLink to={`${to}`} className="dashboard-item" >
      <h3 className="text-white text-6-xl">{title}</h3>
    </NavLink>
  );
  
}
export default function Dashboard() {
  return (
  <div className="dashboard p-10 mt-10">
    <h2 className="mb-20 text-3xl">Analysis</h2>
    <div className="flex flex-row flex-wrap gap-10">
    <DashBoardItem title="Market Monioring" to="marketMonioring" />
    <DashBoardItem title="Discom Analysis" to="discomAnalysis"/>
    <DashBoardItem title="Exchange Analysis" to="exchangeAnalysis" />
    <DashBoardItem title="Landing Cost Circular" to="landingCostCircular" />
    <DashBoardItem title="Power Atlas" to="powerAtlas" />
    <DashBoardItem title="Real Time Analysis" to="realTimeAnalysis" />
    <DashBoardItem title="Attribute Analysis" to="attributeAnalysis" />
  </div>
  </div>
  
  );
}