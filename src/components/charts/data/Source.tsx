import ChartLabelValue from "./Model";

interface SourceData {
    Generator: string;
    source: string;
  }
  
export const DemoSourceData: SourceData[] = [
    {
        "Generator": "APML 1200 MW",
        "source": "Thermal"
    },
    {
        "Generator": "APML 125 MW",
        "source": "Thermal"
    },
    {
        "Generator": "APML 1320 MW",
        "source": "Thermal"
    },
    {
        "Generator": "APML 440 MW",
        "source": "Thermal"
    },
    {
        "Generator": "Bhusawal 3",
        "source": "Thermal"
    },
    {
        "Generator": "Bhusawal 4",
        "source": "Thermal"
    },
    {
        "Generator": "Bhusawal 5",
        "source": "Thermal"
    },
    {
        "Generator": "CGPL",
        "source": "Thermal"
    },
    {
        "Generator": "Chandrapur 3",
        "source": "Thermal"
    },
    {
        "Generator": "Chandrapur 4",
        "source": "Thermal"
    },
    {
        "Generator": "Chandrapur 5",
        "source": "Thermal"
    },
    {
        "Generator": "Chandrapur 6",
        "source": "Thermal"
    },
    {
        "Generator": "Chandrapur 7",
        "source": "Thermal"
    },
    {
        "Generator": "Chandrapur 8",
        "source": "Thermal"
    },
    {
        "Generator": "Chandrapur 9",
        "source": "Thermal"
    },
    {
        "Generator": "Dodson II",
        "source": "Hydro"
    },
    {
        "Generator": "Emco Power",
        "source": "Thermal"
    },
    {
        "Generator": "GTPS Uran",
        "source": "Gas"
    },
    {
        "Generator": "Hydro (Ghatghar)",
        "source": "Hydro"
    },
    {
        "Generator": "JSW",
        "source": "Thermal"
    },
    {
        "Generator": "Khaparkheda 1 to 4",
        "source": "Thermal"
    },
    {
        "Generator": "Khaparkheda 5",
        "source": "Thermal"
    },
    {
        "Generator": "Koradi 6",
        "source": "Thermal"
    },
    {
        "Generator": "Koradi 9",
        "source": "Thermal"
    },
    {
        "Generator": "Nashik 3,4 & 5",
        "source": "Thermal"
    },
    {
        "Generator": "Paras 3",
        "source": "Thermal"
    },
    {
        "Generator": "Paras 4",
        "source": "Thermal"
    },
    {
        "Generator": "Parli 6",
        "source": "Thermal"
    },
    {
        "Generator": "Parli 7",
        "source": "Thermal"
    },
    {
        "Generator": "Parli Replacement U 8",
        "source": "Thermal"
    },
    {
        "Generator": "Pench",
        "source": "Hydro"
    },
    {
        "Generator": "SSP",
        "source": "Hydro"
    },
    {
        "Generator": "Sai Wardha",
        "source": "Thermal"
    }
]
  
  function ConvertSourceDataToChart(data: SourceData[]): ChartLabelValue {
    const sourceCount: { [key: string]: number } = {};
    const labels: string[] = [];
    const values: GLfloat[] = [];
    const backgroundColor: string[] = [];
  
    data.forEach((entry) => {
      const source = entry.source;
  
      // If the source is not in sourceCount, initialize it with 1; otherwise, increment the count
      sourceCount[source] = (sourceCount[source] || 0) + 1;
    });
  
    // Populate labels and values arrays
    Object.keys(sourceCount).forEach((source) => {
      labels.push(source);
      values.push(sourceCount[source]);
      // Optional: You can set background colors here if needed
      // backgroundColor.push("#RRGGBB"); // Replace with actual color codes
    });
  
    return { labels, values, backgroundColor };
  }
  
  // Given source data
  const sourceData: SourceData[] = [
    // ... (as provided in the question)
  ];
  
  // Count the occurrences of each source
  const chartData: ChartLabelValue = ConvertSourceDataToChart(sourceData);
  
  // Output the result
  console.log("Labels:", chartData.labels);
  console.log("Values:", chartData.values);
  console.log("Background Colors:", chartData.backgroundColor);

export default ConvertSourceDataToChart;