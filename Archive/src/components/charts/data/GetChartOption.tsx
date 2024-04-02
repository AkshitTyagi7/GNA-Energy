interface ChartOptions {
  responsive: boolean;
  plugins: {
    legend: {
      position: 'top' | 'left' | 'bottom' | 'right';
      display?: boolean;
    };
    title: {
      display: boolean;
      text: string;
    };
    tooltip?: {
      displaylegend?: boolean;
      callbacks?: {
        label: (item: any) => string;
      };
    };
  };
  scales?: {
    y?: {
      beginAtZero?: boolean;
      display?: boolean;
      title?: {
        display: boolean;
        text: string;
      };
    };

  };
}

export default function GetChartOptions({
  textTitle = '',
  displayTitle = true,
  displayLegend = true,
  isSmallLegend = false,
  displayYLabel = true,
  secondYaxis = false,
  enableZoom = true,
  yLabelText = '',
  y2LabelText = '',
  isStacked = false,
  aspectRatio ,
  fontSize,
  maintainAspectRatio = true,
  displayTooltip = true, // new option for tooltip
}: {
  textTitle?: string;
  displayTitle?: boolean;
  isSmallLegend?: boolean;
  displayLegend?: boolean;
  enableZoom?: boolean;
  displayYLabel?: boolean;
  yLabelText?: string;
  isStacked?: boolean;
  aspectRatio?: number;
  y2LabelText?: string;
  fontSize?: number;
  maintainAspectRatio?: boolean;
  secondYaxis?: boolean;
  displayTooltip?: boolean;
} = {}): ChartOptions {
  const options = {
    // aspectRatio: aspectRatio,
    maintainAspectRatio: maintainAspectRatio,
    transitions: {
      zoom: {
        animation: {
          duration: 1000,
          easing: 'easeOutCubic'
        }
      }
    },
    aspectRatio: aspectRatio,
    responsive: true,
    stacked: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: displayLegend,
        position: 'top' as const,
        labels: isSmallLegend ? {
          boxWidth: 20,
          padding: 5,
          boxheight: 5,
          // This more specific font property overrides the global property
          font: {
              size: 10
          }
      } : undefined,
      },
   zoom: {
        pan: {
            enabled: enableZoom,
            mode: 'x'
        },
        zoom: {
            pinch: {
                enabled: enableZoom       // Enable pinch zooming
            },
            
            wheel: {
                enabled: enableZoom       // Enable wheel zooming
            },
            
            mode: 'x',
        }
    },
  
      title: {
        display: displayTitle,
        text: textTitle,
        font:{
          size: fontSize,
        }
      },
      tooltip: {
        displayLegend: displayLegend,
        display: displayTooltip,
        


        callbacks: {
            label: (item:any) =>
             !secondYaxis ?   `${item.dataset.label}: ${item.formattedValue} ${yLabelText}` : `${item.dataset.label}: ${item.formattedValue}`
            ,
        } ,
    },
    },
    scales: {
      x:{
        stacked: isStacked,

      },
      y: {
        stacked: isStacked,
        display: displayYLabel,
        title: {
          
          display: displayYLabel,
          text: yLabelText,
        },
      },
      y1: {
        stacked: isStacked,
        display: secondYaxis,
        position: 'right' as const,
        title: {
          display: secondYaxis,
          text: y2LabelText,
        },


      }
      
    },
  };

  return options;
}
