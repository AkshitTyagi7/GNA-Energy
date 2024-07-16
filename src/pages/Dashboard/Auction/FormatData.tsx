import { Auction, AuctionChartData } from "../../../models/auction";

// date: string | null;
// total_mwh: number | null;
// total_mu: number | null;
// total_price_rs: number | null;
// auction_count: number | null;
// weighted_avg_rs_per_kwh: number | null;
// simple_avg_rs_per_kwh: number | null;


const calculateHoursBetween = (startTime: string, endTime: string): number => {
    // Implement the function to calculate the duration in hours between two times
    // This is a placeholder implementation
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);
    
    // console.log("Start time end time - ",startTime, endTime);
    let hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    hours = Math.round(hours * 100) / 100;

    
    return hours;
};

export const FormatAuctionDaily = (
    {
        start_date,
        end_date,
        auctions
    }: {
        start_date: string;
        end_date: string;
        auctions: Auction[];
    
    }
): AuctionChartData[] | { error: string } | { message: string } => {
    if (!auctions || auctions.length === 0) {
        return { error: 'No auction data provided.' };
    }

    // Filter auctions based on entity and exchange type if provided
    let filteredAuctions = auctions;
    if (filteredAuctions.length === 0) {
        return { message: 'No auctions found for the given filters.' };
    }

    const data: AuctionChartData[] = [];

    for (const auction of filteredAuctions) {
        const auctionStart = new Date(Math.max(new Date(auction.delivery_start_date!).getTime(), new Date(start_date).getTime()));
        const auctionEnd = new Date(Math.min(new Date(auction.delivery_end_date!).getTime(), new Date(end_date).getTime()));
        let currentDate = auctionStart;

        while (currentDate <= auctionEnd) {
            const dayKey = currentDate.toISOString().split('T')[0];
            let existingEntry = data.find(item => item.date === dayKey);

            if (!existingEntry) {
                existingEntry = {
                    date: dayKey,
                    total_mwh: 0,
                    total_mu: 0,
                    total_price_rs: 0,
                    auction_count: 0,
                    weighted_avg_rs_per_kwh: 0,
                    simple_avg_rs_per_kwh: 0,
                    total_weighted_price: 0,
                    total_accepted_price: 0,
                };
                data.push(existingEntry);
            }

            const nextDay = new Date(currentDate);
            nextDay.setDate(nextDay.getDate() + 1);
            const durationHours = calculateHoursBetween(auction.delivery_start_time!, auction.delivery_end_time!);

            const mwh = auction.allocated_quantity_mw ? auction.allocated_quantity_mw * durationHours : 0;
            if (auction.accepted_price_kwh != undefined && mwh > 0) {
                existingEntry.total_mwh! += mwh;
                existingEntry.total_mu! += mwh / 1000;
                existingEntry.total_price_rs! += auction.accepted_price_kwh! * mwh;
                existingEntry.total_weighted_price! += auction.accepted_price_kwh! * mwh! as any;
                existingEntry.total_accepted_price! += auction.accepted_price_kwh! as any;
                existingEntry.auction_count! += 1;
            }

            currentDate = nextDay;
        }
    }

    for (const day of data) {
        if (day.total_mwh! > 0) {
            day.weighted_avg_rs_per_kwh = day.total_weighted_price! as any / day.total_mwh!;
        }
        if (day.auction_count! > 0) {
            day.simple_avg_rs_per_kwh = day.total_accepted_price! as any / day.auction_count!;
        }
        delete day.total_weighted_price;
        delete day.total_accepted_price;
    }

    return data;
};

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

