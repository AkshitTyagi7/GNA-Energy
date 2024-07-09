import { useEffect, useState } from "react";
import "./MarketMonitoring.css";
import { DemoExchangeData, Exchange, Markets } from "./DemoExchangeData";
import Select from "react-select";
import { Filter, Product } from "../../../store/state/MarketMontitoring/types";
import { filters } from "./Filters";
import {
  ColorBlue,
  ColorYellow,
  PrimaryColor,
  SecondaryColor,
  buildHttpReq,
} from "../../../common";
import { FormatByPriceData, FormatMarketMonitoringData } from "./FormatData";
import { ReLineChart } from "../../../components/recharts/ReCharts";
import { LegendKey } from "../../../models/chart_model";
// import { FormatMarketMonitoringData } from "./FormatData";
let startMonth: {
  value: number;
  label: string;
} = {
  value: -1,
  label: "",
};
let endMonth: {
  value: number;
  label: string;
} = {
  value: -1,
  label: "",
};
export function MarketMontoring() {
  useEffect(() => {
    fetchVolumeData({
      selectedExchange,
      selectedMarket,
      selectedProduct: selectedFilter,
      startMonth,
      endMonth,
    });
    fetchexchangeData({
      selectedExchange,
      selectedMarket,
      selectedProduct: byPriceProduct,
      startMonth,
      endMonth,
    });
  }, []);

  const [priceData, setPriceData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [subTabIndex, setSubTabIndex] = useState<number>(0);
  const [selectedMarket, setSelectedMarket] = useState<Filter[]>(Markets);
  const [selectedExchange, setSelectedExchange] = useState<Filter[]>(Exchange);
  const [selectedFilter, setSelectedFilter] = useState<Product[]>(
    getProducts({
      exchange: selectedExchange,
      market: selectedMarket,
    })
  );
  const [byPriceProduct, setByPriceProduct] = useState<Product>(
    getProducts({
      exchange: selectedExchange,
      market: selectedMarket,
    })[0]
  );
  // reset t

  const byVolumeKeys: LegendKey[] = [
    {
      dataKey: "dam",
      name: "DAM",
      stroke: PrimaryColor,
    },
    {
      dataKey: "rtm",
      name: "RTM",
      stroke: SecondaryColor,
    },
    {
      dataKey: "hpdam",
      name: "HPDAM",
      stroke: ColorYellow,
    },
    {
      dataKey: "gdam",
      name: "GDAM",
      stroke: "Green",
    },

    {
      dataKey: "intraDay",
      name: "Intra-Day Contracts",
      stroke: ColorBlue,
    },
    {
      dataKey: "contingencyContracts",
      name: "Day Ahead Contingency Contracts",
      stroke: "red",
    },
    {
      dataKey: "daily",
      name: "Daily Contracts",
      stroke: "slateblue",
    },
    {
      dataKey: "weekly",
      name: "Weekly Contracts",
      stroke: "black",
    },
    {
      dataKey: "monthly",
      name: "Monthly Contracts",
      stroke: "#710907",
    },
    // {
    //   dataKey: "anyDay",
    //   name: "Any Day Contracts",
    //   stroke: ColorYellow,
    // },
    {
      dataKey: "singleSided",
      name: "Any Day Single Sided Contracts",
      stroke: "#82ca9d",
    },
    {
      dataKey: "bilateral",
      name: "Bilateral",
      stroke: "skyblue",
    },
  ];

  const byProductKeys: LegendKey[] = [
    {
      dataKey: "hpx",
      name: "HPX",
      stroke: "rgb(17, 141, 255)",
    },
    {
      dataKey: "iex",
      name: "IEX",
      stroke: "rgb(18, 35, 158)",
    },
    {
      dataKey: "pxil",
      name: "PXIL",
      stroke: "rgb(230, 108, 55)",
    },
    {
      dataKey: "traders",
      name: "Traders",
      stroke: "#343C6A",
    },
  ];

  return (
    <div>
      <div className="header">
        <h1>Market Monitoring</h1>

        <div className="header-side-area">
          <div>
            <button
              onClick={() => {
                setTabIndex(0);
              }}
              className={`tab tab-left ${tabIndex === 0 ? "tab-active" : ""}`}
            >
              Cumulative
            </button>
            <button
              className={`tab tab-right ${tabIndex === 1 ? "tab-active" : ""}`}
              onClick={() => {
                setTabIndex(1);
              }}
            >
              Comparative
            </button>
          </div>

          <div className="flex space-x-2">
            <Select
              placeholder="Start Month"
              className="dateSelect"
              value={
                startMonth.value != -1 ?  {
                value: startMonth.value as any,
                label: startMonth.label,
              } : undefined
              }
              options={filters[2].subfilter.reverse().map((item) => {
                if (
                  endMonth.value === -1 ||
                  parseInt(item.id.toString()) <
                    parseInt(endMonth.value.toString())
                ) {
                  return {
                    value: item.id,
                    label: item.title,
                  };
                } else {
                  return {
                    value: item.id,
                    label: item.title,
                    isDisabled: true,
                  };
                }
              })}
              onChange={(selectedOption) => {
                startMonth = {
                  value: selectedOption!.value as number,
                  label: selectedOption!.label,
                };
                fetchVolumeData({
                  selectedExchange,
                  selectedMarket,
                  selectedProduct: selectedFilter,
                  startMonth,
                  endMonth,
                });
                fetchexchangeData({
                  selectedExchange,
                  selectedMarket,
                  selectedProduct: byPriceProduct,
                  startMonth,
                  endMonth,
                });
              }}
            />
            <Select
              placeholder="End Month"
              className="dateSelect"
              value={
                endMonth.value !=-1 ? {
                  value: endMonth.value as any,
                  label: endMonth.label,
                } : undefined
                }
              options={filters[2].subfilter.map((item) => {
                if (
                  parseInt(item.id.toString()) >
                  parseInt(startMonth.value.toString())
                ) {
                  return {
                    value: item.id,
                    label: item.title,
                  };
                } else {
                  return {
                    value: item.id,
                    label: item.title,
                    isDisabled: true,
                  };
                }
              })}
              onChange={(selectedOption) => {
                endMonth = {
                  value: selectedOption!.value as number,
                  label: selectedOption!.label,
                };
                fetchVolumeData({
                  selectedExchange,
                  selectedMarket,
                  selectedProduct: selectedFilter,
                  startMonth,
                  endMonth,
                });
                fetchexchangeData({
                  selectedExchange,
                  selectedMarket,
                  selectedProduct: byPriceProduct,
                  startMonth,
                  endMonth,
                });
                // fetchVolumeData();
              }}
            />
          </div>
        </div>
      </div>
      <div className="c">
        <div className="body-container">
          <div className="side-filters-container">
            <div className="side-filter-item">
              <h4>Market</h4>

              {Markets.map((item) => {
                return (
                  <p
                    className={`side-filter-subitem  ${
                      selectedMarket.includes(item)
                        ? "side-filter-subitem-active"
                        : ""
                    }`}
                    onClick={() => {
                      let filter;
                      if (selectedMarket.length === 3) {
                        setSelectedMarket([item]);
                        filter = [item];
                      } else if (selectedMarket.includes(item)) {
                        setSelectedMarket(
                          selectedMarket.filter((i) => i !== item)
                        );
                        filter = selectedMarket.filter((i) => i !== item);
                        if (filter.length === 0) {
                          setSelectedMarket(Markets);
                          filter = Markets;
                        }
                      } else {
                        setSelectedMarket([...selectedMarket, item]);
                        filter = [...selectedMarket, item];
                      }
                      // fetchVolumeData({
                      //   selectedExchange,
                      //   selectedMarket: filter,
                      //   selectedProduct: selectedFilter,
                      //   startMonth,
                      //   endMonth,
                      // });
                      // fetchexchangeData({
                      //   selectedExchange,
                      //   selectedMarket: filter,
                      //   selectedProduct: byPriceProduct,
                      //   startMonth,
                      //   endMonth,
                      // });
                    }}
                  >
                    {item.name}
                  </p>
                );
              })}
            </div>
            {tabIndex === 0 && (
              <div className="side-filter-item">
                <h4>Exchange / Trader</h4>

                {Exchange.map((item) => {
                  return (
                    <p
                      className={`side-filter-subitem ${
                        selectedExchange.includes(item)
                          ? "side-filter-subitem-active"
                          : ""
                      }`}
                      onClick={() => {
                        let filter;
                        if (selectedExchange.length === 4) {
                          setSelectedExchange([item]);
                        } else if (selectedExchange.includes(item)) {
                          setSelectedExchange(
                            selectedExchange.filter((i) => i !== item)
                          );
                          filter = selectedExchange.filter((i) => i !== item);
                          if (filter.length === 0) {
                            setSelectedExchange(Exchange);
                            filter = Exchange;
                          }
                        } else {
                          setSelectedExchange([...selectedExchange, item]);
                          filter = [...selectedExchange, item];
                        }
                      }}
                    >
                      {item.name}
                    </p>
                  );
                })}
              </div>
            )}
            {tabIndex === 1 && (
              <div className="side-filter-item">
                <h4>Product</h4>

                {getProducts({
                  exchange: selectedExchange,
                  market: selectedMarket,
                }).map((item) => {
                  return (
                    <p
                      className={`side-filter-subitem ${
                        tabIndex == 1
                          ? byPriceProduct.id == item.id
                            ? "side-filter-subitem-active"
                            : ""
                          : selectedFilter.filter((p) => p.id == item.id)
                              .length > 0
                          ? "side-filter-subitem-active"
                          : ""
                      }`}
                      onClick={() => {
                        if (tabIndex == 1) {
                          setByPriceProduct(item);
                          return;
                        }
                        if (
                          selectedFilter.filter((p) => p.id == item.id).length >
                          0
                        ) {
                          setSelectedFilter(
                            selectedFilter.filter((i) => i.id !== item.id)
                          );
                        } else {
                          setSelectedFilter([...selectedFilter, item]);
                        }
                      }}
                    >
                      {item.name}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          <div className="markeMonitoring-chart-container">
            <div className="markeMonitoring-chart">
              {tabIndex == 0 && (
                <>
                  <div className="flex justify-between">
                    {/* <h2 className="chartHeading">
                    By Volume ({VOLUME_UNIT})</h2> */}
                    <h2 className="chartHeading">
                      {subTabIndex == 0
                        ? "By Volume (MU)"
                        : "By Price (Rs/KWh)"}
                    </h2>
                    <div className="header-side-area">
                      <div>
                        <button
                          onClick={() => {
                            setSubTabIndex(0);
                          }}
                          className={`tab tab-left ${
                            subTabIndex === 0 ? "tab-active" : ""
                          }`}
                        >
                          By Volume
                        </button>
                        <button
                          className={`tab tab-right ${
                            subTabIndex === 1 ? "tab-active" : ""
                          }`}
                          onClick={() => {
                            setSubTabIndex(1);
                          }}
                        >
                          By Price
                        </button>
                      </div>
                    </div>
                  </div>
                  <ReLineChart
                    yAxisLabel={
                      subTabIndex == 0
                        ? "Volume (MU)"
                        : "Weighted Average Price (Rs/KWh)"
                    }
                    yAxisWidth={80}
                    data={
                      subTabIndex == 0
                        ? (FormatMarketMonitoringData(
                            volumeData,
                            selectedExchange.map((e) => e.name),
                            [ ...selectedMarket.map((e) => e.name), "Traders"] ,
                          ) as any)
                        : (FormatMarketMonitoringData(
                            priceData,
                            selectedExchange.map((e) => e.name),
                            [ ...selectedMarket.map((e) => e.name), "Traders", "Bilateral"] ,                            true
                          ) as any)
                    }
                    legends={byVolumeKeys.filter(
                      (e) =>
                        getProducts({
                          exchange: selectedExchange,
                          market: selectedMarket,
                        }).filter(
                          (product) => product.name == e.name ?? e.dataKey
                        ).length > 0
                    )}
                    unit={subTabIndex == 0 ? "MU" : "Rs/KWh"}
                    xDataKey="month"
                  />
                </>
              )}
              {tabIndex == 1 && (
                <>
                  <div className="flex justify-between">
                    {/* <h2 className="chartHeading">
                    By Volume ({VOLUME_UNIT})</h2> */}
                    <h2 className="chartHeading">
                      {subTabIndex == 0
                        ? "By Volume (MU)"
                        : "By Price (Rs/KWh)"}
                    </h2>
                    <div className="header-side-area">
                      <div>
                        <button
                          onClick={() => {
                            setSubTabIndex(0);
                          }}
                          className={`tab tab-left ${
                            subTabIndex === 0 ? "tab-active" : ""
                          }`}
                        >
                          By Volume
                        </button>
                        <button
                          className={`tab tab-right ${
                            subTabIndex === 1 ? "tab-active" : ""
                          }`}
                          onClick={() => {
                            setSubTabIndex(1);
                          }}
                        >
                          By Price
                        </button>
                      </div>
                    </div>
                  </div>
                  <ReLineChart
                    yAxisLabel={
                      subTabIndex == 0
                        ? "Volume (MU)"
                        : "Weighted Average Price (Rs/KWh)"
                    }
                    yAxisWidth={80}
                    data={
                      subTabIndex == 0
                        ? (FormatByPriceData(volumeData, [
                            byPriceProduct.name,
                            "Bilateral",
                          ],                          [ ...selectedMarket.map((e) => e.name), "Traders"] ,
                        ) as any)
                        : FormatByPriceData(
                            priceData,
                            [byPriceProduct.name, "Trading Licensees"],
                            [ ...selectedMarket.map((e) => e.name), "Traders"] ,                            true
                          )
                    }
                    legends={byProductKeys}
                    unit={subTabIndex == 0 ? "MU" : "Rs/KWh"}
                    xDataKey="month"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  async function fetchVolumeData({
    selectedExchange,
    selectedMarket,
    selectedProduct,
    startMonth,
    endMonth,
  }: {
    selectedExchange: Filter[];
    selectedMarket: Filter[];
    selectedProduct: Product[];
    startMonth: { value: number; label: string };
    endMonth: { value: number; label: string };
  }) {
    
    const res = await buildHttpReq({
      endpoint: "market_monitoring_volume_api",
      method: "POST",
      body: {
        exchange: "HPX,IEX,PXIL,Traders",
        market: selectedMarket.map((item) => item.name).toString(),
        product: selectedProduct.map((item) => item.name).toString(),
        start_month: startMonth.label,
        end_month: endMonth.label,
      },
    });

    setVolumeData(res);

    tabIndex == 0 && setChartData(FormatMarketMonitoringData(res));
  }

  async function fetchexchangeData({
    selectedExchange,
    selectedMarket,
    selectedProduct,
    startMonth,
    endMonth,
  }: {
    selectedExchange: Filter[];
    selectedMarket: Filter[];
    selectedProduct: Product;
    startMonth: { value: number; label: string };
    endMonth: { value: number; label: string };
  }) {
    const byPrice = await buildHttpReq({
      endpoint: "market_monitoring_price_api",
      method: "POST",
      body: {
        exchange: "HPX,IEX,PXIL,Traders",
        market: selectedMarket.map((item) => item.name).toString(),
        product:
          byVolumeKeys.map((item) => item.name).toString() +
          ",Trading Licensees",
        start_month: startMonth.label,
        end_month: endMonth.label,
      },
    });
    tabIndex == 1 && setChartData(FormatByPriceData(byPrice));
    console.log("Setting by Price - ", byPrice);
    console.log(byPrice);
    setPriceData(byPrice);
  }
  function getProducts({
    market,
    exchange,
  }: {
    market: Filter[];
    exchange: Filter[];
  }): Product[] {
    const marketProducts = market.flatMap((m) => m.products);
    const exchangeProducts = exchange.flatMap((e) => e.products);

    const uniqueMarketProducts = Array.from(new Set(marketProducts));
    const uniqueExchangeProducts = Array.from(new Set(exchangeProducts));

    const commonProducts = uniqueMarketProducts.filter((mp) =>
      uniqueExchangeProducts.some((ep) => ep.id === mp.id)
    );
    if (exchange.filter((item) => item.name == "Traders").length !== 0) {
      tabIndex == 0 && commonProducts.push({ id: 13, name: "Bilateral" });
    }

    return commonProducts;
  }
}
