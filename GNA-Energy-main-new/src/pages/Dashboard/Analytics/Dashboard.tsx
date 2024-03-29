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
    <h2 className="mb-20 text-4xl text-center">GNA Data and Analytics Capability Center (GDACC)</h2>
    <div className="flex flex-row flex-wrap gap-10 justify-center">
    <DashBoardItem title="Market monitoring" to="marketmonitoring" />
    <DashBoardItem title="Discom Analytics" to="discomAnalysis"/>
    <DashBoardItem title="Exchange Analytics" to="exchangeAnalysis" />
    <DashBoardItem title="Power Atlas" to="powerAtlas" />
  </div>
  </div>
  );
}