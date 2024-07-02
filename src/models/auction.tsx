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
    buyer: number | null; // Assuming buyer is referenced by ID
    delivery_end_date: string | null;
    delivery_end_time: string | null;
    delivery_start_date: string | null;
    delivery_start_time: string | null;
    duplicate: number | null;
    exchange_type: number | null; // Assuming exchange_type is referenced by ID
    requisition_no: string | null;
    type: number | null; // Assuming type is referenced by ID
}

interface SearchAuctionParams {
    buyer?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
}
