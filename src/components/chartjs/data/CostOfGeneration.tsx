import ChartLabelValue from "./Model";

interface CostData {
    Cost_of_generation: string;
    Generator: string;
  }

export const DemoCostData: CostData[] = [
    {
        "Cost_of_generation": "0",
        "Generator": "APML 1200 MW"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "APML 125 MW"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "APML 1320 MW"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "APML 440 MW"
    },
    {
        "Cost_of_generation": "9.21 Rs./KWh",
        "Generator": "Bhusawal 3"
    },
    {
        "Cost_of_generation": "2.885 Rs./KWh",
        "Generator": "Bhusawal 4"
    },
    {
        "Cost_of_generation": "2.885 Rs./KWh",
        "Generator": "Bhusawal 5"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "CGPL"
    },
    {
        "Cost_of_generation": "5.81 Rs./KWh",
        "Generator": "Chandrapur 3"
    },
    {
        "Cost_of_generation": "5.81 Rs./KWh",
        "Generator": "Chandrapur 4"
    },
    {
        "Cost_of_generation": "5.81 Rs./KWh",
        "Generator": "Chandrapur 5"
    },
    {
        "Cost_of_generation": "5.81 Rs./KWh",
        "Generator": "Chandrapur 6"
    },
    {
        "Cost_of_generation": "5.81 Rs./KWh",
        "Generator": "Chandrapur 7"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "Chandrapur 8"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "Chandrapur 9"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "Dodson II"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "Emco Power"
    },
    {
        "Cost_of_generation": "9.9 Rs./KWh",
        "Generator": "GTPS Uran"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "Hydro (Ghatghar)"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "JSW"
    },
    {
        "Cost_of_generation": "1.185 Rs./KWh",
        "Generator": "Khaparkheda 1 to 4"
    },
    {
        "Cost_of_generation": "4.75 Rs./KWh",
        "Generator": "Khaparkheda 5"
    },
    {
        "Cost_of_generation": "3.99 Rs./KWh",
        "Generator": "Koradi 6"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "Koradi 9"
    },
    {
        "Cost_of_generation": "6.36 Rs./KWh",
        "Generator": "Nashik 3,4 & 5"
    },
    {
        "Cost_of_generation": "1.715 Rs./KWh",
        "Generator": "Paras 3"
    },
    {
        "Cost_of_generation": "1.715 Rs./KWh",
        "Generator": "Paras 4"
    },
    {
        "Cost_of_generation": "2.86 Rs./KWh",
        "Generator": "Parli 6"
    },
    {
        "Cost_of_generation": "2.86 Rs./KWh",
        "Generator": "Parli 7"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "Parli Replacement U 8"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "Pench"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "SSP"
    },
    {
        "Cost_of_generation": "0",
        "Generator": "Sai Wardha"
    }
]
    
  

 export function ConvertCostData(data: CostData[]): ChartLabelValue {
    const labels: string[] = [];
    const values: GLfloat[] = [];
  
    data.forEach((entry) => {
      const generator = entry.Generator;
      const costOfGenerationString = entry.Cost_of_generation;
  
      // Convert the Cost_of_generation string to a floating-point number
      const costOfGenerationValue = parseFloat(costOfGenerationString.replace(' Rs./KWh', ''));
  
      if (!isNaN(costOfGenerationValue)) {
        labels.push(generator);
        values.push(costOfGenerationValue);
      }
    });
  
    return { labels, values };
  }
  
