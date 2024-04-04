import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  Brush,
  Label,
  BarChart,
  PieChart,
  Pie,
  Cell,
  LineChart,
  LabelList,
} from "recharts";
import { COST_UNIT, MEGA_POWER_UNIT } from "../../../Units";
import { PrimaryColor, SecondaryColor, QuaternaryColor } from "../../../common";
import { BuyerSellerData } from "./FormatData";
import { UtilizationTrend, UtilizationTrendData, UtilizationTrendElement, UtilizationTrendMCP } from "../../../store/state/BuyerSellerState";
import React from "react";
export const AxisLabel = ({
  axisType,
  x,
  y,
  width,
  height,
  stroke,
  children,
}: any) => {
  const isVert = axisType === "yAxis";
  const cx = isVert ? x : x + width / 2;
  const cy = isVert ? height / 2 + y : y + height + 10;
  const rot = isVert ? `270 ${cx} ${cy}` : 0;
  return (
    <text
      x={cx}
      y={cy}
      transform={`rotate(${rot})`}
      textAnchor="middle"
      stroke={stroke}
    >
      {children}
    </text>
  );
};



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

export const ExchangeChart =  ({
  showBrush = false,
  title = "Exchange Chart",
  data,
  height = "25%",
  width = "100%",
  syncId = "anyId",
  onlyBrush = false,
  setShownLegends,
  shownLegnends=[],
}: {
  showBrush?: boolean;
  onlyBrush?: boolean;
  title?: string;
  data: any[];
  shownLegnends: string[];
  setShownLegends: (legends: string[]) => void;
  height?: string;
  width?: string;
  syncId?: string;
})=>( <>
    {!onlyBrush && <h2 className="text-center text-xl m-2 " style={{
      color: SecondaryColor
    }}>{title}</h2>}
    <ResponsiveContainer width={width} height={height}>
      <ComposedChart syncId={"Exchange"} data={data} margin={{}}>
        {!onlyBrush && (
          <>
            <CartesianGrid strokeDasharray="4 2" />

            <XAxis dataKey="name" fontSize={12} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              fontSize={12}
              interval={0}
              tick={renderQuarterTick as any}
              height={20}
              xAxisId="quarter"
            />
            <YAxis  >

            </YAxis>
            {/* <YAxis name="MW" label={"MW"} width={0} /> */}

            <YAxis
              yAxisId="right"
              fontSize={12}
              
              orientation="right"
            >
  
            </YAxis>

            {/* <YAxis yAxisId="right" orientation="right" name="WAP" label={"WAP"} width={0} /> */}

            <Tooltip
            
              labelFormatter={(value, payload) => {
                try {
                  return [`${payload[0].payload.date} - Time Slot ${value}`];
                } catch {
                  return [value];
                }
              }}
              formatter={(value, name, props) => {
                let val = parseFloat(value.toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                if (val === "NaN") {
                  val="";
                }
                if (name === "Weighted Average Price") {
                  return [
                    val,
                    name.toString().concat(`(${COST_UNIT})`),
                  ];
                }
                return [val, name];
              }}
            />

<Bar
  dataKey="mcv_mw"
  fill={"#DEDFDF"}
  hide={!shownLegnends.includes(`MCV (${MEGA_POWER_UNIT})`) && shownLegnends.length > 0}
  name={`MCV (${MEGA_POWER_UNIT})`}
  yAxisId="right"
  radius={[4, 4, 0, 0]}
  isAnimationActive={false}
/>

          </>
        )}
        <Line
          dot={false}
          strokeWidth={onlyBrush ? 0 :2}
          hide={!shownLegnends.includes(`Sell Bids(${MEGA_POWER_UNIT})`) && shownLegnends.length > 0}
          yAxisId="right"
          dataKey="sell_bid_mw"
          
          stroke={SecondaryColor}
          isAnimationActive={false}
          color={SecondaryColor}
          fill={SecondaryColor}
          name={`Sell Bids(${MEGA_POWER_UNIT})`}
        />


                <Line
      dot={false}
      strokeWidth={onlyBrush ? 0 :2}
      yAxisId="right"
      hide={!shownLegnends.includes("Purchase Bids(MW)") && shownLegnends.length > 0}
      style={{
        display: onlyBrush ? "none" : "block",
      }}
      dataKey="prchs_bid_mw"
      stroke={"#333333"}
      isAnimationActive={false}
      color={"#333333"}
      fill={"#333333"}
      name={`Purchase Bids(${MEGA_POWER_UNIT})`}
    />
            <Line
              dot={false}
              strokeWidth={onlyBrush ? 0 : 2}
              dataKey="wt_mcp_rs_mwh"
              hide={!shownLegnends.includes(`Price(${COST_UNIT})`) && shownLegnends.length > 0}
              name={`Price(${COST_UNIT})`}

              stroke={PrimaryColor}
              isAnimationActive={false}
              color={PrimaryColor}
              fill={PrimaryColor}
            />

        {showBrush ? (
          <Brush
            startIndex={data != null && data.length > 96 ? data.length - 96 : 0}
            endIndex={data != null && data.length > 96 ? data.length - 1 : 0}
            fontSize={"20px"}
            
            dataKey="date"
            height={40}
            fillOpacity={1}
            color=
            {PrimaryColor}
            stopColor="red"
            floodColor={PrimaryColor}
            style={{margin: "20px", fontSize:"0px"}}

            fill={"white"}
            stroke={PrimaryColor}
          />
        ) : (
          <Brush
            startIndex={data != null && data.length > 96 ? data.length - 96 : 0}
            endIndex={data != null && data.length > 96 ? data.length - 1 : 0}
            dataKey="date"
            height={0}
            stroke={PrimaryColor}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  </>)


export const BuyerSellerChart = ({data, showLegend}:{data: BuyerSellerData[], showLegend: boolean}) => {
return <ResponsiveContainer 
>
           <BarChart
               layout="vertical"
               barCategoryGap={2} barGap={2}
          data={data}
          // syncId={"buyerSeller"}
          >
            
            <YAxis  height={0} minTickGap={10} axisLine={false}  tickLine={false} allowDataOverflow={false} fontSize={13}  width={140} dataKey="name" type="category" >
         

       
            </YAxis>
            <XAxis width={110} height={0} type="number" tickFormatter={
              (value) => {
                return "";
              }
            
            }>
              
              <Label
                // value="MWh"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }} />
            </XAxis >
            <Tooltip
            formatter={
              (value, name, props) => {
                return [parseFloat(value.toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " MWh"];
              }
            }
         
            />
            {/* <Legend verticalAlign="top" /> */}
     
          <Bar radius={4}  dataKey={"value"} barSize={40}  color="white"     fill={SecondaryColor}  >
          <LabelList fontSize={14} fill="white" fontWeight={300} formatter={
            (value: any) => {
              // convert value to k by dividing by 1000
              if(parseFloat(value) < 10000){return ""}
              return (parseFloat(value)/1000).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "k MWh"; }
          
          } dataKey="value" position="center" ></LabelList>

          </Bar>

            
          </BarChart>
</ResponsiveContainer>
};
const COLORS = [
    '#34656D', '#F1935C','#7CB5EC' , '#333333', '#B8860B',
    ];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: { cx: number, cy: number, midAngle: number, innerRadius: number, outerRadius: number, percent: number, index: number }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {` ${percent > 0.15 ? (percent * 100).toFixed(0) +"%" : ""}`}
    </text>
  );
};
export const BuyerSellerPieChart = ({data}:{data: BuyerSellerData[]}) => {
  return <ResponsiveContainer>
    <PieChart
    data={data}
    
    >
      <Tooltip
      formatter={
        (value, name, props) => {
          return [ parseFloat(value.toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " MWh", name];
        }
      }
      />
      <Pie 
      isAnimationActive={true}
      animationDuration={500}
      animationBegin={0}
      
                  label={renderCustomizedLabel}
                  labelLine={false}

            data={data} dataKey="value" nameKey="name"  >

{data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[
                index > COLORS.length - 1 ? index - COLORS.length : index
              ]} />
            ))}
            </Pie>
    </PieChart>
  </ResponsiveContainer>
};

