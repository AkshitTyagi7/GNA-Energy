import React, { useEffect, useState } from "react";
import "./Exchange.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
  Brush,
  ResponsiveContainer,
  LineChart,
  Label,
} from "recharts";
import { BuyerSeller, FormatDataOfRealtime, RealTimeChartData, formatRealTimeChartData } from "./FormatData";
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
import { ExchangeChart } from "./Chart";
import { RawLineChart } from "../../../components/charts/Charts";
import GetChartOptions from "../../../components/charts/data/GetChartOption";
import FootNote from "../../../components/charts/footnote";
import Loading from "../../../components/Loading";

const ApiData = FinalDemoData;

export default function ExchangePage() {
  const maxDate = new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000);
  const [date, setDate] = useState(
    new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000)
  );
  const [byExchangeIndex, setByExchangeIndex] = useState(0);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number[]>(
    []
  );
  const [realTimechartIndex, setRealtimeChartIndex] = useState<number>(1);
  const [RealTimeChartData, setRealTimeChartData] = useState<
    RealTimeChartData[]
  >([]);
  const [buyerVsSellerData, setBuyerVsSellerData] = useState<BuyerSeller[]>([]);

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
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000)
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExchangeData({
      start_date: startDate,
      end_date: endDate,
    });
    fetchRealTimeData();
    fetchBuyerVsSellerData(
{      start_date: startDate,
      end_date: endDate,}
    )
  }, []);

  return (
    <>
    {
      isLoading ? <Loading /> : null
    }
      <div className="flex flex-row justify-between">
        <div className="flex mt-4 space-x-3 h-10">
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
            buttonTitle="Buyer vs Seller"
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
              }}
            />
          </div>
        )}
      </div>
      {pageIndex === 0 && (
        <>
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
            data={
              Object.keys(iexData).map((data, index) => {
                return iexData[data];
              })[selectedProductIndex[0]]
            }
            showBrush={false}
            title="IEX"
          />
          <ExchangeChart
            data={
              Object.keys(hpxData).map((data, index) => {
                return hpxData[data];
              })[selectedProductIndex[0]]
            }
            title="HPX"
          />
          <ExchangeChart data={
              Object.keys(pxilData).map((data, index) => {
                return pxilData[data];
              })[selectedProductIndex[0]]
          } showBrush={true} title="PXIL" />
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

            <div className="realtime-container">
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
      )}
      {
        pageIndex === 3 &&
        <div className="buyerVsSeller">
          <h2 className="text-center text-2xl mt-0">Top Buyer vs Top Seller (MWhr)</h2>
        <ResponsiveContainer>
          <ComposedChart
          data={buyerVsSellerData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" />
            <YAxis width={120} tickFormatter={
              (value) => {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }
            
            }>
              <Label
                value="MWhr"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }} />
            </YAxis >
            <Tooltip
            contentStyle={
              {
                textAlign:"left",
              }
            }
            formatter={
              (value, name, props) => {
                console.log(value, name, props); 
                const newName= name === "Top Buyer" ? props.payload.buyer : props.payload.seller;
                // add , after first 3 digits and then after every 2 digits
                const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return [ [`${newName}: \n${formattedValue} MWhr`],];
              }
            }
            />
            <Legend verticalAlign="top" />
            <Bar type="monotone" dataKey="buyer_mwhr" color={PrimaryColor} fill={PrimaryColor} stroke={PrimaryColor} name="Top Buyer" />
            <Brush 
             />
            <Bar type="monotone" dataKey="seller_mwhr" color={SecondaryColor} fill={SecondaryColor} stroke={SecondaryColor} name="Top Seller"  />
          </ComposedChart>
        </ResponsiveContainer></div>
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
      const reData= FormatDataOfRealtime(ApiData as any);
      console.log(reData);
      const temp: RealTimeChartData[] = [];
      const reChartData= 
      Object.keys(data).forEach((key: string) => {
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
  async function fetchBuyerVsSellerData({start_date,end_date} : {start_date:Date,end_date:Date}) {
  const res = await buildHttpReq({
    endpoint:"top_buyer_seller_api",
    body:{
      start_date:start_date
        .toLocaleDateString("en-GB")
        .split("/")
        .join("-"),
      end_date: end_date
      .toLocaleDateString("en-GB")
      .split("/")
      .join("-"),
    },
    method:"POST"
  })
  let finalData: BuyerSeller[] = [];
  for(let i=0;i<res.length;i++){
    finalData.push({
      buyer: res[i].buyer,
      buyer_mwhr: parseFloat(res[i].buyer_mwhr),
      id: res[i].id,
      seller: res[i].seller,
      seller_mwhr:parseFloat( res[i].seller_mwhr),
    });
  }
  setBuyerVsSellerData(finalData);
  }
}
