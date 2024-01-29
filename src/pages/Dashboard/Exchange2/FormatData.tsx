

export interface ExchngeItem{
    
        name: string | number;
        wt_mcp_rs_mwh:  number | string | null;
        sell_bid_mw: number | string | null;
        prchs_bid_mw: number | string | null;
        date: string | number ;

    
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
                });
            }
            );
        });
        // data[key].data.dam.map((item: any, index: number) => {
        //     fomattedDataArray.dam.push({
        //         name: index+1,
        //         wt_mcp_rs_mwh: item.wt_mcp_rs_mwh,
        //         sell_bid_mw: parseFloat(item.sell_bid_mw),
        //         prchs_bid_mw: parseFloat(item.prchs_bid_mw),
        //         date: item.date,
        //     });
        // }
        // );
        // data[key].data.gdam.map((item: any, index: number) => {
        //     fomattedDataArray.gdam.push({
        //         name: index+1,
        //         wt_mcp_rs_mwh: item.wt_mcp_rs_mwh,
        //         sell_bid_mw: parseFloat(item.sell_bid_mw),
        //         prchs_bid_mw: parseFloat(item.prchs_bid_mw),
        //         date: item.date,
        //     });
        // }
        // );
        // data[key].data.rtm.map((item: any, index: number) => {
        //     fomattedDataArray.rtm.push({
        //         name: index+1,
        //         wt_mcp_rs_mwh: item.wt_mcp_rs_mwh,
        //         sell_bid_mw: parseFloat(item.sell_bid_mw),
        //         prchs_bid_mw: parseFloat(item.prchs_bid_mw),
        //         date: item.date,
        //     });
        // }
        // );
        // data[key].data.hpdam.map((item: any, index: number) => {
        //     fomattedDataArray.hpdam.push({
        //         name: index+1,
        //         wt_mcp_rs_mwh: item.wt_mcp_rs_mwh,
        //         sell_bid_mw: parseFloat(item.sell_bid_mw),
        //         prchs_bid_mw: parseFloat(item.prchs_bid_mw),
        //         date: item.date,
        //     });
        // }
        // );


    });

    return fomattedDataArray;
}

export const AxisLabel = ({ axisType, x, y, width, height, stroke, children }: any) => {
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
  
  export  const renderQuarterTick = (tickProps: any) => {
    const { x, y, payload } = tickProps;
    const {index,value, offset } = payload;  
    const finalIndex = index + 1;
    if(finalIndex %48 === 0 && finalIndex%96 !== 0){
      return <text x={x} y={y - 4} textAnchor="middle">{value}</text>;
    }
  };