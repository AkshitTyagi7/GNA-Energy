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
  displayYLabel = true,
  yLabelText = '',
  displayTooltip = true, // new option for tooltip
}: {
  textTitle?: string;
  displayTitle?: boolean;
  displayLegend?: boolean;
  displayYLabel?: boolean;
  yLabelText?: string;
  displayTooltip?: boolean;
} = {}): ChartOptions {
  const options = {
    
    responsive: true,
    plugins: {
      legend: {
        display: displayLegend,
        position: 'top' as const,
      },
      title: {
        display: displayTitle,
        text: textTitle,
      },
      tooltip: {
        displayLegend: displayLegend,
        callbacks: {
            label: (item:any) =>
                `${item.dataset.label}: ${item.formattedValue} ${yLabelText}`,
        },
    },
    },
    scales: {
      y: {
        display: displayYLabel,
        title: {
          display: displayYLabel,
          text: yLabelText,
        },
      },
    },
  };

  return options;
}
