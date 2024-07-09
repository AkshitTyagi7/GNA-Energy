import { ReChartData } from "../models/chart_model";
import { ApiResponse } from "../models/csrc";


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

    return data as any;

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
        const response = await fetch("https://api-data.gna.energy/data/latest-aggregated-day-data/");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Error fetching data');
    }
};

export default fetchLatestAggregatedDayData;

export async function fetchPSPData() {
    const response = await fetch("https://datahub.gna.energy/power_supply_api", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await response.json();
    return data;
}