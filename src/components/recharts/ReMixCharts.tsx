import React, { useState, useCallback, useMemo } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
  Brush,
  Tooltip,
  Line,
  Bar,
  ComposedChart,
} from "recharts";
import { PrimaryColor } from "../../common";
import {
  BAR_RADIUS,
  BrushStart,
  ChartArguements,
  ChartType,
  LegendKey,
} from "../../models/chart_model";
import { COLORS } from "./ReCharts";
import { YAxisFormatter, renderQuarterTick } from "./components";
import { COST_UNIT } from "../../Units";
import { getTimeRange } from "../../pages/Dashboard/Exchange3/Chart";

const getLegendColor = (legend: LegendKey, index: number, selectedLegends: LegendKey[], isLegend?:boolean): string => {
  const isSelected =
    selectedLegends.some((item) => item.dataKey === legend.dataKey) ||
    selectedLegends.length === 0;
  return isSelected
    ? (isLegend ? legend.legendColor : legend.stroke) ?? legend.stroke ??  COLORS[index % COLORS.length]
    : "#E0E0E0";
};

export function lightenColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}


export const LegendComponent = (
  legend: LegendKey,
  index: number,
  selectedLegends: LegendKey[],
  handleLegendClick: (legend: LegendKey) => void
) => (
  <div
    key={legend.dataKey}
    className="realTime-Legend"
    onClick={() => handleLegendClick(legend)}
  >
    <p style={{ color: getLegendColor(legend, index, selectedLegends, true) }}>
      <div
        className={
          legend.type === ChartType.Bar ? "dot" : "line"
        }
        style={{ backgroundColor: getLegendColor(legend, index, selectedLegends, true) }}
      ></div>
      {legend.name}
    </p>
  </div>
);

export function ReMixChart({
  data,
  legends,
  syncid,
  unit,
  xDataKey,
  xTick,
  xLabel,
  yAxisLabel,
  secondYAxisLabel,
  yAxisWidth,
  legendBreakIndex, 
  hidePrice,

  xAxisPosition = "insideBottom",
  onlyTitle = false,
  secondXDataKey,
  showBrush = false,
  brushIndex,
  brushHeight = 30,
  brushStart = BrushStart.End,
  xaxisHeight,
  barCategoryGap = 2.5,
  isTimeSlot,
  fontSize,
}: ChartArguements) {
  const [selectedLegends, setSelectedLegends] = useState<LegendKey[]>([]);

  const handleLegendClick = useCallback(
    (legend: LegendKey) => {
      setSelectedLegends((prevSelectedLegends) =>
        prevSelectedLegends.some((item) => item.dataKey === legend.dataKey)
          ? prevSelectedLegends.filter((item) => item.dataKey !== legend.dataKey)
          : [...prevSelectedLegends, legend]
      );
    },
    []
  );

  const filteredLegends = useMemo(
    () => legends.filter((e) => e.dataKey !== xDataKey),
    [legends, xDataKey]
  );

  const brushStartIndex = useMemo(
    () =>
      data && brushStart === BrushStart.Start
        ? 0
        : data.length > 95
        ? data.length - 96
        : 0,
    [data, brushStart]
  );

  const brushEndIndex = useMemo(
    () =>
      data && brushStart === BrushStart.Start
        ? 95
        : data.length > 96
        ? data.length - 1
        : 0,
    [data, brushStart]
  );

  const orderedSelectedLegends = useMemo(
    () => {
      if (selectedLegends.length === 0) return filteredLegends;
      return legends.filter(legend => selectedLegends.some(selected => selected.dataKey === legend.dataKey));
    },
    [selectedLegends, filteredLegends, legends]
  );

  return (
    <div className="chart-container">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-3">
        {filteredLegends.map((legend, index) => (
          <React.Fragment key={index}>
            {LegendComponent(legend, index, selectedLegends, handleLegendClick)}
            {legendBreakIndex && legendBreakIndex === index && (
              <div style={{ width: "100%", height: "0px" }}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <ResponsiveContainer height={"80%"}>
        <ComposedChart barCategoryGap={barCategoryGap} syncId={syncid} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
          tick={xTick}
          height={xaxisHeight}
          label={{ value: xLabel, position: xAxisPosition, dy: 10 }}
          interval={xTick ? 0 : undefined}
          minTickGap={8} dataKey={xDataKey} />
          {secondXDataKey && (
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
          )}
          <YAxis
          tickFormatter={YAxisFormatter}
          
          fontSize={fontSize} width={yAxisWidth}>
            <Label
              fontSize={fontSize}
              value={yAxisLabel}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <YAxis yAxisId="right" orientation="right" >
          <Label
              fontSize={fontSize}
              value={secondYAxisLabel}
              angle={-90}
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          {showBrush && (
            <Brush
              dataKey={xDataKey}
              height={brushHeight}
              stroke={PrimaryColor}
              startIndex={
                brushIndex?.startIndex ?? brushStartIndex}
              endIndex={
                brushIndex?.endIndex ??
                brushEndIndex}
              floodColor={PrimaryColor}
            />
          )}
          <Tooltip
            labelFormatter={
              
              (value, payload) => {

              try {
                if(onlyTitle) {return [value];}
                if(isTimeSlot) {return [getTimeRange(parseInt(value)) + ` (${value})`];}

                
                if (!payload[0].payload.date) {
                  return [value];
                }
                return [`${payload[0].payload.date} - Time Slot ${value}`];
              } 
              
              catch {
                if(isTimeSlot) {return [value, getTimeRange(parseInt(value))];}
                return [value];
              }
            }}
            formatter={(value, name) =>
              // `${parseFloat(value.toString())
              //   .toFixed(2)
              //   .toString()
              //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${name.toString().includes("Price") ? COST_UNIT : unit}`
              {
                let val = `${parseFloat(value.toString())
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${name.toString().includes("Price") ? COST_UNIT : unit}`
                if(hidePrice) {return val.replace("Price", "")}
                return val;
              }
            }
          />

          {orderedSelectedLegends.map(
            (legend, index) => (
              legend.type === ChartType.Bar ? (
                <Bar
                  key={index}
                  fill={getLegendColor(legend, index, selectedLegends)}
                  radius={BAR_RADIUS}
                  type="monotone"
                  name={legend.name}
                  stackId={legend.stackId}
                  
                  dataKey={legend.dataKey}
                  yAxisId={legend.yAxisId}
                  stroke={getLegendColor(legend, index, selectedLegends)}
                  strokeWidth={2}
                />
              ) : (
                <Line
                  key={index}
                  type="monotone"
                  name={legend.name}
                  yAxisId={legend.yAxisId}
                  dataKey={legend.dataKey}
                  stroke={getLegendColor(legend, index, selectedLegends)}
                  dot={false}
                  strokeWidth={2}
                />
              )
            )
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
