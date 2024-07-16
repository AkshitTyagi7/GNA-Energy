import { MarketSnapshotData } from "./interface";

const exchanges: string[] = [
  "IEX", "PXIL", "HPX"
]

const products: string[] = [
  "DAM", "GDAM", "HPDAM", "RTM"
]
export function FilterExchangeData(
  data: MarketSnapshotData[],
  {
    exchangeIndex,
    exchangeProductIndex
  }: {
    exchangeIndex: number;
    exchangeProductIndex: number;
  }
): MarketSnapshotData[] {

  // Assuming `exchanges` and `products` arrays are defined elsewhere
  const exchange = exchanges[exchangeIndex];
  const product = products[exchangeProductIndex];

  // Filter the data based on exchange and product
  data = data.filter(
    (trade) => trade.exchange__name === exchange && trade.product__name === product
  );

  data = data.map((item: any, index: any) =>{
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
  }});

  // Sort data by date and time_slot
  data.sort(
    (a: any, b: any) => {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return a.time_slot - b.time_slot;
    }
  );

  // Create an empty slot
  const createEmptySlot = (date: string, time_slot: number) => {
    return {
      date: date,
      exchange__name: exchange,
      product__name: product,
      time_slot: time_slot,
      purchase_bid_mw: 0,
      sell_bid_mw: 0,
      mcv_mw: 0,
      mcp_rs_mwh: 0,
      wt_mcp_rs_mwh: 0
    }
  };

  // Helper function to generate date strings in 'YYYY-MM-DD' format
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Add missing slots and days
  const result: MarketSnapshotData[] = [];
  if (data.length === 0) return result;

  let currentDate = new Date(data[0].date);
  const endDate = new Date(data[data.length - 1].date);

  while (currentDate <= endDate) {
    const currentDateString = formatDate(currentDate);
    const dayData = data.filter(item => item.date === currentDateString);
    const slotsSet = new Set(dayData.map(item => item.time_slot));

    for (let i = 1; i <= 96; i++) {
      if (!slotsSet.has(i)) {
        dayData.push(createEmptySlot(currentDateString, i));
      }
    }

    dayData.sort((a: any, b: any) => a.time_slot - b.time_slot);
    result.push(...dayData);

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}



