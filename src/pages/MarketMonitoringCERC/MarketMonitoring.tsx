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
import "./MarketMonitoring.css";
import { ApiResponse, CsrcPSSPData, PSPData } from "../../models/csrc";
import fetchLatestAggregatedDayData, { fetchPSPData } from "../../rest_api/restapi";
import { ReLineChart } from "../../components/recharts/ReCharts";
import { renderHourTick } from "../Dashboard/Exchange3/Chart";
import { COST_UNIT } from "../../Units";

const MarketMonitoring = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string>("DAM");
  const [loading, setLoading] = useState<boolean>(true);
  const [pspdata, setPspData] = useState<CsrcPSSPData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  const updateData = () => {
    setLoading(true);
    fetchLatestAggregatedDayData()
      .then((responseData) => {
        setData(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });

    fetchPSPData()
      .then((data) => {
        console.log(data);
        setPspData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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




  return (
    <div className="cerccontainer">
      <div className="topNavbar">
        <Cerc />
        <div className="navHeading">CERC Market Monitor</div>
        <Logo />
      </div>
      <div className="powerSuppContainer">
        <div className="powSupPosContainer">
          <div className="powSupPos">
            <Stat style={{ fontSize: "24px" }} />
            <span>Power Supply Position</span>
          </div>
          <div className="dateTextPowSup">{pspdata && pspdata?.latest.data.date}</div>
        </div>
        <div className="powSupDispContainer">
          <div className="dateContainer">
            <DateIcon style={{ fontSize: "25px" }} />
            <div className="dateNow">{pspdata && pspdata?.latest.data.date}</div>
            <div className="datePast">{pspdata && pspdata?.prev.data.date}</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">
              Energy Met <br />
              (MU)
            </div>
            <div className="powSupToday">{pspdata && pspdata?.latest.data.enrgy_met_mu}</div>
            <div className="powSuppast">{pspdata && pspdata?.prev.data.enrgy_met_mu}</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Energy Shortage (MU)</div>
            <div className="powSupToday">{pspdata && pspdata?.latest.data.enrgy_shrtage_mu}</div>
            <div className="powSuppast">{pspdata && pspdata?.prev.data.enrgy_shrtage_mu}</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Generation Outage (MW)</div>
            <div className="powSupToday">{pspdata && pspdata?.latest.data.outage}</div>
            <div className="powSuppast">{pspdata && pspdata?.prev.data.outage}</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Frequency (49.9-50.05)</div>
            <div className="powSupToday">{pspdata && pspdata?.latest.data.frequency}</div>
            <div className="powSuppast">{pspdata && pspdata?.prev.data.frequency}</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Max Demand (MW)</div>
            <div className="powSupToday">{pspdata && pspdata?.latest.data.max_demand_met_during_the_day_mw_from_nldc_scada}</div>
            <div className="powSuppast">{pspdata && pspdata?.prev.data.max_demand_met_during_the_day_mw_from_nldc_scada}</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Solar Hour Peak (MW)</div>
            <div className="powSupToday">{pspdata && pspdata?.latest.data.solar_gen_mu}</div>
            <div className="powSuppast">{pspdata && pspdata?.prev.data.solar_gen_mu}</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Evening Peak (MW)</div>
            <div className="powSupToday">{pspdata && pspdata?.latest.data.demand_met_during_evening_peak_hrsmw_at_19_00_hrs_from_rldcs}</div>
            <div className="powSuppast">{pspdata && pspdata?.prev.data.demand_met_during_evening_peak_hrsmw_at_19_00_hrs_from_rldcs}</div>
          </div>
          <div className="eachEnergyContainer">
            <div className="powSupHeading">Peak Shortage (MW)</div>
            <div className="powSupToday">{pspdata && pspdata?.latest.data.peak_shrtage_mw}</div>
            <div className="powSuppast">{pspdata && pspdata?.prev.data.peak_shrtage_mw}</div>
          </div>
          
        </div>
      </div>
      <div className="collectiveMarketCont">
        <div className="cmContainer">
          <div className="collHeadContainer">
            <div className="headingContSub">
              <div className="collHeading">
                <Collective style={{ fontSize: "24px" }} />
                <span>Collective Market</span>
              </div>
              <div className="collTypesSec">
                <div
                  className={
                    selectedMarket === "DAM"
                      ? "activeCollType"
                      : "inactiveCollType"
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
                </div>
              </div>
            </div>
            <div className="dateTextPowSup">{data && data?.date}</div>
          </div>
          <div className="marketContianer">
            <div className="marketTypeCont">
              <div className="marketImageArea2">
                <CollMar style={{ fontSize: "36px" }} />
              </div>
              <div className="marketTextArea">
                <div className="mcpButton">MCP</div>
              </div>
              <div className="marketTextArea">
                <div className="mcpButton">MCV</div>
              </div>
              <div className="marketTextArea">
                <div className="sellButton">Sell Bid</div>
              </div>
              <div className="marketTextArea">
                <div className="sellButton">Purchase Bid</div>
              </div>
              <div className="marketTextArea">
                <div className="sellButton">₹10 MCP Blocks</div>
              </div>
            </div>
            {["HPX", "IEX", "PXIL"].map((market) => {
              return (
                <div className="marketDetailsCont" key={market}>
                  <div className="marketImageArea">
                    {market === "HPX" ? (
                      <HPX style={{ height: "28px", width: "86px" }} />
                    ) : market === "IEX" ? (
                      <IEX style={{ height: "28px", width: "86px" }} />
                    ) : (
                      <Pxil style={{ height: "28px", width: "86px" }} />
                    )}
                  </div>
                  {[
                    "mcp_avg",
                    "mcv_total",
                    "sell_bid_total",
                    "purchase_bid_total",
                     "no_of_mcp_at_10"
                  ].map((key) => {
                    return (
                      <div className="marketTextArea" key={key}>
                        <div className="valEach">
                          <div className="mainValue1">
                            {data &&
                              data[market][selectedMarket] ?
                              data[market][selectedMarket]?.latest[key] : '-'}
                          </div>
                          <div className="iconCont">
                            {data &&
                            data[market][selectedMarket] &&
                            data[market][selectedMarket].change[key] >= 0 ? (
                              <IconUp />
                            ) : (
                              <IconDown />
                            )}
                            <span className={data && data[market][selectedMarket] && data![market][selectedMarket]?.change[key] >= -0.001 ? "": "iconCOntDown"}>
                              {data &&
                                data[market][selectedMarket] &&  data[market][selectedMarket] ?
                                data[market][selectedMarket]?.change[key]+ "%": "- %"} 
                            </span>
                          </div>
                        </div>
                        <div className="valEach">
                          <div className="mainVal2">Yesterday</div>
                          <div className="mainVal2Right">
                            {data &&
                              data[market][selectedMarket] ?
                              data[market][selectedMarket].previous[key] : '-'}
                          </div>
                          
                        </div>
                        
                        
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div className="rtmContainer">
          <div className="rtmHeadCont">
            <div className="rtmHeadText">Real Time Market</div>
            <div className="timerTxt">{currentTime}</div>
          </div>
          <div className="rtmGraphContainer">
            <ReLineChart
              data={data && data["IEX"]["RTM"] && data["IEX"]["RTM"].chartData as any}
              unit={COST_UNIT}
              
              yAxisWidth={45}
              
              isTimeSlot={true}
              xLabel="Time(Hrs)"
              yAxisLabel="(Rs/kWh)"
              disableLegend={true}
              legends={[{ dataKey: "mcp_rs_mwh", name: "MCP", stroke: "rgba(241, 147, 92, 1)" }]}
              xDataKey="time_slot"
              xTick={renderHourTick}
              
            />
          </div>
          <div className="rtmDetailsCont">
            <div className="rtmL1">
              <CollMar style={{ height: "26px" }} />
              <div>MCP</div>
              <div>MCV</div>
            </div>
            <div className="rtmL2">
              <HPX style={{ height: "26px" }} />
              <div>{data && data["HPX"]["RTM"] && data["HPX"]["RTM"].latest.mcp_avg}</div>
              <div>{data && data["HPX"]["RTM"] && data["HPX"]["RTM"].latest.mcv_total}</div>
            </div>
            <div className="rtmL2">
              <IEX style={{ height: "26px" }} />
              <div>{data && data["IEX"]["RTM"] && data["IEX"]["RTM"].latest.mcp_avg}</div>
              <div>{data && data["IEX"]["RTM"] && data["IEX"]["RTM"].latest.mcv_total}</div>
            </div>
            <div className="rtmL2">
              <Pxil style={{ height: "26px" }} />
              <div>{data && data["PXIL"]["RTM"] && data["PXIL"]["RTM"].latest.mcp_avg}</div>
              <div>{data && data["PXIL"]["RTM"] && data["PXIL"]["RTM"].latest.mcv_total}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottomText">
        Powered By <b>GNA Energy</b> <br></br> (GNA Energy
          Data & Analytics Capability Center)
      </div>
    </div>
  );
};

export default MarketMonitoring;