export const FormatAuctionDailyComparison = (
    {
        start_date,
        end_date,
        auctions
    }: {
        start_date: string;
        end_date: string;
        auctions: Auction[];
    
    }
): AuctionComparison[] | { error: string } | { message: string } => {
    if (!auctions || auctions.length === 0) {
        return { error: 'No auction data provided.' };
    }

    // Filter auctions based on entity and exchange type if provided
    let filteredAuctions = auctions;
    if (filteredAuctions.length === 0) {
        return { message: 'No auctions found for the given filters.' };
    }

    const data: AuctionComparison[] = [];

    for (const auction of filteredAuctions) {
        const auctionStart = new Date(Math.max(new Date(auction.delivery_start_date!).getTime(), new Date(start_date).getTime()));
        const auctionEnd = new Date(Math.min(new Date(auction.delivery_end_date!).getTime(), new Date(end_date).getTime()));
        let currentDate = auctionStart;

        while (currentDate <= auctionEnd) {
            const dayKey = currentDate.toISOString().split('T')[0];
            let existingEntry = data.find(item => item.date === dayKey);

            if (!existingEntry) {
                existingEntry = {
                    date: dayKey,
                    total_mu_iex: 0,
                    total_mu_pxil: 0,
                    total_mu_hpx: 0,
                    total_mu_deep: 0,
                    total_mu: 0,
                    total_price_rs_iex: 0,
                    total_price_rs_pxil: 0,
                    total_price_rs_hpx: 0,
                    total_price_rs_deep: 0,
                    total_price_rs: 0,
                    auction_count_iex: 0,
                    auction_count_pxil: 0,
                    auction_count_hpx: 0,
                    auction_count_deep: 0,
                    auction_count: 0,
                    weighted_avg_rs_per_kwh_iex: 0,
                    weighted_avg_rs_per_kwh_pxil: 0,  
                    weighted_avg_rs_per_kwh_hpx: 0,
                    weighted_avg_rs_per_kwh_deep: 0,
                    weighted_avg_rs_per_kwh: 0,
                    simple_avg_rs_per_kwh_iex: 0,
                    simple_avg_rs_per_kwh_pxil: 0,
                    simple_avg_rs_per_kwh_hpx: 0,
                    simple_avg_rs_per_kwh_deep: 0,
                    simple_avg_rs_per_kwh: 0,
                };
                data.push(existingEntry);
            }

            const nextDay = new Date(currentDate);
            nextDay.setDate(nextDay.getDate() + 1);
            const durationHours = calculateHoursBetween(auction.delivery_start_time!, auction.delivery_end_time!);

            const mwh = auction.allocated_quantity_mw ? auction.allocated_quantity_mw * durationHours : 0;
            if (auction.accepted_price_kwh != undefined && mwh > 0) {
                // existingEntry.total_mwh! += mwh;
                existingEntry.total_mu! += mwh / 1000;
                existingEntry.total_price_rs! += auction.accepted_price_kwh! * mwh;
                existingEntry.weighted_avg_rs_per_kwh! += auction.accepted_price_kwh! * mwh! as any;
                existingEntry.total_price_rs! += auction.accepted_price_kwh! as any;
                existingEntry.auction_count! += 1;
                if(auction.exchange_type__name === "IEX"){
                    existingEntry.total_mu_iex! += mwh / 1000;
                    existingEntry.total_price_rs_iex! += auction.accepted_price_kwh! * mwh;
                    existingEntry.auction_count_iex! += 1;
                    existingEntry.weighted_avg_rs_per_kwh_iex! += auction.accepted_price_kwh! * mwh! as any;
                    existingEntry.simple_avg_rs_per_kwh_iex! += auction.accepted_price_kwh! as any;
                }
                if(auction.exchange_type__name === "PXIL"){
                    existingEntry.total_mu_pxil! += mwh / 1000;
                    existingEntry.total_price_rs_pxil! += auction.accepted_price_kwh! * mwh;
                    existingEntry.auction_count_pxil! += 1;
                    existingEntry.weighted_avg_rs_per_kwh_pxil! += auction.accepted_price_kwh! * mwh! as any;
                    existingEntry.simple_avg_rs_per_kwh_pxil! += auction.accepted_price_kwh! as any;
                }
                if(auction.exchange_type__name === "HPX"){
                    existingEntry.total_mu_hpx! += mwh / 1000;
                    existingEntry.total_price_rs_hpx! += auction.accepted_price_kwh! * mwh;
                    existingEntry.auction_count_hpx! += 1;
                    existingEntry.weighted_avg_rs_per_kwh_hpx! += auction.accepted_price_kwh! * mwh! as any;
                    existingEntry.simple_avg_rs_per_kwh_hpx! += auction.accepted_price_kwh! as any;
                }
                if(auction.exchange_type__name === "DEEP"){
                    existingEntry.total_mu_deep! += mwh / 1000;
                    existingEntry.total_price_rs_deep! += auction.accepted_price_kwh! * mwh;
                    existingEntry.auction_count_deep! += 1;
                    existingEntry.weighted_avg_rs_per_kwh_deep! += auction.accepted_price_kwh! * mwh! as any;
                    existingEntry.simple_avg_rs_per_kwh_deep! += auction.accepted_price_kwh! as any;
                }

            }

            currentDate = nextDay;
        }
    }

    for (const day of data) {
        if (day.total_mu_iex! > 0) {
            day.weighted_avg_rs_per_kwh_iex = day.weighted_avg_rs_per_kwh_iex! / day.total_mu_iex!/ 1000;
            day.simple_avg_rs_per_kwh_iex = day.simple_avg_rs_per_kwh_iex! / day.auction_count_iex!/ 1000;
        }
        if (day.total_mu_pxil! > 0) {
            day.weighted_avg_rs_per_kwh_pxil = day.weighted_avg_rs_per_kwh_pxil! / day.total_mu_pxil!/ 1000;
            day.simple_avg_rs_per_kwh_pxil = day.simple_avg_rs_per_kwh_pxil! / day.auction_count_pxil!/ 1000;
        }
        if (day.total_mu_hpx! > 0) {
            day.weighted_avg_rs_per_kwh_hpx = day.weighted_avg_rs_per_kwh_hpx! / day.total_mu_hpx!/ 1000;
            day.simple_avg_rs_per_kwh_hpx = day.simple_avg_rs_per_kwh_hpx! / day.auction_count_hpx!/ 1000;
            
        }
        if (day.total_mu_deep! > 0) {
            day.weighted_avg_rs_per_kwh_deep = day.weighted_avg_rs_per_kwh_deep! / day.total_mu_deep!/ 1000;
            day.simple_avg_rs_per_kwh_deep = day.simple_avg_rs_per_kwh_deep! / day.auction_count_deep!/ 1000;
        }
        if (day.total_mu! > 0) {
            day.weighted_avg_rs_per_kwh = day.weighted_avg_rs_per_kwh! / day.total_mu!/ 1000;
            day.simple_avg_rs_per_kwh = day.simple_avg_rs_per_kwh! / day.auction_count!/ 1000;
        }


    }

    return data;
};



