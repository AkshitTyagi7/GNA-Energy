import { Text } from "recharts";
import { PrimaryColor, QuaternaryColor, SecondaryColor } from "../../../common";
import { format } from "path";


export interface ExchngeItem{
    
        name: string | number;
        wt_mcp_rs_mwh:  number | string | null;
        sell_bid_mw: number | string | null;
        prchs_bid_mw: number | string | null;
        mcv_mw: number | string | null;
        date: string | number ;


    
}
// {
//   "buyer": "GEB Beneficiary W0RGU0",
//   "buyer_mwhr": "19508771.53",
//   "id": "22-10-2021",
//   "seller": "UPPCL N0RUP0",
//   "seller_mwhr": "15202311.95"
// },
export interface BuyerSeller{
    buyer: string[];
    buyer_mwhr: number[];
    // date: string;
    seller: string[];
    seller_mwhr: number[];
}

export interface ExchangeData{
    dam:ExchngeItem[],
    gdam:ExchngeItem[],
    rtm:ExchngeItem[],
    hpdam:ExchngeItem[],
    [key: string]: ExchngeItem[]; // Add index signature
}

export function FormatExchangeData(data : any): ExchangeData{
    let fomattedDataArray: ExchangeData={
        dam:[],
        gdam:[],
        rtm:[],
        hpdam:[],
    
    };
    Object.keys(data).map((key, index) => {
        Object.keys(data[key].data).map((key2, index2) => {
            if(data[key].data[key2].length===0){
            const timeSlots = 96;
            for(let i=0;i<timeSlots;i++){
                fomattedDataArray[key2].push({
                    name: i+1,
                    wt_mcp_rs_mwh: null,
                    sell_bid_mw: null,
                    prchs_bid_mw: null,
                    mcv_mw: null,
                    date: key,
                });
            }}
            data[key].data[key2].map((item: any, index: number) => {
                fomattedDataArray[key2].push({
                    name: index+1,
                    wt_mcp_rs_mwh: item.wt_mcp_rs_mwh,
                    sell_bid_mw: parseFloat(item.sell_bid_mw),
                    prchs_bid_mw: parseFloat(item.prchs_bid_mw),
                    date: item.date,
                    mcv_mw: parseFloat(item.mcv_mw),
                });
            }
            );
        });
    });
    Object.keys(fomattedDataArray).map((key, index) => {
        fomattedDataArray[key] = fomattedDataArray[key].sort((a: any, b : any) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
        
            return dateA.getTime() - dateB.getTime();
                });
    });

    return fomattedDataArray;
}

export const AxisLabel = ({ axisType, x, y, width, height, stroke, children }: any) => {
    const isVert = axisType === 'yAxis';
    const cx = isVert ? x : x + (width / 2);
    const cy = isVert ? (height / 2) + y : y + height + 10;
    const rot = isVert ? `270 ${cx} ${cy}` : 0;
    return (
      <Text x={cx} y={cy} transform={`rotate(${rot})`} textAnchor="middle" stroke={stroke}>
        {children}
      </Text>
    );
  };
  
  export  const renderQuarterTick = (tickProps: any) => {
    const { x, y, payload } = tickProps;
    const {index,value, offset } = payload;  
    const finalIndex = index + 1;
    if(finalIndex %48 === 0 && finalIndex%96 !== 0){
      return <text x={x} y={y - 4} textAnchor="middle">{value}</text>;
    }
  };



  export interface ExchangeChartData {
    
    title: string;
    timeBlocks: string[];
    date: string[];
    SellBids: number[];
    prchsBids: number[];
    mcv: number[];
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
            borderColor: QuaternaryColor,
            backgroundColor: QuaternaryColor,
          },
          {
            label: "RTM Prices",
            data: rtmPrices as number[],
            borderColor: SecondaryColor,
            backgroundColor: SecondaryColor,
          },
          {
            label:"HPDAM Prices",
            data:[],
            borderColor:"red",
            backgroundColor:"red"
          }
        ],
      }
    };
  };


export function FormatDataOfRealtime(data:any){
    let formatedData: { name: number; price: number; date: string; }[]=[];
    Object.keys(data).map((key, index) => {
        Object.keys(data[key]).map((key2, index2) => {
            Object.keys(data[key][key2]).map((key3, index3) => {
                formatedData.push({
                    name: index3+1,
                    price: parseFloat(data[key][key2][key3]),
                    date: key,
                    

            
            });


    });
});
});
console.log(formatedData);
return formatedData;

}

export interface BuyerSellerData{
    name: string;
    value: number;
}

export interface BuyerSellerItem{
  buyer: string;
  buyer_mwhr: number;
  seller: string;
  seller_mwhr: number;
}



const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Dates
};

export const ExchangeColors: string[] = [
  // Shuffled using Math.random() approach
  PrimaryColor,
  SecondaryColor,
  "rgb(17, 141, 255)",
  "rgb(18, 35, 158)",
  "#DC143C", // Crimson
  "#800080", // Purple
  "#FFA07A", // Mango
  "#006400", // Emerald Green
  "#B76E79", // Rose Gold
  "#B22222", // Firebrick
  "#2F4F4F", // Dark Gray
  "#C71585", // Deep Pink
  "#D2B48C", // Cinnamon
  "#DC143C", // Crimson
  "#000080", // Navy Blue
  "#FF7F50", // Coral
  "#87CEEB", // Sky Blue
  "#A52A2A", // Brown
  "#FF6347", // Tomato
  "#8B0000", // Dark Red
  "#4B0082", // Indigo
  "#C71585", // Deep Pink
  "#2E8B57", // Sea Green
  "#C00000", // Maroon
  "#A9A9A9", // Medium Gray
  "#363636", // Charcoal
  "#696969", // Dark Gray
  "#000000", // Black
  "#6495ED", // Cornflower Blue
  "#FF6347", // Tomato
  "#B76E79", // Rose Gold
  "#4B0082", // Indigo
  "#FF8C00", // Dark Orange
  "#004347", // Deep Sea Green
  "#9400D3", // Dark Violet
  "#007F4E", // Dark Green
  "#8B0000", // Dark Red
  "#C00000", // Maroon
  "#FF0000", // Red
  "#0018A8", // Deep Sapphire
  "#4169E1", // Royal Blue
  "#6495ED", // Cornflower Blue
  "#87CEEB", // Sky Blue
  "#FFA500", // Orange
  "#FF4500", // Orange Red
  "#2E8B57", // Sea Green
  "#006400", // Emerald Green
  // ... (remaining shuffled colors)
];
