import Chart from 'react-apexcharts';
import { DemoExchangeData } from './Dashboard/Analytics/Exchange/DemoExchangeData';
import { ExchangeChartData, FormatExchangeData } from './Dashboard/Analytics/Exchange/ExchangeData';
export function DemoPage(){
    let DemoData: ExchangeChartData[]=FormatExchangeData(DemoExchangeData.data)
    let series: ApexAxisChartSeries = [
          
      {
        name: 'Purchase Bids',
        type: 'line',
        // decimalsInFloat: 2,
        data: DemoData[0].prchsBids.map((bid, index) =>parseFloat( bid.toFixed(2)))

      },
      {
        name: "Sell Bids",
        type: 'line',
        data: DemoData[0].SellBids.map((bid, index) =>parseFloat(bid.toFixed(2)))
      },
      {
        name: "WeightedMCP",
        type: 'column',
        data: DemoData[0].wtMcp.map((bid, index) =>parseFloat(bid.toFixed(2)))
      },
    ]
    let options: ApexCharts.ApexOptions = {
        chart: {
          id: "chart1",
          type: "line",
          stacked: true,
          zoom: {
            autoScaleYaxis: true,
            type: 'xy',
          }
        },
        dataLabels: {
          enabled: false
        },
        yaxis: [
            {
              seriesName: 'Column A',
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
              },
              title: {
                text: "Columns"
              }
            },
            {
              seriesName: 'Column A',
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
          categories: DemoData[0].date.map((date, index) => (index+1).toString()).slice(0, 96),
          min:1,
          
          max:50,
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
        }
      }

      let options2: any = {
        chart: {
          id: "chart2",
          type: "line",
          stacked: false,
          brush: {
            target: "chart1",
            enabled: true,
            
          },
          selection: {
            enabled: true,
            fill: {
              color: "#fff",
              opacity: 0.4
            },
            xaxis: {
              min: 1,
              max: 20
            }
          }
        },
      
        dataLabels: {
          enabled: false
        },
        yaxis: [
            {
              seriesName: 'Column A',
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
              },
              title: {
                text: "Columns"
              }
            },
            {
              seriesName: 'Column A',
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
        data: DemoData[0].date.map((date, index) => (index+1).toString()).slice(0, 96), 

        xaxis: {
          categories: DemoData[0].date.map((date, index) => (index+1).toString()).slice(0, 96),
          min:1,
          labels: {
            type: "datetime",
            show: true,
            formatter: function (val: any, index: any) {

              if(val ==='1'){
                return val;
              }
              if(val === '50'){
                return '23-10-2022'
              }
              if (val ==='96') {
                return val;
              } 
              
              else {
                return'';
              }
            }
          },
          // show axis a at a distance of 20 units from the x axis

          max:96,

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
        }
      }



    return (
        <div>
            <Chart options={options} series={series} className="apexchart" height={350} />
            {/* <Chart options={options} series={series} className="apexchart" height={350} /> */}

            <Chart options={options2} series={series} className="apexchart" height={150} />
        </div>
    );
}