import Chart from 'react-apexcharts';
import { ExchangeChartData } from './ExchangeData';

export function CreateExchangeSeries({ChartData}:{
    ChartData:ExchangeChartData,
    index:number
}): ApexAxisChartSeries{
    let series: ApexAxisChartSeries = [
        {
          name: 'Purchase Bids',
          type: 'line',
          // decimalsInFloat: 2,
          data: ChartData.prchsBids.map((bid, index) =>parseFloat( bid.toFixed(2)))
    
        },
        {
          name: "Sell Bids",
          type: 'line',
          data: ChartData.SellBids.map((bid, index) =>parseFloat(bid.toFixed(2)))
        },
        {
          name: "WeightedMCP",
          type: 'column',
          data: ChartData.wtMcp.map((bid, index) =>parseFloat(bid.toFixed(2)))
        },
      ]
      return series;
}

export function CreateApexOption({
    id,
    labels    ,
    
}:{
    id:string,
    labels:string[],

}): ApexCharts.ApexOptions {
    const options: ApexCharts.ApexOptions = {
        
        chart: {
            
          id: id,
          type: "line",
          stacked: true,
          events: {
            zoomed: function (chartContext, { xaxis, yaxis }) {

                const ticks=chartContext.xaxis?.tickAmount
                console.log("Number of ticks - ",ticks)

                const newTickCount=()=>{ 
                    if(xaxis.max+1-xaxis.min<24){
                        return xaxis.max+1-xaxis.min
                    }
                    else{
                        return 23
                    }
                }
                console.log("New tick count - ",newTickCount())

                
                console.log(xaxis)
               chartContext.updateOptions({
                xaxis:{
                    
                        tickAmount:newTickCount(),
                    
                }
               });
            },
          },
          zoom: {
            autoScaleYaxis: true,

            type: 'x',

            
          }
        },
        dataLabels: {
          enabled: false
        },
        yaxis: [
            {
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
              },
           
            },
            {
              show: false
            }, {
              opposite: true,
              seriesName: 'Weighted MCP',
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
              },
              title: {
                text: "WeightedMCP"
              }
            }
          ],
        stroke: {
          width: [4, 4, 8]
        },

        xaxis: {
            
            type:"category",
            // Hide overlapping labels


          categories: labels,
          min:1,
          
          max:96,
        title:{
            text:"Time Slots",
            style:{
                fontSize:"20px"
            }
        }
        },
        

        tooltip: {
          shared: true,
          x: {
            show: true,
          
          }
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40
        },
  
      }
      

      return options;
}