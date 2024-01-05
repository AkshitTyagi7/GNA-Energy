import ChartLabelValue from "./Model";

interface PPAData {
    Generator: string;
    ppa: string;
  }
  
 let demoPPA= [
    {
        "Generator": "APML 1200 MW",
        "ppa": "Y"
    },
    {
        "Generator": "APML 125 MW",
        "ppa": "Y"
    },
    {
        "Generator": "APML 1320 MW",
        "ppa": "Y"
    },
    {
        "Generator": "APML 440 MW",
        "ppa": "Y"
    },
    {
        "Generator": "Bhusawal 3",
        "ppa": "Y"
    },
    {
        "Generator": "Bhusawal 4",
        "ppa": "Y"
    },
    {
        "Generator": "Bhusawal 5",
        "ppa": "Y"
    },
    {
        "Generator": "CGPL",
        "ppa": "Y"
    },
    {
        "Generator": "Chandrapur 3",
        "ppa": "Y"
    },
    {
        "Generator": "Chandrapur 4",
        "ppa": "Y"
    },
    {
        "Generator": "Chandrapur 5",
        "ppa": "Y"
    },
    {
        "Generator": "Chandrapur 6",
        "ppa": "Y"
    },
    {
        "Generator": "Chandrapur 7",
        "ppa": "Y"
    },
    {
        "Generator": "Chandrapur 8",
        "ppa": "Y"
    },
    {
        "Generator": "Chandrapur 9",
        "ppa": "Y"
    },
    {
        "Generator": "Dodson II",
        "ppa": "Y"
    },
    {
        "Generator": "Emco Power",
        "ppa": "Y"
    },
    {
        "Generator": "GTPS Uran",
        "ppa": "Y"
    },
    {
        "Generator": "Hydro (Ghatghar)",
        "ppa": "Y"
    },
    {
        "Generator": "JSW",
        "ppa": "Y"
    },
    {
        "Generator": "Khaparkheda 1 to 4",
        "ppa": "Y"
    },
    {
        "Generator": "Khaparkheda 5",
        "ppa": "Y"
    },
    {
        "Generator": "Koradi 6",
        "ppa": "Y"
    },
    {
        "Generator": "Koradi 9",
        "ppa": "Y"
    },
    {
        "Generator": "Nashik 3,4 & 5",
        "ppa": "Y"
    },
    {
        "Generator": "Paras 3",
        "ppa": "Y"
    },
    {
        "Generator": "Paras 4",
        "ppa": "Y"
    },
    {
        "Generator": "Parli 6",
        "ppa": "Y"
    },
    {
        "Generator": "Parli 7",
        "ppa": "Y"
    },
    {
        "Generator": "Parli Replacement U 8",
        "ppa": "Y"
    },
    {
        "Generator": "Pench",
        "ppa": "Y"
    },
    {
        "Generator": "SSP",
        "ppa": "Y"
    },
    {
        "Generator": "Sai Wardha",
        "ppa": "Y"
    }
]

  
 export default function ConvertPPAData(data: PPAData[]): ChartLabelValue {
    const labels: string[] = ["PPA", "Non-PPA"];
    const values: GLfloat[] = [0, 0];
  
    data.forEach((entry) => {
      const isPPA = entry.ppa === "Y";
      isPPA ? (values[0] += 1) : (values[1] += 1);
    });
  
    return { labels, values };
  }
  
  // Usage
const ppaChartData: ChartLabelValue = ConvertPPAData(demoPPA);
console.log("Labels:", ppaChartData.labels);
console.log("Values:", ppaChartData.values);
  