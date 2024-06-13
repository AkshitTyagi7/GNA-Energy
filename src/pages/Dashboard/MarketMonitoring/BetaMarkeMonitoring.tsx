import {
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  Brush,
  Tooltip,
  Legend,
  CartesianGrid,
  Label,
} from "recharts";
import { Exchange, Filter, Markets, Product } from "./DemoExchangeData";
import { FormatByPriceData, FormatMarketMonitoringData } from "./FormatData";
import { filters } from "./Filters";
import {
  ColorBlue,
  ColorYellow,
  PrimaryColor,
  SecondaryColor,
  buildHttpReq,
} from "../../../common";
import { IdTitle, SubMenu } from "../../../components/SubMenu";
import { useEffect, useState } from "react";
import { ReactComponent as UpIcon } from "../../../icons/up.svg";
import { ReactComponent as DownIcon } from "../../../icons/down.svg";
import "./MarketMonitoring.css";
import React from "react";
import Select from "react-select";
import { MediumButton } from "../../../components/Button";
import { COST_UNIT, ENERGY_UNIT, MEGA_POWER_UNIT } from "../../../Units";

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
export function BetaMarketMontoring() {
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

  useEffect(() => {
    fetchVolumeData({
      selectedExchange: Exchange,
      selectedMarket: selectedMarket,
      selectedProduct: selectedFilter,
      startMonth,
      endMonth,
    });
    fetchPriceData({
      selectedExchange: Exchange,
      selectedMarket: selectedMarket,
      selectedProduct: byPriceProduct,
      startMonth,
      endMonth,
    });
  }, []);
  const chartLine = ({
    stroke,
    dataKey,
    name,
  }: {
    stroke: string;
    dataKey: string;
    name: string;
  }) => {
    return (
      <Line
        strokeWidth={3}
        type="monotone"
        dataKey="singleSided"
        name="Any Day Single Sided Contracts"
        stroke="#82ca9d"
      />
    );
  };
  return (
    <>
      <div className="marketMonitorkingBody ">
        <div className="flex  w-full space-x-2 "></div>
        <div className="">
          <div style={{}}>
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <Select
                  placeholder="Start Month"
                  className="dateSelect"
                  options={filters[2].subfilter.map((item) => {
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
                    // fetchVolumeData();
                  }}
                />
              </div>
              <h2 className="text-3xl">Market Monitoring</h2>     
              <div>
                <MediumButton
                  buttonTitle="By Volume"
                  onClick={() => {
                    setTabIndex(0);
                    setChartData(productData);
                  }}
                  isActive={tabIndex == 0}
                />
                <MediumButton
                  buttonTitle="By Price"
                  onClick={() => {
                    setTabIndex(1);
                    setChartData(priceData);
                  }}
                  isActive={tabIndex == 1}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full flex mt-2">
          <div className="w-1/6 mr-4">
            <div className="">
              <div className="text-md text-slate-500">Market</div>
              {Markets.map((item) => {
                return (
                  <button
                    className={`filter-item ${
                      selectedMarket.includes(item) ? "activeFilter" : ""
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
                  </button>
                );
              })}
            </div>
            <div className="mt-2 ">
              <div className="text-md text-slate-500">Exchange / Trader</div>

              {Exchange.map((item) => {
                return (
                  <button
                    className={`filter-item ${
                      selectedExchange.includes(item) ? "activeFilter" : ""
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
                  </button>
                );
              })}
            </div>

            <div className="mt-2 ">
              <div className="text-md text-slate-500">Product</div>

              {getProducts({
                exchange: selectedExchange,
                market: selectedMarket,
              }).map((item) => {
                return (
                  <button
                    className={`filter-item ${
                      tabIndex == 1
                        ? byPriceProduct.id == item.id
                          ? "activeFilter"
                          : ""
                        : selectedFilter.filter((p) => p.id == item.id).length >
                          0
                        ? "activeFilter"
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
                        selectedFilter.filter((p) => p.id == item.id).length > 0
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
                  </button>
                );
              })}
            </div>
          </div>
          <ResponsiveContainer>
            <ResponsiveContainer>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis width={120}>
                  <Label
                    angle={270}
                    value={
                      tabIndex == 0
                        ? `Volume (${ENERGY_UNIT})`
                        : `Price (${COST_UNIT})`
                    }
                  ></Label>
                </YAxis>

                <XAxis
                  dataKey="month"
                  fontSize={12}
                  label={"Month"}
                  height={60}
                />
                <YAxis />

                {tabIndex == 1 ? (
                  <>
                    {[
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
                    ].map((item) => {
                      return (
                        <Line
                          strokeWidth={2}
                          type="monotone"
                          dot={false}
                          hide={
                            !setShownPrice.includes(item.name) &&
                            setShownPrice.length > 0
                          }
                          dataKey={item.dataKey}
                          name={item.name}
                          stroke={item.stroke}
                        />
                      );
                    })}

                    {chartData.filter((item) => item.traders).length !== 0 ? (
                      <Line
                        strokeWidth={2}
                        type="monotone"
                        dot={false}
                        dataKey="traders"
                        hide={
                          !setShownPrice.includes("Traders") &&
                          setShownPrice.length > 0
                        }
                        name="Traders"
                        stroke={"skyblue"}
                      />
                    ) : null}
                  </>
                ) : (
                  <>
                  {
                    [
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
                    ].map((item) => {
                      return (
                        <Line
                          strokeWidth={2}
                          type="monotone"
                          dot={false}
                          hide={
                            !setShownVolume.includes(item.name) &&
                            setShownVolume.length > 0
                          }
                          dataKey={item.dataKey}
                          name={item.name}
                          stroke={item.stroke}
                        />
                      );
                    })

                    
                  }
                  </>
                )}

                <Brush dataKey="month" height={30} stroke="#8884d8" />
                <Legend
                  verticalAlign="top"
                  onClick={(e) => {
                    if (tabIndex == 0) {
                      if (setShownVolume.includes(e.value)) {
                        setSetShownVolume(
                          setShownVolume.filter((item) => item !== e.value)
                        );
                      } else {
                        setSetShownVolume([...setShownVolume, e.value]);
                      }
                    } else {
                      if (setShownPrice.includes(e.value)) {
                        setSetShownPrice(
                          setShownPrice.filter((item) => item !== e.value)
                        );
                      } else {
                        setSetShownPrice([...setShownPrice, e.value]);
                      }
                    }
                  }}
                />
                <Tooltip
               
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

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
}
