import { MarketSnapshotData } from "./interface";

const exchanges: string[] = [
    "IEX", "PXIL","HPX"
]

const products: string[] = [
    "DAM","GDAM", "HPDAM", "RTM"
]
export function FilterExchangeData(
  data: MarketSnapshotData[],
  {
  exchangeIndex,
  exchangeProductIndex}:{
    exchangeIndex: number;
    exchangeProductIndex: number;
  }
): MarketSnapshotData[] {

     data = data.filter(
    (trade) => trade.exchange__name ===
    exchanges[exchangeIndex]
    && trade.product__name ===products[exchangeProductIndex]
  );
  
  console.log(data);

  return data;
}

export function FilterSortExchangeData(
  data: MarketSnapshotData[],
  exchange: string,
  product: string
): MarketSnapshotData[]{
  data = data.filter(
    (trade) => trade.exchange__name === exchange && trade.product__name === product
  ).sort(
    (a: any, b: any) => {
        if(a.date < b.date){
            return -1;
        }
        if(a.date > b.date){
            return 1;
        }
        return a.time_slot - b.time_slot;
    }



).map((item: any, index: any)=>{
    return {
        date: item.date,
        exchange__name: item.exchange__name,
        product__name: item.product__name,
        time_slot: item.time_slot,
        purchase_bid_mw: item.purchase_bid_mw,
        sell_bid_mw: item.sell_bid_mw,
        mcv_mw: item.mcv_mw,
        mcp_rs_mwh: item.mcp_rs_mwh,
        wt_mcp_rs_mwh: item.wt_mcp_rs_mwh/1000
    }
}
);

return data;
}
