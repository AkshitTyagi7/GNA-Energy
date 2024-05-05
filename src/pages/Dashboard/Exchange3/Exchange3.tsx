import { useEffect, useState } from "react";
import { COST_UNIT, MEGA_POWER_UNIT, VOLUME_UNIT } from "../../../Units";
import {
  PrimaryColor,
  SecondaryColor,
  buildHttpReq,
  buildUrl,
} from "../../../common";
import { tab } from "./interface/tabs";
import "./styles.css";
import { ExchangeLegend } from "./interface/legends";
import {
  ComparisonData,
  ExchangeColors,
  FormatExchangeData,
  RealTimeChartData,
  ReformattedData,
  getDaysInMonthFromString,
  reformatData,
} from "./FormatData";
import {
  BuyerSellerChart,
  BuyerSellerPieChart,
  ExchangeChart,
  UtilizationTrendChart,
} from "./Chart";
import { ResponsiveContainer } from "recharts";
import { useDispatch, useSelector } from "react-redux";
import {
  AddBuyerSellerFilter,
  BuyerSellerFilter,
  BuyerSellerFilters,
  RemoveBuyerSellerFilter,
  setBuyerSellerData,
  setTrendData,
} from "../../../store/state/BuyerSellerState";
import { RootState } from "../../../store/store";
import {
  fetchExchangeData,
  setComparisonRawData,
  setExchangePage,
  setSelectedExchange,
  setSelectedProduct,
} from "../../../store/state/Exchange/ExchangeState";
import Select from "react-select";
import { ReactComponent as Cross } from "../../../icons/cross.svg";
import { LoadingItem } from "../../../components/Loading";
import {
  BrushStart,
  COLORS,
  LegendKey,
  ReBarChart,
  ReLineChart,
  getColorList,
} from "../../../components/charts/ReCharts";
import swal from "sweetalert";

