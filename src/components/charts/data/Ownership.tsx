import ChartLabelValue from "./Model";

interface OwnershipData {
    Generator: string;
    ownership: string;
  }

let DemoOwnershipData= [
    {
        "Generator": "APML 1200 MW",
        "ownership": "IPP"
    },
    {
        "Generator": "APML 125 MW",
        "ownership": "IPP"
    },
    {
        "Generator": "APML 1320 MW",
        "ownership": "IPP"
    },
    {
        "Generator": "APML 440 MW",
        "ownership": "IPP"
    },
    {
        "Generator": "Bhusawal 3",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Bhusawal 4",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Bhusawal 5",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "CGPL",
        "ownership": "IPP"
    },
    {
        "Generator": "Chandrapur 3",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Chandrapur 4",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Chandrapur 5",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Chandrapur 6",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Chandrapur 7",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Chandrapur 8",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Chandrapur 9",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Dodson II",
        "ownership": "State - Dodson"
    },
    {
        "Generator": "Emco Power",
        "ownership": "IPP"
    },
    {
        "Generator": "GTPS Uran",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Hydro (Ghatghar)",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "JSW",
        "ownership": "IPP"
    },
    {
        "Generator": "Khaparkheda 1 to 4",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Khaparkheda 5",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Koradi 6",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Koradi 9",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Nashik 3,4 & 5",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Paras 3",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Paras 4",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Parli 6",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Parli 7",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Parli Replacement U 8",
        "ownership": "State - MSPGCL"
    },
    {
        "Generator": "Pench",
        "ownership": "Others"
    },
    {
        "Generator": "SSP",
        "ownership": "Others"
    },
    {
        "Generator": "Sai Wardha",
        "ownership": "IPP"
    }
]

  
 export default function ConvertOwnershipData(data: OwnershipData[]): ChartLabelValue {
    const ownershipCount: { [key: string]: number } = {};
    const labels: string[] = [];
    const values: GLfloat[] = [];
    // Optional: You can uncomment the line below and set background colors if needed
    // const backgroundColor: string[] = [];
    
    data.forEach((entry) => {
      const ownership = entry.ownership;
    
      // If the ownership is not in ownershipCount, initialize it with 1; otherwise, increment the count
      ownershipCount[ownership] = (ownershipCount[ownership] || 0) + 1;
    });
    
    // Populate labels and values arrays
    Object.keys(ownershipCount).forEach((ownership) => {
      labels.push(ownership);
      values.push(ownershipCount[ownership]);
      // Optional: You can set background colors here if needed
      // backgroundColor.push("#RRGGBB"); // Replace with actual color codes
    });
    
    return { labels, values /*, backgroundColor */ };
  }
  
  // Usage
  const ownershipChartData: ChartLabelValue = ConvertOwnershipData(DemoOwnershipData);
  console.log("Labels:", ownershipChartData.labels);
  console.log("Values:", ownershipChartData.values);
  // Optional: console.log("Background Colors:", ownershipChartData.backgroundColor);
  