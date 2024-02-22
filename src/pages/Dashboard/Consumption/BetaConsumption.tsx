import { useEffect, useState } from "react";
import {
  ChartConsumptionData,
  ChartOutageData,
  ConsumptionColors,
  FormatConsumptionData,
  FormatGenerationData,
  FormatOutageData,
  GenerationChartData,
  aggreageOutageData,
} from "./FormatData";
import React from "react";
import {
  Brush,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import "./Consumption.css";
import StartEndDate from "../../../components/StartEndDate";
import { PrimaryColor, buildHttpReq } from "../../../common";
import { MediumButton, SmallButton } from "../../../components/Button";
import Loading from "../../../components/Loading";
export function BetaConsumption() {
  let [chartData, setChartData] = React.useState<ChartConsumptionData>(
    FormatConsumptionData([])
  );
  const [selectedState, setSelectedState] = React.useState<string[] | null>([
    // chartData.states[0].name,
  ]);
  const [chartGenerationData, setGenerationData] = React.useState([]);
  const [formattedGenerationData, setFormattedGenerationData] =
    React.useState<GenerationChartData>(FormatGenerationData([]));

  let [chartOutageData, setOutageData] = React.useState<ChartOutageData>(
    FormatOutageData([])
  );
  let [selectedOutageRegion, setSelectedOutageRegion] = React.useState<
    string[]
  >([
    // chartOutageData.region[0].name,
  ]);
  const [selectedGenerationState, setSelectedGenerationState] = React.useState<
    string[] | null
  >([
    // chartGenerationData.states[0],
  ]);
  useEffect(() => {
    FetchDemandData({ start_date: startDate, end_date: endDate });
    FetchOutageData({ start_date: startDate, end_date: endDate });
    FetchGenerationData({ start_date: startDate, end_date: endDate });
    FetchRealTimeGenerationData();
  }, []);
  const [tabIndex, setTabIndex] = useState(0);
  let [endDate, setEndDate] = useState(
    new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000)
  );
  let [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 369 * 24 * 60 * 60 * 1000)
  );
  let maxDate = new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000);
  const [loading, setLoading] = useState(true);
  const [hiddenGenerationCharts, setHiddenGenerationCharts] = useState<
    string[]
  >([]);
  const [demandLoading, setDemandLoading] = useState(true);
  const [generationLoading, setGenerationLoading] = useState(true);
  const [outageLoading, setOutageLoading] = useState(true);
  const [realTimeGenerationLoading, setRealTimeGenerationLoading] =
    useState(true);
  const [realtimeData, setRealtimeData] = useState([]);
  const [realTimeKeys, setRealTimeKeys] = useState<any[]>([]);
  return (
    <div className="">
      <div className="flex justify-between mr-2 mt-2">
      {tabIndex !=3 &&  <div className="flex dateSelection">
          <input
            type="date"
            data-date-format="DD MMMM YYYY"
            className="p-2 br-20 mr-2 rounded-lg"
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
              startDate = new Date(e.target.value);
              setStartDate(new Date(e.target.value));
              FetchDemandData({
                start_date: new Date(e.target.value),
                end_date: endDate,
              });
              FetchGenerationData({
                start_date: new Date(e.target.value),
                end_date: endDate,
              });
              FetchOutageData({
                start_date: new Date(e.target.value),
                end_date: endDate,
              });

              // fetchExchangeData({
              //   start_date: new Date(e.target.value),
              //   end_date: endDate,
              // });
            }}
          />
          to
          <input
            type="date"
            data-date-format="DD MMMM YYYY"
            className="p-2 ml-2 br-20 rounded-lg"
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
              endDate = new Date(e.target.value);
              setEndDate(new Date(e.target.value));
              FetchDemandData({
                start_date: startDate,
                end_date: new Date(e.target.value),
              });
              FetchGenerationData({
                start_date: startDate,
                end_date: new Date(e.target.value),
              });
              FetchOutageData({
                start_date: startDate,
                end_date: new Date(e.target.value),
              });
            }}
          />
        </div>}
        <h1 className="consumptionTitle">
          Consumption & Generation Analytics{" "}
        </h1>
        <div className="flex justify-between mr-2 consumptionButtons">
          <SmallButton
            buttonTitle="Demand"
            className="consumptionButton"
            onClick={() => {
              setTabIndex(0);
            }}
            isActive={tabIndex == 0}
          />
          <SmallButton
            buttonTitle="Generation"
            className="consumptionButton"
            onClick={() => {
              setTabIndex(1);
            }}
            isActive={tabIndex == 1}
          />
          <SmallButton
            buttonTitle="Outage"
            className="consumptionButton"
            onClick={() => {
              setTabIndex(2);
            }}
            isActive={tabIndex == 2}
          />
          {/* <SmallButton
            buttonTitle="Real Time Generation"
            onClick={() => {
              setTabIndex(3);
            }}
            isActive={tabIndex == 3}
          /> */}
        </div>
      </div>
      <div className="flex flex-row w-full h-full">
        {tabIndex === 0 ? (
          <>
            {demandLoading && <Loading />}
            <div className="w-1/6 consumptionFilters h-1">
              {chartData.states.map((state) => {
                return (
                  <button
                    onClick={() => {
                      setSelectedState((selectedState: any) => {
                        if (selectedState?.includes(state.name)) {
                          return selectedState?.filter(
                            (item: any) => item !== state.name
                          );
                        } else {
                          return [...(selectedState ?? []), state.name];
                        }
                      });
                    }}
                    className={`filter-item ${
                      selectedState?.includes(state.name) ? "activeFilter " : ""
                    }`}
                  >
                    {state.name}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-grow ml-10 ">
              <div className="w-full ConsumptionChart">
                <h2 className="text-xl mt-2">Energy Met (MUs)</h2>

                <ResponsiveContainer className={"mb-10"}>
                  <LineChart
                    syncId={"consumptionChart"}
                    data={chartData.data}
                    margin={{
                      right: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {selectedState?.map((state, index) => {
                      return (
                        <Line
                          type="monotone"
                          dataKey={`${state}_energyMet`}
                          strokeWidth={2}
                          dot={false}
                          stroke={ConsumptionColors[index].toString()}
                          name={state}
                        />
                      );
                    })}
                    <XAxis
                      dataKey="date"
                      fontSize={13}
                      height={50}
                      minTickGap={30}
                      tickSize={11}
                    >
                      <Label
                        value="Date"
                        offset={10}
                        fontSize={14}
                        position="insideBottom"
                      />
                    </XAxis>
                    <YAxis max={10} width={70}>
                      <Label value="MUs" angle={-90} position="insideLeft" />
                    </YAxis>
                    <Legend verticalAlign="top" />
                    <Tooltip
                      formatter={(value, name, props) => {
                        const val = parseFloat(value.toString()).toFixed(2);
                        return [val + " MUs", name];
                      }}
                    />
                    <Brush height={0} dataKey={"date"} />
                  </LineChart>
                </ResponsiveContainer>
                <h2 className="text-xl">Peak Demand (MW)</h2>

                <ResponsiveContainer>
                  <LineChart
                    syncId={"consumptionChart"}
                    data={chartData.data}
                    margin={{
                      right: 20,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    {selectedState?.map((state, index) => {
                      return (
                        <Line
                          type="monotone"
                          dataKey={`${state}_peakDemand`}
                          strokeWidth={2}
                          dot={false}
                          stroke={ConsumptionColors[index].toString()}
                          name={state}
                        />
                      );
                    })}
                    <XAxis
                      dataKey="date"
                      fontSize={13}
                      height={50}
                      minTickGap={30}
                      tickSize={11}
                    >
                      <Label
                        value="Date"
                        offset={10}
                        fontSize={14}
                        position="insideBottom"
                      />
                    </XAxis>
                    <YAxis width={70}>
                      <Label value="MW" angle={-90} position="insideLeft" />
                    </YAxis>
                    <Legend verticalAlign="top" />
                    <Tooltip
                      formatter={(value, name, props) => {
                        const val = parseFloat(value.toString()).toFixed(2);
                        return [val + " MW", name];
                      }}
                    />
                    <Brush dataKey={"date"} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : tabIndex === 1 ? (
          <div className="flex w-full OutageChart GenerationChart">
            {generationLoading && <Loading />}
            <div className="w-1/6 consumptionFilters">
              {formattedGenerationData.states.map((state) => {
                return (
                  <button
                    onClick={() => {
                      setSelectedGenerationState(
                        (selectedGenerationState: any) => {
                          if (selectedGenerationState?.includes(state)) {
                            return selectedGenerationState?.filter(
                              (item: any) => item !== state
                            );
                          } else {
                            return [...(selectedGenerationState ?? []), state];
                          }
                        }
                      );
                    }}
                    className={`filter-item ${
                      selectedGenerationState?.includes(state)
                        ? "activeFilter "
                        : ""
                    }`}
                  >
                    {state}
                  </button>
                );
              })}
            </div>
            <ResponsiveContainer className={"ml-5 mr-5"}>
              <AreaChart
                data={
                  selectedGenerationState?.length == 0
                    ? FormatGenerationData(chartGenerationData).data
                    : FormatGenerationData(
                        chartGenerationData.filter((item: any) =>
                          selectedGenerationState?.includes(item.state)
                        )
                      ).data
                }
                margin={{
                  right: 20,
                }}
              >
                <Legend
                  verticalAlign="top"
                  onClick={(e) => {
                    if (hiddenGenerationCharts.includes(e.value)) {
                      setHiddenGenerationCharts(
                        hiddenGenerationCharts.filter(
                          (item) => item !== e.value
                        )
                      );
                    } else {
                      setHiddenGenerationCharts([
                        ...hiddenGenerationCharts,
                        e.value,
                      ]);
                    }
                  }}
                />
                <YAxis width={70}>
                  <Label value="MUs" angle={-90} position="insideLeft" />
                </YAxis>
                <CartesianGrid strokeDasharray="3 3" />

                <Area
                  type="monotone"
                  dataKey="wind"
                  name="Wind"
                  stroke="Blue"
                  stackId={1}
                  hide={hiddenGenerationCharts.includes("Wind")}
                  fill="Blue"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="hydro"
                  stackId={1}
                  hide={hiddenGenerationCharts.includes("Hydro")}
                  name="Hydro"
                  stroke="Green"
                  fill="Green"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="solar"
                  name="Solar"
                  stackId={1}
                  hide={hiddenGenerationCharts.includes("Solar")}
                  stroke="#00FFFF
                  "
                  fill="#00FFFF	
                  "
                  strokeWidth={3}
                />

                <Area
                  type="monotone"
                  dataKey="nuclear"
                  name="Nuclear"
                  stroke="Red"
                  stackId={1}
                  hide={hiddenGenerationCharts.includes("Nuclear")}
                  fill="Red"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="thermal"
                  name="Thermal"
                  stroke="#FF681F"
                  fill="#FF681F"
                  stackId={1}
                  strokeWidth={3}
                  hide={hiddenGenerationCharts.includes("Thermal")}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    const val = parseFloat(value.toString()).toFixed(2);
                    return [val + " MW", name];
                  }}
                />
                <Brush dataKey={"date"} />
                <XAxis
                  dataKey="date"
                  fontSize={13}
                  height={50}
                  minTickGap={30}
                  tickSize={11}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : tabIndex === 2 ? (
          
            <div className="flex flex-row w-full">
              {outageLoading && <Loading />}
              <div className="w-1/6 flex">
                <div className="w-full">
                  <h2 className="text-xl mt-2 mb-3">Regions</h2>
                  {chartOutageData.region.map((region) => {
                    return (
                      <button
                        onClick={() => {
                          setSelectedOutageRegion((selectedRegion: any) => {
                            if (selectedOutageRegion?.includes(region.name)) {
                              return selectedOutageRegion?.filter(
                                (item: any) => item !== region.name
                              );
                            } else {
                              return [
                                ...(selectedOutageRegion ?? []),
                                region.name,
                              ];
                            }
                          });
                        }}
                        className={`filter-item ${
                          selectedOutageRegion?.includes(region.name)
                            ? "activeFilter "
                            : ""
                        }`}
                      >
                        {region.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="OutageChart w-full mr-10 ml-10">
                <h2 className="text-xl text-center mt-2">Outage (MW)</h2>
                <ResponsiveContainer>
                  <LineChart
                    data={aggreageOutageData(
                      chartOutageData,
                      selectedOutageRegion
                    )}
                  >
                    <XAxis
                      dataKey="date"
                      fontSize={13}
                      height={50}
                      minTickGap={30}
                      tickSize={11}
                    >
                      <Label
                        value="Date"
                        offset={10}
                        fontSize={14}
                        position="insideBottom"
                      />
                    </XAxis>
                    <YAxis max={10} width={70}>
                      <Label value="MW" angle={-90} position="insideLeft" />
                    </YAxis>{" "}
                    <Line
                      type="monotone"
                      strokeWidth={3}
                      dot={false}
                      dataKey="stateSector"
                      name="State Sector"
                      stroke="rgb(17, 141, 255)"
                    />
                    <Line
                      type="monotone"
                      strokeWidth={3}
                      dot={false}
                      dataKey="centralSector"
                      name="Central Sector"
                      stroke="rgb(18, 35, 158)"
                    />
                    <Tooltip
                      formatter={(value, name, props) => {
                        const val = parseFloat(value.toString()).toFixed(2);
                        return [val + " MW", name];
                      }}
                    />
                    <Legend verticalAlign="top" />
                    <Brush dataKey={"date"} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          
          
        ) : tabIndex === 3 && (
          <div className="w-full OutageChart mr-5">
            <h2 className="text-xl text-left mt-5 ml-5">Real Time Generation (MW)</h2>
            <ResponsiveContainer >
              <LineChart data={
                realTimeKeys.length > 0 ? realtimeData[realTimeKeys[0]] : []
              } >
                {/* {
            "demand_met": "208049",
            "gas_generation": "3323",
            "hydro_generation": "6373",
            "nuclear_generation": "4075",
            "renewable_generation": "47248",
            "thermal_generation": "145355",
            "time_slot": "10:45-11:00"
        }, */}
                <XAxis dataKey="time_slot" minTickGap={2} 
                height={50}
                offset={20}
                tickFormatter={
                  (value, index) => {
                    return (index+1).toString();
                  }
                } >
                  <Label
                    value="Time Slot"
                    height={80}
                    fontSize={14}
                    position="insideBottom" />
                </XAxis>
                <YAxis width={80}>
                  <Label value="MW" angle={-90} position="insideLeft" width={80} />
                </YAxis>
                <Tooltip 
                formatter={(value, name, props) => {
                  const val = parseFloat(value.toString()).toFixed(2);
                  return [val + " MW", name];
                }}
                
                />
                <Legend verticalAlign="top"/>
                <Line dot={false}  type="monotone" name="Demand Met" dataKey="demand_met" stroke="rgb(17, 141, 255)" strokeWidth={3} />
                <Line dot={false} type="monotone" name="Gas" dataKey="gas_generation" stroke="rgb(18, 35, 158)" strokeWidth={3}  />
                <Line dot={false} type="monotone" name="Hydro" dataKey="hydro_generation" stroke="#82ca9d" strokeWidth={3}  />
                <Line dot={false} type="monotone" name="Nuclear" dataKey="nuclear_generation" stroke="red" strokeWidth={3}  />
                <Line dot={false} type="monotone" name="Renewable" dataKey="renewable_generation" stroke="green" strokeWidth={3}  />
                <Line dot={false} type="monotone" name="Thermal" dataKey="thermal_generation" stroke={PrimaryColor} strokeWidth={3}  />
              <Brush dataKey={"time_slot"} 
              
              tickFormatter={
                (value, index) => {
                  return (index+1).toString();
                }
              } />
              </LineChart>
            </ResponsiveContainer>

          </div>
        ) 
        }
      </div>
    </div>
  );

  async function FetchDemandData({
    start_date,
    end_date,
  }: {
    start_date: Date;
    end_date: Date;
  }) {
    // fetch data from api
    // setChartData(FormatConsumptionData(data));
    setDemandLoading(true);

    const data = await buildHttpReq({
      endpoint: "consumption_api",
      method: "POST",
      body: {
        start_date: convertDate(start_date),
        end_date: convertDate(end_date),
      },
    });
    setChartData(FormatConsumptionData(data));
    chartData = FormatConsumptionData(data);
    setDemandLoading(false);
    setSelectedState([chartData.states[0].name, chartData.states[1].name]);
  }
  async function FetchOutageData({
    start_date,
    end_date,
  }: {
    start_date: Date;
    end_date: Date;
  }) {
    setOutageLoading(true);
    // fetch data from api
    const data = await buildHttpReq({
      endpoint: "generation_outage_api",
      method: "POST",
      body: {
        start_date: convertDate(start_date),
        end_date: convertDate(end_date),
      },
    });
    setOutageLoading(false);
    setOutageData(FormatOutageData(data));

    chartOutageData = FormatOutageData(data);
    // setSelectedOutageRegion([chartOutageData.region[0].name]);
  }

  async function FetchGenerationData({
    start_date,
    end_date,
  }: {
    start_date: Date;
    end_date: Date;
  }) {
    setGenerationLoading(true);
    // fetch data from api
    const data = await buildHttpReq({
      endpoint: "generation_data_api",
      method: "POST",
      body: {
        start_date: convertDate(start_date),
        end_date: convertDate(end_date),
      },
    });
    setGenerationLoading(false);
    setGenerationData(data);
    setFormattedGenerationData(FormatGenerationData(data));
  }

  async function FetchRealTimeGenerationData(){ 
    setRealTimeGenerationLoading(true);
    const data = await buildHttpReq({
      endpoint: "rtm_generation_api",
      method: "POST",
      body: {
        start_date: convertDate(startDate),
        end_date: convertDate(endDate),
      },
    });
    setRealtimeData(data);
    setRealTimeKeys(Object.keys(data));
    setRealTimeGenerationLoading(false);

  }

  function convertDate(Date: Date): string {
    // Convert date to dd-mm-yyyy
    return Date.toLocaleDateString("en-GB").split("/").join("-");
  }
}
