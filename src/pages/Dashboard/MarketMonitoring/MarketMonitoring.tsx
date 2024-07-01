import { useEffect, useState } from "react";
import { PowerBiFrame } from "../../../components/frame";
import "./MarketMonitoring.css";
import { DemoExchangeData, Exchange, Markets } from "./DemoExchangeData";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { MediumButton } from "../../../components/Button";
import { setTabIndex } from "../../../store/state/MarketMontitoring/MarketMonitoringState";
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
import {  ReLineChart } from "../../../components/recharts/ReCharts";
import { tab } from "@testing-library/user-event/dist/tab";
import { COST_UNIT, VOLUME_UNIT } from "../../../Units";
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
    fetchPriceData({
      selectedExchange,
      selectedMarket,
      selectedProduct: byPriceProduct,
      startMonth,
      endMonth,
    });
  }, []);

  const [productData, setProductData] = useState<any[]>([]);
  const [priceData, setPriceData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [setShownVolume, setSetShownVolume] = useState<String[]>([]);
  const [setShownPrice, setSetShownPrice] = useState<String[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(0);
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
    {
      dataKey: "anyDay",
      name: "Any Day Contracts",
      stroke: ColorYellow,
    },
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
              By Volume
            </button>
            <button
              className={`tab tab-right ${tabIndex === 1 ? "tab-active" : ""}`}
              onClick={() => {
                setTabIndex(1);
              }}
            >
              By Price
            </button>
          </div>

          <div className="flex space-x-2">
            <Select
              placeholder="Start Month"
              className="dateSelect"
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
                fetchPriceData({
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
                fetchPriceData({
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
                      if (selectedMarket.includes(item)) {
                        setSelectedMarket(
                          selectedMarket.filter((i) => i !== item)
                        );
                        filter = selectedMarket.filter((i) => i !== item);
                      } else {
                        setSelectedMarket([...selectedMarket, item]);
                        filter = [...selectedMarket, item];
                      }
                      fetchVolumeData({
                        selectedExchange,
                        selectedMarket: filter,
                        selectedProduct: selectedFilter,
                        startMonth,
                        endMonth,
                      });
                      fetchPriceData({
                        selectedExchange,
                        selectedMarket: filter,
                        selectedProduct: byPriceProduct,
                        startMonth,
                        endMonth,
                      });
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
                        if (selectedExchange.includes(item)) {
                          setSelectedExchange(
                            selectedExchange.filter((i) => i !== item)
                          );
                          filter = selectedExchange.filter((i) => i !== item);
                        } else {
                          setSelectedExchange([...selectedExchange, item]);
                          filter = [...selectedExchange, item];
                        }
                        fetchVolumeData({
                          selectedExchange: filter,
                          selectedMarket,
                          selectedProduct: selectedFilter,
                          startMonth,
                          endMonth,
                        });
                        fetchPriceData({
                          selectedExchange: filter,
                          selectedMarket,
                          selectedProduct: byPriceProduct,
                          startMonth,
                          endMonth,
                        });
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
                          fetchPriceData({
                            selectedExchange,
                            selectedMarket,
                            selectedProduct: item,
                            startMonth,
                            endMonth,
                          });
                          return;
                        }
                        if (
                          selectedFilter.filter((p) => p.id == item.id).length >
                          0
                        ) {
                          setSelectedFilter(
                            selectedFilter.filter((i) => i.id !== item.id)
                          );
                          fetchVolumeData({
                            selectedExchange: selectedExchange,
                            selectedMarket: selectedMarket,
                            selectedProduct: selectedFilter.filter(
                              (i) => i.id !== item.id
                            ),
                            startMonth,
                            endMonth,
                          });
                        } else {
                          setSelectedFilter([...selectedFilter, item]);
                          fetchVolumeData({
                            selectedExchange: selectedExchange,
                            selectedMarket: selectedMarket,
                            selectedProduct: [...selectedFilter, item],
                            startMonth,
                            endMonth,
                          });
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
                  <h2 className="chartHeading">By Volume ({VOLUME_UNIT})</h2>
                  <ReLineChart
                  yAxisLabel="Volume (MWh)"
                  yAxisWidth={80}
                    data={chartData}
                    legends={byVolumeKeys.filter(
                      (e) =>
                        getProducts({
                          exchange: selectedExchange,
                          market: selectedMarket,
                        }).filter(
                          (product) => product.name == e.name ?? e.dataKey
                        ).length > 0
                    )}
                    unit="MWh"
                    xDataKey="month"
                  />
                </>
              )}
              {tabIndex == 1 && (
                <>
                  <h2 className="chartHeading">By Price ({COST_UNIT})</h2>
                  <ReLineChart
                    yAxisLabel="Price (Rs/MWh)"
                    data={priceData}
                    legends={byProductKeys}
                    unit="MWh"
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
        exchange: selectedExchange.map((item) => item.name).toString(),
        market: selectedMarket.map((item) => item.name).toString(),
        product: selectedProduct.map((item) => item.name).toString(),
        start_month: startMonth.label,
        end_month: endMonth.label,
      },
    });

    setProductData(FormatMarketMonitoringData(res));

    tabIndex == 0 && setChartData(FormatMarketMonitoringData(res));
  }

  async function fetchPriceData({
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
        exchange: selectedExchange.map((item) => item.name).toString(),
        market: selectedMarket.map((item) => item.name).toString(),
        product: selectedProduct.name + ",Trading Licensees",
        start_month: startMonth.label,
        end_month: endMonth.label,
      },
    });
    tabIndex == 1 && setChartData(FormatByPriceData(byPrice));
    setPriceData(FormatByPriceData(byPrice));
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
