import { useEffect } from "react";
import { PowerBiFrame } from "../../../components/frame";
import { DemoExchangeData } from "./DemoExchangeData";
import { FormatMarketMonitoringData } from "./FormatData";

export function MarketMontoring () {
  useEffect
  (() => {
  console.log(  FormatMarketMonitoringData(DemoExchangeData));
    

  },[]);
    return (
      PowerBiFrame
      ({
        url:"https://app.powerbi.com/view?r=eyJrIjoiZTI0Yzc5YjktMGRlOC00ZDkxLWFmYzktMGFlZDRiNTAxYzdlIiwidCI6IjdhN2NhNjdjLWFlMGEtNGZkMy04ZGRkLThjNDgwZTBmYjM1ZSJ9"
      }));
  }