export interface Auction {
    id: number;
    accepted_price_kwh: number | null;
    allocated_quantity_mw: number | null;
    auction_initiation_date: string | null;
    auction_initiation_time: string | null;
    auction_no: string | null;
    auction_result_date: string | null;
    auction_result_time: string | null;
    booking_accepted_price_kwh: number | null;
    total_count_of_sellers_who_participated_in_the_auction: number | null;
    booking_quantity_mw: number | null;
    buy_minimum_quantity_mw: number | null;
    buy_total_quantity_mw: number | null;
    buyer__name: string | null;
    delivery_end_date: string | null;
    delivery_end_time: string | null;
    delivery_start_date: string | null;
    delivery_start_time: string | null;
    duplicate: number | null;
    exchange_type__name: string | null;
    requisition_no: string | null;
    type__name: string | null;
  }
  export interface AuctionComparison{
    date: string | null;
    total_mu_iex: number;
    total_mu_pxil: number;
    total_mu_hpx: number;
    total_mu_deep: number;
    total_mu: number;
    total_price_rs_iex: number;
    total_price_rs_pxil: number;
    total_price_rs_hpx: number;
    total_price_rs_deep: number;
    total_price_rs: number;
    auction_count_iex: number;
    auction_count_pxil: number;
    auction_count_hpx: number;
    auction_count_deep: number;
    auction_count: number;
    weighted_avg_rs_per_kwh_iex: number;
    weighted_avg_rs_per_kwh_pxil: number;
    weighted_avg_rs_per_kwh_hpx: number;
    weighted_avg_rs_per_kwh_deep: number;
    weighted_avg_rs_per_kwh: number;
    simple_avg_rs_per_kwh_iex: number;
    simple_avg_rs_per_kwh_pxil: number;
    simple_avg_rs_per_kwh_hpx: number;
    simple_avg_rs_per_kwh_deep: number;
    simple_avg_rs_per_kwh: number;
}

interface SearchAuctionParams {
    buyer?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
}

export interface TAM{
    // "date": "2024-07-06",
    // "exchange": "HPX",
    // "product": "DAILY",
    // "total_traded_volume_mwh": "100.0",
    // "weighted_average_price_rs_mwh": "8900.0"
    date: string | null;
    exchange: string | null;
    product: string | null;
    total_traded_volume_mwh: number | null;
    weighted_average_price_rs_mwh: number | null;
    instrument_name: string | null;
    no_of_trades: number | null;
    product_gna: string | null;
}

// {
//     "date": "2024-03-01",
//     "total_mwh": 240884.23379166663,
//     "total_mu": 240.88423379166693,
//     "total_price_rs": 1874219.2956202764,
//     "auction_count": 190,
//     "weighted_avg_rs_per_kwh": 7.780581012376389,
//     "simple_avg_rs_per_kwh": 8.10706315789474
//   },

export interface AuctionChartData{
    date: string | null;
    total_mwh: number | undefined;
    total_mu: number | undefined;
    total_price_rs: number | undefined;
    auction_count: number | undefined;
    weighted_avg_rs_per_kwh: number | undefined;
    unallocated_mwh?: number | undefined;
    unallocated_mu?: number | undefined;
    simple_avg_rs_per_kwh: number | null;
    [key: string]: number | string | null | undefined;

}