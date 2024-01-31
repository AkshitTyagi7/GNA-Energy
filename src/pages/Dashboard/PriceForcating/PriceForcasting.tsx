import { useEffect, useState } from "react";
import { PrimaryColor, SecondaryColor, buildHttpReq } from "../../../common";
import { Bar, BarChart, Brush, CartesianGrid, Legend, ResponsiveContainer,Line, XAxis, YAxis,Tooltip, ComposedChart } from "recharts";
import { renderQuarterTick } from "../Exchange2/FormatData";
import { COST, COST_UNIT } from "../../../Units";

interface PriceForecastingData {
    name: string;
    date: string;
    forecasted_value: number;
    actual_value: number;
}

export function PriceForecasting() {
    const [forecateData, setData] = useState<any>([]);
    const [startDate, setStartDate] = useState(new Date(new Date().getTime() - (4 * 24 * 60 * 60 * 1000)));
    const [endDate, setEndDate] = useState(new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000)));
    const maxDate = new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000));

      useEffect(() => {
        fetchData(
            {
                startDate:startDate,
                endDate:endDate,
            }
        );
    },
    []);

    return (
        <>
    
        <div className="text-right flex justify-between width-full mt-4 ml-4">
        <h2 className="text-center text-2xl mt-0">Price Forecasting</h2>
        <div>
            <input type="date" className=" mr-3 p-2 br-20 rounded-lg" max={endDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} value={startDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} onChange={(e) => {
                setStartDate(new Date(e.target.value));
                fetchData(
                    {
                        startDate:new Date(e.target.value),
                        endDate:endDate,
                    }
            
                );
            } } />
            to
            <input type="date" className=" ml-3 mr-10 p-2 br-20 rounded-lg" max={maxDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} value={endDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} onChange={(e) => {
                setEndDate(new Date(e.target.value));
                fetchData(
                    {
                        startDate:startDate,
                        endDate:new Date(e.target.value),
                    }
               
                );
            } } /></div>
        </div><ResponsiveContainer width="98%" height={"90%"}>
                <ComposedChart data={forecateData}>
                    <Legend verticalAlign="top" />
                    <XAxis dataKey="name" fontSize={12} />
                    <XAxis
                        dataKey="date"
                        axisLine={false}

                        tickLine={false}
                        interval={0}
                        tick={renderQuarterTick as any}
                        height={20}

                        xAxisId="quarter" />

                    <YAxis tickSize={1} width={96} label={COST_UNIT} fontSize={16}  />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip 
                    labelFormatter={(value, payload) => {
                        try {
                          return [`${payload[0].payload.date} - Time Slot ${value}`];
                        }
                        catch {
                          return [value,];
                        }
                    
                      }}
                    
                      formatter={(value, name, props) => {
                        return [parseFloat(value.toString()).toFixed(2).concat(` ${COST_UNIT}`), name, ]
                      }}
                    />
                    <Line strokeWidth={4}
                        dataKey="forecasted_value" fill={SecondaryColor} color={SecondaryColor} stroke={SecondaryColor} name={"Forecasted Value"} />
                    <Line strokeWidth={4}
                        dataKey="actual_value" stroke={PrimaryColor} color={PrimaryColor} fill={PrimaryColor} name="Actual Value" />
                    <XAxis dataKey="name" />
                    <Brush

                        startIndex={forecateData != null && forecateData.length > 96 ?
                            forecateData.length - 96 : 0} endIndex={forecateData != null && forecateData.length > 96 ?
                                forecateData.length - 1 : 0} dataKey="date" height={40} stroke={PrimaryColor} />


                </ComposedChart>
            </ResponsiveContainer></>
    )

    async function fetchData({startDate,endDate}:{startDate:Date,endDate:Date}){
        const formatStartDate = startDate.toLocaleDateString('en-GB').split('/').join('-');
        const formatEndDate = endDate.toLocaleDateString('en-GB').split('/').join('-');
        const response =await buildHttpReq({
            endpoint: '/dam_forecast_api',
            method: 'POST',
            body: {
                start_date: formatStartDate,
                end_date: formatEndDate,
            }
        });
        const res = await response;
        let tempData: any = [];
        Object.keys(res).map((key, index) => {
            res[key].data.map((item: any, index: number) => {
                tempData.push({
                    name: index+1,
                    date: item.date,
                    forecasted_value:item.forecasted_value == "" ? 0 : parseFloat( item.forecasted_value),
                    actual_value: parseFloat( item.actual_value),
                });
            });
        
        });
            // Sort the data by date which is in string format dd-mm-yyyy

      tempData =  tempData.sort((a: any, b : any) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
    
        return dateA.getTime() - dateB.getTime();
            });
        
        
        console.log(forecateData);
        setData(tempData);
}}





const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Dates
};




