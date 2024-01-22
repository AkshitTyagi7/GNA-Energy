import Chart from 'react-apexcharts';
import { DemoExchangeData } from './Dashboard/Analytics/Exchange/DemoExchangeData';
import { ExchangeChartData, FormatExchangeData } from './Dashboard/Analytics/Exchange/ExchangeData';
import { CreateApexOption } from './Dashboard/Analytics/Exchange/Options';
import { count } from 'console';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { MediumButton } from '../components/Button';
import { JsxElement } from 'typescript';
import { XAxisOption } from './ApexOptions';
interface SharedBrushState {
  selected: boolean;
  range: {
    start: number | null;
    end: number | null;
  };
}
export function DemoPage() {
  const [xmax, setXmax] = useState<number>(90);
  const [xmin, setXmin] = useState<number>(1);
  const chartRef:any = useRef(null);




  useEffect(() => {
    scrollingChart().then((chart) => {
    });
  }
    , []);
  let DemoData: ExchangeChartData[] = FormatExchangeData(DemoExchangeData.data)



  let series: ApexAxisChartSeries = [
    {
      name: 'Purchase Bids',
      type: 'line',
      // decimalsInFloat: 2,
      data: DemoData[0].prchsBids.map((bid, index) => parseFloat(bid.toFixed(2))).concat(DemoData[0].prchsBids.map((bid, index) => parseFloat(bid.toFixed(2))))

    },
    {
      name: "Sell Bids",
      type: 'line',
      data: DemoData[0].SellBids.map((bid, index) => parseFloat(bid.toFixed(2))).concat(DemoData[0].SellBids.map((bid, index) => parseFloat(bid.toFixed(2))))
    },
    {
      name: "WeightedMCP",
      type: 'column',
      data: DemoData[0].wtMcp.map((bid, index) => parseFloat(bid.toFixed(2))).concat(DemoData[0].wtMcp.map((bid, index) => parseFloat(bid.toFixed(2))))
    },
  ];
  let chart1 = <Chart
  ref={chartRef}
  options={
    options({ count: 4, length: series[0].data.length, id: 'chart1' })
  } series={
    series
  }
    className="apexchart" height={350} width={600} />

    let chart2 = <Chart options={
      options({ count: 4, length: series[0].data.length, id: 'chart2' })
    } series={
      series
    }
      className="apexchart" height={350} width={600} />


  function options({ id, count, length, brush = false, target }: { id: string, count: number, length: number, brush?: boolean, target?: string }): ApexCharts.ApexOptions {


    return {
      chart: {
        id: id,
        group:!brush ? "exchange" : "",
        height: 350,
        zoom: {
          autoScaleYaxis: true
        },
        events: {
          selection: function (chartContext, { xaxis, yaxis }) {

            const chartInstance = chartRef.current.chart;
        

            brush ? 
               chartInstance.updateOptions({
                id:"chart1",
              xaxis: XAxisOption({ categories:  DemoData[0].date.map((date, index) => (index + 1).toString()).slice(0, 96).concat
                (DemoData[0].date.map((date, index) => (index + 1).toString()).slice(0, 96)), brush: false, xmin: xaxis.min, xmax: xaxis.max, length: length, space: count }),
            }): console.log("Brush is not enabled")
     
            ;
          }
        },
        brush: {
          target: 'chart1',
          enabled: brush,

        },

        selection: {
          enabled: true,
          fill: {
            color: "#fff",
            opacity: 0.4
          },
          xaxis: {
            min: 1,
            max: 96
          }
        }
      },

      xaxis: XAxisOption({ categories: DemoData[0].date.map((date, index) => (index + 1).toString()).slice(0, 96).concat
(DemoData[0].date.map((date, index) => (index + 1).toString()).slice(0, 96)), brush: brush, xmin: xmin, xmax: xmax, length: length, space: count }),
    }
  }



  return (
    <div>

      <div className="flex justify-center">

       {chart1}
      {chart2}

  {

  }


      </div>
  {chart2}
      <Chart options={
        options({ count: 4, length: series[0].data.length, id: 'chart3', brush: true})
      } series={
        series
      } className="apexchart" height={350} width={"100%"} />




    </div>
  );
  async function scrollingChart(): Promise<ReactElement> {
    //sleep for 5 seconds
    await new Promise(r => setTimeout(r, 1000));
    return <Chart options={
      options({ count: 4, length: series[0].data.length, id: 'chart2', target: 'chart1', brush: true })
    } series={
      series
    } className="apexchart" height={350} width={"100%"} />
  }
}