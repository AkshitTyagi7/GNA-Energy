import React, { useEffect, useState } from "react";
import "./Exchange.css";
import { ResponsiveContainer, LineChart, Label } from "recharts";
import {
  BuyerSeller,
  BuyerSellerData,
  FormatDataOfRealtime,
  RealTimeChartData,
  formatRealTimeChartData,
} from "./FormatData";
import {
  DemoExchangeData,
  DemoExchangeData2,
  DemoExchangeData3,
  FinalDemoData,
} from "../Exchange/DemoExchangeData";
import {
  PrimaryColor,
  SecondaryColor,
  QuaternaryColor,
  buildHttpReq,
} from "../../../common";
import { COST_UNIT } from "../../../Units";
import { ExchangeData, FormatExchangeData } from "./FormatData";
import { MediumButton, SmallButton } from "../../../components/Button";
import {
  BuyerSellerChart,
  BuyerSellerPieChart,
  ExchangeChart,
  UtilizationTrendChart,
} from "./Chart";
import { RawLineChart } from "../../../components/chartjs/Charts";
import GetChartOptions from "../../../components/chartjs/data/GetChartOption";
import FootNote from "../../../components/chartjs/footnote";
import Loading from "../../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  BuyerSellerFilters,
  AddBuyerSellerFilter,
  RemoveBuyerSellerFilter,
  BuyerSellerFilter,
  setBuyerSellerData,
  setTrendData,
} from "../../../store/state/BuyerSellerState";
import Select from "react-select";

