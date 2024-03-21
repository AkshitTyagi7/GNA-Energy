// import { Chart } from "chart.js";
import ChartLabelValue from "./Model";

export const DemoWeightedAvg= [
    {
        "Generator": "APML 1200 MW",
        "weighted_avg": "0"
    },
    {
        "Generator": "APML 125 MW",
        "weighted_avg": "0"
    },
    {
        "Generator": "APML 1320 MW",
        "weighted_avg": "0"
    },
    {
        "Generator": "APML 440 MW",
        "weighted_avg": "0"
    },
    {
        "Generator": "Bhusawal 3",
        "weighted_avg": "7204.77 nan"
    },
    {
        "Generator": "Bhusawal 4",
        "weighted_avg": "3202.24 nan"
    },
    {
        "Generator": "Bhusawal 5",
        "weighted_avg": "3202.24 nan"
    },
    {
        "Generator": "CGPL",
        "weighted_avg": "0"
    },
    {
        "Generator": "Chandrapur 3",
        "weighted_avg": "6071.87 nan"
    },
    {
        "Generator": "Chandrapur 4",
        "weighted_avg": "6071.87 nan"
    },
    {
        "Generator": "Chandrapur 5",
        "weighted_avg": "6071.87 nan"
    },
    {
        "Generator": "Chandrapur 6",
        "weighted_avg": "6071.87 nan"
    },
    {
        "Generator": "Chandrapur 7",
        "weighted_avg": "6071.87 nan"
    },
    {
        "Generator": "Chandrapur 8",
        "weighted_avg": "0"
    },
    {
        "Generator": "Chandrapur 9",
        "weighted_avg": "0"
    },
    {
        "Generator": "Dodson II",
        "weighted_avg": "0"
    },
    {
        "Generator": "Emco Power",
        "weighted_avg": "0"
    },
    {
        "Generator": "GTPS Uran",
        "weighted_avg": "nan nan"
    },
    {
        "Generator": "Hydro (Ghatghar)",
        "weighted_avg": "0"
    },
    {
        "Generator": "JSW",
        "weighted_avg": "0"
    },
    {
        "Generator": "Khaparkheda 1 to 4",
        "weighted_avg": "1165.01 nan"
    },
    {
        "Generator": "Khaparkheda 5",
        "weighted_avg": "5354.67 nan"
    },
    {
        "Generator": "Koradi 6",
        "weighted_avg": "4003.9 nan"
    },
    {
        "Generator": "Koradi 9",
        "weighted_avg": "0"
    },
    {
        "Generator": "Nashik 3,4 & 5",
        "weighted_avg": "6189.75 nan"
    },
    {
        "Generator": "Paras 3",
        "weighted_avg": "2062.14 nan"
    },
    {
        "Generator": "Paras 4",
        "weighted_avg": "2062.14 nan"
    },
    {
        "Generator": "Parli 6",
        "weighted_avg": "2950.305 nan"
    },
    {
        "Generator": "Parli 7",
        "weighted_avg": "2950.305 nan"
    },
    {
        "Generator": "Parli Replacement U 8",
        "weighted_avg": "0"
    },
    {
        "Generator": "Pench",
        "weighted_avg": "0"
    },
    {
        "Generator": "SSP",
        "weighted_avg": "0"
    },
    {
        "Generator": "Sai Wardha",
        "weighted_avg": "0"
    }
]

export function ConvertWeightedAvgData(data: any[]): ChartLabelValue {
    const labels: string[] = [];
    const values: GLfloat[] = [];
  
    data.forEach((entry) => {
      const generator = entry.Generator;
      const weightedAvgString = entry.weighted_avg;
  
      // Convert the weighted_avg string to a floating-point number
      const weightedAvgValue = parseFloat(weightedAvgString.replace(' nan', ''));
  
      if (!isNaN(weightedAvgValue)) {
        labels.push(generator);
        values.push(weightedAvgValue);
      }
    });
  
    return { labels, values };
  }

export default function GetWeightedAvgData(): ChartLabelValue {
    return ConvertWeightedAvgData(DemoWeightedAvg);
  }