import { useEffect, useState } from "react";
import { PrimaryColor, SecondaryColor, buildHttpReq } from "../../../common";
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ComposedChart,
} from "recharts";
import { renderQuarterTick } from "../Exchange2/FormatData";
import { COST, COST_UNIT } from "../../../Units";
import { ReLineChart } from "../../../components/recharts/ReCharts";

interface PriceForecastingData {
  name: string;
  date: string;
  forecasted_value: number;
  actual_value: number;
}

export function PriceForecasting() {
  const [forecateData, setData] = useState<any>([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)
  );
  const maxDate = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
  const [shownForecast, setShownForecast] = useState<String[]>([]);

  useEffect(() => {
    fetchData({
      startDate: startDate,
      endDate: endDate,
    });
  }, []);

  return (
    <>
    <div className="header">
    <h1>Price Forecast</h1>
    <div className="date-selection">
          <input
            type="date"
            className="date-input"
            max={endDate
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")}
            value={startDate
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")}
            onChange={(e) => {
              setStartDate(new Date(e.target.value));
              fetchData({
                startDate: new Date(e.target.value),
                endDate: endDate,
              });
            }}
          />
          to
          <input
            type="date"
            className="date-input"
            max={maxDate
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")}
            value={endDate
              .toLocaleDateString("en-GB")
              .split("/")
              .reverse()
              .join("-")}
            onChange={(e) => {
              setEndDate(new Date(e.target.value));
              fetchData({
                startDate: startDate,
                endDate: new Date(e.target.value),
              });
            }}
          />
        </div>
    </div>
      <div className="container2 content2-padding-body">
     <div className="onechart-container">
     <h1 className="chartHeading">IEX DAM Price Forecast (₹/KWh)</h1>

      <ReLineChart
      yAxisLabel="Price (₹/KWh)"
     showBrush={true}
     data={forecateData} legends={
        [
          {
            name: "Forecasted Value",
            dataKey: "forecasted_value",
            stroke: SecondaryColor,
          },
          {
            name: "Actual Value",
            dataKey: "actual_value",
            stroke: PrimaryColor,
          },
        ]
      
      } xDataKey="name" unit={COST_UNIT} secondXDataKey="date" /></div></div>
    </>
  );

  async function fetchData({
    startDate,
    endDate,
  }: {
    startDate: Date;
    endDate: Date;
  }) {
    const formatStartDate = startDate
      .toLocaleDateString("en-GB")
      .split("/")
      .join("-");
    const formatEndDate = endDate
      .toLocaleDateString("en-GB")
      .split("/")
      .join("-");
    const response = await buildHttpReq({
      endpoint: "/dam_forecast_api",
      method: "POST",
      body: {
        start_date: formatStartDate,
        end_date: formatEndDate,
      },
    });
    const res = await response;
    let tempData: any = [];
    Object.keys(res).map((key, index) => {
      res[key].data.map((item: any, index: number) => {
        tempData.push({
          name: index + 1,
          date: item.date,
          forecasted_value:
            item.forecasted_value == "" ? 0 : parseFloat(item.forecasted_value),
          actual_value: parseFloat(item.actual_value),
        });
      });
    });
    // Sort the data by date which is in string format dd-mm-yyyy

    tempData = tempData.sort((a: any, b: any) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      return dateA.getTime() - dateB.getTime();
    });

    console.log(forecateData);
    setData(tempData);
  }
}

const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Dates
};