const ApiData = FinalDemoData;
export default function ExchangePage() {
  const searchStyle = {
    valueContainer: (base: any) => ({
      ...base,
      maxHeight: 50,
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
    multiValueRemove: (base: any, state: { data: { isFixed: any } }) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
  };
  const maxDate = new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000);
  const [date, setDate] = useState(
    new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000)
  );
  const [byExchangeIndex, setByExchangeIndex] = useState(0);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number[]>(
    []
  );
  // let trendBuyer: string[] = ["UPPCL", "RAJASTHAN", "ODISHA", "WBSETCL"];
  const [exchangeShownlegends, setExchangeShownLegends] = useState<string[]>([]);
  const [productShownlegends, setProductShownLegends] = useState<string[]>([]);
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
  const [realTimechartIndex, setRealtimeChartIndex] = useState<number>(1);
  const [RealTimeChartData, setRealTimeChartData] = useState<
    RealTimeChartData[]
  >([]);
  const BuyerSellerState = useSelector((state: RootState) => state.buyerSeller);

  const [pageIndex, setPageIndex] = useState(0);
  const [iexData, setIexData] = useState<ExchangeData>({
    dam: [],
    gdam: [],
    rtm: [],
    hpdam: [],
  });
  const [hpxData, setHpxData] = useState<ExchangeData>({
    dam: [],
    gdam: [],
    rtm: [],
    hpdam: [],
  });
  const [pxilData, setPxilData] = useState<ExchangeData>({
    dam: [],
    gdam: [],
    rtm: [],
    hpdam: [],
  });

  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000)
  );
  const [isLoading, setIsLoading] = useState(false);

  const [isBuyerLoading, setIsBuyerLoading] = useState(false);
  const [buyerSellerPage, setBuyerSellerPage] = useState(0);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchExchangeData({
      start_date: startDate,
      end_date: endDate,
    });
    fetchUtilityTrendData(
      {
        buyers: trendBuyer,
        sellers: trendSeller,
        startDate: startDate,
        endDate: endDate,
      }
    );
    fetchRealTimeData();

    fetchBuyerVsSellerData({
      start_date: startDate,
      end_date: endDate,
      exchange: BuyerSellerState.BuyerSeller.filters[0],
      product: BuyerSellerState.BuyerSeller.filters[1],
      region: BuyerSellerState.BuyerSeller.filters[2],
    });
  }, []);

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="flex mt-4 space-x-3 h-10 tabButtons">
          <MediumButton
          
            buttonTitle="By Exchange"
            isActive={pageIndex === 0}
            onClick={() => setPageIndex(0)}
          />
          <MediumButton
            buttonTitle="By Product"
            isActive={pageIndex === 1}
            onClick={() => setPageIndex(1)}
          />
          <MediumButton
            buttonTitle="Realtime"
            isActive={pageIndex === 2}
            onClick={() => setPageIndex(2)}
          />
          <MediumButton
            buttonTitle="Buyers & Sellers"
            isActive={pageIndex === 3}
            onClick={() => setPageIndex(3)}
          />

          {/* <MediumButton buttonTitle="Compare" isActive={pageIndex === 3} onClick={() => setPageIndex(3)} /> */}
        </div>
        {pageIndex !== 2 && (
          <div className="text-right">
            <input
              type="date"
              className="mt-4 mr-3 p-2 br-20 rounded-lg"
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
                fetchExchangeData({
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
                fetchUtilityTrendData(
                  {
                    buyers: trendBuyer,
                    sellers: trendSeller,
                    startDate: new Date(e.target.value),
                    endDate: endDate,
                  }
                );

              }}
            />
            to
            <input
              type="date"
              className="mt-4 ml-3 mr-10 p-2 br-20 rounded-lg"
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
                fetchExchangeData({
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
                fetchUtilityTrendData(
                  {
                    buyers: trendBuyer,
                    sellers: trendSeller,
                    startDate: startDate,
                    endDate: new Date(e.target.value),
                  }
                );
              }}
            />
          </div>
        )}
      </div>
      {pageIndex === 0 && (
        <>
          {isLoading ? <Loading /> : null}
          <div
            className="flex flex-row justify-between mt-3"
            style={{ width: "98%" }}
          >
            <div className="text-2xl text-center">
              Price and Volume by Product
            </div>
            <div>
              <SmallButton
                buttonTitle="IEX"
                isActive={byExchangeIndex === 0}
                onClick={() => {
                  setByExchangeIndex(0);
                }}
              />
              <SmallButton
                buttonTitle="PXIL"
                isActive={byExchangeIndex === 1}
                onClick={() => {
                  setByExchangeIndex(1);
                }}
              />
              <SmallButton
                buttonTitle="HPX"
                isActive={byExchangeIndex === 2}
                onClick={() => {
                  setByExchangeIndex(2);
                }}
              />
            </div>
          </div>
          <div className="byExchangeChart mt-">
            <ResponsiveContainer>
              <ExchangeChart
              shownLegnends={exchangeShownlegends}
              setShownLegends={setExchangeShownLegends}
                data={
                  byExchangeIndex === 0
                    ? iexData.dam
                    : byExchangeIndex === 1
                    ? pxilData.dam
                    : hpxData.dam
                }
                title="DAM"
                syncId="byProduct"
              />
            </ResponsiveContainer>

            <ResponsiveContainer>
              <ExchangeChart
                            shownLegnends={exchangeShownlegends}
                            setShownLegends={setExchangeShownLegends}
              
                data={
                  byExchangeIndex === 0
                    ? iexData.gdam
                    : byExchangeIndex === 1
                    ? pxilData.gdam
                    : hpxData.gdam
                }
                title="GDAM"
                syncId="byProduct"
              />
            </ResponsiveContainer>
          </div>
          <div className="byExchangeChart">
            <ResponsiveContainer>
              <ExchangeChart
              shownLegnends={exchangeShownlegends}
              setShownLegends={setExchangeShownLegends}
                data={
                  byExchangeIndex === 0
                    ? iexData.hpdam
                    : byExchangeIndex === 1
                    ? pxilData.hpdam
                    : hpxData.hpdam
                }
                title="HPDAM"
                syncId="byProduct"
              />
            </ResponsiveContainer>

            <ResponsiveContainer>
              <ExchangeChart
                            shownLegnends={exchangeShownlegends}
                            setShownLegends={setExchangeShownLegends}
              
                data={
                  byExchangeIndex === 0
                    ? iexData.rtm
                    : byExchangeIndex === 1
                    ? pxilData.rtm
                    : hpxData.rtm
                }
                title="RTM"
                syncId="byProduct"
              />
            </ResponsiveContainer>
          </div>
          <ExchangeChart
                        shownLegnends={exchangeShownlegends}
                        setShownLegends={setExchangeShownLegends}
          
            data={iexData.dam}
            title="DAM"
            syncId="byProduct"
            height="4.7%"
            width="99%"
            showBrush={true}
            onlyBrush={true}
          />
        </>
      )}
      {pageIndex === 1 && (
        <>
          {isLoading ? <Loading /> : null}
          <div className="flex flex-row justify-between mt-3">
            <div className="text-2xl text-center">
              Price and Volume by Product
            </div>
            <div className="">
              {Object.keys(iexData).map((data, index) => {
                return (
                  <SmallButton
                    onClick={() => setSelectedProductIndex([index])}
                    buttonTitle={data.toUpperCase()}
                    isActive={selectedProductIndex.includes(index)}
                  />
                );
              })}
            </div>
          </div>
          <ExchangeChart

          shownLegnends={productShownlegends}
          setShownLegends={setProductShownLegends}
            data={
              Object.keys(iexData).map((data, index) => {
                return iexData[data];
              })[selectedProductIndex[0]]
            }
            showBrush={false}
            title="IEX"
          />
          <ExchangeChart
                    shownLegnends={productShownlegends}
                    setShownLegends={setProductShownLegends}
          
            data={
              Object.keys(hpxData).map((data, index) => {
                return hpxData[data];
              })[selectedProductIndex[0]]
            }
            title="HPX"
          />
          <ExchangeChart
                    shownLegnends={productShownlegends}
                    setShownLegends={setProductShownLegends}
          
            data={
              Object.keys(pxilData).map((data, index) => {
                return pxilData[data];
              })[selectedProductIndex[0]]
            }
            showBrush={true}
            title="PXIL"
          />
        </>
      )}
      {pageIndex === 2 && (
        <div className="p-5">
          <div className="justify-between container-chart">
            <div className="flex flex-row justify-between">
              <div className="text-2xl text-center mb-2">Real Time Data</div>
              <div className="">
                {RealTimeChartData.map((data, index) => {
                  return (
                    <MediumButton
                      onClick={() => setRealtimeChartIndex(index)}
                      buttonTitle={data.title}
                      isActive={index === realTimechartIndex}
                    />
                  );
                })}
              </div>
            </div>

            <div className="onechart-container">
              <div
                className="flex justify-center realTimeChart text-center  w-full content-center"
                style={{
                  height: "60vh",
                }}
              >
                <RawLineChart
                  data={
                    RealTimeChartData.length > 0
                      ? RealTimeChartData[realTimechartIndex!].data
                      : { labels: [], datasets: [] }
                  }
                  options={GetChartOptions({
                    textTitle:
                      RealTimeChartData.length > 0
                        ? `${
                            RealTimeChartData[realTimechartIndex!].title
                          } Prices (Rs/KWh)`
                        : "",
                    displayTitle: true,
                    displayLegend: true,
                    displayYLabel: true,
                    yLabelText: "Rs/KWh",
                    fontSize: 20,
                    maintainAspectRatio: false,
                    enableZoom: false,
                  })}
                />
              </div>
            </div>
          </div>
          <FootNote source="Source - IEX" />
        </div>
      )
      }
      {pageIndex === 3 && (
        <div>
          <div className="flex w-full justify-end pr-10 mt-5">
            <MediumButton
              buttonTitle="Top Players"
              isActive={buyerSellerPage === 0}
              onClick={() => setBuyerSellerPage(0)} />
            <MediumButton
              buttonTitle="Trends"
              isActive={buyerSellerPage === 1}
              onClick={() => setBuyerSellerPage(1)} />
          </div>
      {buyerSellerPage === 0 ?  <div className="buyerVsSeller  flex w-full">
          {isBuyerLoading ? <Loading /> : null}
          <div className="w-2/12">
            {BuyerSellerFilters.map((filter, index) => {
              return (
                <div>
                  <div className="text-md text-slate-500 mt-4 mb-2 text-left">
                    {filter.name}
                  </div>
                  {filter.filters.map((subfilter, subindex) => {
                    return (
                      <button
                        className={`filter-item ${
                          BuyerSellerState.BuyerSeller.filters[
                            index
                          ].filters.findIndex(
                            (item) => item.name === subfilter.name
                          ) !== -1
                            ? "activeFilter"
                            : ""
                        }`}
                        onClick={async () => {
                          let temp = JSON.parse(
                            JSON.stringify(BuyerSellerState.BuyerSeller.filters)
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
                              AddBuyerSellerFilter({ index, filter: subfilter })
                            );
                          } else {
                            temp[index].filters = temp[index].filters.filter(
                              (item: any) => item.name !== subfilter.name
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
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="w-full h-full">
            <div className="flex">
              <div className="h-full w-full">
                <h2 className="text-center text-xl ">Sellers (MWh)</h2>

                <div className="buyersellerCharts">
                  <div
                    className="buyerVsSellerChart"
                    style={{
                      height: `${
                        BuyerSellerState.BuyerSeller.Data.seller.length * 8
                      }vh`,
                    }}
                  >
                    <BuyerSellerChart
                      data={BuyerSellerState.BuyerSeller.Data.seller}
                      showLegend={false}
                    />
                  </div>
                </div>
                <div className="w-full" style={{ height: "35vh" }}>
                  <h2 className="text-center text-xl mt-2">By Region</h2>

                  <BuyerSellerPieChart
                    data={BuyerSellerState.BuyerSeller.Data.region_seller}
                  />
                </div>
              </div>
              <div className="h-full w-full r">
                <h2 className="text-center text-xl">Buyers (MWh)</h2>
                <div className="buyersellerCharts">
                  <div
                    className="buyerVsSellerChart"
                    style={{
                      height: `${
                        BuyerSellerState.BuyerSeller.Data.buyer.length * 8
                      }vh`,
                    }}
                  >
                    <BuyerSellerChart
                      data={BuyerSellerState.BuyerSeller.Data.buyer}
                      showLegend={true}
                    />
                  </div>
                </div>
                <div className="w-full mt-2" style={{ height: "35vh" }}>
                  <h2 className="text-center text-xl ">By Region</h2>

                  <BuyerSellerPieChart
                    data={BuyerSellerState.BuyerSeller.Data.region_buyer}
                  />
                </div>
              </div>
            </div>
          </div>
        </div> :  <div className="utilizationChart">

         {isBuyerLoading ? <Loading /> : null}
          <div className="flex justify-between ">
            <div className="flex space-x-4">
              <div>
                <div className="ml-1 text-slate-500">Buyers</div>
                <Select
                  value={trendBuyer.map((item) => {
                    return { value: item, label: item, isFixed: false };
                  })}

                  isMulti={true}
                  onChange={(e) => {
                    console.log(e);
                    setTrendBuyer(e.map((item) => item.value));

                    fetchUtilityTrendData(
                      {
                        buyers: e.map((item) => item.value),
                        sellers: trendSeller,
                        startDate: startDate,
                        endDate: endDate,
                      }
                    );

                  }}
                  className="trendFilter"
                  options={BuyerSellerState.Trend.filters.buyer_name.map(
                    (item) => {
                      return { value: item, label: item, isFixed: false };
                    }
                  )}
                  styles={searchStyle}
                />
              </div>
              <div>
                <div className="text-slate-500 ml-1">Sellers</div>
                <Select
                  isMulti={true}
                  value={trendSeller.map((item) => {
                    return { value: item, label: item, isFixed: false };
                  })}
                  styles={searchStyle}
                  onChange={
                    (e)=> {
                    setTrendSeller(e.map((item) => item.value));
                    fetchUtilityTrendData(
                      {
                        buyers: trendBuyer,
                        sellers: e.map((item) => item.value),
                        startDate: startDate,
                        endDate: endDate,
                      }
                    );
                    
                    }
                  }
                  className="trendFilter"
                  options={BuyerSellerState.Trend.filters.seller_name.map(
                    (item) => {
                    
                      return { value: item, label: item, isFixed: false };
                    }
                  )}
                />
              </div>
            </div>
          </div>
            <div className="text-center text-slate-700 text-lg">Buyer</div>
            <UtilizationTrendChart
              data={BuyerSellerState.Trend.data.buyer}
              legends={BuyerSellerState.Trend.data.buyer_selected}
            />
          <div className="text-lg text-slate-700 mt-4 text-center">Seller</div>
          <UtilizationTrendChart
            data={BuyerSellerState.Trend.data.seller}
            legends={BuyerSellerState.Trend.data.seller_selected}
          />
        </div>}
        </div>
      )
      
      }

    </>
  );

  async function fetchRealTimeData() {
    console.log("fetching data");
    try {
      const response = await fetch("https://datahub.gna.energy/rtm_api");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: any = await response.json();
      // const data = RealTimeData as any;
      const reData = FormatDataOfRealtime(ApiData as any);
      const temp: RealTimeChartData[] = [];
      const reChartData = Object.keys(data).forEach((key: string) => {
        console.log(key, data[key]);
        const formattedData = formatRealTimeChartData(data[key], key);
        temp.push(formattedData);
      });
      setRealTimeChartData(temp);

      console.log("data");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchExchangeData({
    start_date = startDate,
    end_date = endDate,
  }) {
    console.log("fetching data");
    try {
      setIsLoading(true);

      let formatedStartDate = start_date
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");
      let formatedEndDate = end_date
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-");
      let apiRes = await buildHttpReq({
        endpoint: "/all_exchange_analytics_api_range",
        body: {
          start_date: formatedStartDate,
          end_date: formatedEndDate,
        },
        method: "POST",
      });

      setPxilData(FormatExchangeData(apiRes.pxil));
      setHpxData(FormatExchangeData(apiRes.hpx));
      setIexData(FormatExchangeData(apiRes.iex));
      setSelectedProductIndex([0]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIexData(FormatExchangeData([]));
      setPxilData(FormatExchangeData([]));
      setHpxData(FormatExchangeData([]));
      setIsLoading(false);

      setSelectedProductIndex([]);
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
    setIsBuyerLoading(true);
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
    setIsBuyerLoading(false);
    dispatch(
      setBuyerSellerData({
        buyer: res.buyer,
        seller: res.seller,
        region_buyer: res.region_buyer,
        region_seller: res.region_seller,
      })
    );
  }

  async function fetchUtilityTrendData(
    {
      buyers,
      sellers,
      startDate,
      endDate,
    }:
    {
      buyers: string[];
      sellers: string[];
      startDate: Date;
      endDate: Date;
    
    }
  ) {
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
      console.log("Setting Trend Data");
      console.log(res);
      dispatch(
        setTrendData(res)
      )
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  }
}
