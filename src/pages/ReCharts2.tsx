import React, { useEffect, useState } from "react";
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
import { DemoExchangeData, DemoExchangeData2, DemoExchangeData3, FinalDemoData } from "./Dashboard/Exchange/DemoExchangeData";
import { PrimaryColor, SecondaryColor, QuaternaryColor } from "../common";
import { COST_UNIT } from "../Units";
import { ExchangeData, FormatExchangeData } from "./Dashboard/Exchange2/FormatData";
    
  const ApiData = FinalDemoData

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

let data4 = [...data1, ...data2, ...data3, ...data2, ...data3, ...data2, ...data3,];
const monthTickFormatter = (tick: string) => {
  const date = new Date(tick);

  return date.getMonth() + 3;
};

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

export default function ReCharts2() {
  const maxDate = new Date(new Date().getTime() - (0 * 24 * 60 * 60 * 1000));
const [date, setDate] = useState(new Date(new Date().getTime() - (0 * 24 * 60 * 60 * 1000)));

const [selectedProductIndex, setSelectedProductIndex] = useState<number[]>([]);
const [iexData, setIexData] = useState<ExchangeData>(
    {
        dam:[],
        gdam:[],
        rtm:[],
        hpdam:[],
    }
);
const [hpxData, setHpxData] = useState<ExchangeData>(
    {
        dam:[],
        gdam:[],
        rtm:[],
        hpdam:[],
    }
);
const [pxilData, setPxilData] = useState<ExchangeData>(
    {
        dam:[],
        gdam:[],
        rtm:[],
        hpdam:[],
    }
);

const [startDate, setStartDate] = useState(new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000)));
const [endDate, setEndDate] = useState(new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)));

useEffect(() => {
    fetchExchangeData(
      {
        start_date:startDate,
        end_date:endDate,
      }
    );
},[]);

  return (
    <>
    <div className="text-right" >
    
    <input type="date" className="mt-4 mr-3 p-2 br-20 rounded-lg" max={endDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} value={startDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} onChange={(e) => {
      setStartDate(new Date(e.target.value));
      fetchExchangeData(
        {
          start_date:new Date(e.target.value),
          end_date:endDate,
        }
      );
    }} />
    to
    <input type="date" className="mt-4 ml-3 mr-10 p-2 br-20 rounded-lg" max={maxDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} value={endDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} onChange={(e) => {
      setEndDate(new Date(e.target.value));
      fetchExchangeData(
        {
          start_date:startDate,
          end_date:new Date(e.target.value),
        }
      );
    }} />

    </div>
    <div className="flex flex-row justify-between">
              <div className="text-2xl text-center">Price and Volume by Product</div>
              <div className="mt-2">
                {/* {
                  IexChartData.map((data, index) => {
                    return <SmallButton onClick={() => setByProductIndex(index)} buttonTitle={data.title.toUpperCase()} isActive={index === byProductIndex} />
                  })} */}
              </div>
            </div>
    <ExchangeChart data={iexData.dam} showBrush={false} title="IEX"  />
    <ExchangeChart data={hpxData.dam} title="PXIL" />
    <ExchangeChart data={pxilData.dam} showBrush={true} title="HPX"  />
    
    </>
  );

  function ExchangeChart({showBrush = false , title= "Exchange Chart", data, height="25%", width="100%", syncId="anyId"}: any){
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

  async function fetchExchangeData({start_date=startDate, end_date=endDate}) {
    console.log("fetching data");
    try {
      // const response = await fetch("http://
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      let formatedStartDate=start_date.toLocaleDateString('en-GB').split('/').join('-');
        let formatedEndDate=end_date.toLocaleDateString('en-GB').split('/').join('-');
      const formData = new FormData();
      formData.append('start_date', formatedStartDate);
        formData.append('end_date', formatedEndDate);

    fetch("https://datahub.gna.energy/exchange_analytics_api_range", {
        method: 'POST',
        body: formData,
      }).then((response) => response.json()).then((data) => {
        console.log(data);
        setIexData(FormatExchangeData(data));
      });
      try {
        fetch("https://datahub.gna.energy/pxil_exchange_analytics_api_range", {
          method: 'POST',
          body: formData,
        }).then((response) => response.json()).then((data) => {
          console.log(data);
          setPxilData(FormatExchangeData(data));
        }
        );

      }
      catch (error) {
        console.log("This is the error in fetching the api of pxildata - ", error);
        setPxilData(FormatExchangeData([]));
      }

      try {
      fetch("https://datahub.gna.energy/hpx_exchange_analytics_api_range", {
          method: 'POST',
          body: formData,
        }).then((response) => response.json()).then((data) => {
          console.log(data);
          setHpxData(FormatExchangeData(data));
        }
        );

      } catch (error) {
        console.log("This is the error in fetching the api of hpxdata - ", error);
        setHpxData(FormatExchangeData([]));
      }

      setSelectedProductIndex([0, 1, 2, 3]);




    }
    catch (error) {
      console.error("Error fetching data:", error);
        setIexData(FormatExchangeData([]));
        setPxilData(FormatExchangeData([]));
        setHpxData(FormatExchangeData([]));

      setSelectedProductIndex([]);
    }
  }
}