export const UtilizationTrendChart= ({data,mcp, legends}:{data: UtilizationTrendElement[],mcp: UtilizationTrendMCP[], legends: {name: string}[]}) => {
  return <ResponsiveContainer>
    <ComposedChart syncId={"utilizationChart"} data={
      // Add the mcp data to the data

      data.map((element, index) => {
        let mcpElement = mcp[index];
        if (mcpElement) {
          return {
            ...element,
            wt_mcp: mcpElement.wt_mcp,
          };
        }
        return element;
      })
    }>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis >
        {/* <Label value={"MWh"} angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} /> */}
      </YAxis>
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip 
      formatter={
        (value, name, props) => {
          return [name + " : "  + parseFloat(value.toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " MWh"];
        }
      }
      />

<Bar
  dataKey="wt_mcp"
  fill={"#DEDFDF"}
  name={`MCP (${COST_UNIT})`}
  yAxisId="right"
  radius={[4, 4, 0, 0]}
  maxBarSize={30}
/>
      {
        legends.map((legend, index) => {
          return <Line  key={index} type="monotone" dataKey={legend.name} stroke={
            COLORS[
              index > COLORS.length - 1 ? index - COLORS.length : index
            ]
          }  dot={false} strokeWidth={2}  />
        })
      }

    </ComposedChart>
  </ResponsiveContainer>
}