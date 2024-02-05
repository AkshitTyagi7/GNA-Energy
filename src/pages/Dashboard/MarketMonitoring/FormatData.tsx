import { StringLiteral } from "typescript";

enum Products {
    DAM = "DAM",
    RTM = "RTM",
    GDAM = "GDAM",
    IntraDay = "Intra-Day Contracts",
    ContigencyContracts = "Day Ahead Contingency Contracts",
    Daily = "Daily Contracts",
    Weekly = "Weekly Contracts",
    Monthly = "Monthly Contracts",
    AnyDay = "Any Day Contracts",
    SingleSided = "Any Day Single Sided Contracts",
}

export interface MarketMonitoringItem {
    month: string;
    product: Products;
    value: number;
}

export interface MarketMonitoringData {
    dam: MarketMonitoringItem[];
    rtm: MarketMonitoringItem[];
    gdam: MarketMonitoringItem[];
    intraDay: MarketMonitoringItem[];
    contingencyContracts: MarketMonitoringItem[];
    daily: MarketMonitoringItem[];
    weekly: MarketMonitoringItem[];
    monthly: MarketMonitoringItem[];
    anyDay: MarketMonitoringItem[];
    singleSided: MarketMonitoringItem[];
}

export interface ChartExchangeItem {
    month: string;
    dam: number;
    rtm: number;
    gdam: number;
    intraDay: number;
    contingencyContracts: number;
    daily: number;
    weekly: number;
    monthly: number;
    anyDay: number;
    singleSided: number;


}
export function FormatMarketMonitoringData(data: any): ChartExchangeItem[] {
    const formattedDataArray: MarketMonitoringData = {
        dam: [],
        rtm: [],
        gdam: [],
        intraDay: [],
        contingencyContracts: [],
        daily: [],
        weekly: [],
        monthly: [],
        anyDay: [],
        singleSided: [],
    };

    const updateFormattedData = (dataArray: MarketMonitoringItem[], product: Products, item: any) => {
        const index = dataArray.findIndex((element) => element.month === item.month);
        if (index === -1) {
            dataArray.push({
                month: item.month,
                product: item.product,
                value: item.value,
            });
        } else {
            dataArray[index].value += item.value;
        }
    };

    Object.keys(data).forEach((key) => {
        Object.keys(data[key]).forEach((key2) => {
            data[key][key2].forEach((item: any) => {
                switch (item.product) {
                    case Products.DAM:
                        updateFormattedData(formattedDataArray.dam, Products.DAM, item);
                        break;
                    case Products.RTM:
                        updateFormattedData(formattedDataArray.rtm, Products.RTM, item);
                        break;
                    case Products.GDAM:
                        updateFormattedData(formattedDataArray.gdam, Products.GDAM, item);
                        break;
                    case Products.IntraDay:
                        updateFormattedData(formattedDataArray.intraDay, Products.IntraDay, item);
                        break;
                    case Products.ContigencyContracts:
                        updateFormattedData(formattedDataArray.contingencyContracts, Products.ContigencyContracts, item);
                        break;
                    case Products.Daily:
                        updateFormattedData(formattedDataArray.daily, Products.Daily, item);
                        break;
                    case Products.Weekly:
                        updateFormattedData(formattedDataArray.weekly, Products.Weekly, item);
                        break;
                    case Products.Monthly:
                        updateFormattedData(formattedDataArray.monthly, Products.Monthly, item);
                        break;
                    case Products.AnyDay:
                        updateFormattedData(formattedDataArray.anyDay, Products.AnyDay, item);
                        break;
                    case Products.SingleSided:
                        updateFormattedData(formattedDataArray.singleSided, Products.SingleSided, item);
                        break;

                    default:
                        break;
                }
            });
        });
    });
    const finalChartExchangeData: ChartExchangeItem[] = [];

    let maxLength = 0;
    let maxLengthKey = "";
    Object.keys(formattedDataArray).forEach((key) => {
        if (formattedDataArray[key as keyof MarketMonitoringData].length > maxLength) {
            maxLength = formattedDataArray[key as keyof MarketMonitoringData].length;
            maxLengthKey = key;
        }
    });
    for(let index= 0; index < 
        maxLength; index++
        ){
            finalChartExchangeData.push({
                month: formattedDataArray[maxLengthKey as keyof MarketMonitoringData][index].month,
                dam: formattedDataArray.dam[index]?.value ?? null,
                rtm: formattedDataArray.rtm[index]?.value ?? null,
                gdam: formattedDataArray.gdam[index]?.value ?? null,
                intraDay: formattedDataArray.intraDay[index]?.value ?? null,
                contingencyContracts: formattedDataArray.contingencyContracts[index]?.value ?? null,
                daily: formattedDataArray.daily[index]?.value ?? null,
                weekly: formattedDataArray.weekly[index]?.value ?? null,
                monthly: formattedDataArray.monthly[index]?.value ?? null,
                anyDay: formattedDataArray.anyDay[index]?.value ?? null,
                singleSided: formattedDataArray.singleSided[index]?.value ?? null,
            });
        }    
        console.log(finalChartExchangeData);
    // formattedDataArray.dam.forEach((item, index) => {
    //         finalChartExchangeData.push({
    //             month: item.month,
    //             dam: item.value,
    //             rtm: formattedDataArray.rtm[index]?.value ?? [],
    //             gdam: formattedDataArray.gdam[index]?.value ?? [],
    //             intraDay: formattedDataArray.intraDay[index]?.value ?? [],
    //             contingencyContracts: formattedDataArray.contingencyContracts[index]?.value ?? [],
    //             // daily: formattedDataArray.daily[index].value,
    //             // weekly: formattedDataArray.weekly[index].value,
    //             // monthly: formattedDataArray.monthly[index].value,
    //             // anyDay: formattedDataArray.anyDay[index].value,
    //             // singleSided: formattedDataArray.singleSided[index].value,
    //             daily: formattedDataArray.daily[index]?.value ?? [],
    //             weekly: formattedDataArray.weekly[index]?.value ?? [],
    //             monthly: formattedDataArray.monthly[index]?.value ?? [],
    //             anyDay: formattedDataArray.anyDay[index]?.value ?? [],
    //             singleSided: formattedDataArray.singleSided[index]?.value ?? [],
    //         });
     
    // });
    return finalChartExchangeData;
}
