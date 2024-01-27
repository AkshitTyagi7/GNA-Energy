import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Line,
  Brush,
  ResponsiveContainer,
} from "recharts";
import { DemoExchangeData, DemoExchangeData2, DemoExchangeData3 } from "./Dashboard/Exchange/DemoExchangeData";
import { PrimaryColor, SecondaryColor, QuaternaryColor } from "../common";

const data = [
  {
    date: "2000-01",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    date: "2000-02",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    date: "2000-03",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    date: "2000-04",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    date: "2000-05",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    date: "2000-06",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    date: "2000-07",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    date: "2000-08",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    date: "2000-09",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    date: "2000-10",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    date: "2000-11",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    date: "2000-12",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
];

let data1: any = DemoExchangeData.data.dam.map((item, index) => {
  return {
    name: index+1,
    
    wt_mcp_rs_mwh: item.wt_mcp_rs_mwh,
    sell_bid_mw: parseFloat(item.sell_bid_mw),
    prchs_bid_mw: parseFloat(item.prchs_bid_mw),
    date: item.date,

  };
}
);

let data2: any = DemoExchangeData2.data.dam.map((item, index) => {
  return {
    name: index+1,
    
    wt_mcp_rs_mwh: item.wt_mcp_rs_mwh,
    sell_bid_mw: parseFloat(item.sell_bid_mw),
    prchs_bid_mw: parseFloat(item.prchs_bid_mw),
    date: item.date,

  };
}
);

let data3: any = DemoExchangeData3.data.dam.map((item, index) => {
  return {
    name: index+1,
    
    wt_mcp_rs_mwh: item.wt_mcp_rs_mwh,
    sell_bid_mw: parseFloat(item.sell_bid_mw),
    prchs_bid_mw: parseFloat(item.prchs_bid_mw),
    date: item.date,

  };
}
);

let data4 = [...data1, ...data2, ...data3];
const monthTickFormatter = (tick: string) => {
  const date = new Date(tick);

  return date.getMonth() + 3;
};

const renderQuarterTick = (tickProps: any) => {
  const { x, y, payload } = tickProps;
  const { value, offset } = payload;
  const quarterNo = Math.floor(value / 96) + 1;

  if (value % 96 === 0) {
    return <text x={x} y={y - 4} textAnchor="middle">{``}</text>;
  }

  if(value === 48){
    return <text x={x} y={y - 4} textAnchor="middle">{`${value}-12-2024`}</text>;

  }


  if (value  === 1 || value === 96 ) {
    const pathX = Math.floor(x - offset) + 0.5;
    return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red"  width={"2px"}/>;
  }
  return '';
};

export default function ReCharts2() {
  return (
    <>
    <div ></div>
    <ResponsiveContainer width="92%" height={"30%"}>
    <ComposedChart
    className="mt-20"
      width={1500}
      height={500}
      data={data4}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <Brush

      
      data={
          data
        
        } 
        
        startIndex={0} endIndex={95} dataKey="date" height={40} stroke={PrimaryColor} />

      <XAxis dataKey="name" />
      <XAxis
        dataKey="name"
        axisLine={false}
        tickLine={false}
        interval={0}
        tick={renderQuarterTick as any}
        height={20}
  
        xAxisId="quarter" />
       <YAxis name ="MW"  />
        <YAxis yAxisId="right" orientation="right" name="WAP"/>

      <Tooltip />
      <Legend />
      <Bar dataKey="wt_mcp_rs_mwh" fill={PrimaryColor} name="Weighted Average Price"/>
        <Line yAxisId="right" dataKey="sell_bid_mw" stroke={SecondaryColor} color={SecondaryColor} fill={SecondaryColor} name="Sell Bids(MW)" />
        <Line yAxisId="right" dataKey="prchs_bid_mw" stroke={QuaternaryColor} color={QuaternaryColor} fill={QuaternaryColor} name="Purchase Bids(MW)" />


    </ComposedChart></ResponsiveContainer></>
  );
}
