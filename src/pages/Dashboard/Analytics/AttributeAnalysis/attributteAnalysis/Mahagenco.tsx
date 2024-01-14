import React from "react";
import { BarChart } from "../../../../../components/charts/Charts";
import GetChartOptions from "../../../../../components/charts/data/GetChartOption";
import { DemoMahaGencoDataJson } from "./DemoMahaGenco";
import MahaGencoChart from "./Models";
import { SmallButton } from "../../../../../components/Button";

export default function MahaGenco(){
    const [selectedLegend, setSelectedLegend] = React.useState<string[]>([]);

    return (
        <>
        <div className="flex space-x-1 justify-center">
            <SmallButton onClick={()=>{
                if(selectedLegend.includes("Actual")){
                    setSelectedLegend(selectedLegend.filter((item)=>item !== "Actual"));
                }else{
                    setSelectedLegend([...selectedLegend, "Actual"]);
                }
            
            }} buttonTitle="Actual" isActive={
                selectedLegend.includes("Actual")
            } />
            <SmallButton onClick={()=>{
                if(selectedLegend.includes("Nomative")){
                    setSelectedLegend(selectedLegend.filter((item)=>item !== "Nomative"));
                }else{
                    setSelectedLegend([...selectedLegend, "Nomative"]);
                }
            }} buttonTitle="Nomative" isActive={
                selectedLegend.includes("Nomative")
            } />
        </div>
        <BarChart className='mt-4' isRawData={true} data={MahaGencoChart.fromJson(DemoMahaGencoDataJson).toDataSet(
         selectedLegend.length==0 ? true :   selectedLegend.includes("Actual"),
         selectedLegend.length==0 ? true:   selectedLegend.includes("Nomative"),
        )} options={GetChartOptions({ yLabelText: "MUs", displayYLabel: true, displayLegend: false, maintainAspectRatio: true })} /></>

    )
}