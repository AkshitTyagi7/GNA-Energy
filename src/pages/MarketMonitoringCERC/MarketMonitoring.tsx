import React, { useEffect, useState } from "react";
import { ReactComponent as Logo } from "../../icons/Logo.svg";
import { ReactComponent as Cerc } from "../../icons/Cerc.svg";
import { ReactComponent as Stat } from "../../icons/Stat.svg";
import { ReactComponent as DateIcon } from "../../icons/DateIcon.svg";
import { ReactComponent as Collective } from "../../icons/Collective.svg";
import { ReactComponent as CollMar } from "../../icons/CollMar.svg";
import { ReactComponent as HPX } from "../../icons/HPX.svg";
import { ReactComponent as IconDown } from "../../icons/IconDown.svg";
import { ReactComponent as IconUp } from "../../icons/IconUp.svg";
import { ReactComponent as Pxil } from "../../icons/Pxil.svg";
import { ReactComponent as IEX } from "../../icons/IEX.svg";
import {ReactComponent as Clock} from "../../icons/orange-clock.svg";
import "./MarketMonitoring.css";
import { ApiResponse, CsrcPSSPData, PSPData } from "../../models/csrc";
import fetchLatestAggregatedDayData, {
  fetchPSPData,
} from "../../Rest_api/restapi";
import { ReLineChart } from "../../components/recharts/ReCharts";
import { renderHourTick } from "../Dashboard/Exchange3/Chart";
import { COST_UNIT } from "../../Units";
import { NavLink } from "react-router-dom";
import { formatDateMD, formatDateUserFriendly } from "../../extensions/date";

