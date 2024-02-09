import { useEffect, useState } from "react";
import {
  ChartConsumptionData,
  ChartOutageData,
  ConsumptionColors,
  FormatConsumptionData,
  FormatGenerationData,
  FormatOutageData,
  GenerationChartData,  aggreageOutageData,
} from "./FormatData";
import { ConsumptionData, GenerationData, OutageData } from "./Data";
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
import { buildHttpReq } from "../../../common";
import { MediumButton, SmallButton } from "../../../components/Button";

export function BetaConsumption() {
  let [chartData, setChartData] = React.useState<ChartConsumptionData>(
    FormatConsumptionData([])
  );
  const [selectedState, setSelectedState] = React.useState<string[] | null>([
    // chartData.states[0].name,
  ]);
  const [chartGenerationData, setGenerationData] = React.useState(
    GenerationData
    
  );
  const [formattedGenerationData, setFormattedGenerationData] = React.useState<GenerationChartData>(
    FormatGenerationData(
      GenerationData 
    )
  );

  let [chartOutageData, setOutageData] = React.useState<ChartOutageData>(
    FormatOutageData([])
  );
  let [selectedOutageRegion, setSelectedOutageRegion] = React.useState<
    string[] 
  >([
    // chartOutageData.region[0].name,
  ]);
  const [selectedGenerationState, setSelectedGenerationState] = React.useState<string[] | null>([
    // chartGenerationData.states[0],
  ]); 
  useEffect(() => {
    FormatGenerationData(GenerationData);
    FetchDemandData({ start_date: "", end_date: "" });
    FetchOutageData({ start_date: "", end_date: "" });
    FetchGenerationData({ start_date: "", end_date: "" });  
  }, []);

  let [startMonth, setStartMonth] = useState({ value: -1, label: "" });
  let [endMonth, setEndMonth] = useState({ value: -1, label: "" });
  const [tabIndex, setTabIndex] = useState(0);

  const DemandBody = () => {
    return (
      <>
        <div className="w-1/6 consumptionFilters">
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
            <h2 className="text-2xl">Energy Met (MUs)</h2>

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
                <Tooltip />
                <Brush height={0} dataKey={"date"} />
              </LineChart>
            </ResponsiveContainer>
            <h2 className="text-2xl">Peak Demand (MW)</h2>

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
                <Tooltip />
                <Brush dataKey={"date"} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </>
    );
  };
 const OutageBody = () => {
  return  <div className="flex flex-row w-full">
              <div className="w-1/6 flex">
                <div className="w-full">
                <h2 className="text-2xl mt-2 mb-3">Regions</h2>
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
              </div></div>
              <div className="OutageChart w-full mr-10 ml-10">
                <h2 className="text-2xl text-center mt-2">Outage (MW)</h2>
              <ResponsiveContainer>
                <LineChart
                data={aggreageOutageData(chartOutageData, selectedOutageRegion)}>
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
                </YAxis>                    <Line type="monotone" strokeWidth={3} dot={false} dataKey="stateSector" name="State Sector" stroke="rgb(17, 141, 255)" />
                    <Line type="monotone" strokeWidth={3} dot={false} dataKey="centralSector" name="Central Sector" stroke="rgb(18, 35, 158)" />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Brush dataKey={"date"} />

                </LineChart>
              </ResponsiveContainer></div>
            </div>}
  return (
    <div className="mt-2">
      <div className="flex justify-between mr-2">
        <StartEndDate
          startMonth={startMonth}
          endMonth={endMonth}
          options={chartData.date.map((item, index) => {
            return {
              id: index,
              title: item,
            };
          })}
          onEndMonthChange={(v) => {
            setEndMonth(v);
            FetchDemandData({ start_date: startMonth.label, end_date: v.label });
            FetchOutageData({ start_date: startMonth.label, end_date: v.label });
          }}
          onStartMonthChange={(v) => {
            setStartMonth(v);
            FetchDemandData({ start_date: v.label, end_date: endMonth.label });
            FetchOutageData({ start_date: v.label, end_date: endMonth.label });
          }}
        />
        <h1 className="text-3xl text-center">
          Consumption & Generation Analytics{" "}
        </h1>
        <div className="flex justify-between mr-2">
          <MediumButton
            buttonTitle="Demand"
            onClick={() => {
              setTabIndex(0);
            }}
            isActive={tabIndex == 0}
          />
          <MediumButton
            buttonTitle="RE Generation"
            onClick={() => {
              setTabIndex(1);
            }}
            isActive={tabIndex == 1}
          />
          <MediumButton
            buttonTitle="Outage"
            onClick={() => {
              setTabIndex(2);
            }}
            isActive={tabIndex == 2}
          />
        </div>
      </div>
      <div className="flex flex-row w-full h-full">
        {tabIndex === 0 ? (
          <DemandBody />
        ) : tabIndex === 1 ? (
          <div className="flex w-full OutageChart">
            <div className="w-1/6 consumptionFilters">
              {formattedGenerationData.states.map((state) => {
                return (
                  <button
                    onClick={() => {
                      setSelectedGenerationState((selectedGenerationState: any) => {
                        if (selectedGenerationState?.includes(state)) {
                          return selectedGenerationState?.filter(
                            (item: any) => item !== state
                          );
                        } else {
                          return [...(selectedGenerationState ?? []), state];
                        }
                      });
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
            <ResponsiveContainer className={"ml-5 mr-5"} >
            <ComposedChart
              data={ selectedGenerationState?.length == 0 ? FormatGenerationData(chartGenerationData).data : FormatGenerationData(chartGenerationData.filter((item : any) =>selectedGenerationState?.includes(item.state))).data}
              margin={{
                right: 20,
              }} >
                <Legend verticalAlign="top" />
                <YAxis width={70}>
                  <Label value="MUs" angle={-90} position="insideLeft" />
                  </YAxis>
                <CartesianGrid strokeDasharray="3 3" />
                <Area type="monotone" dataKey="thermal" name="Thermal"  stroke="Red" fill="Red" strokeWidth={3} />
                <Area type="monotone" dataKey="wind" name="Hydro"  stroke="Green" fill="Green" strokeWidth={3} />
                <Area type="monotone" dataKey="hydro" name="Wind"  stroke="Blue" fill="Blue" strokeWidth={3} />
                <Area type="monotone" dataKey="solar" name="Solar"  stroke="Orange" fill="Orange" strokeWidth={3} />
                <Tooltip />
                <Brush dataKey={"date"} />
              <XAxis
                dataKey="date"
                fontSize={13}
                height={50}
                minTickGap={30}
                tickSize={11} />
              </ComposedChart></ResponsiveContainer>
          </div>
        ) : (
          tabIndex === 2 && (
            <OutageBody />
          )
        )}
      </div>
    </div>
  );

  async function FetchDemandData({
    start_date,
    end_date,
  }: {
    start_date: string;
    end_date: string;
  }) {
    // fetch data from api
    // setChartData(FormatConsumptionData(data));

    const data = await buildHttpReq({
      endpoint: "consumption_api",
      method: "POST",
      body:
        start_date === "" || end_date === ""
          ? {}
          : {
              start_date: start_date,
              end_date: end_date,
            },
    });
    setChartData(FormatConsumptionData(data));
    chartData = FormatConsumptionData(data);
    setSelectedState([chartData.states[0].name, chartData.states[1].name]);
  }
  async function FetchOutageData({
    start_date,
    end_date,
    }: {
    start_date: string;
    end_date: string;
    }) {
    // fetch data from api
    const data = await buildHttpReq({
        endpoint: "generation_outage_api",
        method: "POST",
        body:
            start_date === "" || end_date === ""
            ? {}
            : {
                start_date: start_date,
                end_date: end_date,
                },
        });
    setOutageData(FormatOutageData(data));
    chartOutageData = FormatOutageData(data);
    // setSelectedOutageRegion([chartOutageData.region[0].name]);
    }

  async function FetchGenerationData({
    start_date,
    end_date,
  }: {
    start_date: string;
    end_date: string;
  }) {
    // fetch data from api
    const data = await buildHttpReq({
      endpoint: "generation_data_api",
      method: "POST",
      body:
        start_date === "" || end_date === ""
          ? {}
          : {
              start_date: start_date,
              end_date: end_date,
            },
    });
    setGenerationData(data);
    setFormattedGenerationData(FormatGenerationData(data));
  }
}
