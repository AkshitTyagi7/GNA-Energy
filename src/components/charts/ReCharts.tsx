import { useState } from "react";
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Cell,
  ComposedChart,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PrimaryColor } from "../../common";
export const COLORS = [
  "#FF7F50",
  "#B8860B",
  "#7CB5EC",
  "#F1935C",
  "#34656D",
  "#333333",
];
export interface ReChartData {
  [key: string]: number | string | Date | null | undefined;
}

export interface LegendKey {
  name?: string;
  stroke?: string;
  dataKey: string;
  // color: string;
}

export const BAR_RADIUS: number | [number, number, number, number] = [
  4, 4, 0, 0,
];

export function getColorList(length: number) {
  let colors = [];
  for (let i = 0; i < length; i++) {
    colors.push(COLORS[i % COLORS.length]);
  }
  return colors;
}

export enum BrushStart {
  Start,
  End,
}

export function ReLineChart({
  data,
  legends,
  syncid,
  unit,
  xDataKey,
  yAxisLabel,
  yAxisWidth,
  secondXDataKey,
  showBrush = false,
  brushHeight = 30,
  brushStart = BrushStart.End,
  fontSize,
}: {
  data: ReChartData[];
  legends: LegendKey[];
  syncid?: string;
  unit?: string;
  xDataKey: string;
  yAxisWidth?: number;
  secondXDataKey?: string;
  yAxisLabel?: string;
  fontSize?: number;
  showBrush?: boolean;
  brushHeight?: number;
  brushStart?: BrushStart;
}) {
  const [selectedLegends, setSelectedLegends] = useState<LegendKey[]>([]);
  return (
    <div className="chart-container">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-3">
        {legends
          .filter((e) => e.dataKey != xDataKey)
          .map((legend, index) => {
            return (
              <div
                className="realTime-Legend"
                onClick={() => {
                  if (
                    selectedLegends.filter(
                      (item) => item.dataKey === legend.dataKey
                    ).length > 0
                  ) {
                    setSelectedLegends(
                      selectedLegends.filter(
                        (item) => item.dataKey !== legend.dataKey
                      )
                    );
                  } else {
                    setSelectedLegends([...selectedLegends, legend]);
                  }
                }}
              >
                <p
                  style={{
                    color:
                      selectedLegends.filter(
                        (item) => item.dataKey === legend.dataKey
                      ).length > 0 || selectedLegends.length === 0
                        ? legend.stroke === null || legend.stroke === undefined
                          ? COLORS[
                              index > COLORS.length - 1
                                ? index - COLORS.length
                                : index
                            ]
                          : legend.stroke
                        : "grey",
                  }}
                >
                  {" "}
                  <div
                    className="dot"
                    style={{
                      backgroundColor:
                        selectedLegends.filter(
                          (item) => item.dataKey === legend.dataKey
                        ).length > 0 || selectedLegends.length === 0
                          ? legend.stroke === null ||
                            legend.stroke === undefined
                            ? COLORS[
                                index > COLORS.length - 1
                                  ? index - COLORS.length
                                  : index
                              ]
                            : legend.stroke
                          : "grey",
                    }}
                  ></div>{" "}
                  {legend.name}
                </p>
              </div>
            );
          })}
      </div>

      <ResponsiveContainer height={"80%"}>
        <LineChart syncId={syncid} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis  minTickGap={8} dataKey={xDataKey} />
          {secondXDataKey !== undefined ? (
            <XAxis
              dataKey={secondXDataKey}
              axisLine={false}
              tickLine={false}
              fontSize={12}
              interval={0}
              tick={renderQuarterTick as any}
              height={20}
              xAxisId="quarter"
            />
          ) : null}
          <YAxis fontSize={fontSize} width={yAxisWidth}>
            <Label
              fontSize={fontSize}
              value={yAxisLabel}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          {showBrush && (
            <Brush
              dataKey={xDataKey}
              height={brushHeight}
              stroke={PrimaryColor}
              startIndex={
                data != null && brushStart === BrushStart.Start
                  ? 0
                  : data.length > 96 - 1
                  ? data.length - 96
                  : 0
              }
              endIndex={
                data != null && brushStart === BrushStart.Start
                  ? 96 - 1
                  : data.length > 96
                  ? data.length - 1
                  : 0
              }
              floodColor={PrimaryColor}
            />
          )}
          <Tooltip
            labelFormatter={(value, payload) => {
              try {
                if (payload[0].payload.date == undefined){
                  return [value]
                }
                return [`${payload[0].payload.date} - Time Slot ${value}`];
              } catch {
                return [value];
              }
            }}
            formatter={(value, name, props) => {
              return [
                name +
                  " : " +
                  parseFloat(value.toString())
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                  " " +
                  unit,
              ];
            }}
          />

          {selectedLegends.length === 0
            ? legends
                .filter((e) => e.dataKey != xDataKey)
                .map((legend, index) => {
                  return (
                    <Line
                      key={index}
                      type="monotone"
                      name={typeof legend === "string" ? legend : legend.name}
                      dataKey={
                        typeof legend === "string" ? legend : legend.dataKey
                      }
                      stroke={
                        legend.stroke === null || legend.stroke === undefined
                          ? COLORS[
                              index > COLORS.length - 1
                                ? index - COLORS.length
                                : index
                            ]
                          : legend.stroke
                      }
                      dot={false}
                      strokeWidth={2}
                    />
                  );
                })
            : selectedLegends.map((legend, index) => {
                return (
                  <Line
                    key={index}
                    type="monotone"
                    name={typeof legend === "string" ? legend : legend.name}
                    dataKey={
                      typeof legend === "string" ? legend : legend.dataKey
                    }
                    stroke={
                      legend.stroke === null || legend.stroke === undefined
                        ? COLORS[
                            index > COLORS.length - 1
                              ? index - COLORS.length
                              : index
                          ]
                        : legend.stroke
                    }
                    dot={false}
                    strokeWidth={2}
                  />
                );
              })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export const renderQuarterTick = (tickProps: any) => {
  const { x, y, payload } = tickProps;
  const { index, value, offset } = payload;
  const finalIndex = index + 1;

  // if (finalIndex  === 1 || finalIndex%97 ===0 ) {
  //   const pathX = Math.floor(x - offset) + 0.5;
  //   return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red"  width={"2px"}/>;
  // }
  if (finalIndex % 48 === 0 && finalIndex % 96 !== 0) {
    return (
      <text x={x} y={y - 4} fontSize={12} textAnchor="middle">
        {value}
      </text>
    );
  }
};

export const LegendItem = ({
  name,
  color,
  onClick,
  fontSize,
}: {
  name: string;
  color: string;
  onClick?: () => void;
  fontSize?: string;
}) => {
  return (
    <div className="realTime-Legend" onClick={onClick}>
      <p style={{ color: color }}>
        {" "}
        <div className="dot" style={{ backgroundColor: color }}></div> {name}
      </p>
    </div>
  );
};

export function ReBarChart({
  data,
  legends,
  syncid,
  unit,
  xDataKey,
  yAxisLabel,
  yAxisWidth,
  showLegend = true,
  secondXDataKey,
  showBrush = false,
  brushHeight = 30,
  brushStart = BrushStart.End,
  fontSize,
}: {
  data: ReChartData[];
  legends: LegendKey[];
  syncid?: string;
  showLegend?: boolean;
  unit?: string;
  xDataKey: string;
  yAxisWidth?: number;
  secondXDataKey?: string;
  yAxisLabel?: string;
  fontSize?: number;
  showBrush?: boolean;
  brushHeight?: number;
  brushStart?: BrushStart;
}) {
  const [selectedLegends, setSelectedLegends] = useState<LegendKey[]>([]);

  return (
    <div className="chart-container">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-3">
        {legends
          .filter((e) => e.dataKey != xDataKey)
          .map((legend, index) => {
            return (
            !showLegend ? null :    <div
                className="realTime-Legend"
                onClick={() => {
                  if (
                    selectedLegends.filter(
                      (item) => item.dataKey === legend.dataKey
                    ).length > 0
                  ) {
                    setSelectedLegends(
                      selectedLegends.filter(
                        (item) => item.dataKey !== legend.dataKey
                      )
                    );
                  } else {
                    setSelectedLegends([...selectedLegends, legend]);
                  }
                }}
              >
                <p
                  style={{
                    color:
                      selectedLegends.filter(
                        (item) => item.dataKey === legend.dataKey
                      ).length > 0 || selectedLegends.length === 0
                        ? legend.stroke === null || legend.stroke === undefined
                          ? COLORS[
                              index > COLORS.length - 1
                                ? index - COLORS.length
                                : index
                            ]
                          : legend.stroke
                        : "grey",
                  }}
                >
                  {" "}
                  <div
                    className="dot"
                    style={{
                      backgroundColor:
                        selectedLegends.filter(
                          (item) => item.dataKey === legend.dataKey
                        ).length > 0 || selectedLegends.length === 0
                          ? legend.stroke === null ||
                            legend.stroke === undefined
                            ? COLORS[
                                index > COLORS.length - 1
                                  ? index - COLORS.length
                                  : index
                              ]
                            : legend.stroke
                          : "grey",
                    }}
                  ></div>{" "}
                  {legend.name}
                </p>
              </div>
            );
          })}
      </div>

      <ResponsiveContainer height={"80%"}>
        <BarChart syncId={syncid} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          {secondXDataKey !== undefined ? (
            <XAxis
              dataKey={secondXDataKey}
              axisLine={false}
              tickLine={false}
              fontSize={12}
              interval={0}
              tick={renderQuarterTick as any}
              height={20}
              xAxisId="quarter"
            />
          ) : null}
          <YAxis fontSize={fontSize} width={yAxisWidth}>
            <Label
              fontSize={fontSize}
              value={yAxisLabel}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          {showBrush && (
            <Brush
              dataKey={xDataKey}
              height={brushHeight}
              stroke={PrimaryColor}
              startIndex={
                data != null && brushStart === BrushStart.Start
                  ? 0
                  : data.length > 96 - 1
                  ? data.length - 96
                  : 0
              }
              endIndex={
                data != null && brushStart === BrushStart.Start
                  ? 96 - 1
                  : data.length > 96
                  ? data.length - 1
                  : 0
              }
              floodColor={PrimaryColor}
            />
          )}
          <Tooltip
            labelFormatter={(value, payload) => {
              try {
                return [`${value}`];
              } catch {
                return [value];
              }
            }}
            formatter={(value, name, props) => {
              return [
                name +
                  " : " +
                  parseFloat(value.toString())
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                  " " +
                  unit,
              ];
            }}
          />

          {selectedLegends.length === 0
            ? legends
                .filter((e) => e.dataKey != xDataKey)
                .map((legend, index) => {
                  return (

                    legends.length === 1 ?  
                    <Bar 
                      key={index}
                      type="monotone"
                      name={typeof legend === "string" ? legend : legend.name}
                      dataKey={
                        typeof legend === "string" ? legend : legend.dataKey
                      }
                     
                      strokeWidth={2}
                  >
                    {
                      data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))
                    }
                  </Bar>
                    :
                    <Bar
                      key={index}
                      type="monotone"
                      name={typeof legend === "string" ? legend : legend.name}
                      dataKey={
                        typeof legend === "string" ? legend : legend.dataKey
                      }
                      stroke={
                        legend.stroke === null || legend.stroke === undefined
                          ? COLORS[
                              index > COLORS.length - 1
                                ? index - COLORS.length
                                : index
                            ]
                          : legend.stroke
                      }
                      strokeWidth={2}
                    />
                  );
                })
            : selectedLegends.map((legend, index) => {
                return (
                  <Bar
                    key={index}
                    type="monotone"
                    name={typeof legend === "string" ? legend : legend.name}
                    dataKey={
                      typeof legend === "string" ? legend : legend.dataKey
                    }
                    stroke={
                      legend.stroke === null || legend.stroke === undefined
                        ? COLORS[
                            index > COLORS.length - 1
                              ? index - COLORS.length
                              : index
                          ]
                        : legend.stroke
                    }
                    strokeWidth={2}
                  />
                );
              })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const MediumLegendItem = ({
  name,
  color,
  onClick,
  fontSize,
}: {
  name: string;
  color: string;
  onClick?: () => void;
  fontSize?: string;
}) => {
  return (
    <div className="realTime-Legend" onClick={onClick}>
      <p style={{ color: color, fontSize: "14p!important" }}>
        {" "}
        <div className="dot" style={{ backgroundColor: color }}></div> {name}
      </p>
    </div>
  );
};
