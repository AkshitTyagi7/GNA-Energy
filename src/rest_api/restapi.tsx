import { buildHttpResponse, HttpMethod } from "./network_utility";
import { ReChartData } from "../models/chart_model";
import { AuctionChartData } from "../models/auction";
 import { ApiResponse } from "../models/api_res";

export async function login(email: string): Promise<ApiResponse> {
    const response =await buildHttpResponse({ 
        endPoint: 'user/login/',
        method: HttpMethod.POST,
        body: {
            email: email
        }
    } )
    return response as ApiResponse;
}

export async function verifyOtp(email: string, otp: string): Promise<ApiResponse> {
    const response = await buildHttpResponse({
        endPoint: 'user/verify_otp/',
        method: HttpMethod.POST,
        body: {
            email: email,
            otp: otp
        }
    })
    return response as ApiResponse;
}

export async function checkAccess(accessKey: string): Promise<ApiResponse> {
    const response = await buildHttpResponse({
        endPoint: 'user/check_access/',
        method: HttpMethod.POST,
        body: {
            access_key: accessKey
        }
    })
    return response as ApiResponse;
}

export async function getSessionValidity(): Promise<ApiResponse> {
    const response = await buildHttpResponse({
        endPoint: 'user/get_session_validity/',
        method: HttpMethod.GET
    })
    return response as ApiResponse;
}

export async function fetchExchangeSlotData({
    exchange,
    product,
    slot,
    date,
  }: {
    exchange: string;
    product: string;
    slot: string;
    date: string;
  }){
    console.log("fetchExchangeSlotData", exchange, product, slot, date);
    const response =  await buildHttpResponse({
        endPoint: "data/getTopBuySellData/",
        method: HttpMethod.POST,
        body: {
            "exchanges": [exchange],
            "products": [product],
            "time_slots": [slot],
            "start_date": date,
            "end_date": date,
                }
  })
    return response;
}

export async function fetchExchangeComparisonData(body: any) {
    const response = await buildHttpResponse({
        endPoint: "data/multipleDateRangeExchangeData/",
        method: HttpMethod.POST,
        body:body
    })
    return response;
    }

export async function fetchAllExchangeData(start_date: string, end_date: string){
    const response = await buildHttpResponse({
        endPoint: `data/getData?start_date=${start_date}&end_date=${end_date}`,
        method: HttpMethod.GET
    })
    return response;

}

export async function getEntityComparisont({
    entityid,
    exchange,
    startDate,
    endDate
}:{
    entityid: number,
    exchange: string,
    startDate: string,
    endDate: string
}) : Promise<
    
     ReChartData[]
       
    
> {

    const response = await fetch("https://api-data.gna.energy/data/getSlotWiseAggregatedEntityData/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        // {
        //     "start_date": "2023-01-01",
        //     "end_date": "2023-12-31",
        //     "exchange": "IEX",
        //     "entitity_id": 3027
        // }
        body: JSON.stringify({
            'start_date': startDate,
            'end_date': endDate,
            'exchange': exchange,
            'entitity_id': entityid
        })
    });
        // body: {
        //     'start_date': startDate,
        //     'end_date': endDate,
        //     'exchange': exchange,
        //     'entity_id': entityid
        // }
    const data = await response.json();

    return data.data as any;

}

export async function getEntitys(){
    const response = await fetch("https://api-data.gna.energy/data/getEntitys", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data: {
      data:{  id: number,
        name: string}[]
    } = await response.json();
    
    const res = data.data.map((d) => {
        return {
            value: d.id,
            name: d.name
        }
    })
    return res;
}


const fetchLatestAggregatedDayData = async () => {
    try {
        const response = await buildHttpResponse({
            endPoint: 'data/latest-aggregated-day-data/',
            method: HttpMethod.GET
        });
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Error fetching data');
    }
};

export default fetchLatestAggregatedDayData;

export async function fetchPSPData() {
    const response = await buildHttpResponse({
        endPoint: 'data/power_supply_api',
        method: HttpMethod.POST
    })
    return response;
}

export async function fetchDailyAuctionData({start_date, end_date, exchange, entity_id}:{
    start_date: string,
    end_date: string,
    exchange?: string,
    entity_id?: number
}): Promise<AuctionChartData[]> {
    const response = await buildHttpResponse({endPoint:`data/auction-daily-api?start_date=${start_date}&end_date=${end_date}&exchange_type=${exchange}`,method: HttpMethod.GET});
    return response as AuctionChartData[];
}

export async function fetchMonthlyAuctionData({start_date, end_date, exchange, entity_id}:{
    start_date: string,
    end_date: string,
    exchange?: string,
    entity_id?: number
}): Promise<AuctionChartData[]> {
    const response = await buildHttpResponse({endPoint:`data/auction-monthly-api?start_date=${start_date}&end_date=${end_date}&exchange_type=${exchange}`, method:HttpMethod.GET});
    return response as AuctionChartData[];
}

 