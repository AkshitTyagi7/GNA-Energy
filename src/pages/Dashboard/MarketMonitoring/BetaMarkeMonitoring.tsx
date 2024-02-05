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
import {
  DemoExchangeData,
  Exchange,
  Filter,
  Markets,
  Product,
} from "./DemoExchangeData";
import { ChartExchangeItem, FormatMarketMonitoringData } from "./FormatData";
import { filters } from "./Filters";
import {
  Color1,
  ColorBlue,
  ColorRed,
  ColorYellow,
  PrimaryColor,
  QuaternaryColor,
  SecondaryColor,
  TertiaryColor,
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
let selectedProduct: Filter[] = [];
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
  const [productData, setProductData] = useState<ChartExchangeItem[]>([]);
  const [priceData, setPriceData] = useState<ChartExchangeItem[]>([]);
  const [chartData, setChartData] = useState<ChartExchangeItem[]>(
    productData
  );
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedMarket, setSelectedMarket] = useState<Filter[]>(Markets);
  const [selectedExchange, setSelectedExchange] = useState<Filter[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Product[]>(
    getProducts({
      exchange: selectedExchange,
      market: selectedMarket,
    })
  );

  // const optionStyle = {
  //   valueContainer: (provided: any, state: any) => ({
  //     ...provided,
  //     // height: '80px',
  //     maxHeight: "60px",
  //     padding: "6px 6px",
  //     overflow: "scroll",
  //   }),

  //   input: (provided: any, state: any) => ({
  //     ...provided,
  //     margin: "0px",
  //   }),
  //   indicatorSeparator: (state: any) => ({}),
  //   indicatorsContainer: (provided: any, state: any) => ({
  //     ...provided,
  //     // height: '30px',
  //   }),
  // };

  // const optionStyle={
  //   valueContainer: (provided: any, state: any) => ({
  //     ...provided,
      

  //   }),

  //   input: (provided: any, state: any) => ({
  //     ...provided,
      

  //   }),
  //   indicatorSeparator: (state: any) => ({}),
  //   indicatorsContainer: (provided: any, state: any) => ({
  //     ...provided,
      
  //     // height: '30px',
  //   }),
    
  // }

  const [selectedSubFilter, setSelectedSubFilter] = React.useState<IdTitle[]>([
    filters[0].subfilter[0],
  ]);

  useEffect(() => {
    fetchData({
      selectedExchange,
      selectedMarket,
      selectedProduct,
      startMonth,
      endMonth,
    });
  }, []);
  const chartLine = ({stroke,dataKey, name}:{stroke: string,dataKey:string, name: string})=>{
    return <Line
    strokeWidth={3}
    type="monotone"
    dataKey="singleSided"
    name="Any Day Single Sided Contracts"
    stroke="#82ca9d"
  />
  }
  return (
    <>
      <div className="marketMonitorkingBody ">
        <div className="flex  w-full space-x-2 ">
          {/* <div className="flex space-x-2 w-full justify-between">
            <div className="flex flex-grow space-x-4">
              <Select
                placeholder="Select Market"
                className="searchSelect"
                closeMenuOnSelect={false}
                isMulti
                styles={optionStyle}
                onChange={(selectedOption) => {
                  selectedMarket = selectedOption.map((item) => item.value);
                  fetchData();
                }}
                options={Markets.map((item) => {
                  return {
                    value: item,
                    label: item,
                  };
                })}
              />
              <Select
                placeholder="Select Exchange"
                className="searchSelect"
                styles={optionStyle}
                closeMenuOnSelect={false}
                isMulti
                options={Exchange.map((item) => {
                  return {
                    value: item,
                    label: item,
                  };
                })}
                onChange={(selectedOption) => {
                  selectedExchange = selectedOption.map((item) => item.value);
                  fetchData();
                }}
              />
              <Select
                placeholder="Select Product"
                className="flex-grow searchSelect"
                styles={optionStyle}
                isMulti
                onChange={(selectedOption) => {
                  selectedProduct = selectedOption.map((item) => item.value);
                  fetchData();
                }}
                closeMenuOnSelect={false}
                options={Products.map((item) => {
                  return {
                    value: item,
                    label: item,
                  };
                })}
              />
            </div>
            <div className="flex space-x-2">
              <Select
                placeholder="Start Month"
                className="dateSelect"
                styles={optionStyle}
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
                  fetchData();
                }}
              />
              <Select
                placeholder="End Month"
                className="dateSelect"
                styles={optionStyle}
                // options that are ahead of the start month
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
                  fetchData();
                }}
              />
            </div>
          </div>{" "} */}
        </div>
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
                  fetchData({
                    selectedExchange,
                    selectedMarket,
                    selectedProduct,
                    startMonth,
                    endMonth,
                  });
                }}
              />
              <Select
                placeholder="End Month"
                className="dateSelect"
                // options that are ahead of the start month
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
                  fetchData({
                    selectedExchange,
                    selectedMarket,
                    selectedProduct,
                    startMonth,
                    endMonth,
                  });
                  // fetchData();
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
                      if (selectedMarket.includes(item)) {
                        setSelectedMarket(
                          selectedMarket.filter((i) => i != item)
                        );
                        fetchData({
                          selectedExchange,
                          selectedMarket: selectedMarket.filter(
                            (i) => i != item
                          ),
                          selectedProduct,
                          startMonth,
                          endMonth,
                        });
                      } else {
                        setSelectedMarket([...selectedMarket, item]);
                        fetchData({
                          selectedExchange,
                          selectedMarket: [...selectedMarket, item],
                          selectedProduct,
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
            <div className="mt-2 ">
              <div className="text-md text-slate-500">Exchange</div>

              {Exchange.map((item) => {
                return (
                  <button
                    className={`filter-item ${
                      selectedExchange.includes(item) ? "activeFilter" : ""
                    }`}
                    onClick={() => {
                      if (selectedExchange.includes(item)) {
                        setSelectedExchange(
                          selectedExchange.filter((i) => i != item)
                        );
                        fetchData({
                          selectedExchange: selectedExchange.filter(
                            (i) => i != item
                          ),
                          selectedMarket,
                          selectedProduct,
                          startMonth,
                          endMonth,
                        });
                      } else {
                        setSelectedExchange([...selectedExchange, item]);
                        fetchData({
                          selectedExchange: [...selectedExchange, item],
                          selectedMarket,
                          selectedProduct,
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

            <div className="mt-2 ">
              <div className="text-md text-slate-500">Product</div>

              {getProducts({
                exchange: selectedExchange,
                market: selectedMarket,
              }).map((item) => {
                return (
                  <button
                    className={`filter-item ${
                      selectedFilter.includes(item) ? "activeFilter" : ""
                    }`}
                    onClick={() => {
                      if (selectedFilter.includes(item)) {
                        setSelectedFilter(
                          selectedFilter.filter((i) => i.id != item.id)
                        );
                        fetchData({
                          selectedExchange: selectedExchange,
                          selectedMarket: selectedMarket,
                          selectedProduct: selectedFilter.filter(
                            (i) => i.id != item.id
                          ),
                          startMonth,
                          endMonth,
                        });
                      } else {
                        setSelectedFilter([...selectedFilter, item]);
                        fetchData({
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
             {
            chartData.filter(item=>item.dam).length != 0 ?
             <Line
                  strokeWidth={2}
                  type="monotone"
                  dot={false}
                  visibility={ chartData.filter(item=>item.dam).length != 0 ? "visible" : "hidden"}
                  dataKey="dam"
                  name="DAM"
                  stroke={PrimaryColor}
                /> : null}
                  {/* <Line
                    strokeWidth={2}
                    type="monotone"
                    dataKey="rtm"
                    dot={false}

                    name="RTM"
                    stroke={SecondaryColor}
                  />
                  <Line
                    strokeWidth={2}
                    type="monotone"
                    dot={false}

                    name="GDAM"
                    dataKey="gdam"
                    stroke={"Green"}
                  />
                  <Line
                    strokeWidth={2}
                    type="monotone"
                    dot={false}

                    dataKey="intraDay"
                    name="Intra-Day Contracts"
                    stroke={ColorBlue}
                  />
                  <Line
                    strokeWidth={2}
                    type="monotone"
                    dot={false}

                    name="Day Ahead Contingency Contracts"
                    dataKey="contingencyContracts"
                    stroke={"red"}
                  />
                  <Line
                    strokeWidth={2}
                    type="monotone"
                    name="Daily Contracts"
                    dot={false}

                    dataKey="daily"
                    stroke={"slateblue"}
                  />
                  <Line
                    strokeWidth={2}
                    type="monotone"
                    dataKey="weekly"
                    dot={false}

                    name="Weekly Contracts"
                    stroke={"black"}
                  />
                  <Line
                    strokeWidth={2}
                    type="monotone"
                    dataKey="monthly"
                    dot={false}

                    name="Monthly Contracts"
                    stroke={"#710907"}
                  />
                  <Line
                    strokeWidth={2}
                    type="monotone"
                    dot={false}

                    name="Any Day Contracts"
                    dataKey="anyDay"
                    stroke={ColorYellow}
                  />
                  <Line
                    strokeWidth={2}
                    type="monotone"
                    dataKey="singleSided"
                    dot={false}

                    name="Any Day Single Sided Contracts"
                    stroke="#82ca9d"
                  /> */}

                  {chartData.filter(item=>item.rtm).length != 0 ?
                  <Line
                    strokeWidth={2}
                    type="monotone"

                    dataKey="rtm"
                    dot={false}
                    name="RTM"
                    stroke={SecondaryColor}
                  /> : null}
                  {chartData.filter(item=>item.gdam).length != 0 ?
                  <Line
                    strokeWidth={2}
                    type="monotone"

                    dataKey="gdam"
                    dot={false}
                    name="GDAM"
                    stroke={"Green"}
                  /> : null}
                  {chartData.filter(item=>item.intraDay).length != 0 ?
                  <Line
                    strokeWidth={2}
                    type="monotone"

                    dataKey="intraDay"
                    dot={false}
                    name="Intra-Day Contracts"
                    stroke={ColorBlue}
                  /> : null}
                  {chartData.filter(item=>item.contingencyContracts).length != 0 ?
                  <Line
                    strokeWidth={2}
                    type="monotone"

                    dataKey="contingencyContracts"
                    dot={false}
                    name="Day Ahead Contingency Contracts"
                    stroke={"red"}
                  /> : null}
                  {chartData.filter(item=>item.daily).length != 0 ?
                  <Line
                    strokeWidth={2}
                    type="monotone"

                    dataKey="daily"
                    dot={false}
                    name="Daily Contracts"
                    stroke={"slateblue"}
                  /> : null}
                  {chartData.filter(item=>item.weekly).length != 0 ?
                  <Line
                    strokeWidth={2}
                    type="monotone"

                    dataKey="weekly"
                    dot={false}
                    name="Weekly Contracts"
                    stroke={"black"}
                  /> : null}
                  {chartData.filter(item=>item.monthly).length != 0 ?
                  <Line
                    strokeWidth={2}
                    type="monotone"

                    dataKey="monthly"
                    dot={false}
                    name="Monthly Contracts"
                    stroke={"#710907"}

                  /> : null}
                  {chartData.filter(item=>item.anyDay).length != 0 ?
                  <Line
                    strokeWidth={2}
                    type="monotone"

                    dataKey="anyDay"
                    dot={false}
                    name="Any Day Contracts"
                    stroke={ColorYellow}
                  /> : null}
                  {chartData.filter(item=>item.singleSided).length != 0 ?
                  <Line
                    strokeWidth={2}
                    type="monotone"

                    dataKey="singleSided"
                    dot={false}
                    name="Any Day Single Sided Contracts"
                    stroke="#82ca9d"
                  /> : null}

                  
                <Brush
                  dataKey="month"
                  height={30}
                  stroke="#8884d8"
                  // startIndex={
                  //   chartData.length - 12
                    
                  // }
                  // endIndex={
                  //  chartData.length - 1
                  // }
                />
                <Legend verticalAlign="top" />
                <Tooltip
                  formatter={(value, name, props) => {
                    let diplayValue = parseFloat(
                      value.toLocaleString()
                    ).toFixed(2);
                    if (diplayValue == "NaN") {
                      diplayValue = "-";
                    }
                    return [
                      `${diplayValue} `,
                      `${name} (${tabIndex == 0 ? ENERGY_UNIT : COST_UNIT})`,
                    ];
                  }}
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
    if (exchange.length === 0) {
      // return unique products from all markets
      return market
        .flatMap((m) => m.products)
        .filter((value, index, self) => self.indexOf(value) === index);
    }

    const marketProducts = market.flatMap((m) => m.products);
    const exchangeProducts = exchange.flatMap((e) => e.products);

    const uniqueMarketProducts = Array.from(new Set(marketProducts));
    const uniqueExchangeProducts = Array.from(new Set(exchangeProducts));

    const commonProducts = uniqueMarketProducts.filter((mp) =>
      uniqueExchangeProducts.some((ep) => ep.id === mp.id)
    );
    if(exchange.filter(item=>item.name == "Traders").length != 0){}

    return commonProducts;
  }

  async function fetchData({
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

    const byPrice = await buildHttpReq({
      endpoint: "market_monitoring_price_api",
      method: "POST",
      body: {
        exchange: selectedExchange.map((item) => item.name).toString(),
        market: selectedMarket.map((item) => item.name).toString(),
        product: selectedProduct.map((item) => item.name).toString(),
        start_month: startMonth.label,
        end_month: endMonth.label,
      },
    });
    tabIndex == 0? 
    setChartData(FormatMarketMonitoringData(res)):
    setChartData(FormatMarketMonitoringData(byPrice));
    setPriceData(FormatMarketMonitoringData(byPrice));
  }
}
