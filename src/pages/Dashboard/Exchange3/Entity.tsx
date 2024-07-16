import { useEffect, useState } from "react";
import { ReLineChart } from "../../../components/recharts/ReCharts";
import { getEntityComparisont } from "../../../Rest_api/restapi";
import { ChartType, ReChartData } from "../../../models/chart_model";
import { ReMixChart } from "../../../components/recharts/ReMixCharts";
import { SearchBox } from "../../../components/Search";
import { Exchanges_data } from "./Data/Exchanges_data";
import { EntityData } from "./Data/Entity_data";
import Loading from "../../../components/Loading";
import { COST_UNIT } from "../../../Units";
import { renderHourTick } from "./Chart";

export function EntityPage() {
  const [chartData, setChartData] = useState<ReChartData[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<
    {
      label: string;
      value: number;
    }[]
  >([
    {
      label: "GEB Beneficiary",
      value: 3019,
    },
  ]);
  const [selectedExchange, setSelectedExchange] = useState<
    { value: number; label: string }[]
  >([
    {
      value: 101,
      label: "IEX",
    },
  ]);

  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000)
  );
  const [isLoading, setIsLoading] = useState(true);
  const maxDate = new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000);

  
  useEffect(() => {
    fetchEntityData({
      entityid: 3027,
      exchange: "IEX",
      // newstartDate: "2023-01-01",
      // newendDate: "2023-12-31",
      newstartDate: startDate.toLocaleDateString("en-GB").split("/").reverse().join("-"),
      newendDate: endDate.toLocaleDateString("en-GB").split("/").reverse().join("-"),
    });
  }, []);
  return (
    <div className="onechart-container">
      {isLoading && <Loading />}
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div className="w-80">
            <SearchBox
              options={EntityData.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              selectedOptions={selectedEntity}
              isMany={false}
              onChange={(e: any) => {
                console.log(e);
                setSelectedEntity([e]);
                fetchEntityData({ entityid: e.value})
              }}
              placeholder="Search Entity"
            />{" "}
          </div>
          <SearchBox
            options={Exchanges_data.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
            selectedOptions={selectedExchange}
            onChange={(e: any) => {
            //   console.log(e);
              setSelectedExchange([e]);
              fetchEntityData({ exchange: e.label });

            }}
            placeholder="Search Exchanges"
          />
        </div>
        <div className="date-selection">
          <input
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
          type="date" className="date-input"
          onChange={(e) => {
            setStartDate(new Date(e.target.value));
            fetchEntityData({ newstartDate: e.target.value });
          }}
          />
          to
          <input
          onChange={
            (e) => {
              setEndDate(new Date(e.target.value));
              fetchEntityData({ newendDate: e.target.value });
            }
          }
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
          type="date" className="date-input" />
        </div>
      </div>
      <ReMixChart
        data={chartData}
        xDataKey="slot"
        // isTimeSlot={true}
        xLabel="Time (Hrs)"
        unit="MW"
        secondYAxisLabel={COST_UNIT}
        yAxisLabel="MW"
        // xTick={renderHourTick}
        legends={[
          {
            name: "Weighted Price",
            stroke: "orange",
            dataKey: "weighted_price",
            yAxisId: "right",
            type: ChartType.Bar,
          },
          {
            name: "DAM Buy Volume",
            stroke: "red",
            dataKey: "volume_buy_dam",
            type: ChartType.Line,
          },
          {
            name: "DAM Sell Volume",
            stroke: "blue",
            dataKey: "volume_sell_dam",
            type: ChartType.Line,
          },
          {
            name: "HPDAM Buy Volume",
            stroke: "Maroon",
            dataKey: "volume_buy_hpdam",
            type: ChartType.Line,
          },
          {
            name: "HPDAM Sell Volume",
            stroke: "brown",
            dataKey: "volume_sell_hpdam",
            type: ChartType.Line,
          },
          {
            name: "GDAM Buy Volume",
            stroke: "green",
            dataKey: "volume_buy_hpdam",
            type: ChartType.Line,
          },
          {
            name: "GDAM Sell Volume",
            stroke: "darkgreen",
            dataKey: "volume_sell_hpdam",
            type: ChartType.Line,
          },
          {
            name: "RTM Buy Volume",
            stroke: "purple",
            dataKey: "volume_buy_rtm",
            type: ChartType.Line,
          },
          {
            name: "RTM Sell Volume",
            stroke: "black",
            dataKey: "volume_sell_rtm",
            type: ChartType.Line,
          },
        ]}
      />
    </div>
  );

  function fetchEntityData({
    entityid,
    exchange,
    newstartDate,
    newendDate,
  }: {
    entityid?: number;
    exchange?: string;
    newstartDate?: string;
    newendDate?: string;
  }) {
    setIsLoading(true);
    getEntityComparisont({
        entityid: entityid || selectedEntity[0].value,
        exchange: exchange || selectedExchange[0].label,
        startDate: newstartDate || startDate.toLocaleDateString("en-GB").split("/").reverse().join("-"),
        endDate: newendDate || endDate.toLocaleDateString("en-GB").split("/").reverse().join("-"),


        }).then((data) =>{ setChartData(data); setIsLoading(false);});
  }
}
