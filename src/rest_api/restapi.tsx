import { ReChartData } from "../models/chart_model";


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