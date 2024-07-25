import { TAM } from "../../../models/auction";
import { toSafeFloat } from "../../../extensions/number";
import { formatDMY } from "../../../common"
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

    const response = await fetch(`https://api-data.gna.energy/data/get_tam_data?start_date=${startDate.toISOString().split("T")[0]}&end_date=${endDate.toISOString().split("T")[0]}`, {
      method: "GET",
      // body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    let tamData: TAM[] = [];
    data.forEach((auction: any) => {
        tamData.push({
          date:formatDMY(auction.converted_date),
          exchange: auction.exchange,
          product: products.find((product) => product.keys.includes(auction.product_gna))?.name || auction.product_gna,
          total_traded_volume_mwh: auction.total_traded_volume_mwh,
          weighted_average_price_rs_mwh: toSafeFloat((toSafeFloat(auction.weighted_average_price_rs_mwh) / 1000).toFixed(2)),
          instrument_name: auction.instrument_name,
          no_of_trades: auction.no_of_trades,
          product_gna: products.find((product) => product.keys.includes(auction.product_gna))?.name || auction.product_gna,
        });
      });
    console.log("TAM data:", tamData);
    return tamData;
  } catch (error) {
    console.error("Error fetching TAM data:", error);
    return [];
  }
};
 const products = [
  { name: "Daily", key: "Daily", keys: ["Daily", "DAILY"] },
  {
    name: "Intra day",
    key: "Intra day",
    keys: [
      "I_DayDynamic_C",
      "Intra day",
      "Intra Day",
      "I_DayStatic_C",
      "INTRA DAY",
    ],
  },
  {
    name: "DAC",
    key: "Day Ahead Contingency",
    keys: [
      "Day Ahead Contingency",
      "DACDynamic",
      "CONTINGENCY",
      "Contingency",
      "TAM(DAC)",
      "DACStatic",
    ],
  },
  { name: "Weekly", key: "Weekly", keys: ["Weekly", "WEEKLY"] },

  { name: "Monthly", key: "Monthly", keys: ["Monthly"] },
  {
    name: "HP DAC",
    key: "DACDynamic_HP",
    keys: [
      "DACDynamic_HP",
      "DACStatic_TAM_H",
      "Day Ahead Contingency_HP",
      "DAY AHEAD CONTINGENCY_HP",
      "Contingency_HP",
      "DAY AHEAD CONTIGENCY_HP",
      "CONTINGENCY_HP",
    ],
  },
  {
    name: "HP Intra Day",
    key: "IDayDynamic_HP",
    keys: ["IDayDynamic_HP", "Intra Day_HP"],
  },
  {
    name: "HP Daily",
    key: "Daily_HP",
    keys: ["Daily_HP", "DAILY_HP", "daily_hp"],
  },
  {
    name: "HP Monthly",
    key: "Monthly_HP",
    keys: ["Monthly_HP", "MONTHLY_HP", "monthly_hp"],
  },
];
