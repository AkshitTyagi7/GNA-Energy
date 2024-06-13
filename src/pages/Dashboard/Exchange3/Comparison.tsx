import { useEffect, useState } from "react";
import {
  COST_UNIT,
  ENERGY_UNIT,
  MEGA_POWER_UNIT,
  VOLUME_UNIT,
} from "../../../Units";
import {
  PrimaryColor,
  QuaternaryColor,
  SecondaryColor,
  TertiaryColor,
  buildHttpReq,
  buildUrl,
} from "../../../common";
import { tab } from "./interface/tabs";
import "./styles.css";
import { ExchangeLegend } from "./interface/legends";
import {
  ComparisonData,
  FormatExchangeData,
  RealTimeChartData,
  ReformattedData,
  getDaysInMonthFromString,
  reformatData,
  // formatRealTimeChartData,
} from "./FormatData";
import { ExchangeChart } from "./Chart";
import { ResponsiveContainer } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  fetchExchangeData,
  setSelectedExchange,
  setSelectedProduct,
} from "../../../store/state/Exchange/ExchangeState";
import Loading, { LoadingItem } from "../../../components/Loading";
import swal from "sweetalert";
import Select from "react-select";
import {
  ReBarChart,
  ReLineChart,
} from "../../../components/recharts/ReCharts";
import { Legend } from "chart.js/dist";
import { BrushStart, LegendKey, getColorList } from "../../../models/chart_model";
export function ExchangeComparion() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000)
  );
  const [RealTimeChartData, setRealTimeChartData] = useState<
    RealTimeChartData[]
  >([]);

  const unitTabs = [
    {
      dataKey: "wt_mcp_rs_mwh",
      name: "MCP",
      unit: COST_UNIT,
    },

    {
      dataKey: "mcv_mw",
      name: "MCV",
      unit: MEGA_POWER_UNIT,
    },

    {
      dataKey: "sell_bid_mw",
      unit: MEGA_POWER_UNIT,
      name: "Sell Bids",
    },
    {
      dataKey: "prchs_bid_mw",
      name: "Purchase Bids",
      unit: MEGA_POWER_UNIT,
    },
    {
      name: "Weighted MCP",
      unit: COST_UNIT,
    },

  ];

  const [activeUnitTab, setActiveUnitTab] = useState(0);

  const [buyerSellerPage, setBuyerSellerPage] = useState(0);

  const searchStyle = {
    valueContainer: (base: any) => ({
      ...base,
      maxHeight: 40,
      overflowY: "auto",
    }),
    multiValue: (base: any, state: { data: { isFixed: any } }) => {
      return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base;
    },
    multiValueLabel: (base: any, state: { data: { isFixed: any } }) => {
      return state.data.isFixed
        ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
        : base;
    },
    multiValueRemove: (
      base: any,
      state: {
        data: {
          value: any;
          isFixed: any;
        };
      }
    ) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
  };
  const [chartData, setChartData] = useState<{
    data: ReformattedData;
    legends: LegendKey[];
  }>({
    data: {
      iex: {
        dam: [],
        gdam: [],
        rtm: [],
        hpdam: [],
      },
      pxil: {
        dam: [],
        gdam: [],
        rtm: [],
        hpdam: [],
      },
      hpx: {
        dam: [],
        gdam: [],
        rtm: [],
        hpdam: [],
      },
    },
    legends: [],
  });
  const Years = [2023, 2024];
  const Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const maxDate = new Date();
  const dateOptions: {
    value: Date;
    label: string;
    color: string;
  }[] = Years.flatMap((year, i1) => {
    return Months.map((month, i2) => {
      if (
        new Date(year, Months.indexOf(month), 1).getTime() <= maxDate.getTime()
      ) {
        return {
          id: i1 + i2,
          value: new Date(year, Months.indexOf(month), 1),
          label: `${month} ${year}`,
          color: getColorList(Years.length * Months.length)[i1 + i2],
        };
      }
      return undefined;
    });
  })
    .reverse()
    .filter((option) => option !== undefined) as {
    value: Date;
    label: string;
    color: string;
  }[];
  const state = useSelector((state: RootState) => state.exchange);
  let [selectedYears, setSelectedYears] = useState<
    { name: number; color: string }[]
  >([]);
  let [selectedMonths, setSelectedMonths] = useState<number>(0);
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState<
    {
      value: Date;
      label: string;
    }[]
  >([]);

  const [selectedExchange, setSelectedExchange] = useState(0);

  useEffect(() => {
    /* Initial Data should be first 3 months of dateoptins */
    setSelectedOptions(dateOptions.slice(0, 1));

    getExchangeData({
      dates: dateOptions.slice(0, 1).map((e) => e.value),
    });
  }, []);
  const [exchangeLoading, setExchangeLoading] = useState(true);

  return (
    <div>
      {/* Header */}
      {}
      <div className="header">
        <div>
          <h1>Exchange</h1>
        </div>
        <div className="header-side-area">
          <Select
            placeholder="Select Months..."
            value={selectedOptions}
            isMulti={true}
            onChange={(value) => {
              setSelectedOptions(value as any);
              getExchangeData({ dates: value.map((e) => e.value) });
            }}
            options={
              /* date options that are not in the selected options */
              dateOptions.filter(
                (option) =>
                  !selectedOptions.map((e) => e.label).includes(option.label)
              )
            }
          />
        </div>
      </div>
      {/* Content */}
      {/* Removing Padding for the Market Editing Page */}
      <div
        className="loading-container"
        style={{ display: getLoading() ? "flex" : "none" }}
      >
        <LoadingItem />
      </div>
      <div className={state.page !== 3 ? "content2-padding-body" : ""}>
        {/* Filters */}
        {getActivateFilter(false) && (
          <div className="filters">
            <div className="legend-exchangeSelection">
              <div className="exchange-selection">
                {state.page === (0 as any)
                  ? ["IEX", "PXIL", "HPX"].map((exchange, index) => {
                      return (
                        <button
                          key={index}
                          className={`tab-small ${
                            selectedExchange === index ? "tab-active" : ""
                          } ${
                            index === 0
                              ? "tab-left"
                              : index === 2
                              ? "tab-right"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedExchange(index);
                          }}
                        >
                          {exchange}
                        </button>
                      );
                    })
                  : ["DAM", "GDAM", "HPDAM", "RTM"].map((exchange, index) => {
                      return (
                        <button
                          key={index}
                          className={`tab-small ${
                            state.Exchange.selectedProduct === index
                              ? "tab-active"
                              : ""
                          } ${
                            index === 0
                              ? "tab-left"
                              : index === 3
                              ? "tab-right"
                              : ""
                          }`}
                          onClick={() => {
                            dispatch(setSelectedProduct(index));
                          }}
                        >
                          {exchange}
                        </button>
                      );
                    })}
              </div>
              <div className="exchange-selection">
                {unitTabs.map((tab, index) => {
                  return (
                    <button
                      key={index}
                      className={`tab-small ${
                        activeUnitTab === index ? "tab-active" : ""
                      } ${
                        index === 0
                          ? "tab-left"
                          : index === unitTabs.length - 1
                          ? "tab-right"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveUnitTab(index);
                      }}
                    >
                      {tab.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {/* Chart Area */}

        {activeUnitTab !== 4 && (
          <div className="exchange-chart-area">
            <ComparisonChart
              title="DAM"
              data={
                selectedExchange === 0
                  ? chartData.data.iex.dam
                  : selectedExchange === 1
                  ? chartData.data.pxil.dam
                  : chartData.data.hpx.dam
              }
            />

            <ComparisonChart
              title="GDAM"
              data={
                selectedExchange === 0
                  ? chartData.data.iex.gdam
                  : selectedExchange === 1
                  ? chartData.data.pxil.gdam
                  : chartData.data.hpx.gdam
              }
            />

            <ComparisonChart
              title="HPDAM"
              data={
                selectedExchange === 0
                  ? chartData.data.iex.hpdam
                  : selectedExchange === 1
                  ? chartData.data.pxil.hpdam
                  : chartData.data.hpx.hpdam
              }
            />

            <ComparisonChart
              title="RTM"
              data={
                selectedExchange === 0
                  ? chartData.data.iex.rtm
                  : selectedExchange === 1
                  ? chartData.data.pxil.rtm
                  : chartData.data.hpx.rtm
              }
            />
            <ExchangeChart
              shownLegnends={[]}
              brushStart={BrushStart.Start}
              setShownLegends={function (legends: string[]): void {}}
              data={chartData.data.iex.dam}
              title="DAM"
              syncId="comparison"
              height="6%"
              width="99%"
              showBrush={true}
              onlyBrush={true}
            />
          </div>
        )}

        {activeUnitTab === 4 && (
          <div className="exchange-chart-area">
            <div className="exchange-byExchange-chart">
              <WeightedAverageChart data={chartData.data.iex.dam} title="DAM" />
            </div>
            <div className="exchange-byExchange-chart">
              <WeightedAverageChart data={chartData.data.iex.dam} title="DAM" />
            </div>

            <div className="exchange-byExchange-chart">
              <WeightedAverageChart data={chartData.data.iex.dam} title="DAM" />
            </div>

            <div className="exchange-byExchange-chart">
              <WeightedAverageChart data={chartData.data.iex.dam} title="DAM" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  async function getExchangeData({ dates }: { dates: Date[] }) {
    try {
      if (dates.length === 0) {
        return;
      }
      setExchangeLoading(true);

      /* If any date is before of feb-2024 return swal currently data not available before feb */
      /*       if (dates[0].getTime() < new Date(2024, 1, 1).getTime()) {
        swal(
          "Data Not Available",
          "Data is not available before Feb 2024",
          "warning"
        );
        setExchangeLoading(false);
        return;
      } */

      fetch(buildUrl("all_exchange_multiple_api_range"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          dates: dates.map((e) => ({
            start_date: e.toLocaleDateString("en-GB").split("/").join("-"),
            end_date: new Date(e.getFullYear(), e.getMonth() + 1, 0)
              .toLocaleDateString("en-GB")
              .split("/")
              .join("-"),
          })),
        }),
      })
        .then((res) => res.json())
        .then((apidata) => {
          let comparisonData: ComparisonData[] = [];
          let legends: LegendKey[] = [];
          console.log(apidata);

          for (let i = 0; i < apidata.length; i++) {
            let data = {
              iex: FormatExchangeData(apidata[i].data.iex),
              hpx: FormatExchangeData(apidata[i].data.hpx),
              pxil: FormatExchangeData(apidata[i].data.pxil),
            };
            comparisonData.push({
              date: `${Months[dates[i].getMonth()]}-${dates[i].getFullYear()}`,
              data: data,
            });
            legends.push({
              dataKey: `${Months[dates[i].getMonth()]}_${dates[
                i
              ].getFullYear()}`,
              name: `${Months[dates[i].getMonth()]}-${dates[i].getFullYear()}`,
              stroke: getColorList(dates.length)[i],
            });
          }
          setChartData({
            data: reformatData(comparisonData),
            legends: legends,
          });
          console.log(reformatData(comparisonData));
          setExchangeLoading(false);
        })
        .catch((error) => {
          setExchangeLoading(false);
          console.error("Error fetching data:", error);
          swal(
            "Something Went Wrong",
            "Error fetching Exchange Data. Please try again",
            "warning"
          );
        });
    } catch (error) {
      setExchangeLoading(false);
      console.error("Error fetching data:", error);
      swal(
        "Something Went Wrong",
        "Error fetching Exchange Data. Please try again later",
        "warning"
      );
    }
  }

  function WeightedAverageChart({ data, title }: { data: any; title: string }) {
    return (
      <ReBarChart
        data={convertWeightedAverage({
          data: data,
          months: chartData.legends.map((e) => e.name) as string[],
        })}
        xDataKey="month"
        unit={COST_UNIT}
        yAxisLabel={COST_UNIT}
        legends={[
          {
            dataKey: "value",
            name: "Weighted Average",
            stroke: PrimaryColor,
          },
        ]}
      />
    );
  }

  function ComparisonChart({ data, title }: { data: any; title: string }) {
    return (
      <div className="exchange-byExchange-chart">
        <h2
          className="text-center text-md"
          style={{
            color: SecondaryColor,
            marginBottom: -10,
          }}
        >
          {title}
        </h2>
        <ReLineChart
          yAxisWidth={activeUnitTab !== 0 ? 70 : 40}
          fontSize={15}
          brushStart={BrushStart.Start}
          data={data}
          xDataKey="name"
          secondXDataKey="date"
          syncid="comparison"
          showBrush={true}
          brushHeight={0.00000001}
          yAxisLabel={unitTabs[activeUnitTab].unit}
          unit={unitTabs[activeUnitTab].unit}
          legends={chartData.legends.map((e) => {
            const activeUnit = unitTabs[activeUnitTab];
            return {
              dataKey: activeUnit.dataKey + "_" + e.dataKey,
              name: e.name,

              stroke: e.stroke,
            };
          })}
        />
      </div>
    );
  }

  function getActivateFilter(isBuyerSeller?: boolean): boolean {
    if (state.page === 0) {
      return true;
    } else if (state.page === 1) {
      return true;
    } else if (state.page === 3) {
      if (isBuyerSeller) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function getLoading() {
    if (state.page === 0) {
      return exchangeLoading;
    } else if (state.page === 1) {
      return exchangeLoading;
    } else {
      return false;
    }
  }

  function convertWeightedAverage({
    data,
    months,
  }: {
    data: {
      [key: string]: string | number | null;
    }[];
    months: string[];
  }): {
    month: string | number;
    value: number;
  }[] {
    const weightedAverage: {
      month: string | number;
      value: number;
    }[] = months.map((month) => ({
      month: month,
      value: 0,
    }));
    let totalCost: number[] = [];
    let volumes: number[] = [];

    months.forEach((month, index) => {
      const daysInMonth = getDaysInMonthFromString(month);
      const noOfSlots = 96 * daysInMonth;
      let totalCostMonth = 0;
      let volumeMonth = 0;
      data.forEach((item) => {
        const cost = parseFloat(
          item[`wt_mcp_rs_mwh_${month.replace(/-/g, "_")}`] as string
        );
        const volume = parseFloat(
          item[`mcv_mw_${month.replace(/-/g, "_")}`] as string
        );
        if(
          cost !== null &&
          volume !== null &&
          !isNaN(cost) &&
          !isNaN(volume)
        ){
        totalCostMonth += cost * volume;
        volumeMonth += volume;
    }});
      totalCost.push(totalCostMonth);
      volumes.push(volumeMonth);
    });

    weightedAverage.forEach((item, index) => {
      console.log(item.month,"Total Cost - ",  totalCost[index],"Total volume - ", volumes[index])
      item.value = totalCost[index] / volumes[index];
    });

    console.log(weightedAverage);

    return weightedAverage;
  }
}
