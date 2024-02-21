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
} from "recharts";
import { COST_UNIT, MEGA_POWER_UNIT } from "../../../Units";
import { PrimaryColor, SecondaryColor, QuaternaryColor } from "../../../common";
import { BuyerSellerData } from "./FormatData";
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
      <text x={x} y={y - 4} textAnchor="middle">
        {value}
      </text>
    );
  }
};

export const ExchangeChart = ({
  showBrush = false,
  title = "Exchange Chart",
  data,
  height = "25%",
  width = "100%",
  syncId = "anyId",
  onlyBrush = false,
}: {
  showBrush?: boolean;
  onlyBrush?: boolean;
  title?: string;
  data: any[];
  height?: string;
  width?: string;
  syncId?: string;
}) => (
  <>
    {!onlyBrush && <h2 className="text-center text-xl ">{title}</h2>}
    <ResponsiveContainer width={width} height={height}>
      <ComposedChart syncId={syncId} data={data} margin={{}}>
        {!onlyBrush && (
          <>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" fontSize={12} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={renderQuarterTick as any}
              height={20}
              xAxisId="quarter"
            />
            <YAxis name={COST_UNIT} width={50} fontSize={12} >
              <Label
                value={COST_UNIT}
                position="middle"
                color="black"

                angle={270}
                fontSize={12}
                offset={0}
                style={{ textAnchor: "middle" }} />
            </YAxis>
            {/* <YAxis name="MW" label={"MW"} width={0} /> */}

            <YAxis
              yAxisId="right"
              width={110}
              fontSize={12}
              
              orientation="right"
            >
              <Label
                value={MEGA_POWER_UNIT}
                width={80}
                position="middle"
                color="black"
                fontSize={12}
                angle={270}
                offset={0}
                style={{ textAnchor: "middle" }} />
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
                if (name === "Weighted Average Price") {
                  return [
                    parseFloat(value.toString()).toFixed(2),
                    name.toString().concat(`(${COST_UNIT})`),
                  ];
                }
                return [parseFloat(value.toString()).toFixed(2), name];
              }}
            />
            <Legend verticalAlign="top" 
          align="center"
            wrapperStyle={{
              fontSize: "12px",
              paddingRight: "50px",
            }}
      
            />

            <Bar
              dataKey="wt_mcp_rs_mwh"
              fill={SecondaryColor}
              isAnimationActive={false}
              name={`Price(${COST_UNIT})`}
            />
            <Line
              dot={false}
              strokeWidth={4}
              yAxisId="right"
              dataKey="sell_bid_mw"
              stroke={QuaternaryColor}
              isAnimationActive={false}
              color={QuaternaryColor}
              fill={QuaternaryColor}
              name={`Sell Bids(${MEGA_POWER_UNIT})`}
            />


                    <Line
          dot={false}
          strokeWidth={4}
          yAxisId="right"
          style={{
            display: onlyBrush ? "none" : "block",
          }}
          dataKey="prchs_bid_mw"
          stroke={PrimaryColor}
          isAnimationActive={false}
          color={PrimaryColor}
          fill={PrimaryColor}
          name={`Purchase Bids(${MEGA_POWER_UNIT})`}
        />
          </>
        )}
            <Line
              dot={false}
              strokeWidth={4}
              yAxisId="right"
              dataKey="mcv_mw"
              stroke={"red"}
              isAnimationActive={false}
              color={"red"}
              fill={"red"}
              name={`MCV (${MEGA_POWER_UNIT})`}
            />

        {showBrush ? (
          <Brush
            startIndex={data != null && data.length > 96 ? data.length - 96 : 0}
            endIndex={data != null && data.length > 96 ? data.length - 1 : 0}
            dataKey="date"
            height={40}
            fillOpacity={1}
            color=
            {PrimaryColor}
            stopColor="red"
            floodColor={PrimaryColor}

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
  </>
);

export const BuyerSellerChart = ({data, showLegend}:{data: BuyerSellerData[], showLegend: boolean}) => {
return <ResponsiveContainer 
>
           <BarChart
               layout="vertical"
               barCategoryGap={2} barGap={2}
          data={data}
          // syncId={"buyerSeller"}
          >
            
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis height={0}  width={150} fontSize={12} dataKey="name" type="category" >
            </YAxis>
            <XAxis width={110} height={0} type="number" tickFormatter={
              (value) => {
                return "";
              }
            
            }>
              
              <Label
                // value="MWhr"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }} />
            </XAxis >
            <Tooltip
            formatter={
              (value, name, props) => {
                return [parseFloat(value.toString()).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " MWhr"];
              }
            }
         
            />
            {/* <Legend verticalAlign="top" /> */}
     
          <Bar  dataKey={"value"} barSize={40}       fill={SecondaryColor}  />
            {/* {
              data.lines.map((line, index) => {
                return <Bar width={80} key={index} dataKey={"mwhr"} fill={line.color} name={line.name} />
              }
              )
            } */}
            
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
      {` ${percent > 0.06 ? (percent * 100).toFixed(0) +"%" : ""}`}
    </text>
  );
};
export const BuyerSellerPieChart = ({data}:{data: BuyerSellerData[]}) => {
  return <ResponsiveContainer>
    <PieChart
    data={data}
    >
      <Tooltip
     
      />
      <Pie 
      
                  label={renderCustomizedLabel}
                  labelLine={false}

            data={data} dataKey="value" nameKey="name"  >

{data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </Pie>
      <Legend verticalAlign="top" />
    </PieChart>
  </ResponsiveContainer>
};


