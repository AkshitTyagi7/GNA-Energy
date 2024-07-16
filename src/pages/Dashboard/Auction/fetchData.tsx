import { TAM } from "../../../models/auction";
import { toSafeFloat } from "../../../extensions/number";
interface FetchDataParams {
    startDate: Date;
    endDate: Date;
    entity?: string;
  }
  
export const fetchData = async ({ startDate, endDate }: FetchDataParams) => {
  try {
    const response = await fetch(
      `https://api-data.gna.energy/data/search-auction/?start_date=${startDate.toISOString().split("T")[0]}&end_date=${endDate.toISOString().split("T")[0]}`
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.auctions.reverse();
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return [];
  }
};

export const fetchTAMData = async ({ startDate, endDate }: FetchDataParams) => {
  try {
    const formData = new FormData();
    formData.append("start_date", startDate.toISOString().split("T")[0]);
    formData.append("end_date", endDate.toISOString().split("T")[0]);

    const response = await fetch("https://datahub.gna.energy/tam_exchange_api", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let tamData: TAM[] = [];
    data.forEach((date: any) => {
      date.data.forEach((auction: any) => {
        tamData.push({
          date: date.date,
          exchange: auction.exchange,
          product: auction.product === "CONTINGENCY" ? "Day Ahead Contingency" : auction.product === "Intraday" ? "Intra day" : auction.product === "Intra Day" ? "Intra day" : auction.product === "DAILY" ? "Daily" : auction.product,
          total_traded_volume_mwh: auction.total_traded_volume_mwh,
          weighted_average_price_rs_mwh: toSafeFloat((toSafeFloat(auction.weighted_average_price_rs_mwh) / 1000).toFixed(2)),
          instrument_name: auction.instrument_name,
          no_of_trades: auction.no_of_trades,
        });
      });
    });

    return tamData;
  } catch (error) {
    console.error("Error fetching TAM data:", error);
    return [];
  }
};
