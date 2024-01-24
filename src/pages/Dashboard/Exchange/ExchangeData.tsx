import { PrimaryColor, QuaternaryColor, SecondaryColor } from "../../../common";

export interface ExchangeChartData {
    
    title: string;
    timeBlocks: string[];
    date: string[];
    SellBids: number[];
    prchsBids: number[];
    wtMcp: number[];
  
  }
  
  export  interface RealTimeChartData {
    title: string;
    data: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
      }[]
    };
  }
  
  export  const formatRealTimeChartData = (data: any, key: string): RealTimeChartData => {
    const labels = Object.keys(data["DAM_rates"]);
    const damPrices = Object.values(data["DAM_rates"]).map((price: any) => parseFloat(price)/10);
    const gdamPrices = Object.values(data["GDAM_rates"]).map((price: any) => parseFloat(price)/10);
    const rtmPrices = Object.values(data["RTM_rates"]).map((price: any) => parseFloat(price)/10);
  
    return {
      title: key
      ,
      data: {
        // Add labels as 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
        labels: labels.map((label, index) => (index+1).toString()),
        datasets: [
          {
            label: "DAM Prices",
            data: damPrices as number[],
            borderColor: PrimaryColor,
            backgroundColor: PrimaryColor,
          },
          {
            label: "GDAM Prices",
            data: gdamPrices as number[],
            borderColor: SecondaryColor,
            backgroundColor: SecondaryColor,
          },
          {
            label: "RTM Prices",
            data: rtmPrices as number[],
            borderColor: QuaternaryColor,
            backgroundColor: QuaternaryColor,
          },
        ],
      }
    };
  };


export  const FormatExchangeData = (data: any): ExchangeChartData[] => {
    const tempData: ExchangeChartData[] = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const exchangeData = data[key];

          const chartData: ExchangeChartData = {
            title: key,
            timeBlocks: [],
            date: [],
            SellBids: [],
            prchsBids: [],
            wtMcp: [],
          };

          exchangeData.forEach((entry: any) => {
            chartData.timeBlocks.push( entry.time_block);
            chartData.date.push(entry.date);
            chartData.SellBids.push(parseFloat(entry.sell_bid_mw) ? parseFloat(entry.sell_bid_mw) : 0);
            chartData.prchsBids.push(parseFloat(entry.prchs_bid_mw) ? parseFloat(entry.prchs_bid_mw) : 0);
            chartData.wtMcp.push(parseFloat(entry.wt_mcp_rs_mwh) ? parseFloat(entry.wt_mcp_rs_mwh) : 0);
          });

          tempData.push(chartData);

        }
      }
      return tempData;

    }
    