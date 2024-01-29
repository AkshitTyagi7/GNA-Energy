import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, Brush } from "recharts";
import { COST_UNIT } from "../../../Units";
import { PrimaryColor, SecondaryColor, QuaternaryColor } from "../../../common";
const AxisLabel = ({ axisType, x, y, width, height, stroke, children }: any) => {
    const isVert = axisType === 'yAxis';
    const cx = isVert ? x : x + (width / 2);
    const cy = isVert ? (height / 2) + y : y + height + 10;
    const rot = isVert ? `270 ${cx} ${cy}` : 0;
    return (
      <text x={cx} y={cy} transform={`rotate(${rot})`} textAnchor="middle" stroke={stroke}>
        {children}
      </text>
    );
  };
  
  const renderQuarterTick = (tickProps: any) => {
    const { x, y, payload } = tickProps;
    const {index,value, offset } = payload;  
    const finalIndex = index + 1;
  
  
  
    // if (finalIndex  === 1 || finalIndex%97 ===0 ) {
    //   const pathX = Math.floor(x - offset) + 0.5;
      //   return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red"  width={"2px"}/>;
    // }
    if(finalIndex %48 === 0 && finalIndex%96 !== 0){
      return <text x={x} y={y - 4} textAnchor="middle">{value}</text>;
  
    }
  
  };
export function ExchangeChart({showBrush = false , title= "Exchange Chart", data, height="25%", width="100%", syncId="anyId"}: {
    showBrush?: boolean,
    title?: string,
    data: any,
    height?: string,
    width?: string,
    syncId?: string,
}){
    return (
      <><h2 className="text-center text-2xl mt-0">{title}</h2><ResponsiveContainer width={width} height={height}>
        <ComposedChart
          syncId={syncId}



          data={data}
          margin={{
            top: 1,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />


          <XAxis dataKey="name" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={renderQuarterTick as any}
            height={20}

            xAxisId="quarter" />
          <YAxis name="MW" label={"MW"} width={80} />
          <YAxis yAxisId="right" orientation="right" name="WAP" label={"WAP"} width={160} />

          <Tooltip
            labelFormatter={(value, payload) => {
              try {
                return [`${payload[0].payload.date} - Time Slot ${value}`];
              }
              catch {
                return [value,];
              }
            } }

            formatter={(value, name, props) => {
              if (name === "Weighted Average Price") {
                return [parseFloat(value.toString()).toFixed(2) , name.toString().concat(`(${COST_UNIT})`)];
              }
              return [parseFloat(value.toString()).toFixed(2), name,];
            } } />

          <Legend verticalAlign="top" />
          <Bar dataKey="wt_mcp_rs_mwh" fill={PrimaryColor} name="Weighted Average Price" />
          <Line yAxisId="right" dataKey="sell_bid_mw" stroke={SecondaryColor} color={SecondaryColor} fill={SecondaryColor} name="Sell Bids(MW)" />
          <Line yAxisId="right" dataKey="prchs_bid_mw" stroke={QuaternaryColor} color={QuaternaryColor} fill={QuaternaryColor} name="Purchase Bids(MW)" />

          {showBrush ?
            <Brush

              startIndex={0} endIndex={95} dataKey="date" height={40} stroke={PrimaryColor} />
            :
            <Brush

              startIndex={0} endIndex={95} dataKey="date" height={0} stroke={PrimaryColor} />}
        </ComposedChart>
        </ResponsiveContainer></>
    )
  }