import { StringLiteral } from "typescript";

enum Products {
    DAM = "DAM",
    RTM = "RTM",
    HPDAM = "HPDAM",
    GDAM = "GDAM",
    
    IntraDay = "Intra-Day Contracts",
    ContigencyContracts = "Day Ahead Contingency Contracts",
    Daily = "Daily Contracts",
    Weekly = "Weekly Contracts",
    Monthly = "Monthly Contracts",
    AnyDay = "Any Day Contracts",
    SingleSided = "Any Day Single Sided Contracts",
    Bilateral="Bilateral"
}

export interface MarketMonitoringItem {
    month: string;
    product: Products;
    value: number;
    totalVolume?: number;
    totalCost?: number;
}

export interface MarketMonitoringData {
    dam: MarketMonitoringItem[];
    rtm: MarketMonitoringItem[];
    hpdam: MarketMonitoringItem[];
    gdam: MarketMonitoringItem[];
    intraDay: MarketMonitoringItem[];
    contingencyContracts: MarketMonitoringItem[];
    daily: MarketMonitoringItem[];
    weekly: MarketMonitoringItem[];
    monthly: MarketMonitoringItem[];
    anyDay: MarketMonitoringItem[];
    singleSided: MarketMonitoringItem[];
    bilateral: MarketMonitoringItem[];
}

export interface ChartExchangeItem {
    month: string;
    dam: number;
    rtm: number;
    hpdam: number;
    gdam: number;
    intraDay: number;
    contingencyContracts: number;
    daily: number;
    weekly: number;
    monthly: number;
    anyDay: number;
    singleSided: number;
    bilateral: number;



}


export function FormatMarketMonitoringData(data: any, includingExchange?: String[],includingMarket?: String[], isWeighted?: boolean): ChartExchangeItem[] {
    const formattedDataArray: MarketMonitoringData = {
        dam: [],
        rtm: [],
        hpdam: [],
        gdam: [],
        intraDay: [],
        contingencyContracts: [],
        daily: [],
        weekly: [],
        monthly: [],
        anyDay: [],
        singleSided: [],
        bilateral: [],
    };
    
    const updateFormattedData = (dataArray: MarketMonitoringItem[], product: Products, item: any) => {
        const index = dataArray.findIndex((element) => element.month === item.month);

        if (index === -1) {
            var toPush: MarketMonitoringItem = {
                month: item.month,
                product: product,
                value: item.value,
            };
            if(isWeighted){
                toPush.totalVolume = item.volume;
                toPush.totalCost = item.value*item.volume;
            }
           
            dataArray.push(toPush); 

        } else {
            if(isWeighted){
                dataArray[index].totalVolume += item.volume;
                dataArray[index].totalCost! += item.value*item.volume;
                dataArray[index].value = dataArray[index].totalVolume === 0 ? 0 : dataArray[index].totalCost!/dataArray[index].totalVolume!;
            }
            else{
                dataArray[index].value += item.value;
            }
        }
    };
    Object.keys(data).forEach((key) => {
        if (includingExchange?.includes(key)) {
            
        Object.keys(data[key]).forEach((key2) => {
            if (includingMarket?.includes(key2)) {
            data[key][key2].forEach((item: any) => {
                switch (item.product) {
                    
                    case Products.DAM:
                        updateFormattedData(formattedDataArray.dam, Products.DAM, item);
                        break;
                    case Products.RTM:
                        updateFormattedData(formattedDataArray.rtm, Products.RTM, item);
                        break;
                    case Products.HPDAM:
                        updateFormattedData(formattedDataArray.hpdam, Products.HPDAM, item);
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
                    case Products.Bilateral:
                        updateFormattedData(formattedDataArray.bilateral, Products.Bilateral, item);
                        break;
                    case "Trading Licensees":
                        updateFormattedData(formattedDataArray.bilateral, Products.Bilateral, item);
                        break;
                    

                    default:
                        console.log("Product not included, " + item.product);
                        break;
                }
            });
        }else{
            console.log("Market not included, " + key2)
        }});
    }
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
                hpdam: formattedDataArray.hpdam[index]?.value ?? null,
                gdam: formattedDataArray.gdam[index]?.value ?? null,
                intraDay: formattedDataArray.intraDay[index]?.value ?? null,
                contingencyContracts: formattedDataArray.contingencyContracts[index]?.value ?? null,
                daily: formattedDataArray.daily[index]?.value ?? null,
                weekly: formattedDataArray.weekly[index]?.value ?? null,
                monthly: formattedDataArray.monthly[index]?.value ?? null,
                anyDay: formattedDataArray.anyDay[index]?.value ?? null,
                singleSided: formattedDataArray.singleSided[index]?.value ?? null,
                bilateral: formattedDataArray.bilateral[index]?.value ?? null,
            });
        }    
         console.log(finalChartExchangeData)

    return finalChartExchangeData;
}

