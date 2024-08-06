import { useEffect, useState } from "react";
import { ChartRecord, ChartType } from "../../models/chart_model";
import { fetchSnapshots, fetchTamData } from "../../Rest_api/restapi";
import { FormatChartData } from "../../components/recharts/functions";
import { ReLineChart } from "../../components/recharts/ReCharts";
import { ReMixChart } from "../../components/recharts/ReMixCharts";
import { ExchangeColors } from "../Dashboard/Exchange3/FormatData";
import { formatDMY, PrimaryColor } from "../../common";
import { DateRangePicker } from "react-date-range";
import { formatDateString } from "../Dashboard/Auction/Auction";

const INTERVAL = ["date", "month"];
const EXCHANGES = ["IEX", "HPX", "PXIL"];
const PRODUCTS = [
  "DAM",
  "RTM",
  "GDAM",
  "Day Ahead Contingency",
  "CONTINGENCY",
  "DACDynamic",
  "Daily",
  "HPDAM",
  "DAILY",
];

const GROUP_BY = ["exchange", "product", "type"];
const UNIT_KEYS = ["weighted_average_price", "total_volume_mwh"];

export const ChartBuilder = () => {
  const [snapshotData, setSnapshotData] = useState<ChartRecord[]>([]);
//   const start_date = "2024-01-01";
//   const end_date = "2024-01-05";
  const [tamData, setTamData] = useState<ChartRecord[]>([]);
  const [chartData, setChartData] = useState<ChartRecord[]>([]);
  const [selectedExchange, setSelectedExchange] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<string[]>(["type"]);
  const [selectedInterval, setSelectedInterval] = useState<string>("date");
  const [chartKeys, setChartKeys] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [dates, setDate] = useState([
    {
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-07-01"),
      key: "selection",
    },
  ]);
  const [dateRange, setDateRange] = useState(dates[0]);

  useEffect(() => {
    _handleFetchingData(dates[0].startDate.toLocaleDateString("en-GB").split("/").reverse().join("-"), dates[0].endDate.toLocaleDateString("en-GB").split("/").reverse().join("-"));
  }, [dates]);

  useEffect(() => {
    _handleChartDataChange();
  }, [
    snapshotData,
    tamData,
    selectedInterval,
    groupBy,
    selectedExchange,
    selectedProduct,
  ]);

  const _handleFetchingData = async (start_date: string, end_date: string) => {
    const snapshots: ChartRecord[] = await fetchSnapshots(start_date, end_date);
    const tamData: ChartRecord[] = await fetchTamData(start_date, end_date);
    setSnapshotData(snapshots);
    setTamData(tamData);
  };

  const _handleChartDataChange = () => {
    let data = snapshotData.concat(tamData);
    if (selectedExchange.length > 0) {
      data = data.filter((d) => selectedExchange.includes(d.exchange));
    }
    if (selectedProduct.length > 0) {
      data = data.filter((d) => selectedProduct.includes(d.product));
    }

    const chartData = FormatChartData({
      keys: [selectedInterval],
      groupBy: groupBy,
      aggregationKeys: [],
      priceKey: "weighted_average_price",
      volumeKey: "total_volume_mwh",
      data: data,
    });
    console.log(chartData);
    setChartData(chartData.data as ChartRecord[]);
    setChartKeys(chartData.keys);
  };
  const _handleExchangeChange = (exchange: string) => {
    if (selectedExchange.includes(exchange)) {
      setSelectedExchange(selectedExchange.filter((e) => e !== exchange));
    } else {
      setSelectedExchange([...selectedExchange, exchange]);
    }
  };

  const _handleProductChange = (product: string) => {
    if (selectedProduct.includes(product)) {
      setSelectedProduct(selectedProduct.filter((e) => e !== product));
    } else {
      setSelectedProduct([...selectedProduct, product]);
    }
  };

  const _handleGroupByChange = (group: string) => {
    if (groupBy.includes(group)) {
      setGroupBy(groupBy.filter((e) => e !== group));
    } else {
      setGroupBy([...groupBy, group]);
    }
  };

  return (
    <div className="flex flex-row w-full h-full">
      <div className="side-filters-container w-60">
        Chart Filters
        <div className="side-filter-item">
          <h4>Exchanges</h4>
          {EXCHANGES.map((exchange) => {
            return (
              <p
                key={exchange}
                onClick={() => _handleExchangeChange(exchange)}
                className={
                  "side-filter-subitem  " +
                  (selectedExchange.includes(exchange)
                    ? "side-filter-subitem-active"
                    : "")
                }
              >
                {exchange}
              </p>
            );
          })}
        </div>
        <div className="side-filter-item">
          <h4>Products</h4>
          {PRODUCTS.map((product) => {
            return (
              <p
                key={product}
                onClick={() => _handleProductChange(product)}
                className={
                  "side-filter-subitem  " +
                  (selectedProduct.includes(product)
                    ? "side-filter-subitem-active"
                    : "")
                }
              >
                {product}
              </p>
            );
          })}
        </div>
        <div className="side-filter-item">
          <h4>Interval</h4>
          {INTERVAL.map((interval) => {
            return (
              <p
                key={interval}
                onClick={() => setSelectedInterval(interval)}
                className={
                  "side-filter-subitem  " +
                  (selectedInterval === interval
                    ? "side-filter-subitem  side-filter-subitem-active"
                    : "")
                }
              >
                {interval}
              </p>
            );
          })}
        </div>
        <div className="side-filter-item">
          <h4>Group By</h4>
          {GROUP_BY.map((group) => {
            return (
              <p
                key={group}
                onClick={() => _handleGroupByChange(group)}
                className={
                  "side-filter-subitem  " +
                  (groupBy.includes(group)
                    ? "side-filter-subitem  side-filter-subitem-active"
                    : "")
                }
              >
                {group}
              </p>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col w-full h-full">
        <div className="markeMonitoring-chart-container">
          <div className="markeMonitoring-chart">
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
                  onChange={(item) => setDate([item.selection as any])}
                  showPreview={true}
                    dragSelectionEnabled={false}
                  minDate={new Date("2022-01-01")}
                  maxDate={new Date("2025-12-31")}

                  moveRangeOnFirstSelection={false }
                  rangeColors={[PrimaryColor, PrimaryColor, PrimaryColor]}
                  months={2}
                  ranges={dates}
                  direction="horizontal"
                />
                <button
                  onClick={() => {
                    setDateRange({
                      startDate: new Date(dates[0].startDate.toLocaleDateString("en-GB").split("/").reverse().join("-")),
                      endDate: new Date(dates[0].endDate.toLocaleDateString("en-GB").split("/").reverse().join("-")),
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
            <ReMixChart
              data={chartData}
              showSecondYAxis={true}
              isTimeSlot={false}
              onlyTitle={true}
              xLabel="Date"
              unit="MWh"
              yAxisLabel="Volume(MWh)"
              secondYAxisLabel="Price(INR)"
              legends={[
                ...chartKeys
                  .map((key, index) => {
                    return {
                      dataKey: key + "_" + UNIT_KEYS[1],
                      type: ChartType.Bar,
                      name: key + " Volume",
                      stroke: ExchangeColors[index],

                      legendColor: ExchangeColors[index],
                    };
                  })
                  .flat(),
                ...chartKeys
                  .map((key, index) => {
                    return {
                      dataKey: key + "_" + UNIT_KEYS[0],
                      type: ChartType.Line,
                      yAxisId: "right",
                      name: key + " Price",
                      stroke: ExchangeColors[index],
                      legendColor: ExchangeColors[index],
                    };
                  })
                  .flat(),
              ]}
              xDataKey={selectedInterval}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
