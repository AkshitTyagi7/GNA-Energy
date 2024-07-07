let DemoNetChargeData=[
    {
        "Generator": "APML 1200 MW",
        "Net_generation": "0"
    },
    {
        "Generator": "APML 125 MW",
        "Net_generation": "0"
    },
    {
        "Generator": "APML 1320 MW",
        "Net_generation": "0"
    },
    {
        "Generator": "APML 440 MW",
        "Net_generation": "0"
    },
    {
        "Generator": "Bhusawal 3",
        "Net_generation": "26.46 MU"
    },
    {
        "Generator": "Bhusawal 4",
        "Net_generation": "221.485 MU"
    },
    {
        "Generator": "Bhusawal 5",
        "Net_generation": "221.485 MU"
    },
    {
        "Generator": "CGPL",
        "Net_generation": "0"
    },
    {
        "Generator": "Chandrapur 3",
        "Net_generation": "651.56 MU"
    },
    {
        "Generator": "Chandrapur 4",
        "Net_generation": "651.56 MU"
    },
    {
        "Generator": "Chandrapur 5",
        "Net_generation": "651.56 MU"
    },
    {
        "Generator": "Chandrapur 6",
        "Net_generation": "651.56 MU"
    },
    {
        "Generator": "Chandrapur 7",
        "Net_generation": "651.56 MU"
    },
    {
        "Generator": "Chandrapur 8",
        "Net_generation": "0"
    },
    {
        "Generator": "Chandrapur 9",
        "Net_generation": "0"
    },
    {
        "Generator": "Dodson II",
        "Net_generation": "0"
    },
    {
        "Generator": "Emco Power",
        "Net_generation": "0"
    },
    {
        "Generator": "GTPS Uran",
        "Net_generation": "67.16 MU"
    },
    {
        "Generator": "Hydro (Ghatghar)",
        "Net_generation": "0"
    },
    {
        "Generator": "JSW",
        "Net_generation": "0"
    },
    {
        "Generator": "Khaparkheda 1 to 4",
        "Net_generation": "82.825 MU"
    },
    {
        "Generator": "Khaparkheda 5",
        "Net_generation": "237.85 MU"
    },
    {
        "Generator": "Koradi 6",
        "Net_generation": "71.62 MU"
    },
    {
        "Generator": "Koradi 9",
        "Net_generation": "0"
    },
    {
        "Generator": "Nashik 3,4 & 5",
        "Net_generation": "157.98 MU"
    },
    {
        "Generator": "Paras 3",
        "Net_generation": "59.6 MU"
    },
    {
        "Generator": "Paras 4",
        "Net_generation": "59.6 MU"
    },
    {
        "Generator": "Parli 6",
        "Net_generation": "83.245 MU"
    },
    {
        "Generator": "Parli 7",
        "Net_generation": "83.245 MU"
    },
    {
        "Generator": "Parli Replacement U 8",
        "Net_generation": "0"
    },
    {
        "Generator": "Pench",
        "Net_generation": "0"
    },
    {
        "Generator": "SSP",
        "Net_generation": "0"
    },
    {
        "Generator": "Sai Wardha",
        "Net_generation": "0"
    }
]

interface NetGenerationData {
    Generator: string;
    Net_generation: string;
  }
  
  interface ChartLabelValue {
    labels: string[];
    values: GLfloat[];
    backgroundColor?: string[];
  }
  
 export function ConvertNetGenerationData(data: NetGenerationData[]): ChartLabelValue {
    const labels: string[] = [];
    const values: GLfloat[] = [];
  
    data.forEach((entry) => {
      const generator = entry.Generator;
      const netGeneration = parseFloat(entry.Net_generation.replace(" MU", ""));
  
      if (!isNaN(netGeneration)) {
        labels.push(generator);
        values.push(netGeneration);
      }
    });
  
    return { labels, values };
  }
  
  // Usage
  const netGenerationChartData: ChartLabelValue = ConvertNetGenerationData(DemoNetChargeData);