enum Exchange {
    IEX = "IEX",
    HPX = "HPX",
    PXIL = "PXIL",
    Traders = "Traders",

}

export interface ChartByPriceItem{
    month: string;
    iex: number;
    hpx: number;
    pxil: number;
    traders: number;
}

interface ByPriceItem{
    value: number;
    exchange: Exchange;
    month: string;
    cost? : number;
    totalVolume? : number;

}

interface ByPriceData{
    month : ByPriceItem[];
    iex : ByPriceItem[];
    hpx : ByPriceItem[];
    pxil : ByPriceItem[];
    traders : ByPriceItem[];
}




export function FormatByPriceData(data: any, selectedProduct?: String[],selectedMarket?: String[], isPrice?: boolean): ChartByPriceItem[]{
    const formattedDataArray: ByPriceData = {
        month:[],
        iex: [],
        hpx: [],
        pxil: [],
        traders: [],
    
    };

    const updateFormattedData = (dataArray: ByPriceItem[], exchange: Exchange, item: any) => {
        const index = dataArray.findIndex((element) => element.month === item.month);
        if( !selectedProduct?.includes(item.product)){
            return;
        }
        else{
        if (index === -1) {
            var toBePushed: ByPriceItem = {
                month: item.month,
                exchange: exchange,
                value: parseFloat(item.value),
            };
            if(isPrice){
                toBePushed.cost = item.value*item.volume ;
                toBePushed.totalVolume = item.volume;
            }
            dataArray.push(toBePushed);
         
        } else {
            dataArray[index].value += parseFloat(item.value);
            if(isPrice){
                dataArray[index].cost! += item.value*item.volume;
                dataArray[index].totalVolume! += item.volume;
                dataArray[index].value = dataArray[index].totalVolume === 0 ? 0 : dataArray[index].cost!/dataArray[index].totalVolume!;
            }
        }}
    };


    Object.keys(data).forEach((exchange) => {
        Object.keys(data[exchange]).forEach((market) => {
            if(selectedMarket?.includes(market)){

    
            
            switch (exchange) {
                case Exchange.IEX:
                    data[exchange][market].forEach((item: any) => {
                        updateFormattedData(formattedDataArray.iex, Exchange.IEX, item);
                    });
                    break;
                case Exchange.HPX:
                    data[exchange][market].forEach((item: any) => {
                        updateFormattedData(formattedDataArray.hpx, Exchange.HPX, item);
                    });
                    break;
                case Exchange.PXIL:
                    data[exchange][market].forEach((item: any) => {
                        updateFormattedData(formattedDataArray.pxil, Exchange.PXIL, item);
                    });
                    break;
                case Exchange.Traders:
                    data[exchange][market].forEach((item: any) => {
                        updateFormattedData(formattedDataArray.traders, Exchange.Traders, item);
                    });
                    break;
                default:
                    break;
            }        }
            else{
                console.log("Market not included price, " + market)
            }
    });
});
const finalChartByPriceData: ChartByPriceItem[] = [];
let maxLength = 0;
let maxLengthKey = "";
Object.keys(formattedDataArray).forEach((key) => {
    if (formattedDataArray[key as keyof ByPriceData].length > maxLength) {
        maxLength = formattedDataArray[key as keyof ByPriceData].length;
        maxLengthKey = key;
    }
});
for(let index= 0; index < 
    maxLength; index++
    ){
        finalChartByPriceData.push({
            month: formattedDataArray[maxLengthKey as keyof ByPriceData][index].month,
            iex: formattedDataArray.iex[index]?.value ?? null,
            hpx: formattedDataArray.hpx[index]?.value ?? null,
            pxil: formattedDataArray.pxil[index]?.value ?? null,
            traders: formattedDataArray.traders[index]?.value ?? null,
        });
    } 
    console.log(finalChartByPriceData)
return finalChartByPriceData;
}