export const FormatAuctionMonthly = (
    // start_date: string,
    // end_date: string,
    // entity: string | undefined,
    // exchange_type: string | undefined,
    // auctions: Auction[]
    {
        start_date,
        end_date,
        auctions
    }: {
        start_date: string;
        end_date: string;
        entity?: string | undefined;
        exchange_type?: string | undefined;
        auctions: Auction[];
    }
): AuctionChartData[] | { error: string } | { message: string } => {
    if (!start_date || !end_date) {
        return { error: 'Start date and end date are required.' };
    }

    let startDate: Date, endDate: Date;
    try {
        startDate = new Date(start_date);
        endDate = new Date(end_date);
    } catch (error) {
        return { error: 'Invalid date format. Use YYYY-MM-DD.' };
    }

    // Filter auctions based on the provided dates
    let filteredAuctions = auctions.filter(auction => 
        new Date(auction.delivery_start_date!) <= endDate && 
        new Date(auction.delivery_end_date!) >= startDate
    );



    if (filteredAuctions.length === 0) {
        return { message: 'No auctions found for the given filters.' };
    }

    const data: AuctionChartData[] = [];

    for (const auction of filteredAuctions) {
        const auctionStart = new Date(Math.max(new Date(auction.delivery_start_date!).getTime(), startDate.getTime()));
        const auctionEnd = new Date(Math.min(new Date(auction.delivery_end_date!).getTime(), endDate.getTime()));
        let currentDate = auctionStart;

        while (currentDate <= auctionEnd) {
            const monthKey = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
            let existingEntry = data.find(item => item.date === monthKey);

            if (!existingEntry) {
                existingEntry = {
                    date: monthKey,
                    total_mwh: 0,
                    total_mu: 0,
                    total_price_rs: 0,
                    auction_count: 0,
                    weighted_avg_rs_per_kwh: 0,
                    simple_avg_rs_per_kwh: 0,
                    total_weighted_price: 0,
                    total_accepted_price: 0
                };
                data.push(existingEntry);
            }

            const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            const periodEnd = new Date(Math.min(nextMonth.getTime() - 1, auctionEnd.getTime()));
            const durationHours = calculateHoursBetween(auction.delivery_start_time!, auction.delivery_end_time!) *
                ((periodEnd.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

            const mwh = auction.allocated_quantity_mw ? auction.allocated_quantity_mw * durationHours : 0;
            if (auction.accepted_price_kwh != undefined && mwh > 0) {
                existingEntry.total_mwh! += mwh;
                existingEntry.total_mu! += mwh / 1000;
                existingEntry.total_price_rs! += auction.accepted_price_kwh! * mwh;
                existingEntry.total_weighted_price! += auction.accepted_price_kwh! * mwh as any;
                existingEntry.total_accepted_price! += auction.accepted_price_kwh as any;
                existingEntry.auction_count! += 1;
            }

            currentDate = nextMonth;
        }
    }

    for (const month of data) {
        if (month.total_mwh! > 0) {
            month.weighted_avg_rs_per_kwh = month.total_weighted_price! as any / month.total_mwh! as any;
        }
        if (month.auction_count! > 0) {
            month.simple_avg_rs_per_kwh = month.total_accepted_price! as any / month.auction_count! as any;
        }
        delete month.total_weighted_price;
        delete month.total_accepted_price;
    }

    return data;
};


export const FormatAuctionMonthlyComparison = (
    // start_date: string,
    // end_date: string,
    // entity: string | undefined,
    // exchange_type: string | undefined,
    // auctions: Auction[]
    {
        start_date,
        end_date,
        auctions
    }: {
        start_date: string;
        end_date: string;
        entity?: string | undefined;
        exchange_type?: string | undefined;
        auctions: Auction[];
    }
): AuctionComparison[] | { error: string } | { message: string } => {
    if (!start_date || !end_date) {
        return { error: 'Start date and end date are required.' };
    }

    let startDate: Date, endDate: Date;
    try {
        startDate = new Date(start_date);
        endDate = new Date(end_date);
    } catch (error) {
        return { error: 'Invalid date format. Use YYYY-MM-DD.' };
    }

    // Filter auctions based on the provided dates
    let filteredAuctions = auctions.filter(auction => 
        new Date(auction.delivery_start_date!) <= endDate && 
        new Date(auction.delivery_end_date!) >= startDate
    );



    if (filteredAuctions.length === 0) {
        return { message: 'No auctions found for the given filters.' };
    }

    const data: AuctionComparison[] = [];

    for (const auction of filteredAuctions) {
        const auctionStart = new Date(Math.max(new Date(auction.delivery_start_date!).getTime(), startDate.getTime()));
        const auctionEnd = new Date(Math.min(new Date(auction.delivery_end_date!).getTime(), endDate.getTime()));
        let currentDate = auctionStart;

        while (currentDate <= auctionEnd) {
            const monthKey = currentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
            let existingEntry = data.find(item => item.date === monthKey);

            if (!existingEntry) {
                existingEntry = {
                    date: monthKey,
                    total_mu_iex: 0,
                    total_mu_pxil: 0,
                    total_mu_hpx: 0,
                    total_mu_deep: 0,
                    total_mu: 0,
                    total_price_rs_iex: 0,
                    total_price_rs_pxil: 0,
                    total_price_rs_hpx: 0,
                    total_price_rs_deep: 0,
                    total_price_rs: 0,
                    auction_count_iex: 0,
                    auction_count_pxil: 0,
                    auction_count_hpx: 0,
                    auction_count_deep: 0,
                    auction_count: 0,
                    weighted_avg_rs_per_kwh_iex: 0,
                    weighted_avg_rs_per_kwh_pxil: 0,  
                    weighted_avg_rs_per_kwh_hpx: 0,
                    weighted_avg_rs_per_kwh_deep: 0,
                    weighted_avg_rs_per_kwh: 0,
                    simple_avg_rs_per_kwh_iex: 0,
                    simple_avg_rs_per_kwh_pxil: 0,
                    simple_avg_rs_per_kwh_hpx: 0,
                    simple_avg_rs_per_kwh_deep: 0,
                    simple_avg_rs_per_kwh: 0,
                };
                data.push(existingEntry);
            }

            const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            const periodEnd = new Date(Math.min(nextMonth.getTime() - 1, auctionEnd.getTime()));
            const durationHours = calculateHoursBetween(auction.delivery_start_time!, auction.delivery_end_time!) *
                ((periodEnd.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

            const mwh = auction.allocated_quantity_mw ? auction.allocated_quantity_mw * durationHours : 0;
            // if (auction.accepted_price_kwh != undefined && mwh > 0) {
            //     existingEntry.total_mwh! += mwh;
            //     existingEntry.total_mu! += mwh / 1000;
            //     existingEntry.total_price_rs! += auction.accepted_price_kwh! * mwh;
            //     existingEntry.total_weighted_price! += auction.accepted_price_kwh! * mwh as any;
            //     existingEntry.total_accepted_price! += auction.accepted_price_kwh as any;
            //     existingEntry.auction_count! += 1;
            // }
            if (auction.accepted_price_kwh != undefined && mwh > 0) {
                // existingEntry.total_mwh! += mwh;
                existingEntry.total_mu! += mwh / 1000;
                existingEntry.total_price_rs! += auction.accepted_price_kwh! * mwh;
                existingEntry.auction_count! += 1;
                if(auction.exchange_type__name === "IEX"){
                    existingEntry.total_mu_iex! += mwh / 1000;
                    existingEntry.total_price_rs_iex! += auction.accepted_price_kwh! * mwh;
                    existingEntry.auction_count_iex! += 1;
                    existingEntry.weighted_avg_rs_per_kwh_iex! += auction.accepted_price_kwh! * mwh! as any;
                    existingEntry.simple_avg_rs_per_kwh_iex! += auction.accepted_price_kwh! as any;
                }
                if(auction.exchange_type__name === "PXIL"){
                    existingEntry.total_mu_pxil! += mwh / 1000;
                    existingEntry.total_price_rs_pxil! += auction.accepted_price_kwh! * mwh;
                    existingEntry.auction_count_pxil! += 1;
                    existingEntry.weighted_avg_rs_per_kwh_pxil! += auction.accepted_price_kwh! * mwh! as any;
                    existingEntry.simple_avg_rs_per_kwh_pxil! += auction.accepted_price_kwh! as any;
                }
                if(auction.exchange_type__name === "HPX"){
                    existingEntry.total_mu_hpx! += mwh / 1000;
                    existingEntry.total_price_rs_hpx! += auction.accepted_price_kwh! * mwh;
                    existingEntry.auction_count_hpx! += 1;
                    existingEntry.weighted_avg_rs_per_kwh_hpx! += auction.accepted_price_kwh! * mwh! as any;
                    existingEntry.simple_avg_rs_per_kwh_hpx! += auction.accepted_price_kwh! as any;
                }
                if(auction.exchange_type__name === "DEEP"){
                    existingEntry.total_mu_deep! += mwh / 1000;
                    existingEntry.total_price_rs_deep!
                        += auction.accepted_price_kwh! * mwh;
                    existingEntry.auction_count_deep! += 1;
                    existingEntry.weighted_avg_rs_per_kwh_deep! += auction.accepted_price_kwh! * mwh! as any;
                    existingEntry.simple_avg_rs_per_kwh_deep! += auction.accepted_price_kwh! as any;
                }

            }


            currentDate = nextMonth;
        }
    }

    for (const month of data) {
        if (month.total_mu_iex! > 0) {
            month.weighted_avg_rs_per_kwh_iex = month.weighted_avg_rs_per_kwh_iex! / month.total_mu_iex!/ 1000;
            month.simple_avg_rs_per_kwh_iex = month.simple_avg_rs_per_kwh_iex! / month.auction_count_iex!/ 1000;
        }
        if (month.total_mu_pxil! > 0) {
            month.weighted_avg_rs_per_kwh_pxil = month.weighted_avg_rs_per_kwh_pxil! / month.total_mu_pxil!/ 1000;
            month.simple_avg_rs_per_kwh_pxil = month.simple_avg_rs_per_kwh_pxil! / month.auction_count_pxil!/ 1000;
        }
        if (month.total_mu_hpx! > 0) {
            month.weighted_avg_rs_per_kwh_hpx = month.weighted_avg_rs_per_kwh_hpx! / month.total_mu_hpx!/ 1000;
            month.simple_avg_rs_per_kwh_hpx = month.simple_avg_rs_per_kwh_hpx! / month.auction_count_hpx!/ 1000;
            
        }
        if (month.total_mu_deep! > 0) {
            month.weighted_avg_rs_per_kwh_deep = month.weighted_avg_rs_per_kwh_deep! / month.total_mu_deep!/ 1000;
            month.simple_avg_rs_per_kwh_deep = month.simple_avg_rs_per_kwh_deep! / month.auction_count_deep!/ 1000;
        }
        if (month.total_mu! > 0) {
            month.weighted_avg_rs_per_kwh = month.weighted_avg_rs_per_kwh! / month.total_mu!/ 1000;
            month.simple_avg_rs_per_kwh = month.simple_avg_rs_per_kwh! / month.auction_count!/ 1000;
        }
    }

    // for (const month of data) {
    //     if (month.total_mwh! > 0) {
    //         month.weighted_avg_rs_per_kwh = month.total_weighted_price! as any / month.total_mwh! as any;
    //     }
    //     if (month.auction_count! > 0) {
    //         month.simple_avg_rs_per_kwh = month.total_accepted_price! as any / month.auction_count! as any;
    //     }
    //     delete month.total_weighted_price;
    //     delete month.total_accepted_price;
    // }





    return data;
};

