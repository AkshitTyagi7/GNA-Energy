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

const getLegendColor = (legend: LegendKey, index: number, selectedLegends: LegendKey[]): string => {
  const isSelected =
    selectedLegends.some((item) => item.dataKey === legend.dataKey) ||
    selectedLegends.length === 0;
  return isSelected
    ? legend.stroke ?? COLORS[index % COLORS.length]
    : "grey";
};

const renderLegendComponent = (
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
    <p style={{ color: getLegendColor(legend, index, selectedLegends) }}>
      <div
        className="dot"
        style={{ backgroundColor: getLegendColor(legend, index, selectedLegends) }}
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
  yAxisLabel,
  yAxisWidth,
  secondXDataKey,
  showBrush = false,
  brushHeight = 30,
  brushStart = BrushStart.End,
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

  return (
    <div className="chart-container">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-3">
        {filteredLegends.map((legend, index) =>
          renderLegendComponent(legend, index, selectedLegends, handleLegendClick)
        )}
      </div>

      <ResponsiveContainer height={"80%"}>
        <ComposedChart barCategoryGap={2.5} syncId={syncid} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis minTickGap={8} dataKey={xDataKey} />
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
          <YAxis yAxisId="right" orientation="right" />
          {showBrush && (
            <Brush
              dataKey={xDataKey}
              height={brushHeight}
              stroke={PrimaryColor}
              startIndex={brushStartIndex}
              endIndex={brushEndIndex}
              floodColor={PrimaryColor}
            />
          )}
          <Tooltip
            labelFormatter={(value, payload) => {
              try {
                if (!payload[0].payload.date) {
                  return [value];
                }
                return [`${payload[0].payload.date} - Time Slot ${value}`];
              } catch {
                return [value];
              }
            }}
            formatter={(value, name) =>
              `${parseFloat(value.toString())
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${unit}`
            }
          />

          {(selectedLegends.length === 0 ? filteredLegends : selectedLegends).map(
            (legend, index) => (
              legend.type === ChartType.Bar ? (
                <Bar
                  key={index}
                  fill={getLegendColor(legend, index, selectedLegends)}
                  radius={BAR_RADIUS}
                  type="monotone"
                  name={legend.name}
                  
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
