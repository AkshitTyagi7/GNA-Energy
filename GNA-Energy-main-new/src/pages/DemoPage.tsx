import Chart from 'react-apexcharts';
import { DemoExchangeData } from './Dashboard/Analytics/Exchange/DemoExchangeData';
import { ExchangeChartData, FormatExchangeData } from './Dashboard/Analytics/Exchange/ExchangeData';
export function DemoPage(){
    let DemoData: ExchangeChartData[]=FormatExchangeData(DemoExchangeData.data)
    let options: ApexCharts.ApexOptions = {
        chart: {
          type: "line",
          stacked: false
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
          width: [4, 4, 4]
        },

        xaxis: {
          categories: DemoData[0].date.map((date, index) => (index+1).toString()).slice(0, 96),
        },

        tooltip: {
          shared: true,
          x: {
            show: true
          }
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40
        }
      }

    let series: ApexAxisChartSeries = [
          
        {
          name: 'Purchase Bids',
          type: 'line',
          data: DemoData[0].prchsBids

        },
        {
          name: "Sell Bids",
          type: 'line',
          data: DemoData[0].sellingBids
        },
        {
          name: "WeightedMCP",
          type: 'line',
          data: DemoData[0].wtMcp
        },
      ]

    return (
        <div>
            <Chart options={options} series={series} className="apexchart" />
        </div>
    );
}