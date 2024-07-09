export interface RealTimeMarketSnapshot {
    mcp_rs_mwh: number; // MCP in Rs/kWh
    mcv_mw: number; // MCV in MWh
    sell_bid_mw: number; // Sell Bid in MWh
    purchase_bid_mw: number; // Purchase Bid in MWh
    no_of_mcp_at_10: number; // Number of MCP at 10
}

export interface DayData {
    mcp_avg: number | null; // MCP average in Rs/kWh
    mcv_total: number | null; // Total MCV in MWh
    sell_bid_total: number | null; // Total Sell Bid in MWh
    purchase_bid_total: number | null; // Total Purchase Bid in MWh
    no_of_mcp_at_10: number | null; // Number of MCP at 10
    [key: string]: any;

}

export interface ChangeData {
    mcp_avg: number | null; // Percentage change in MCP average
    mcv_total: number | null; // Percentage change in total MCV
    sell_bid_total: number | null; // Percentage change in total Sell Bid
    purchase_bid_total: number | null; // Percentage change in total Purchase Bid
    [key: string]: any;

}

export interface ProductData {
    latest: DayData;
    previous: DayData;
    change: ChangeData;
    chartData: RealTimeMarketSnapshot[];
    
}

export interface ExchangeData {
    [product: string]: ProductData;
}

export interface ApiResponse {
    [exchange: string]: ExchangeData;
    date: any;
}

export interface CsrcPSSPData {
    latest: {
        date: string;
        data: PSPData;
    }
    prev: {
        date: string;
        data: PSPData;
    }
}


export interface PSPData {
    date: string;
    demand_met_during_evening_peak_hrsmw_at_19_00_hrs_from_rldcs: string;
    enrgy_met_mu: string;
    enrgy_shrtage_mu: string;
    outage: string;
    frequency: string;
    hydro_gen_mu: string;
    max_demand_met_during_the_day_mw_from_nldc_scada: string;
    peak_shrtage_mw: string;
    regions: string;
    solar_gen_mu: string;
    time_of_max_demand_met_from_nldc_scada: string;
    wind_gen_mu: string;
  }
  