import ChartLabelValue from "./Model";

export const DemoEnergyData=[
    {
        "Energy_charge": 0,
        "Generator": "APML 1200 MW"
    },
    {
        "Energy_charge": 0,
        "Generator": "APML 125 MW"
    },
    {
        "Energy_charge": 0,
        "Generator": "APML 1320 MW"
    },
    {
        "Energy_charge": 0,
        "Generator": "APML 440 MW"
    },
    {
        "Energy_charge": "11.33 Rs./kWh",
        "Generator": "Bhusawal 3"
    },
    {
        "Energy_charge": "3.095 Rs./kWh",
        "Generator": "Bhusawal 4"
    },
    {
        "Energy_charge": "3.095 Rs./kWh",
        "Generator": "Bhusawal 5"
    },
    {
        "Energy_charge": 0,
        "Generator": "CGPL"
    },
    {
        "Energy_charge": "6.59 Rs./kWh",
        "Generator": "Chandrapur 3"
    },
    {
        "Energy_charge": "6.59 Rs./kWh",
        "Generator": "Chandrapur 4"
    },
    {
        "Energy_charge": "6.59 Rs./kWh",
        "Generator": "Chandrapur 5"
    },
    {
        "Energy_charge": "6.59 Rs./kWh",
        "Generator": "Chandrapur 6"
    },
    {
        "Energy_charge": "6.59 Rs./kWh",
        "Generator": "Chandrapur 7"
    },
    {
        "Energy_charge": 0,
        "Generator": "Chandrapur 8"
    },
    {
        "Energy_charge": 0,
        "Generator": "Chandrapur 9"
    },
    {
        "Energy_charge": 0,
        "Generator": "Dodson II"
    },
    {
        "Energy_charge": 0,
        "Generator": "Emco Power"
    },
    {
        "Energy_charge": "10.11 Rs./kWh",
        "Generator": "GTPS Uran"
    },
    {
        "Energy_charge": 0,
        "Generator": "Hydro (Ghatghar)"
    },
    {
        "Energy_charge": 0,
        "Generator": "JSW"
    },
    {
        "Energy_charge": "1.3425 Rs./kWh",
        "Generator": "Khaparkheda 1 to 4"
    },
    {
        "Energy_charge": "5.07 Rs./kWh",
        "Generator": "Khaparkheda 5"
    },
    {
        "Energy_charge": "4.57 Rs./kWh",
        "Generator": "Koradi 6"
    },
    {
        "Energy_charge": 0,
        "Generator": "Koradi 9"
    },
    {
        "Energy_charge": "7.34 Rs./kWh",
        "Generator": "Nashik 3,4 & 5"
    },
    {
        "Energy_charge": "1.963 Rs./kWh",
        "Generator": "Paras 3"
    },
    {
        "Energy_charge": "1.963 Rs./kWh",
        "Generator": "Paras 4"
    },
    {
        "Energy_charge": "3.275 Rs./kWh",
        "Generator": "Parli 6"
    },
    {
        "Energy_charge": "3.275 Rs./kWh",
        "Generator": "Parli 7"
    },
    {
        "Energy_charge": 0,
        "Generator": "Parli Replacement U 8"
    },
    {
        "Energy_charge": 0,
        "Generator": "Pench"
    },
    {
        "Energy_charge": 0,
        "Generator": "SSP"
    },
    {
        "Energy_charge": 0,
        "Generator": "Sai Wardha"
    }
];



export function ConvertEnergyData(data: any[]): ChartLabelValue {
    const labels: string[] = [];
    const values: GLfloat[] = [];
  
    data.forEach((entry) => {
      const generator = entry.Generator;
      const energyCharge = entry.Energy_charge;
  
      const energyChargeValue = parseFloat(energyCharge);
      if (!isNaN(energyChargeValue)) {
        labels.push(generator);
        values.push(energyChargeValue);
      }
    });
  
    return { labels, values };
  }

    export default function GetEnergyData(): ChartLabelValue {
        return ConvertEnergyData(DemoEnergyData);
    }

console.log(GetEnergyData());