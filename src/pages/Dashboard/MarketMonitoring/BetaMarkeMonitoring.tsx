import { ComposedChart, ResponsiveContainer, XAxis, YAxis, Line } from "recharts"
import { DemoExchangeData } from "./DemoExchangeData"
import { ChartExchangeItem, FormatMarketMonitoringData } from "./FormatData"

export function BetaMarketMontoring(){
    const data: ChartExchangeItem[]=FormatMarketMonitoringData(DemoExchangeData)
    return (
        <ResponsiveContainer width="98%" height={"90%"}>
            <ComposedChart data={data}>
                <XAxis dataKey="month" fontSize={12} />
                <YAxis />
                <Line type="monotone" dataKey="dam" stroke="#8884d8" />
                <Line type="monotone" dataKey="rtm" stroke="#82ca9d" />
                <Line type="monotone" dataKey="gdam" stroke="#82ca9d" />
                <Line type="monotone" dataKey="intraDay" stroke="#82ca9d" />
                <Line type="monotone" dataKey="contingencyContracts" stroke="#82ca9d" />
                <Line type="monotone" dataKey="daily" stroke="#82ca9d" />
                <Line type="monotone" dataKey="weekly" stroke="#82ca9d" />
                <Line type="monotone" dataKey="monthly" stroke="#82ca9d" />
                <Line type="monotone" dataKey="anyDay" stroke="#82ca9d" />
                <Line type="monotone" dataKey="singleSided" stroke="#82ca9d" />
                


            </ComposedChart>
        </ResponsiveContainer>
    )
}