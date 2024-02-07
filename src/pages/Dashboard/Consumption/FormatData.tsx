import { ConsumptionData } from "./Data";

export interface ChartConsumptionData{
    month: string[];
    data:any[]
}
export function FormatConsumptionData(data: any)  {
    let finalChartConsumptionData: ChartConsumptionData = {
        month: [],
        data: [],
    };
    let formattedData: any={};
    for (let i = 0; i < data.length; i++) {
        if(finalChartConsumptionData.month.includes(data[i].states)){
            formattedData[data[i].states].push(data[i]);
            }
            else{
                finalChartConsumptionData.month.push(data[i].states);
                formattedData[data[i].states] = [data[i]];
            }
    }
    console.log(formattedData);
    Object.keys(formattedData).forEach((key) => {
        for(let index= 0; index < formattedData[key as keyof typeof formattedData].length; index++){
            if(finalChartConsumptionData.data.filter((item)=>item.month===formattedData[key as keyof typeof formattedData][index].month).length===0){
                finalChartConsumptionData.data.push({
                    month: formattedData[key as keyof typeof formattedData][index].month,
                    [key]: formattedData[key as keyof typeof formattedData][index].value,
                });
            }
            else{
                finalChartConsumptionData.data[index] = formattedData[key as keyof typeof formattedData][index].value;
            }
        }
    });
    console.log(finalChartConsumptionData);
};