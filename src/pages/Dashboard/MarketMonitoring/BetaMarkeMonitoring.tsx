import {
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  Brush,
  Tooltip,
  Legend
} from "recharts";
import { DemoExchangeData, Exchange, Markets, Products } from "./DemoExchangeData";
import { ChartExchangeItem, FormatMarketMonitoringData } from "./FormatData";
import { filters } from "./Filters";
import { Color1, ColorBlue, ColorRed, ColorYellow, PrimaryColor, QuaternaryColor, SecondaryColor, TertiaryColor } from "../../../common";
import { IdTitle, SubMenu } from "../../../components/SubMenu";
import { useState } from "react";
import { ReactComponent as UpIcon } from "../../../icons/up.svg";
import { ReactComponent as DownIcon } from "../../../icons/down.svg";
import "./MarketMonitoring.css";
import React from "react";
import Select from "react-select";
import { MediumButton } from "../../../components/Button";

export function BetaMarketMontoring() {
  const data: ChartExchangeItem[] =
    FormatMarketMonitoringData(DemoExchangeData);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(
    "Exchange"
  );
  const [selectedSubFilter, setSelectedSubFilter] = React.useState<IdTitle[] >([filters[0].subfilter[0]]);

  return (
    <>
            <div className="flex  w-full space-x-2 mt-2">
            <Select 
            placeholder="Select Market"
            className="searchSelect"
            closeMenuOnSelect={false}
            isMulti
      
            
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
            closeMenuOnSelect={false}
            isMulti
            options={Exchange.map((item) => {
                return {
                    value: item,
                    label: item
                }
            })}
            />
            <Select
            placeholder="Select Product"
           className="searchSelect"
           isMulti
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

                {/* <div
                  className="filterItem flex justify-between align-middle"
                  onClick={() => {
                    setSelectedFilter(
                      selectedFilter === filterItem.name ? null : filterItem.name
                    );
                  }}
                  style={{
                    background: PrimaryColor,
                    color: "white",
                  }}
                >
                  {filterItem.name}
                  {selectedFilter === filterItem.name ? (
                    <UpIcon width={20} height={20} className="whiteIcon" />
                  ) : (
                    <DownIcon width={15} height={15} className="whiteIcon" />
                  )}
                </div> */}
                <div style={{}}>
                    <div className="flex justify-between">
                        <h2 className="text-2xl">Market Monitoring</h2>
                  <div>
                    <MediumButton buttonTitle="By Product" onClick={()=>{}} isActive={true}/>
                    <MediumButton buttonTitle="By Price" onClick={()=>{}} isActive={false}/>
                    </div></div>
                    {/* {
                        filterItem.subfilter.map((subfilterItem) => {
                            return (
                                <SubMenu
                                    item={subfilterItem}
                                    onSelected={(item: IdTitle) => {
                                        selectedSubFilter?.filter((item) => item!.id === subfilterItem!.id)!.length > 0 ? setSelectedSubFilter(selectedSubFilter?.filter((item) => item!.id !== subfilterItem!.id)) : setSelectedSubFilter([...selectedSubFilter!, subfilterItem]);
                                        // setSelectedSubFilter();
                                    }}
                                    isSelected={selectedSubFilter?.filter((item) => item!.id === subfilterItem!.id)!.length > 0 ? true : false}
                                />
                            );
                        })
                    } */}
                  
  
   </div>
   </div>

        <ResponsiveContainer width={"98%"}>
          <ResponsiveContainer width="98%" height={"90%"}>
            <ComposedChart data={data}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis />
              {/* <Line strokeWidth={3} type="monotone" dataKey="dam" stroke={PrimaryColor} /> */}
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
                startIndex={0}
                endIndex={10}
              />
              <Legend verticalAlign="top"/>
              <Tooltip />
            </ComposedChart>
          </ResponsiveContainer>
        </ResponsiveContainer>
      </div>
    </>
  );
}
