import React, { useEffect, useState } from "react";
import { fetchDailyAuctionData, fetchMonthlyAuctionData } from "../../../Rest_api/restapi";
import { toSafeFloat } from "../../../extensions/number";
import { FormatAuctionDaily, FormatAuctionMonthly } from "./FormatData";
import { fetchData, fetchTAMData } from "./fetchData";
import { RA } from "./RA";
import { TAM } from "./TAM";
import "./Auction.css"
import { Auction, TAM as TAMType } from "../../../models/auction";

const TABS = ["Reverse Auction", "TAM"];
const formatDateString = (date: Date): string =>
  date.toLocaleDateString("en-GB").split("/").reverse().join("-");

export function AuctionPage() {
  const [forecastData, setForecastData] = useState<Auction[]>([]);
  const [TAMData, setTAMData] = useState<TAMType[]>([]);
  const [RALoading, setRALoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>(TABS[0]);
  const [startDate, setStartDate] = useState(new Date("2024-01-01"));
  const [endDate, setEndDate] = useState(new Date("2024-02-29"));
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setRALoading(true);
    fetchData({ startDate, endDate }).then(
      (data) => {
        setForecastData(data);
        setRALoading(false);
      }
    );
    setLoading(true);
    fetchTAMData({ startDate, endDate }).then((data) => {
      setTAMData(data);
      setLoading(false);
    });
  }, [startDate, endDate]);

  return (
    <div className="auction-container">
      <div className="header">
        <h1>TAM and DEEP</h1>
        <div className="selectButton">
          {TABS.map((tab, index) => (
            <div
              onClick={() => setSelectedTab(tab)}
              key={tab}
              style={{
                borderRadius:
                  index === 0 ? "8px 0px 0px 8px" : index === TABS.length - 1 ? "0px 8px 8px 0px" : undefined,
              }}
              className={selectedTab === tab ? "fiterActive" : "fiterInactive"}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="date-selection">
          <span>Delivery Period</span>
          &nbsp;
          <input
            type="date"
            max={formatDateString(endDate)}
            value={formatDateString(startDate)}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
          to
          <input
            type="date"
            min = {formatDateString(startDate)}
            value={formatDateString(endDate)}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
      </div>
      {selectedTab === TABS[0] ? <RA forecastData={forecastData} startDate={startDate} endDate={endDate} loading={RALoading} /> : <TAM TAMData={TAMData} loading={loading} startDate={startDate} endDate={endDate} />}
    </div>
  );

  function onDateChange(e: React.ChangeEvent<HTMLInputElement>
  ){
    e.stopPropagation();
    setStartDate(new Date(e.target.value))
  }
}