export function Exchange3() {
  const maxDate = new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000);
  let comparisonRawData: {date_range:{start_date:string, end_date:string}, data:any}[] = [];
  const [ccomparisonLoading, setComparisonLoading] = useState(true);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000)
  );
  const [RealTimeChartData, setRealTimeChartData] = useState<
    RealTimeChartData[]
  >([]);
  const tabs: tab[] = [
    {
      name: "By Exchange",
      active: true,
    },
    {
      name: "By Product",
      active: false,
    },
    {
      name: "Realtime",
      active: false,
    },
    {
      name: "Buyers & Sellers",
      active: false,
    },
    {
      name: "Trend Analysis",
      active: false,
    },
  ];

  const BuyerSellerTab: string[] = ["Top Players", "Trends"];

  const [trendBuyer, setTrendBuyer] = useState<string[]>([
    "UPPCL",
    "RAJASTHAN",
    "ODISHA",
    "WBSETCL",
  ]);
  // let trendSeller: string[] = ["TSTRANSCO", "PUNJAB", "JK&LADAKH", "TNEB"];
  const [trendSeller, setTrendSeller] = useState<string[]>([
    "TSTRANSCO",
    "PUNJAB",
    "JK&LADAKH",
    "TNEB",
  ]);
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


  let selectedComparisonDate: Date[] = [];


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
  const [selectedComparisonExchange, setSelectedComparisonExchange] =
    useState(0);

  const [selectedOptions, setSelectedOptions] = useState<
    {
      value: Date;
      label: string;
    }[]
  >([]);
  const [realTimechartIndex, setRealtimeChartIndex] = useState<number>(1);

  const exchangeLegends: ExchangeLegend[] = [
    {
      name: `Price (${COST_UNIT})`,
      id: "price",
      color: PrimaryColor,
      active: true,
    },
    {
      name: `Sell Bids ${MEGA_POWER_UNIT}`,
      id: "sellBids",
      color: SecondaryColor,
      active: true,
    },
    {
      name: `Purchase Bids ${MEGA_POWER_UNIT}`,
      id: "purchaseBids",
      color: "#333333",
      active: true,
    },

    {
      name: "MCV",
      id: "mcv",
      color: "#9F9F9F",
      active: true,
    },
  ];
  const [activeUnitTab, setActiveUnitTab] = useState(0);

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

  const state = useSelector((state: RootState) => state.exchange);

  const dispatch = useDispatch();
  const BuyerSellerState = useSelector((state: RootState) => state.buyerSeller);

  useEffect(() => {
    getExchangeData({ start_date: startDate, end_date: endDate });
    fetchRealTimeData();
    fetchBuyerVsSellerData({
      start_date: startDate,
      end_date: endDate,
      exchange: BuyerSellerState.BuyerSeller.filters[0],
      product: BuyerSellerState.BuyerSeller.filters[1],
      region: BuyerSellerState.BuyerSeller.filters[2],
    });
    setSelectedOptions(dateOptions.slice(0, 1));

    getComparisonExchangeData({
      dates: dateOptions.slice(0, 1).map((e) => e.value),
    });
    fetchUtilityTrendData({
      buyers: trendBuyer,
      sellers: trendSeller,
      startDate: startDate,
      endDate: endDate,
      exchange: BuyerSellerState.BuyerSeller.filters[0],
      product: BuyerSellerState.BuyerSeller.filters[1],
      region: BuyerSellerState.BuyerSeller.filters[2],

    });
  }, []);
  const [exchangeLoading, setExchangeLoading] = useState(true);
  const [realTimeLoading, setRealTimeLoading] = useState(true);
  const [buyerSellerLoading, setBuyerSellerLoading] = useState(true);
  const [utilityTrendLoading, setUtilityTrendLoading] = useState(true);
  return (
    <div>
      {/* Header */}
      <div className="header">
        <div>
          <h1>Exchange</h1>
        </div>
        <div className="header-side-area">
          <div className="header-tab-selection"> 
            {tabs.map((tab, index) => {
              return (
                <button
                  key={index}
                  onClick={() => {
                    tabs.forEach((tab) => {
                      tab.active = false;
                    });
                    tab.active = true;
                    dispatch(setExchangePage(index));
                  }}
                  className={`tab ${state.page === index ? "tab-active" : ""} ${
                    index === 0
                      ? "tab-left"
                      : index === tabs.length - 1
                      ? "tab-right"
                      : ""
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
          {state.page === 2 && <div></div>}

          {state.page=== 4 && (
            <div className="header-side-area">
            <Select
              placeholder="Select Months..."
              value={selectedOptions.map(option => ({ ...option, isFixed: false }))}
              isMulti={true}
              onChange={(value) => {
                setSelectedOptions(value as any);
                getComparisonExchangeData
                ({ dates: value.map((e) => e.value) });
              }}
              
              styles={searchStyle}

              options={
                /* date options that are not in the selected options */
                dateOptions.filter(
                  (option) =>
                    !selectedOptions.map((e) => e.label).includes(option.label)
                ).map((option) => ({ ...option, isFixed: false }))
              }
            />
          </div>
          )}

          {getActivateFilter(true) && (
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
                  getExchangeData({
                    start_date: new Date(e.target.value),
                    end_date: endDate,
                  });
                  fetchBuyerVsSellerData({
                    start_date: new Date(e.target.value),
                    end_date: endDate,
                    product: BuyerSellerState.BuyerSeller.filters[1],
                    exchange: BuyerSellerState.BuyerSeller.filters[0],
                    region: BuyerSellerState.BuyerSeller.filters[2],
                  });
                  fetchUtilityTrendData({
                    buyers: trendBuyer,
                    sellers: trendSeller,
                    startDate: new Date(e.target.value),
                    endDate: endDate,
                    exchange: BuyerSellerState.BuyerSeller.filters[0],
                    product: BuyerSellerState.BuyerSeller.filters[1],

                    region: BuyerSellerState.BuyerSeller.filters[2],

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
                  getExchangeData({
                    start_date: startDate,
                    end_date: new Date(e.target.value),
                  });
                  fetchBuyerVsSellerData({
                    start_date: startDate,
                    end_date: new Date(e.target.value),
                    product: BuyerSellerState.BuyerSeller.filters[1],
                    exchange: BuyerSellerState.BuyerSeller.filters[0],
                    region: BuyerSellerState.BuyerSeller.filters[2],
                  });
                  fetchUtilityTrendData({
                    buyers: trendBuyer,
                    sellers: trendSeller,
                    startDate: startDate,
                    endDate: new Date(e.target.value),
                    exchange: BuyerSellerState.BuyerSeller.filters[0],
                    product: BuyerSellerState.BuyerSeller.filters[1],

                    region: BuyerSellerState.BuyerSeller.filters[2],

                  });
                }}
              />
            </div>
          )}
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
      <div className={state.page != 3 ? "content2-padding-body" : ""}>
        {/* Filters */}
        {getActivateFilter(false) && (
          <div className="filters">
            <div className="legend-exchangeSelection">
              <div className="exchange-selection">
                {state.page === (1 as any) 
                  ? 
                  ["DAM", "GDAM", "HPDAM", "RTM"].map((exchange, index) => {
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
                  })
                  :
                  ["IEX", "PXIL", "HPX"].map((exchange, index) => {
                    return (
                      <button
                        key={index}
                        className={`tab-small ${
                          state.Exchange.selectedExchange === index
                            ? "tab-active"
                            : ""
                        } ${
                          index === 0
                            ? "tab-left"
                            : index === 2
                            ? "tab-right"
                            : ""
                        }`}
                        onClick={() => {
                          dispatch(setSelectedExchange(index));
                        }}
                      >
                        {exchange}
                      </button>
                    );
                  
                  
                  }
                )}
              </div>
              <div className="legend">
                Legends
                <div className="legend-items">
                  {exchangeLegends.map((legend, index) => {
                    return (
                      <div
                        key={index}
                        className={`legend-item ${
                          legend.active ? "legend-item-active" : ""
                        } ${
                          index === 0
                            ? "legend-item-left"
                            : index === exchangeLegends.length - 1
                            ? "legend-item-right"
                            : ""
                        }
                         
                        
                    `}
                      >
                        <p style={{ color: legend.color }}>
                          {" "}
                          <div
                            className="dot"
                            style={{ backgroundColor: legend.color }}
                          ></div>{" "}
                          {legend.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Chart Area */}
        {state.page === 0 ? (
          <div className="exchange-chart-area">
            <div className="exchange-byExchange-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="DAM"
                                syncId="byExchange"

                  data={
                    state.Exchange.selectedExchange === 0
                      ? state.Exchange.data.iex.dam
                      : state.Exchange.selectedExchange === 1
                      ? state.Exchange.data.pxil.dam
                      : state.Exchange.data.hpx.dam
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <div className="exchange-byExchange-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="GDAM"
                  syncId="byExchange"


                  data={
                    state.Exchange.selectedExchange === 0
                      ? state.Exchange.data.iex.gdam
                      : state.Exchange.selectedExchange === 1
                      ? state.Exchange.data.pxil.gdam
                      : state.Exchange.data.hpx.gdam
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <div className="exchange-byExchange-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="HPDAM"
                  syncId="byExchange"

                  data={
                    state.Exchange.selectedExchange === 0
                      ? state.Exchange.data.iex.hpdam
                      : state.Exchange.selectedExchange === 1
                      ? state.Exchange.data.pxil.hpdam
                      : state.Exchange.data.hpx.hpdam
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <div className="exchange-byExchange-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="RTM"
                  syncId="byExchange"

                  data={
                    state.Exchange.selectedExchange === 0
                      ? state.Exchange.data.iex.rtm
                      : state.Exchange.selectedExchange === 1
                      ? state.Exchange.data.pxil.rtm
                      : state.Exchange.data.hpx.rtm
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <ExchangeChart
              shownLegnends={[]}
              setShownLegends={function (legends: string[]): void {}}
              data={state.Exchange.data.iex.dam}
              title="DAM"
              syncId="byExchange"
              height="6%"
              width="99%"
              showBrush={true}
              onlyBrush={true}
            />
          </div>
        ) : state.page == 1 ? (
          <div className="exchange-chart-area">
            <div className="exchange-byProduct-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="IEX"
                  syncId="byProduct"

                  data={
                    state.Exchange.selectedProduct === 0
                      ? state.Exchange.data.iex.dam
                      : state.Exchange.selectedProduct === 1
                      ? state.Exchange.data.iex.gdam
                      : state.Exchange.selectedProduct === 2
                      ? state.Exchange.data.iex.hpdam
                      : state.Exchange.data.iex.rtm
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <div className="exchange-byProduct-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="PXIL"
                  syncId="byProduct"

                  data={
                    state.Exchange.selectedProduct === 0
                      ? state.Exchange.data.pxil.dam
                      : state.Exchange.selectedProduct === 1
                      ? state.Exchange.data.pxil.gdam
                      : state.Exchange.selectedProduct === 2
                      ? state.Exchange.data.pxil.hpdam
                      : state.Exchange.data.pxil.rtm
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <div className="exchange-byProduct-chart">
              <ResponsiveContainer>
                <ExchangeChart
                  title="HPX"
                  syncId="byProduct"

                  data={
                    state.Exchange.selectedProduct === 0
                      ? state.Exchange.data.hpx.dam
                      : state.Exchange.selectedProduct === 1
                      ? state.Exchange.data.hpx.gdam
                      : state.Exchange.selectedProduct === 2
                      ? state.Exchange.data.hpx.hpdam
                      : state.Exchange.data.hpx.rtm
                  }
                  shownLegnends={[]}
                  setShownLegends={function (legends: string[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </ResponsiveContainer>
            </div>
            <ExchangeChart
              shownLegnends={[]}
              setShownLegends={function (legends: string[]): void {}}
              data={state.Exchange.data.iex.dam}
              title="DAM"
              syncId="byProduct"
              height="4%"
              width="100%"
              showBrush={true}
              onlyBrush={true}
            />
          </div>
        ) : state.page == 2 ? (
          /* Realtime Chart */
          <div className="p-5">
            <div className="justify-between container-chart">
              <div className="flex flex-row justify-between"></div>

              <div className="onechart-container">
                <div className="flex justify-center gap-8"></div>
                <div className="realTime-chart">
                  <div className="flex justify-between">
                    <h1> Price (IEX) ({COST_UNIT}) </h1>
                    <div className="date-selection">
                      <div>
                        {RealTimeChartData.map((data, index) => {
                          return (
                            <button
                              className={`tab-dateSelection ${
                                realTimechartIndex === index &&
                                "tab-dateSelection-active"
                              } ${
                                index === 0
                                  ? "tab-left"
                                  : index === RealTimeChartData.length - 1
                                  ? "tab-right"
                                  : ""
                              }`}
                              onClick={() => setRealtimeChartIndex(index)}
                            >
                              {data.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <ReLineChart
                    data={
                      RealTimeChartData.length > 0
                        ? RealTimeChartData[realTimechartIndex!].data
                        : []
                    }
                    unit={COST_UNIT}
                    yAxisLabel={COST_UNIT}
                    legends={
                      RealTimeChartData.length > 0
                        ? Object.keys(
                            RealTimeChartData[realTimechartIndex!].data[0]
                          ).map((item, index) => {
                            return {
                              dataKey: item,
                              name: item.replace("_rates", ""),
                              stroke:
                                COLORS[
                                  index > COLORS.length - 1
                                    ? index - COLORS.length
                                    : index
                                ],
                            };
                          })
                        : []
                    }
                    xDataKey={"timeslot"}
                  />
                </div>
              </div>
            </div>
            {/* <FootNote source="Source - IEX" /> */}
          </div>
        ) : state.page == 3 ? (
          <div>
            <div>
              <div className="body-container">
                
                  <div className="side-filters-container">
                    {BuyerSellerFilters.map((filter, index) => {
                      return (
                        <div className="side-filter-item">
                          <h4>{filter.name}</h4>
                          <div>
                            {filter.filters.map((subfilter, subindex) => {
                              return (
                                <>
                                  <p
                                    className={`side-filter-subitem ${
                                      BuyerSellerState.BuyerSeller.filters[
                                        index
                                      ].filters.findIndex(
                                        (item) => item.name === subfilter.name
                                      ) !== -1
                                        ? "side-filter-subitem-active"
                                        : ""
                                    }`}
                                    onClick={async () => {
                                      let temp = JSON.parse(
                                        JSON.stringify(
                                          BuyerSellerState.BuyerSeller.filters
                                        )
                                      );
                                      if (
                                        BuyerSellerState.BuyerSeller.filters[
                                          index
                                        ].filters.findIndex(
                                          (item) => item.name === subfilter.name
                                        ) === -1
                                      ) {
                                        temp[index].filters.push({
                                          id: subfilter.id,
                                          name: subfilter.name,
                                        });
                                        dispatch(
                                          AddBuyerSellerFilter({
                                            index,
                                            filter: subfilter,
                                          })
                                        );
                                      } else {
                                        temp[index].filters = temp[
                                          index
                                        ].filters.filter(
                                          (item: any) =>
                                            item.name !== subfilter.name
                                        );
                                        dispatch(
                                          RemoveBuyerSellerFilter({
                                            index,
                                            filter: subfilter,
                                          })
                                        );
                                      }

                                      fetchBuyerVsSellerData({
                                        start_date: startDate,
                                        end_date: endDate,
                                        exchange: temp[0],
                                        product: temp[1],
                                        region: temp[2],
                                      });
                                      fetchUtilityTrendData({
                                        buyers: trendBuyer,
                                        sellers: trendSeller,
                                        startDate: startDate,
                                        endDate: endDate,
                                        exchange: temp[0],
                                        product: temp[1],
                                        region: temp[2],
                                      });
                                    }}
                                  >
                                    {subfilter.name}
                                  </p>
                                  <hr className="hr-small" />
                                </>
                              );
                            })}{" "}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                <div className="w-full h-full">
                  <div className="tabselection-buyerseller m-3">
                    <div>
                      {BuyerSellerTab.map((tab, index) => {
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setBuyerSellerPage(index);
                            }}
                            className={`tab-buyerseller ${
                              buyerSellerPage === index ? "tab-active" : ""
                            } ${
                              index === 0
                                ? "tab-buyerseller-left"
                                : index === BuyerSellerTab.length - 1
                                ? "tab-buyerseller-right"
                                : ""
                            }`}
                          >
                            {tab}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {buyerSellerPage === 0 ? (
                    <div className="exchange-topplayers-container">
                      <div className="exchange-topplayers-players-container">
                        <div className="exchange-topplayers-players-chartarea">
                          <h3>Buyers (MWh)</h3>
                          <div className="buyerSellerChart">
                            <div
                              className="exchange-topplayers-players"
                              style={{
                                height: `${
                                  BuyerSellerState.BuyerSeller.Data.buyer
                                    .length * 8
                                }vh`,
                              }}
                            >
                              <BuyerSellerChart
                                data={BuyerSellerState.BuyerSeller.Data.buyer}
                                showLegend={false}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="exchange-topplayers-players-chartarea">
                          <h3>Sellers (MWh)</h3>
                          <div className="buyerSellerChart">
                            <div
                              className="exchange-topplayers-players"
                              style={{
                                height: `${
                                  BuyerSellerState.BuyerSeller.Data.seller
                                    .length * 8
                                }vh`,
                              }}
                            >
                              <BuyerSellerChart
                                data={BuyerSellerState.BuyerSeller.Data.seller}
                                showLegend={false}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="exchange-topplayers-region-container">
                        <div className="exchange-topplayers-players-chartarea">
                          <h3 className="buyerseller-heading">
                            By Region (MWh)
                          </h3>
                          <div className="exchange-buyerseller-region-chart-area">
                            <div className="topplayer-legends">
                              <div>
                                {BuyerSellerState.BuyerSeller.Data.region_buyer.map(
                                  (item, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className="flex justify-between mb-2"
                                      >
                                        <div className="realTime-Legend">
                                          <p>
                                            <div
                                              className="dot"
                                              style={{
                                                backgroundColor:
                                                  COLORS[index],
                                              }}
                                            ></div>
                                            {item.name}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                            <BuyerSellerPieChart
                              data={
                                BuyerSellerState.BuyerSeller.Data.region_buyer
                              }
                            />
                          </div>
                        </div>
                        <div className="exchange-topplayers-players-chartarea">
                          <h3 className="buyerseller-heading">
                            By Region ({VOLUME_UNIT})
                          </h3>
                          <div className="exchange-buyerseller-region-chart-area">
                            <div className="topplayer-legends">
                              <div>
                                {BuyerSellerState.BuyerSeller.Data.region_seller.map(
                                  (item, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className="flex justify-between mb-2"
                                      >
                                        <div className="realTime-Legend">
                                          <p>
                                            {" "}
                                            <div
                                              className="dot"
                                              style={{
                                                backgroundColor:
                                                  COLORS[index],
                                              }}
                                            ></div>{" "}
                                            {item.name}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                            <BuyerSellerPieChart
                              data={
                                BuyerSellerState.BuyerSeller.Data.region_seller
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="exchange-buyerseller-trends-container">
                      <div className="exchange-buyerseller-trends-chart-container">
                        <h3 className="buyerseller-heading">Buyer</h3>
                        <Select
                          classNames={{}}
                          placeholder="Select Buyers"
                          value={[]}
                          defaultValue={[]}
                          isMulti={true}
                          onChange={(e) => {
                            console.log(e);

                            if (
                              trendBuyer.filter((item) => e[0].value == item)
                                .length === 0
                            ) {
                              setTrendBuyer([
                                ...trendBuyer,
                                e.map((item) => item.value)[0],
                              ]);

                              fetchUtilityTrendData({
                                sellers: trendSeller,
                                buyers: [
                                  ...trendBuyer,
                                  e.map((item) => item.value)[0],
                                ],
                                startDate: startDate,
                                endDate: endDate,
                                exchange: BuyerSellerState.BuyerSeller.filters[0],
                                product: BuyerSellerState.BuyerSeller.filters[1],

                                region: BuyerSellerState.BuyerSeller.filters[2],
                              });
                            } else {
                              fetchUtilityTrendData({
                                sellers: trendSeller,
                                buyers: trendBuyer.filter(
                                  (item) =>
                                    item !== e.map((item) => item.value)[0]
                                ),
                                startDate: startDate,
                                endDate: endDate,
                                exchange: BuyerSellerState.BuyerSeller.filters[0],
                                product: BuyerSellerState.BuyerSeller.filters[1],

                                region: BuyerSellerState.BuyerSeller.filters[2],

                              });
                              setTrendBuyer(
                                trendBuyer.filter(
                                  (item) =>
                                    item !== e.map((item) => item.value)[0]
                                )
                              );
                            }
                          }}
                          className="trendFilter"
                          options={BuyerSellerState.Trend.filters.buyer_name
                            .filter((item) => !trendBuyer.includes(item))
                            .map((item) => {
                              return {
                                value: item,
                                label: item,
                                isFixed: false,
                              };
                            })}
                          styles={searchStyle}
                        />
                        <div className="buyerSeller-legends">
                          {trendBuyer.map((item, index) => {
                            return (
                              <button
                                onClick={() => {
                                  setTrendBuyer(
                                    trendBuyer.filter((item2) => item2 !== item)
                                  );
                                  fetchUtilityTrendData({
                                    sellers: trendSeller,
                                    buyers: trendBuyer.filter(
                                      (item2) => item2 !== item
                                    ),
                                    startDate: startDate,
                                    endDate: endDate,
                                    exchange: BuyerSellerState.BuyerSeller.filters[0],
                                    product: BuyerSellerState.BuyerSeller.filters[1],
    
                                    region: BuyerSellerState.BuyerSeller.filters[2],
    
                                  });
                                }}
                                key={index}
                                className="flex justify-between"
                              >
                                <div className="buyerSeller-Legend">
                                  <p>
                                    <div
                                      className="dot"
                                      style={{
                                        backgroundColor:
                                          COLORS[
                                            index > COLORS.length - 1
                                              ? index - COLORS.length
                                              : index
                                          ],
                                      }}
                                    ></div>
                                    {item}
                                    <Cross />
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="trends-chart">
                          <UtilizationTrendChart
                            data={BuyerSellerState.Trend.data.buyer}
                            mcp={BuyerSellerState.Trend.data.mcp}
                            legends={trendBuyer.map((item) => {
                              return {
                                dataKey: item,
                                name: item,
                          
                              };
                            })}
                          />
                        </div>
                      </div>
                      <div className="exchange-buyerseller-trends-chart-container">
                        <h3 className="buyerseller-heading">Seller</h3>
                        <Select
                          classNames={{}}
                          placeholder="Select Sellers"
                          value={[]}
                          defaultValue={[]}
                          isMulti={true}
                          onChange={(e) => {
                            console.log(e);

                            if (
                              trendSeller.filter((item) => e[0].value == item)
                                .length === 0
                            ) {
                              setTrendSeller([
                                ...trendSeller,
                                e.map((item) => item.value)[0],
                              ]);

                              fetchUtilityTrendData({
                                buyers: trendBuyer,
                                sellers: [
                                  ...trendSeller,
                                  e.map((item) => item.value)[0],
                                ],
                                startDate: startDate,
                                endDate: endDate,
                                exchange: BuyerSellerState.BuyerSeller.filters[0],
                                product: BuyerSellerState.BuyerSeller.filters[1],

                                region: BuyerSellerState.BuyerSeller.filters[2],

                              });
                            } else {
                              fetchUtilityTrendData({
                                buyers: trendBuyer,
                                sellers: trendSeller.filter(
                                  (item) =>
                                    item !== e.map((item) => item.value)[0]
                                ),
                                startDate: startDate,
                                endDate: endDate,
                                exchange: BuyerSellerState.BuyerSeller.filters[0],
                                product: BuyerSellerState.BuyerSeller.filters[1],

                                region: BuyerSellerState.BuyerSeller.filters[2],

                              });
                              setTrendSeller(
                                trendSeller.filter(
                                  (item) =>
                                    item !== e.map((item) => item.value)[0]
                                )
                              );
                            }
                          }}
                          className="trendFilter"
                          options={BuyerSellerState.Trend.filters.seller_name
                            .filter((item) => !trendSeller.includes(item))
                            .map((item) => {
                              return {
                                value: item,
                                label: item,
                                isFixed: false,
                              };
                            })}
                          styles={searchStyle}
                        />
                        <div className="buyerSeller-legends">
                          {trendSeller.map((item, index) => {
                            return (
                              <button
                                onClick={() => {
                                  setTrendSeller(
                                    trendSeller.filter(
                                      (item2) => item2 !== item
                                    )
                                  );
                                  fetchUtilityTrendData({
                                    buyers: trendBuyer,
                                    sellers: trendSeller.filter(
                                      (item2) => item2 !== item
                                    ),
                                    startDate: startDate,
                                    endDate: endDate,
                                    exchange: BuyerSellerState.BuyerSeller.filters[0],
                                    product: BuyerSellerState.BuyerSeller.filters[1],
    
                                    region: BuyerSellerState.BuyerSeller.filters[2],
    
                                  });
                                }}
                                key={index}
                                className="flex justify-between"
                              >
                                <div className="buyerSeller-Legend">
                                  <p>
                                    <div
                                      className="dot"
                                      style={{
                                        backgroundColor:
                                          COLORS[
                                            index > COLORS.length - 1
                                              ? index - COLORS.length
                                              : index
                                          ],
                                      }}
                                    ></div>
                                    {item}
                                    <Cross />
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="trends-chart">
                          <UtilizationTrendChart
                            data={BuyerSellerState.Trend.data.seller}
                            mcp={BuyerSellerState.Trend.data.mcp}
                            legends={trendSeller.map((item) => {
                              return {
                                dataKey: item,
                                name: item,
                                stroke:
                                  ExchangeColors[trendBuyer.indexOf(item)],
                              };
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>{" "}
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}


            {/* Content */}
            {/* Removing Padding for the Market Editing Page */}

            <div className={ ""}>
              {/* Filters */}
              { (
                <div className="filters">
                  <div className="legend-exchangeSelection">
                    <div className="exchange-selection">
                      {state.page === (0 as any)
                        ? ["IEX", "PXIL", "HPX"].map((exchange, index) => {
                            return (
                              <button
                                key={index}
                                className={`tab-small ${
                                  selectedComparisonExchange === index
                                    ? "tab-active"
                                    : ""
                                } ${
                                  index === 0
                                    ? "tab-left"
                                    : index === 2
                                    ? "tab-right"
                                    : ""
                                }`}
                                onClick={() => {
                                  setSelectedComparisonExchange(index);
                                }}
                              >
                                {exchange}
                              </button>
                            );
                          })
                        : ["IEX","PXIL","HPX"].map(
                            (exchange, index) => {
                              return (
                                <button
                                  key={index}
                                  className={`tab-small ${
                                    selectedComparisonExchange === index
                                      ? "tab-active"
                                      : ""
                                  } ${
                                    index === 0
                                      ? "tab-left"
                                      : index === 2
                                      ? "tab-right"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedComparisonExchange(index);
                                  }}
                                >
                                  {exchange}
                                </button>
                              );
                            }
                          )}
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
                      selectedComparisonExchange === 0
                        ? chartData.data.iex.dam
                        : selectedComparisonExchange === 1
                        ? chartData.data.pxil.dam
                        : chartData.data.hpx.dam
                    }
                  />

                  <ComparisonChart
                    title="GDAM"
                    data={
                      selectedComparisonExchange === 0
                        ? chartData.data.iex.gdam
                        : selectedComparisonExchange === 1
                        ? chartData.data.pxil.gdam
                        : chartData.data.hpx.gdam
                    }
                  />

                  <ComparisonChart
                    title="HPDAM"
                    data={
                      selectedComparisonExchange === 0
                        ? chartData.data.iex.hpdam
                        : selectedComparisonExchange === 1
                        ? chartData.data.pxil.hpdam
                        : chartData.data.hpx.hpdam
                    }
                  />

                  <ComparisonChart
                    title="RTM"
                    data={
                      selectedComparisonExchange === 0
                        ? chartData.data.iex.rtm
                        : selectedComparisonExchange === 1
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
                    <WeightedAverageChart
                      // data={chartData.data.iex.dam}
                      data= {
                        selectedComparisonExchange === 0
                        ? chartData.data.iex.dam
                        : selectedComparisonExchange === 1
                        ? chartData.data.pxil.dam
                        : chartData.data.hpx.dam
                      }
                      title="DAM"
                    />
                    <WeightedAverageChart
                      data={
                        selectedComparisonExchange === 0
                        ? chartData.data.iex.gdam
                        : selectedComparisonExchange === 1
                        ? chartData.data.pxil.gdam
                        : chartData.data.hpx.gdam
                      }
                      title="GDAM"
                    />

                    <WeightedAverageChart
                      data={
                        selectedComparisonExchange === 0
                        ? chartData.data.iex.hpdam
                        : selectedComparisonExchange === 1
                        ? chartData.data.pxil.hpdam
                        : chartData.data.hpx.hpdam
                      }
                      title="HPDAM"
                    />

                    <WeightedAverageChart
                      data={
                        selectedComparisonExchange === 0
                        ? chartData.data.iex.rtm
                        : selectedComparisonExchange === 1
                        ? chartData.data.pxil.rtm
                        : chartData.data.hpx.rtm
                      }
                      title="RTM"
                    />
                </div>
              )}
            </div>
          </div>
        )}{" "}
      </div>
    </div>
  );
  async function getExchangeData({
    start_date = startDate,
    end_date = endDate,
  }) {
    try {
      setExchangeLoading(true);
      let formatedStartDate = start_date
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");
      let formatedEndDate = end_date
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");

      await dispatch(
        fetchExchangeData({
          start_date: formatedStartDate,
          end_date: formatedEndDate,
        }) as any
      );
      setExchangeLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      swal(
        "Something Went Wrong",
        "Error fetching Exchange Data. Please try again later",
        "warning"
      );
    }
  }

  async function fetchRealTimeData() {
    console.log("fetching data");
    try {
      setRealTimeLoading(true);
      const response = await fetch("https://datahub.gna.energy/rtm_api");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: any = await response.json();

      // const data = RealTimeData as any;
      const reChartTemp: RealTimeChartData[] = [];
      Object.keys(data).forEach((key: string, index) => {
        reChartTemp.push({
          title: key,
          data: [],
        });
        Object.keys(data[key]).forEach((key2: string, index2) => {
          Object.keys(data[key][key2]).forEach((key3: string, index3) => {
            if (reChartTemp[index].data[index3 as any] == undefined) {
              reChartTemp[index as any].data[index3 as any] = {
                timeslot: index3 + 1,
              };
            }
            try {
              reChartTemp[index].data[index3 as any][key2 as any] = parseFloat(
                data[key][key2][key3]
              );
            } catch (e) {
              console.log(data[key][key2]);
              console.log(e);
            }
          });
        });
      });

      Object.keys(data).forEach((key: string) => {});

      setRealTimeChartData(reChartTemp);
      setRealTimeLoading(false);

      console.log("data - ", reChartTemp);
    } catch (error) {
      console.error("Error fetching data:", error);
      swal(
        "Something Went Wrong",
        "Error fetching Real Time Data. Please try again later",
        "warning"
      );
    }
  }

  async function fetchBuyerVsSellerData({
    start_date,
    end_date,
    exchange,
    product,
    region,
  }: {
    start_date: Date;
    end_date: Date;
    exchange: BuyerSellerFilter;
    product: BuyerSellerFilter;
    region: BuyerSellerFilter;
  }) {
    try {
      setBuyerSellerLoading(true);
      // setIsBuyerLoading(true);
      const res = await buildHttpReq({
        endpoint: "top_buyer_seller_api",
        body: {
          exchange: exchange.filters.map((item) => item.name),

          product: product?.filters.map((item) => item.name),
          region: region?.filters.map((item) => item.name),
          start_date: start_date
            .toLocaleDateString("en-GB")
            .split("/")
            .join("-"),
          end_date: end_date.toLocaleDateString("en-GB").split("/").join("-"),
        },
        method: "POST",
      });
      // setIsBuyerLoading(false);
      dispatch(
        setBuyerSellerData({
          buyer: res.buyer,
          seller: res.seller,
          region_buyer: res.region_buyer,
          region_seller: res.region_seller,
        })
      );
      setBuyerSellerLoading(false);
    } catch (e) {
      swal(
        "Something Went Wrong",
        "Error fetching Buyer Seller Data. Please try again later",
        "warning"
      );
      console.error("Error fetching data:", e);
    }
  }

  async function fetchUtilityTrendData({
    buyers,
    sellers,
    startDate,
    endDate,
    exchange,
    product,
    region,
  }: {
    buyers: string[];
    sellers: string[];
    startDate: Date;
    endDate: Date;
    exchange: BuyerSellerFilter;
    product: BuyerSellerFilter;
    region: BuyerSellerFilter;
    
  }) {
    try {
      setUtilityTrendLoading(true);
      const res = await buildHttpReq({
        endpoint: "buyer_seller_trend_api",
        body: {
          start_date: startDate
            .toLocaleDateString("en-GB")
            .split("/")
            .join("-"),
          end_date: endDate.toLocaleDateString("en-GB").split("/").join("-"),
          buyers: buyers,
          sellers: sellers,
          exchange: exchange.filters.map((item) => item.name),

          product: product?.filters.map((item) => item.name),
          region: region?.filters.map((item) => item.name),
        },
        method: "POST",
      });

      dispatch(setTrendData(res));
      setUtilityTrendLoading(false);
    } catch (e) {
      swal(
        "Something Went Wrong",
        "Error fetching Trend Data. Please try again later",
        "warning"
      );
      console.error("Error fetching data:", e);
    }
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
    } else if (state.page === 2) {
      return realTimeLoading;
    } else if (state.page === 3) {

      if (buyerSellerPage === 0) {
        return buyerSellerLoading;
      } else if (buyerSellerPage === 1) {
        return utilityTrendLoading;
      }
    } 
    else if (state.page === 4) {
      return ccomparisonLoading;
    } 
    else {
      return false;
    }
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
  async function getComparisonExchangeData({ dates }: { dates: Date[] }) {
    try {
      if (dates.length === 0) {
        return;
      }


      // let datesToFetch = Dates that are not in rawcomparison by comparing with start data 
      let datesToFetch: Date[] = dates.filter(
        (date) =>
          !state.Exchange.comparisonRawData.find(
            (item) => item.date_range.start_date === date.toLocaleDateString("en-GB").split("/").join("-")
          )
      );
      
      setComparisonLoading(true);

      console.log("Dates to fetch", datesToFetch);
      let apidata = [];
if(datesToFetch.length<0){
   return;
}


      let compRawData = state.Exchange.comparisonRawData;
      // check if any date is removed from the date range by comparing with the raw data
      if (dates.length <= compRawData.length) {

        const comparisonData: ComparisonData[] = [];
        let legends: LegendKey[] = [];
        for (let i = 0; i < dates.length; i++) {
          let data = {
            iex: FormatExchangeData(compRawData[i].data.iex),
            hpx: FormatExchangeData(compRawData[i].data.hpx),
            pxil: FormatExchangeData(compRawData[i].data.pxil),
          };
          comparisonData.push({
            date: `${Months[dates[i].getMonth()]}-${dates[i].getFullYear()}`,
            data: data,
          });
          legends.push({
            dataKey: `${Months[dates[i].getMonth()]}_${dates[i].getFullYear()}`,
            name: `${Months[dates[i].getMonth()]}-${dates[i].getFullYear()}`,
            stroke: getColorList(dates.length)[i],
          });
        }
        setChartData({
          data: reformatData(comparisonData),
          legends: legends,
        });
        console.log(reformatData(comparisonData));
        console.log("Comparison Data", compRawData);
        setComparisonLoading(false);
        return;
      }
      else{
     const res=await fetch(buildUrl("all_exchange_multiple_api_range"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          dates: datesToFetch.map((e) => ({
            start_date: e.toLocaleDateString("en-GB").split("/").join("-"),
            end_date: new Date(e.getFullYear(), e.getMonth() + 1, 0)
              .toLocaleDateString("en-GB")
              .split("/")
              .join("-"),
          })),
        }),
      })
       apidata = await res.json();
       compRawData= state.Exchange.comparisonRawData.concat(apidata) as any;
    }
          const comparisonData: ComparisonData[] = [];
          let legends: LegendKey[] = [];
          dispatch(setComparisonRawData(state.Exchange.comparisonRawData.concat(apidata) as any));

          for (let i = 0; i < compRawData.length; i++) {
            let data = {
              iex: FormatExchangeData(compRawData[i].data.iex),
              hpx: FormatExchangeData(compRawData[i].data.hpx),
              pxil: FormatExchangeData(compRawData[i].data.pxil),
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
          setComparisonLoading(false);
        }
        catch (error) {
          console.error("Error fetching data:", error);
          swal(
            "Something Went Wrong",
            "Error fetching Exchange Data. Please try again later",
            "warning"
          );
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
        if (
          cost !== null &&
          volume !== null &&
          !isNaN(cost) &&
          !isNaN(volume)
        ) {
          totalCostMonth += cost * volume;
          volumeMonth += volume;
        }
      });
      totalCost.push(totalCostMonth);
      volumes.push(volumeMonth);
    });

    weightedAverage.forEach((item, index) => {
      console.log(
        item.month,
        "Total Cost - ",
        totalCost[index],
        "Total volume - ",
        volumes[index]
      );
      item.value = totalCost[index] / volumes[index];
    });

    console.log(weightedAverage);

    return weightedAverage;
  }
  function WeightedAverageChart({ data, title }: { data: any; title: string }) {
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
      <ReBarChart
      showLegend={false}
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
      /></div>
    );
  }


}
