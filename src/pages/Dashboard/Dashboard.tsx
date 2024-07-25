import React from "react";
import "./Dashboard.css";
import { NavLink } from "react-router-dom";
import { Header } from "../../layout/Header";
import {ReactComponent as ItemImage} from "../../icons/dashboard-item.svg";
import {ReactComponent as BankingAalytics} from "../../icons/dashboard/bankingAnalytics.svg";
import {ReactComponent as ConsumptionAndGenerationAnalytics} from "../../icons/dashboard/consumptionAndGenerationAnalytics.svg";
import {ReactComponent as DemandForecasting} from "../../icons/dashboard/demandForecasting.svg";
import {ReactComponent as DiscomAnalysis} from "../../icons/dashboard/discomAnalysis.svg";
import {ReactComponent as ExchangeAnalysis} from "../../icons/dashboard/exchangeAnalysis.svg";
import {ReactComponent as GridFrequencyProfile} from "../../icons/dashboard/gridFrequencyProfile.svg";
import {ReactComponent as MarketMonitoring} from "../../icons/dashboard/marketmonitoring.svg";
import {ReactComponent as PowerAtlas} from "../../icons/dashboard/powerAtlas.svg";
import {ReactComponent as PriceForecasting} from "../../icons/dashboard/priceForecasting.svg";


 function DashBoardItem({title,Icon, to}: {title: string,Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>, to: string}) {
  return (
    <NavLink to={`${to}`} className="dashboard-item" >

      <Icon style={{
        fill:"white"
      }}  />
      <p >{title}</p>

    </NavLink>
  );
  
}
export default function Dashboard() {
  return (
    <>      <div className="dashboard-header">
    <div>
        <h1>GNA Energy Data and Analytics Capability Center (GDACC)</h1>
    </div>
</div>
    
      <div className="p-10 mt-5">

      <div className="flex flex-row flex-wrap gap-5 justify-center">
        <DashBoardItem Icon={MarketMonitoring} title="Market Monitoring" to="marketmonitoring" />
        <DashBoardItem Icon={ExchangeAnalysis} title="Exchange Analytics" to="exchangeAnalysis" />
        <DashBoardItem Icon={BankingAalytics} title="TAM and DEEP" to="auctions" />
        <DashBoardItem Icon={PowerAtlas} title="Power Atlas" to="powerAtlas" />
        <DashBoardItem Icon={ConsumptionAndGenerationAnalytics} title="Consumption and Generation Analytics" to="consumptionAndGenerationAnalytics" />
        <DashBoardItem Icon={DiscomAnalysis} title="Discom Analytics" to="discomAnalysis" />
        <DashBoardItem Icon={PriceForecasting} title="Price Forecast" to="priceForecasting" />
        <DashBoardItem Icon={DemandForecasting} title="Demand Forecast" to="demandForecasting" />
        <DashBoardItem Icon={GridFrequencyProfile} title="Grid Frequency Profile" to="gridFrequencyProfile" />
        {/* [
        "marketmonitoring", "exchangeAnalysis", "auctions", "powerAtlas", "consumptionAndGenerationAnalytics", "discomAnalysis", "priceForecasting", "demandForecasting", "gridFrequencyProfile"
        ] */}
        {/* 
        [
        {
        "access_type" : "Market Monitoring",
        "key": "marketmonitoring",
        }, {"access_type" : "Exchange Analysis", "key": "exchangeAnalysis"}, {"access_type" : "TAM and DEEP", "key": "auctions"}, {"access_type" : "Power Atlas", "key": "powerAtlas"}, {"access_type" : "Consumption and Generation Analytics", "key": "consumptionAndGenerationAnalytics"}, {"access_type" : "Discom Analytics", "key": "discomAnalysis"}, {"access_type" : "Price Forecast", "key": "priceForecasting"}, {"access_type" : "Demand Forecast", "key": "demandForecasting"}, {"access_type" : "Grid Frequency Profile", "key": "gridFrequencyProfile"
        ]
        */}

      </div>
      <div
        className="text-center mt-5 text-gray-500"
      >2024 GNA Energy Private Limited. All Rights Reserved</div>
    </div></>
  );
}