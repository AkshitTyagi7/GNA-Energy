import { ExchangeData } from "../../../pages/Dashboard/Exchange3/FormatData"

export interface ExchangeState{

    Exchange: {
        data:{
        iex: ExchangeData;
        hpx: ExchangeData;
        pxil: ExchangeData;
    }
    selectedExchange: number;
    selectedProduct: number;
    selectedRegion: string[];

};
page: number;
}

export interface ExchangeStateData{
    iex: ExchangeData;
    hpx: ExchangeData;
    pxil: ExchangeData;
}

export const initialExchangeState: ExchangeState = {
    Exchange: {
        data: {
            iex: {
                dam: [],
                gdam: [],
                rtm: [],
                hpdam: [],
            },
            hpx: {
                dam: [],
                gdam: [],
                rtm: [],
                hpdam: [],
                },
                pxil: {
                    dam: [],
                    gdam: [],
                    rtm: [],
                    hpdam: [],
                
            },
            },
        

        selectedExchange:0,
        selectedProduct: 0,
        selectedRegion: [],

    }
    ,
    page: 0
}