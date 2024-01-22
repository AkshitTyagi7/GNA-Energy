import React, { useEffect, useState } from "react";
import './Exchange.css'
import { Line } from "react-chartjs-2";
import { BarChart, LineChart, MixChart, RawLineChart } from "../../../../components/charts/Charts";
import { RealTimeData } from "./DemoData";
import GetChartOptions from "../../../../components/charts/data/GetChartOption";
import { title } from "process";
import { MediumButton, SmallButton } from "../../../../components/Button";
import { DemoExchangeData } from "./DemoExchangeData";
import { PrimaryColor, QuaternaryColor, SecondaryColor, TertiaryColor } from "../../../../common";
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart as ChartJS } from 'chart.js';
import { COST_MU, COST_UNIT, ENERGY_UNIT, MEGA_POWER_UNIT } from "../../../../Units";
import { Navigate, Route, Routes } from "react-router-dom";
import { ExchangeChartData, FormatExchangeData, RealTimeChartData, formatRealTimeChartData } from "./ExchangeData";
ChartJS.register(zoomPlugin);



function Exchange() {
  const [RealTimeChartData, setRealTimeChartData] = useState<RealTimeChartData[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [realTimechartIndex, setRealtimeChartIndex] = useState<number>(1);

  const [IexChartData, setIexChartData] = useState<ExchangeChartData[]>([]);

  const [pXILChartData, setPXILChartData] = useState<ExchangeChartData[]>([]);
  const [hPAChartData, setHPAChartData] = useState<ExchangeChartData[]>([]);
  const [byProductIndex, setByProductIndex] = useState<number>(0);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number[]>([]);
  const [byExchangeIndex, setByExchangeIndex] = useState<number>(0);
  const maxDate = new Date(new Date().getTime() - (0 * 24 * 60 * 60 * 1000));
  const [date, setDate] = useState(new Date(new Date().getTime() - (0 * 24 * 60 * 60 * 1000)));
  useEffect(() => {

    fetchExchangeData(
      // get days in this format "03-01-2024"

      // new Date().toLocaleDateString('en-GB').split('/').reverse().join('-')
      // Get the date of 7 days ago
      new Date(new Date().getTime() - (15 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-GB').split('/').join('-')

    );
    fetchRealTimeData();
  }, []);

  return (

    <div>
      <div className="flex flex-row justify-between">
        <div className="flex mt-4 space-x-3 h-10">
          <MediumButton buttonTitle="Realtime" isActive={pageIndex === 0} onClick={() => setPageIndex(0)} />
          <MediumButton buttonTitle="By Product" isActive={pageIndex === 1} onClick={() => setPageIndex(1)} />
          <MediumButton buttonTitle="By Exchange" isActive={pageIndex === 2} onClick={() => setPageIndex(2)} />
          <MediumButton buttonTitle="Compare" isActive={pageIndex === 3} onClick={() => setPageIndex(3)} />
        </div>
        {
          pageIndex !== 0 &&
          <input type="date" className="mt-4 mr-5 p-2 br-20 rounded-lg" max={maxDate.toLocaleDateString('en-GB').split('/').reverse().join('-')} value={date.toLocaleDateString('en-GB').split('/').reverse().join('-')} onChange={(e) => {

            setDate(e.target.valueAsDate!);

            fetchExchangeData(e.target.value.split('-').reverse().join('-'));

          }} />
        }
      </div>
      <div>
        {pageIndex === 0 &&
          <div className="p-5">
            <div className="justify-between container-chart">
              <div className="flex flex-row justify-between">
                <div className="text-2xl text-center mb-2">Real Time Data</div>
                <div className="">
                  {
                    RealTimeChartData.map((data, index) => {
                      return <MediumButton onClick={() => setRealtimeChartIndex(index)} buttonTitle={data.title} isActive={index === realTimechartIndex} />
                    })}
                    
                </div>
              </div>


              <div className="realtime-container">

                <div className="flex justify-center realTimeChart text-center  w-full content-center">
                  <RawLineChart data={
                    RealTimeChartData.length > 0 ? RealTimeChartData[realTimechartIndex!].data : { labels: [], datasets: [] }} options={GetChartOptions(
                      { textTitle: RealTimeChartData.length > 0 ? `${RealTimeChartData[realTimechartIndex!].title} Prices (Rs/KWH)` : '', displayTitle: true, displayLegend: true, displayYLabel: true, yLabelText: "Rs/kWh", fontSize: 20, maintainAspectRatio: false, enableZoom: false }
                    )} />
                </div></div>
            </div></div>
        }

        {pageIndex === 1 &&
          <div className="p-5">
            <div className="flex flex-row justify-between">
              <div className="text-2xl text-center">Price and Volume by Product</div>
              <div className="mt-2">
                {
                  IexChartData.map((data, index) => {
                    return <SmallButton onClick={() => setByProductIndex(index)} buttonTitle={data.title.toUpperCase()} isActive={index === byProductIndex} />
                  })}
              </div>
            </div>
            <div className="w-full h-1/3 exchangeChart">
              <MixChart data={
                PrepareExchangeDataSet({
                  labels: IexChartData.length > 0 ? IexChartData[byProductIndex!].date : [],
                  SellBids: IexChartData.length > 0 ? IexChartData[byProductIndex!].SellBids : [],
                  prchsBids: IexChartData.length > 0 ? IexChartData[byProductIndex!].prchsBids : [],
                  wtMcp: IexChartData.length > 0 ? IexChartData[byProductIndex!].wtMcp : []
                })}
                options={
                  PrepareExchangeChartOptions("IEX")


                } />
            </div>
            <div className="relative w-full h-full exchangeChart mt-5" >
              <MixChart data={
                PrepareExchangeDataSet({
                  labels: pXILChartData.length > 0 ? pXILChartData[byProductIndex!].date : [],
                  SellBids: pXILChartData.length > 0 ? pXILChartData[byProductIndex!].SellBids : [],
                  prchsBids: pXILChartData.length > 0 ? pXILChartData[byProductIndex!].prchsBids : [],
                  wtMcp: pXILChartData.length > 0 ? pXILChartData[byProductIndex!].wtMcp : []
                })}

                options={
                  PrepareExchangeChartOptions("PXIL")

                } />
            </div>
            <div className="w-full exchangeChart mt-5">
              <MixChart data={
                PrepareExchangeDataSet({
                  labels: hPAChartData.length > 0 ? hPAChartData[byProductIndex!].date : [],
                  SellBids: hPAChartData.length > 0 ? hPAChartData[byProductIndex!].SellBids : [],
                  prchsBids: hPAChartData.length > 0 ? hPAChartData[byProductIndex!].prchsBids : [],
                  wtMcp: hPAChartData.length > 0 ? hPAChartData[byProductIndex!].wtMcp : []
                })}

                options={
                  PrepareExchangeChartOptions("HPX")


                } />
            </div>


          </div>
        }

        {pageIndex === 2 &&
          <div className="p-5">
            <div className="flex flex-row justify-between">
              <div className="text-2xl text-center">Price and Volume by Exchange</div>
              <div className="mt-2">
                <SmallButton buttonTitle="IEX" isActive={
                  byExchangeIndex === 0
                } onClick={() => { setByExchangeIndex(0); }} />
                <SmallButton buttonTitle="PXIL" isActive={
                  byExchangeIndex === 1

                } onClick={() => { setByExchangeIndex(1) }} />
                <SmallButton buttonTitle="HPX" isActive={
                  byExchangeIndex === 2
                } onClick={() => { setByExchangeIndex(2) }} />
              </div>



            </div>
            <div className="grid grid-cols-2 gap-4">
              {
                selectedByExchange().map((data, index) => {
                  {
                    return (
                      <div className="exchangeChart byExchange">
                        <MixChart data={
                          PrepareExchangeDataSet({
                            labels: data.date,
                            SellBids: data.SellBids,
                            prchsBids: data.prchsBids,
                            wtMcp: data.wtMcp
                          })}
                          options={
                            PrepareExchangeChartOptions(data.title.toUpperCase())
                          } />
                      </div>
                    )


                  }
                }
                )

              }
            </div>
          </div>
        }

        {pageIndex === 3 &&
          <div className="p-5">
            <div className="flex flex-row justify-center">
              {
                IexChartData.map((data, index) => {
                  return <SmallButton onClick={() => {
                    if (selectedProductIndex.includes(index)) {
                      setSelectedProductIndex(selectedProductIndex.filter((item) => item !== index));
                    }
                    else {
                      setSelectedProductIndex([...selectedProductIndex, index]);
                    }
                  }} buttonTitle={data.title.toUpperCase()} isActive={
                    selectedProductIndex.includes(index)
                  } />
                })}
            </div>
            <div className="w-full h-1/3 exchangeChart">

              <BarChart
                isRawData={true}
                data={{
                  labels: IexChartData.length > 0 ? IexChartData[byProductIndex!].date.map((label: any, index: any) => (index + 1).toString()) : [],
                  datasets: [
                    {
                      label: "IEX",
                      data: addFloatList(...selectedProductIndex.map((index) => IexChartData[index].SellBids)),
                      backgroundColor: PrimaryColor,
                    },
                    {
                      label: "PXIL",
                      // create a new list by adding the values of the same index of all the lists
                      data: addFloatList(...selectedProductIndex.map((index) => pXILChartData[index].SellBids)),
                      backgroundColor: SecondaryColor,
                    },
                    {
                      label: "HPX",
                      data: addFloatList(...selectedProductIndex.map((index) => hPAChartData[index].SellBids)),
                      backgroundColor: QuaternaryColor,
                    },

                  ]
                }}
                options={GetChartOptions(
                  { textTitle: "Sell Bids", isStacked: true, displayTitle: true, displayLegend: true, displayYLabel: true, yLabelText: `MW`, fontSize: 20, maintainAspectRatio: false, enableZoom: false }
                )} />


            </div>
            <div className="w-full h-1/3 exchangeChart">
              <BarChart
                isRawData={true}
                data={{
                  labels: IexChartData.length > 0 ? IexChartData[byProductIndex!].date.map((label: any, index: any) => (index + 1).toString()) : [],
                  datasets: [
                    {
                      label: "IEX",
                      data: addFloatList(...selectedProductIndex.map((index) => IexChartData[index].prchsBids)),
                      backgroundColor: PrimaryColor,
                    },
                    {
                      label: "PXIL",
                      data: addFloatList(...selectedProductIndex.map((index) => pXILChartData[index].prchsBids)),
                      backgroundColor: SecondaryColor,
                    }
                    ,
                    {
                      label: "HPX",
                      data: addFloatList(...selectedProductIndex.map((index) => hPAChartData[index].prchsBids)),
                      backgroundColor: QuaternaryColor,
                    },


                  ]
                }}
                options={GetChartOptions(
                  { textTitle: "Purchase Bids", isStacked: true, displayTitle: true, displayLegend: true, displayYLabel: true, yLabelText: `MW`, fontSize: 20, maintainAspectRatio: false, enableZoom: false }
                )} />


            </div>
            <div className="w-full h-1/3 exchangeChart">
              <BarChart
                isRawData={true}
                data={{
                  labels: IexChartData.length > 0 ? IexChartData[byProductIndex!].date.map((label: any, index: any) => (index + 1).toString()) : [],
                  datasets: [
                    {
                      label: "IEX",
                      data: addFloatList(...selectedProductIndex.map((index) => IexChartData[index].wtMcp)),
                      backgroundColor: PrimaryColor,
                    },
                    {
                      label: "PXIL",
                      data: addFloatList(...selectedProductIndex.map((index) => pXILChartData[index].wtMcp)),
                      backgroundColor: SecondaryColor,
                    }
                    ,
                    {
                      label: "HPX",
                      data: addFloatList(...selectedProductIndex.map((index) => hPAChartData[index].wtMcp)),
                      backgroundColor: QuaternaryColor,
                    },

                  ]
                }}
                options={GetChartOptions(
                  { textTitle: `Weighted MCP (${COST_MU})`, isStacked: true, displayTitle: true, displayLegend: true, displayYLabel: true, yLabelText: `Weighted MCP (${COST_MU})`, fontSize: 20, maintainAspectRatio: false, enableZoom: false }
                )} />


            </div>
          </div>}



      </div>
    </div>

  );

  function selectedByExchange(): ExchangeChartData[] {
    switch (byExchangeIndex) {
      case 0:
        return IexChartData;
      case 1:
        return pXILChartData;
      case 2:
        return hPAChartData;
      default:
        return IexChartData;
    }
  }



  async function fetchExchangeData(date: string) {
    console.log("fetching data");
    try {
      // const response = await fetch("http://
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      const formData = new FormData();
      formData.append('date', date);

      const iexresponse = await fetch("http://13.233.117.192/exchange_analytics_api", {
        method: 'POST',
        body: formData,
      });
      const iexdata: any = await iexresponse.json();
      setIexChartData(FormatExchangeData(iexdata.data));
      try {
        const pxilresponse = await fetch("http://13.233.117.192/pxil_exchange_analytics_api", {
          method: 'POST',
          body: formData,
        });
        const pXILdata: any = await pxilresponse.json();
        setPXILChartData(FormatExchangeData(pXILdata.data));
      }
      catch (error) {
        console.log("This is the error in fetching the api of pxildata - ", error);
        setPXILChartData(FormatExchangeData(DemoExchangeData.data));
      }

      try {
        const hpxresponse = await fetch("http://13.233.117.192/hpx_exchange_analytics_api", {
          method: 'POST',
          body: formData,
        });

        const hPAdata: any = await hpxresponse.json();
        setHPAChartData(FormatExchangeData(hPAdata.data));
      } catch (error) {
        console.log("This is the error in fetching the api of hpxdata - ", error);
        setHPAChartData(FormatExchangeData(iexdata.data));
      }

      setSelectedProductIndex([0, 1, 2, 3]);




    }
    catch (error) {
      console.error("Error fetching data:", error);
    }
  }



  async function fetchRealTimeData() {
    console.log("fetching data");
    try {
      const response = await fetch("http://13.233.117.192/rtm_api");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: any = await response.json();
      // const data = RealTimeData as any;
      const temp: RealTimeChartData[] = [];
      Object.keys(data).forEach((key: string) => {
        console.log(key, data[key]);
        const formattedData = formatRealTimeChartData(data[key], key);
        temp.push(formattedData);
      }

      );
      setRealTimeChartData(temp);

      console.log("data");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
};



const PrepareExchangeChartOptions = (textTitle: string) => {
  return GetChartOptions(
    { textTitle: textTitle, fontSize: 20, displayTitle: true, displayLegend: true, displayYLabel: true, yLabelText: `Weighted MCP (${COST_MU})`, y2LabelText: 'MW', secondYaxis: true, maintainAspectRatio: false }
  )
}

const PrepareExchangeDataSet = ({ labels, SellBids, prchsBids, wtMcp }: { labels: any, SellBids: number[], prchsBids: number[], wtMcp: number[] }) => {
  return {
    labels: labels.map((label: any, index: any) => (index+1).toString()),
    datasets: [
      {
        type: 'line' as const,
        label: `Sell Bids (${MEGA_POWER_UNIT})`,
        data: SellBids,
        backgroundColor: QuaternaryColor,
        yAxisID: 'y1',

        borderColor: QuaternaryColor,
      },
      {
        type: 'line' as const,
        label: `Purchase Bids (${MEGA_POWER_UNIT})`,
        data: prchsBids,
        backgroundColor: PrimaryColor,
        yAxisID: 'y1',

        borderColor: PrimaryColor,
      },
      {
        label: `Price (${COST_MU})`,
        data: wtMcp,
        yAxisID: 'y',
        backgroundColor: SecondaryColor,
        borderColor: SecondaryColor,
      },
    ],
  }

}

// Function to add n number of float lists
const addFloatList = (...lists: number[][]) => {
  const result: number[] = [];
  lists.forEach((list) => {
    list.forEach((item, index) => {
      if (result.length <= index) {
        result.push(item);
      }
      else {
        result[index] += item;
      }
    })
  })
  return result;
}


export default Exchange;


