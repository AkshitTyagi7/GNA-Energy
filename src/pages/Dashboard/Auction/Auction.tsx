import React, { useEffect, useState } from "react";
import {
  fetchDailyAuctionData,
  fetchMonthlyAuctionData,
} from "../../../Rest_api/restapi";
import { toSafeFloat } from "../../../extensions/number";
import { FormatAuctionDaily, FormatAuctionMonthly } from "./FormatData";
import { fetchData, fetchTAMData } from "./fetchData";
import { RA } from "./RA";
import { TAM } from "./TAM";
import "./Auction.css";
import { Auction, TAM as TAMType } from "../../../models/auction";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import { formatDMY, PrimaryColor } from "../../../common";
import Popup from "../Exchange3/components/Popup";
import { MediumButton } from "../../../components/Button";

const TABS = ["Reverse Auction", "TAM"];
export const formatDateString = (date: Date): string =>
  date.toLocaleDateString("en-GB").split("/").reverse().join("-");

export function AuctionPage() {
  const [forecastData, setForecastData] = useState<Auction[]>([]);
  const [TAMData, setTAMData] = useState<TAMType[]>([]);
  const [RALoading, setRALoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>(TABS[0]);
  // const [startDate, setStartDate] = useState(new Date("2024-01-01"));
  // const [endDate, setEndDate] = useState(new Date("2024-02-29"));
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState([
    {
      startDate: new Date("2024-01-01"),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [dateRange, setDateRange] = useState(state[0]);

  useEffect(() => {
    setRALoading(true);
    fetchData({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    }).then((data) => {
      setForecastData(data);
      setRALoading(false);
    });
    setLoading(true);
    fetchTAMData({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    }).then((data) => {
      setTAMData(data);
      setLoading(false);
    });
  }, [dateRange]);

  useEffect(() => {
    const handleCopyCutPaste = (e: any) => {
      e.preventDefault();
    };

    document.addEventListener('copy', handleCopyCutPaste);
    document.addEventListener('cut', handleCopyCutPaste);
    document.addEventListener('paste', handleCopyCutPaste);

    return () => {
      document.removeEventListener('copy', handleCopyCutPaste);
      document.removeEventListener('cut', handleCopyCutPaste);
      document.removeEventListener('paste', handleCopyCutPaste);
    };
  }, []);

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
                  index === 0
                    ? "8px 0px 0px 8px"
                    : index === TABS.length - 1
                    ? "0px 8px 8px 0px"
                    : undefined,
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
          {/* <input
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
          /> */}
          <button
            onClick={() => {
              setVisible(!visible);
            }}
            className="date-range-button"
          >
           
            <span className="date-range">
              {formatDMY(formatDateString(dateRange.startDate))} 
              </span>
              {" "}to{" "}
              <span className="date-range">
              {formatDMY(formatDateString(dateRange.endDate))}
              </span>
           
          </button>
          {visible && (
            <div
              className="pop-up-date"
              onClick={(e) => {
                setVisible(false);
              }}
            >
              <div
                className="date-selection-wrapper"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <DateRangePicker
                  onChange={(item) => setState([item.selection as any])}
                  showPreview={true}
                    dragSelectionEnabled={false}
                  minDate={new Date("2022-01-01")}
                  maxDate={new Date("2025-12-31")}

                  moveRangeOnFirstSelection={false }
                  rangeColors={[PrimaryColor, PrimaryColor, PrimaryColor]}
                  months={2}
                  ranges={state}
                  direction="horizontal"
                />
                <button
                  onClick={() => {
                    setDateRange({
                      startDate: new Date(state[0].startDate.toLocaleDateString("en-GB").split("/").reverse().join("-")),
                      endDate: new Date(state[0].endDate.toLocaleDateString("en-GB").split("/").reverse().join("-")),
                      key: "selection",
                    });
                    setVisible(false);
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedTab === TABS[0] ? (
        <RA
          forecastData={forecastData}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          loading={RALoading}
        />
      ) : (
        <TAM
          TAMData={TAMData}
          loading={loading}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
        />
      )}
    </div>
  );

  // function onDateChange(e: React.ChangeEvent<HTMLInputElement>
  // ){
  //   e.stopPropagation();
  //   setStartDate(new Date(e.target.value))
  // }
}
