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
      {/* <div className="text-right flex justify-between width-full mt-4 ml-4">

      </div> */}
      {/* <ResponsiveContainer width="98%" height={"90%"}>
        <ComposedChart data={forecateData}>
          <Legend
            verticalAlign="top"
            onClick={(e) => {
              if (shownForecast.includes(e.value)) {
                setShownForecast(
                  shownForecast.filter((item) => item !== e.value)
                );
              } else {
                setShownForecast([...shownForecast, e.value]);
              }
            }}
          />
          <XAxis dataKey="name" fontSize={12} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={renderQuarterTick as any}
            height={20}
            xAxisId="quarter"
          />

          <YAxis tickSize={1} width={96} label={COST_UNIT} fontSize={16} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            labelFormatter={(value, payload) => {
              try {
                return [`${payload[0].payload.date} - Time Slot ${value}`];
              } catch {
                return [value];
              }
            }}
            formatter={(value, name, props) => {
              return [
                parseFloat(value.toString()).toFixed(2).concat(` ${COST_UNIT}`),
                name,
              ];
            }}
          />
          <Line
            strokeWidth={4}
            hide={
              !shownForecast.includes("Forecast IEX DAM price") &&
              shownForecast.length > 0
            }
            dataKey="forecasted_value"
            fill={SecondaryColor}
            color={SecondaryColor}
            stroke={SecondaryColor}
            name={"Forecast IEX DAM price"}
          />
          <Line
            strokeWidth={4}
            hide={
              !shownForecast.includes("Actual IEX DAM Price") &&
              shownForecast.length > 0
            }
            dataKey="actual_value"
            stroke={PrimaryColor}
            color={PrimaryColor}
            fill={PrimaryColor}
            name="Actual IEX DAM Price"
          />
          <XAxis dataKey="name" />
          <Brush
            startIndex={
              forecateData !== null && forecateData.length > 96
                ? forecateData.length - 96
                : 0
            }
            endIndex={
              forecateData !== null && forecateData.length > 96
                ? forecateData.length - 1
                : 0
            }
            dataKey="date"
            height={40}
            stroke={PrimaryColor}
          />
        </ComposedChart>
      </ResponsiveContainer> */}
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
