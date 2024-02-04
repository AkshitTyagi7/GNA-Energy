import {
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  Brush,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";
import { DemoExchangeData, Exchange, Markets, Products } from "./DemoExchangeData";
import { ChartExchangeItem, FormatMarketMonitoringData } from "./FormatData";
import { filters } from "./Filters";
import { Color1, ColorBlue, ColorRed, ColorYellow, PrimaryColor, QuaternaryColor, SecondaryColor, TertiaryColor, buildHttpReq } from "../../../common";
import { IdTitle, SubMenu } from "../../../components/SubMenu";
import { useEffect, useState } from "react";
import { ReactComponent as UpIcon } from "../../../icons/up.svg";
import { ReactComponent as DownIcon } from "../../../icons/down.svg";
import "./MarketMonitoring.css";
import React from "react";
import Select from "react-select";
import { MediumButton } from "../../../components/Button";
let selectedMarket: string[] = [];
let selectedExchange: string[] = [];
let selectedProduct: string[] = [];
export function BetaMarketMontoring() {
  const [productData, setProductData] = useState<ChartExchangeItem[]>([]);
  const [priceData, setPriceData] = useState<ChartExchangeItem[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(
    "Exchange"
  );

  

  const optionStyle = {
   
        
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      // height: '80px',
      maxHeight: '80px',
      padding: '6px 6px',
      overflow:'scroll'
    }),

    input: (provided: any, state: any) => ({
      ...provided,
      margin: '0px',

    }),
    indicatorSeparator: (state: any) => ({

    }),
    indicatorsContainer: (provided: any, state: any) => ({
      ...provided,
      // height: '30px',


    }),
   }

  const [selectedSubFilter, setSelectedSubFilter] = React.useState<IdTitle[]>([filters[0].subfilter[0]]);
   useEffect(() => {
    fetchData({exchange: selectedExchange, market: selectedMarket, product: selectedProduct});
  }, [])
  return (
    <>
            <div className="flex  w-full space-x-2 mt-2">
            <Select 
            placeholder="Select Market"
            className="searchSelect"
            closeMenuOnSelect={false}
            isMulti
            styles={optionStyle}

            onChange={(selectedOption) => {
                selectedMarket = selectedOption.map((item) => item.value);
                fetchData({exchange: selectedExchange, market: selectedMarket, product: selectedProduct});

            }}
      
            
            options={Markets.map((item) => {
                return {
                    value: item,
                    label: item
                }
            })}
            />
            <Select 
            placeholder="Select Exchange"
            className="searchSelect"
            styles={optionStyle}

            closeMenuOnSelect={false}
            isMulti
            options={Exchange.map((item) => {
                return {
                    value: item,
                    label: item
                }
            })}
            onChange={(selectedOption) => {
                selectedExchange = selectedOption.map((item) => item.value);
                fetchData({exchange: selectedExchange, market: selectedMarket, product: selectedProduct});

            }}
            />
            <Select
            placeholder="Select Product"
           className="searchSelect"
           styles={optionStyle}
           isMulti
           onChange={(selectedOption) => {
            selectedProduct = selectedOption.map((item) => item.value);
            fetchData({exchange: selectedExchange, market: selectedMarket, product: selectedProduct});
           }}
            closeMenuOnSelect={false}
            options={
                Products.map((item) => {
                    return {
                        value: item,
                        label: item
                    }
                })
            } />
        </div>
      <div className="marketMonitorkingBody justify-between">
        <div className="">
                <div style={{}}>
                    <div className="flex justify-between">
                        <h2 className="text-2xl">Market Monitoring</h2>
                  <div>
                    <MediumButton buttonTitle="By Product" onClick={()=>{
                      setTabIndex(0);
                    }} isActive={tabIndex==0}/>
                    <MediumButton buttonTitle="By Price" onClick={()=>{
                      setTabIndex(1);
                    }} isActive={tabIndex==1}/>
                    </div></div>

                  
  
   </div>
   </div>

        <ResponsiveContainer width={"98%"}>
          <ResponsiveContainer >
            <ComposedChart data={
              tabIndex == 0 ? productData : priceData
            }>
              <CartesianGrid strokeDasharray="20 20" />

              <XAxis dataKey="month" fontSize={12} />
              <YAxis />
              <Line strokeWidth={3} type="monotone" dataKey="dam" stroke={PrimaryColor} />
              <Line strokeWidth={3} type="monotone" dataKey="rtm" stroke={SecondaryColor} />
              <Line strokeWidth={3} type="monotone" dataKey="gdam" stroke={ColorBlue} />
              <Line strokeWidth={3} type="monotone" dataKey="intraDay" stroke={QuaternaryColor}/>
              <Line
              strokeWidth={3} 
                type="monotone"
                dataKey="contingencyContracts"
                stroke="#82ca9d"
              />
              <Line strokeWidth={3} type="monotone" dataKey="daily" stroke={
                Color1
              } />
              <Line strokeWidth={3} type="monotone" dataKey="weekly" stroke={
                ColorRed
              } />
              <Line strokeWidth={3} type="monotone" dataKey="monthly" stroke={ColorRed} />
              <Line strokeWidth={3} type="monotone" dataKey="anyDay" stroke={ColorYellow}/>
              <Line strokeWidth={3} type="monotone" dataKey="singleSided" stroke="#82ca9d" />
              <Brush
                dataKey="month"
                height={30}
                stroke="#8884d8"
                // startIndex={
                //   data.length > 0 ? data.length - 11 : 0
                // }
                // endIndex={
                //   data.length > 0 ? data.length - 1 : 0
                // }
              />
              <Legend verticalAlign="top"/>
              <Tooltip />
            </ComposedChart>
          </ResponsiveContainer>
        </ResponsiveContainer>
      </div>
    </>
  );

  async function fetchData(
    {exchange, market, product}: {exchange: string[], market: string[], product: string[]}
  ){
   const res= await buildHttpReq({
      endpoint:"market_monitoring_volume_api",
      method: "POST",
      body:{
        exchange: exchange.toString(),
        market: market.toString(),
        product: product.toString()
      }
  })

  console.log("Chart Data = ",FormatMarketMonitoringData(res));
  setProductData(FormatMarketMonitoringData(res));
  
  const byPrice= await buildHttpReq({
    endpoint:"market_monitoring_price_api",
    method: "POST",
    body:{
      exchange: exchange.toString(),
      market: market.toString(),
      product: product.toString()
    }
  })
  setPriceData(FormatMarketMonitoringData(byPrice));
}






}

