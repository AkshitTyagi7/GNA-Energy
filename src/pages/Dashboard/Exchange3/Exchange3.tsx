import { useEffect, useState } from "react";
import { COST_UNIT, MEGA_POWER_UNIT } from "../../../Units";
import {
  PrimaryColor,
  QuaternaryColor,
  SecondaryColor,
  TertiaryColor,
  buildHttpReq,
} from "../../../common";
import { tab } from "./interface/tabs";
import "./styles.css";
import { ExchangeLegend } from "./interface/legends";
import {
  ExchangeColors,
  ExchangeData,
  FormatDataOfRealtime,
  FormatExchangeData,
  RealTimeChartData,
  // formatRealTimeChartData,
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
  ExchangeState,
  RemoveBuyerSellerFilter,
  setBuyerSellerData,
  setTrendData,
} from "../../../store/state/BuyerSellerState";
import { RootState } from "../../../store/store";
import {
  fetchExchangeData,
  setExchangePage,
  setSelectedExchange,
  setSelectedProduct,
} from "../../../store/state/Exchange/ExchangeState";
import GetChartOptions from "../../../components/charts/data/GetChartOption";
import FootNote from "../../../components/charts/footnote";
import { RawLineChart } from "../../../components/charts/Charts";
import { MediumButton } from "../../../components/Button";
import { get } from "http";
import Select from "react-select";
import { ReactComponent as Cross } from "../../../icons/cross.svg";
import Loading from "../../../components/Loading";
import { COLORS, ReChartData, ReLineChart } from "../../../components/charts/ReCharts";
export function Exchange3() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000)
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

  const [realTimechartIndex, setRealtimeChartIndex] = useState<number>(1);
  const maxDate = new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000);

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
    fetchUtilityTrendData({
      buyers: trendBuyer,
      sellers: trendSeller,
      startDate: startDate,
      endDate: endDate,
    });
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div>
          <h1>Exchange</h1>
        </div>
        <div className="header-side-area">
          <div>
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
          {state.page === 2 && (
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
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>
      {/* Content */}
      {/* Removing Padding for the Market Editing Page */}
      <div className={state.page != 3 ? "content2-padding-body" : ""}>
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
              <div className="legend">
                Legend
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
              syncId="byProduct"
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

              <div
                className="onechart-container"
              >
                <div className="flex justify-center gap-8">

                </div>
                <div className="realTime-chart">
                  <h1>{RealTimeChartData[realTimechartIndex] == undefined || null  ? "" : RealTimeChartData[realTimechartIndex].title} Prices {COST_UNIT}</h1>
                  <ReLineChart
                    data={
                      RealTimeChartData.length > 0
                        ? RealTimeChartData[realTimechartIndex!].data
                        : []
                    }
                    unit={COST_UNIT}
                    legends={
                      RealTimeChartData.length > 0
                        ? Object.keys(
                            RealTimeChartData[realTimechartIndex!].data[0]
                          ).map((item, index) => {
                            return {
                              dataKey: item,
                              name: item.replace("_rates", ""),
                              stroke:COLORS[index > COLORS.length - 1 ? index - COLORS.length : index] 
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
        ) : (
          <div>
            <div>
              <div className="body-container">
                {buyerSellerPage == 0 && (
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
                )}
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
                        <div className="exchange-topplayers-players-chartarea flex">
                          <div className="topplayer-legends">
                            <h3 className="buyerseller-heading">By Region</h3>
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
                                                ExchangeColors[index],
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
                        <div className="exchange-topplayers-players-chartarea flex">
                          <div className="topplayer-legends">
                            <h3 className="mb-4 buyerseller-heading">
                              By Region
                            </h3>
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
                                                ExchangeColors[index],
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
                                        backgroundColor: COLORS[
                                          index > COLORS.length - 1 ? index - COLORS.length : index
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
                                stroke: ExchangeColors[trendBuyer.indexOf(item)],
                              };
                            
                              }
                            )}
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
                                        backgroundColor: COLORS[
                                          index > COLORS.length - 1 ? index - COLORS.length : index
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
                                stroke: ExchangeColors[trendBuyer.indexOf(item)],
                              };
                            
                              }
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>{" "}
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
      let formatedStartDate = start_date
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");
      let formatedEndDate = end_date
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");

      dispatch(
        fetchExchangeData({
          start_date: formatedStartDate,
          end_date: formatedEndDate,
        }) as any
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchRealTimeData() {
    console.log("fetching data");
    try {
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

      console.log("data - ", reChartTemp);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    // setIsBuyerLoading(true);
    const res = await buildHttpReq({
      endpoint: "top_buyer_seller_api",
      body: {
        exchange: exchange.filters.map((item) => item.name),

        product: product?.filters.map((item) => item.name),
        region: region?.filters.map((item) => item.name),
        start_date: start_date.toLocaleDateString("en-GB").split("/").join("-"),
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
  }

  async function fetchUtilityTrendData({
    buyers,
    sellers,
    startDate,
    endDate,
  }: {
    buyers: string[];
    sellers: string[];
    startDate: Date;
    endDate: Date;
  }) {
    try {
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
        },
        method: "POST",
      });

      dispatch(setTrendData(res));
    } catch (e) {
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
}
