import { useEffect, useState } from "react";
import { ExchangeChart } from "./Dashboard/Exchange2/Chart";
import { ExchangeData, FormatExchangeData } from "./Dashboard/Exchange2/FormatData";


export function ExchangeReCharts(){
    const [selectedProductIndex, setSelectedProductIndex] = useState<number[]>([]);
    const [iexData, setIexData] = useState<ExchangeData>(
        {
            dam:[],
            gdam:[],
            rtm:[],
            hpdam:[],
        }
    );
    const [hpxData, setHpxData] = useState<ExchangeData>(
        {
            dam:[],
            gdam:[],
            rtm:[],
            hpdam:[],
        }
    );
    const [pxilData, setPxilData] = useState<ExchangeData>(
        {
            dam:[],
            gdam:[],
            rtm:[],
            hpdam:[],
        }
    );

    useEffect(() => {
        fetchExchangeData();
    },[]);

    return (
        <div>
               <ExchangeChart data={iexData.rtm} showBrush={false} title="IEX"  />

        </div>
    )

    async function getIEXData(){

    }
    async function fetchExchangeData() {
        console.log("fetching data");
        try {
          // const response = await fetch("http://
          // if (!response.ok) {
          //   throw new Error(`HTTP error! Status: ${response.status}`);
          // }
          let startDate= "09-01-2024"
            let endDate= "11-01-2024"
          const formData = new FormData();
          formData.append('start_date', startDate);
            formData.append('end_date', endDate);
    
          const iexresponse = await fetch("https://datahub.gna.energy/exchange_analytics_api_range", {
            method: 'POST',
            body: formData,
          });
          const iexdata: any = await iexresponse.json();
          setIexData(FormatExchangeData(iexdata));
          console.log("iexdata", FormatExchangeData(iexdata));
        //   try {
        //     const pxilresponse = await fetch("https://datahub.gna.energy/pxil_exchange_analytics_api_range", {
        //       method: 'POST',
        //       body: formData,
        //     });
        //     const pXILdata: any = await pxilresponse.json();
        //     setPxilData(FormatExchangeData(pXILdata));
        //   }
        //   catch (error) {
        //     console.log("This is the error in fetching the api of pxildata - ", error);
        //     setPxilData(FormatExchangeData([]));
        //   }
    
        //   try {
        //     const hpxresponse = await fetch("https://datahub.gna.energy/hpx_exchange_analytics_api_range", {
        //       method: 'POST',
        //       body: formData,
        //     });
    
        //     const hPAdata: any = await hpxresponse.json();
        //     setHpxData(FormatExchangeData(hPAdata));
        //   } catch (error) {
        //     console.log("This is the error in fetching the api of hpxdata - ", error);
        //     setHpxData(FormatExchangeData([]));
        //   }
    
          setSelectedProductIndex([0, 1, 2, 3]);
    
    
    
    
        }
        catch (error) {
          console.error("Error fetching data:", error);
            setIexData(FormatExchangeData([]));
            setPxilData(FormatExchangeData([]));
            setHpxData(FormatExchangeData([]));

          setSelectedProductIndex([]);
        }
      }
}


