import { useState } from "react";
import {
  Brush,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PrimaryColor } from "../../common";
export const COLORS = ["#FF7F50", "#B8860B", "#7CB5EC", "#F1935C", "#34656D", "#333333"];
export interface ReChartData {
  [key: string]: number;
}

export interface LegendKey {
  name?: string;
  stroke?: string;
  dataKey: string;
  // color: string;
}



export const BAR_RADIUS: number | [number, number, number, number] = [4, 4, 0, 0];

export function getColorList(length: number) {
  let colors = [];
  for (let i = 0; i < length; i++) {
    colors.push(COLORS[i % COLORS.length]);
  }
  return colors;
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
}: {
  data: ReChartData[];
  legends:  LegendKey[];
  syncid?: string;
  unit?: string;
  xDataKey: string;
  yAxisWidth?: number;
  secondXDataKey?: string;
  yAxisLabel?: string;
  showBrush?: boolean;
}) {
  const [selectedLegends, setSelectedLegends] = useState<LegendKey[]>([]);
  return (
    <div className="chart-container">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-5">
        {legends.filter((e) => e.dataKey != xDataKey).map((legend, index) => {
          return (
            <div className="realTime-Legend" onClick={
          ()=>{
          if(selectedLegends.filter((item)=>item.dataKey===legend.dataKey).length>0){
            setSelectedLegends(selectedLegends.filter((item)=>item.dataKey!==legend.dataKey))
          }
          else{

            setSelectedLegends([...selectedLegends, legend])}
          }
            }>
              <p style={{ color:  
                     selectedLegends.filter((item)=> item.dataKey === legend.dataKey).length >0 || selectedLegends.length===0 ?
                     legend.stroke === null || legend.stroke === undefined ? COLORS[index > COLORS.length - 1 ? index - COLORS.length : index] :
                     legend.stroke : "grey"  }}>
                {" "}
                <div
                  className="dot"
                  style={{ backgroundColor:  selectedLegends.filter((item)=> item.dataKey === legend.dataKey).length >0 || selectedLegends.length===0 ?
                    legend.stroke === null || legend.stroke === undefined ? COLORS[index > COLORS.length - 1 ? index - COLORS.length : index] :

                    legend.stroke : "grey" }}
                ></div>{" "}
                { legend.name}
              </p>
            </div>
          );
        })}
      </div>

      <ResponsiveContainer height={"80%"}>
        <LineChart syncId={syncid} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          {
            secondXDataKey !== undefined ? <XAxis     dataKey={secondXDataKey}
            axisLine={false}
            tickLine={false}
            fontSize={12}
            interval={0}
            tick={renderQuarterTick as any}
            height={20}
            xAxisId="quarter" /> : null
          }
          <YAxis width={yAxisWidth}>
             <Label  value={yAxisLabel} angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} /> 
          </YAxis>
          {            showBrush && <Brush dataKey={xDataKey} height={30}               stroke={PrimaryColor}

              startIndex={data != null && data.length > 96 ? data.length - 96 : 0}
              endIndex={data != null && data.length > 96 ? data.length - 1 : 0}
              floodColor={PrimaryColor}

          />
}
          <Tooltip
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

          {
          
          selectedLegends.length === 0 ?
          legends.filter((e) => e.dataKey != xDataKey).map((legend, index) => {
            return (
              <Line
                key={index}
                type="monotone"
                name={typeof legend === "string" ? legend : legend.name}
                dataKey={typeof legend === "string" ? legend : legend.dataKey}
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
          }) : 
          
          selectedLegends.map((legend, index) => {
            return (
              <Line
                key={index}
                type="monotone"
                name={typeof legend === "string" ? legend : legend.name}
                dataKey={typeof legend === "string" ? legend : legend.dataKey}
                stroke={
                  legend.stroke === null || legend.stroke === undefined ? COLORS[index > COLORS.length - 1 ? index - COLORS.length : index] 
 

                    : legend.stroke
                }
                dot={false}
                strokeWidth={2}
              />
            );
          })
          
          
          }
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
  fontSize
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
        <div className="dot" style={{ backgroundColor: color,  }}></div>{" "}
        {name}
      </p>
    </div>
  );


}

export const MediumLegendItem = ({
  name,
  color,
  onClick,
  fontSize
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
        <div className="dot" style={{ backgroundColor: color,  }}></div>{" "}
        {name}
      </p>
    </div>
  );


}