const MarketMonitoring = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string>("DAM");
  const [loading, setLoading] = useState<boolean>(true);
  const [pspdata, setPspData] = useState<CsrcPSSPData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const bgColors = [
    '#FFFDFB',
    '#FBFFFF',
    '#F5F8FF'
  ];
  const txtColors = [
    "#F1935C",
    "#34656D",
    "#3E72D6"
  ]
  const buttonBgColors= [
    "#FFF7F3",
    "#FBFFFF",
    "#F5F8FF"
  ]

  const updateData = () => {
    setLoading(true);
    try {
      fetchLatestAggregatedDayData()
        .then((responseData) => {
          setData(responseData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    } catch (e) {
      console.error("Error:", e);
      setLoading(false);
    }
    try {
      fetchPSPData()
        .then((data) => {
          console.log(data);
          setPspData(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString());
  };

  useEffect(() => {
    updateData();
    const intervalId = setInterval(updateData, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    updateTime();
    const timerId = setInterval(updateTime, 1 * 1000); // 1 minute

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const markets = ["DAM", "GDAM", "HPDAM"];
    let currentIndex = 0;

    const switchMarket = () => {
      currentIndex = (currentIndex + 1) % markets.length;
      setSelectedMarket(markets[currentIndex]);
    };

    const marketSwitchInterval = setInterval(switchMarket, 10 * 1000); // 30 seconds

    return () => clearInterval(marketSwitchInterval);
  }, []);

  const PowerSupplyComponent = () => (
    <div className="powerSuppContainer">
      <div className="powSupPosContainer">
        <div className="powSupPos">
          <Stat style={{ fontSize: "24px" }} />
          <span className="textlg textbold market-monitoring-gray">
            Power Supply Position
          </span>
        </div>
        <div className="textsm market-monitoring-date">
          {pspdata && formatDateUserFriendly(pspdata?.latest.data.date)}
        </div>
      </div>
      <div className="powSupDispContainer">
        <div className="dateContainer">
          <div className="textsm psp-title">Date</div>
          <div className="dash-divider"></div>

          <div className="textmd textbold">
            {pspdata && pspdata?.latest.data.date}
          </div>
          <div className="textsm lightgray">
            {pspdata && pspdata?.prev.data.date}
          </div>
        </div>

        {[
          { title: `Energy Met\n(MU)`, key: "enrgy_met_mu" },
          { title: "Energy Shortage\n(MU)", key: "enrgy_shrtage_mu" },
          { title: "Generation Outage (MW)", key: "outage" },
          { title: "Frequency\n(49.9-50.05)", key: "frequency", unit: "%" },
          {
            title: "Max Demand\n(MW)",
            key: "max_demand_met_during_the_day_mw_from_nldc_scada",
          },
          { title: "Solar Hour Peak\n(MW)", key: "solar_hour_peak" },
          {
            title: "Evening Peak\n(MW)",
            key: "demand_met_during_evening_peak_hrsmw_at_19_00_hrs_from_rldcs",
          },
          { title: "Peak Shortage\n(MW)", key: "peak_shrtage_mw" },
        ].map((field) => {
          return (
            <div className="eachEnergyContainer" key={field.key}>
              <div className="textsm market-monitoring-secondary psp-title">
                {field.title.split("\n").map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
              <div className="dash-secondary"></div>

              <div className="textmd  textbold">
                {pspdata &&
                  (pspdata?.latest.data[
                    field.key as keyof PSPData
                  ] as any)}{" "}
                {field.unit}
              </div>
              <div className="textsm">
                {pspdata && pspdata?.prev.data[field.key as keyof PSPData]}{" "}
                {field.unit}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const CollectiveMarket = () => (
    <div className="cmContainer">
      <div className="collHeadContainer">
        <div className="headingContSub">
          <div className="collHeading">
            <Collective style={{ fontSize: "24px" }} />
            <span className="textlg textbold market-monitoring-gray">
              Collective Market
            </span>
          </div>
          <div className="collTypesSec">
            {/* <div
              className={
                selectedMarket === "DAM" ? "activeCollType" : "inactiveCollType"
              }
              onClick={() => setSelectedMarket("DAM")}
            >
              DAM
            </div>
            <div
              className={
                selectedMarket === "GDAM"
                  ? "activeCollType"
                  : "inactiveCollType"
              }
              onClick={() => setSelectedMarket("GDAM")}
            >
              G-DAM
            </div>
            <div
              className={
                selectedMarket === "HPDAM"
                  ? "activeCollType"
                  : "inactiveCollType"
              }
              onClick={() => setSelectedMarket("HPDAM")}
            >
              HPDAM
            </div> */}
            {["DAM", "GDAM", "HPDAM"].map((market) => (
              <div
                key={market}
                style={
                  selectedMarket === market
                    ? market === "DAM" ? { color: txtColors[0], background: buttonBgColors[0] } : market === "GDAM" ? { color: txtColors[1], background: buttonBgColors[1] } : { color: txtColors[2], background: buttonBgColors[2] }
                    : {}
                }
                className={
                  selectedMarket === market
                    ? "activeCollType"
                    : "inactiveCollType"
                }
                onClick={() => setSelectedMarket(market)}
              >
                {market}
              </div>
            ))
            }
          </div>
        </div>
        <div className="textsm market-monitoring-date">
          {data && formatDateUserFriendly(data?.date)}
        </div>
      </div>
      <div className="marketContianer">
        <div className="marketTypeCont">
          <div className="marketImageArea2">
            <CollMar style={{ fontSize: "36px" }} />
          </div>
          {["MCP\n(Rs/kWh)", "MCV\n(MU)", "Sell Bid\n(MU)", "Purchase\nBid (MU)", "₹10 MCP\nBlocks"].map(
            (key) => {
              return (
                <div className="marketTextArea" key={key}>
                  
                  <div className="mcpButton textsm secondary-color">
                    <div>
                      {key.split("\n").map((line, index) => (
                        <span key={index}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </div>
                    <div className="textxsm market-monitoring-gray">
                      <div>
                        {data && formatDateMD(data.date)}
                        {/* Previous date */}
                      </div>
                      <div>{data && formatDateMD(data.previousDate)}</div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
        {["IEX", "HPX",  "PXIL"].map((market) => {
          return (
            
            <div className="marketDetailsCont" key={market} style={{
              backgroundColor: bgColors[selectedMarket === "DAM" ? 0 : selectedMarket === "GDAM" ? 1 : 2]
            }}>

              <div className="marketImageArea">
                {market === "HPX" ? (
                  <HPX style={{ height: "30px",  }} />
                ) : market === "IEX" ? (
                  <IEX style={{ height: "30px", }} />
                ) : (
                  <Pxil style={{ height: "30px", }} />
                )}
              </div>
              {[
                "mcp_avg",
                "mcv_total",
                "sell_bid_total",
                "purchase_bid_total",
                "no_of_mcp_at_10",
              ].map((key) => {
                return (
                  <div className="marketTextArea" key={key}>

                    <div className="valEach">
                      <div className="mainValue1">
                        {data && data[market][selectedMarket]
                          ? data[market][selectedMarket]?.latest[key]
                          : "0"}
                      </div>
                    
                      <div className="mainVal2">{data && data[market][selectedMarket]?.previous[key]}</div>
                
                    </div>
                    {/* <div className="dash-divider"></div> */}
                    <div className="iconCont">
                        {data &&
                        data[market][selectedMarket] &&
                        data[market][selectedMarket].change[key] >= 0 ? (
                          <IconUp />
                        ) : (
                          <IconDown />
                        )}
                        <span
                          className={
                           
                            data &&
                            data[market][selectedMarket] &&
                            data![market][selectedMarket]?.change[key] >= -0.001
                              ? "mainVal2"
                              : "iconCOntDown mainVal2"
                          }
                        >
                          {data &&
                          data[market][selectedMarket] &&
                          data[market][selectedMarket]
                            ? data[market][selectedMarket]?.change[key] + "%"
                            : "0%"}
                        </span>
                      </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="cerccontainer">
      <div className="topNavbar">
        <NavLink to="/dashboard">
          <Logo />
        </NavLink>
        <div className="navHeading">CERC Market Monitor</div>
        <div style={{ width: "88px" }}></div>
      </div>
      <PowerSupplyComponent />
      <div className="collectiveMarketCont">
        <CollectiveMarket />
        <div className="rtmContainer">
          <div className="rtmHeadCont">
       
            <div className="textlg textbold market-monitoring-gray">   <div className="collHeading">
            <Collective style={{ fontSize: "24px" }} />
            <span className="textlg textbold market-monitoring-gray">
              Real Time Market
            </span>
          </div></div>
            <div className="timerTxt">
              
              <Clock />
              {currentTime}</div>
          </div>
          <div className="rtmGraphContainer">
            <ReLineChart
              data={
                data &&
                data["IEX"]["RTM"] &&
                (data["IEX"]["RTM"].chartData.map((v, i) => {
                  return {
                    iex_rs_mwh: v["mcp_rs_mwh"],
                    time_slot: i + 1,
                    pxil_rs_mwh: data["PXIL"]["RTM"].chartData[i]
                      ? data["PXIL"]["RTM"].chartData[i]["mcp_rs_mwh"]
                      : null,
                    hpx_rs_mwh: data["HPX"]["RTM"].chartData[i]
                      ? data["HPX"]["RTM"].chartData[i]["mcp_rs_mwh"]
                      : null,
                  };
                }) as any)
              }
              showSecondYAxis={false}
              unit={COST_UNIT}
              fontSize={12}
              isTimeSlot={true}
              xLabel="Time(Hrs)"
              yAxisLabel="(Rs/kWh)"
              disableLegend={false}
              legends={[
                {
                  dataKey: "iex_rs_mwh",
                  name: "IEX",
                  stroke: "rgba(241, 147, 92, 1)",
                },
                {
                  dataKey: "pxil_rs_mwh",
                  name: "PXIL",
                  stroke: "rgba(0, 0, 0, 1)",
                },
                {
                  dataKey: "hpx_rs_mwh",
                  name: "HPX",
                  stroke: "rgba(0, 0, 255, 1)",
                },
              ]}
              xDataKey="time_slot"
              xTick={renderHourTick}
            />
          </div>
          <div className="rtmDetailsCont">
            <div className="rtmL1">
              <CollMar style={{ height: "30px"  }} />
              <div className="textsm secondary-color">MCP (MU)</div>
              <div className="textsm secondary-color">MCV (Rs/kWh)</div>
            </div>
            <div className="rtmL2 mainVal2">
              <IEX style={{ height: "30px"  }} />
              <div>
                {data &&
                  data["IEX"]["RTM"] &&
                  data["IEX"]["RTM"].latest.mcp_avg}
              </div>
              <div className="mainVal2">
                {data &&
                  data["IEX"]["RTM"] &&
                  data["IEX"]["RTM"].latest.mcv_total}
              </div>
            </div>
            <div className="rtmL2">
              <HPX style={{ height: "30px"  }} />
              <div className="mainVal2">
                {data &&
                  data["HPX"]["RTM"] &&
                  data["HPX"]["RTM"].latest.mcp_avg}
              </div>
              <div className="mainVal2">
                {data &&
                  data["HPX"]["RTM"] &&
                  data["HPX"]["RTM"].latest.mcv_total}
              </div>
            </div >
            <div className="rtmL2 mainVal2" >
              <Pxil style={{ height: "30px"  }} />
              <div>
                {data &&
                  data["PXIL"]["RTM"] &&
                  data["PXIL"]["RTM"].latest.mcp_avg}
              </div>
              <div className="mainVal2" >
                {data &&
                  data["PXIL"]["RTM"] &&
                  data["PXIL"]["RTM"].latest.mcv_total}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottomText">
        Powered By <b>GNA Energy</b> <br></br> (GNA Energy Data & Analytics
        Capability Center)
      </div>
    </div>
  );
};

export default MarketMonitoring;
