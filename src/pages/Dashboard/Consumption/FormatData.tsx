import state from "sweetalert/typings/modules/state";

export interface ChartConsumptionData {
  date: string[];
  data: any[];
  states: {
    name: string;
    color: string;
  }[];
}
export function FormatConsumptionData(data: any): ChartConsumptionData {
  let finalChartConsumptionData: ChartConsumptionData = {
    date: [],
    data: [],
    states: [],
  };
  let formattedData: any = {};
  for (let i = 0; i < data.length; i++) {
    if (Object.keys(formattedData).includes(data[i].states)) {
      formattedData[data[i].states].push(data[i]);
    } else {
      formattedData[data[i].states] = [data[i]];
      finalChartConsumptionData.states.push({
        name: data[i].states,
        color: ConsumptionColors[finalChartConsumptionData.states.length],
      });
    }
    if (finalChartConsumptionData.date.indexOf(data[i].date) === -1) {
      finalChartConsumptionData.date.push(data[i].date);
    }
  }
  Object.keys(formattedData).forEach((key) => {
    for (let i = 0; i < formattedData[key].length; i++) {
      let dataIndex = finalChartConsumptionData.data.findIndex(
        (item) => item.date === formattedData[key][i].date
      );
      if (dataIndex !== -1) {
        finalChartConsumptionData.data[dataIndex][`${key}_peakDemand`] =
          parseFloat(formattedData[key][i].max_demand_met_during_the_day_mw);
        finalChartConsumptionData.data[dataIndex][`${key}_energyMet`] =
          parseFloat(formattedData[key][i].energy_met_mu);
      } else {
        finalChartConsumptionData.data.push({
          date: formattedData[key][i].date,
          [`${key}_peakDemand`]: parseFloat(
            formattedData[key][i].max_demand_met_during_the_day_mw
          ),
          [`${key}_energyMet`]: parseFloat(formattedData[key][i].energy_met_mu),
        });
      }
    }
  });
  finalChartConsumptionData.date.sort((a: any, b: any) => {
    const dateA = parseDate(a);
    const dateB = parseDate(b);

    return dateA.getTime() - dateB.getTime();
  });
  // sort states by the alphabetical order
  finalChartConsumptionData.states.sort((a, b) => a.name.localeCompare(b.name));
  return finalChartConsumptionData;
}

export interface ChartOutageData {
  date: string[];
  data: any[];
  region: {
    name: string;
    color: string;
  }[];
}

export function FormatOutageData(data: any): ChartOutageData {
  let finalOutageData: ChartOutageData = {
    date: [],
    data: [],
    region: [],
  };
  let formattedData: any = {};

  for (let i = 0; i < data.length; i++) {
    if (Object.keys(formattedData).includes(data[i].region)) {
      formattedData[data[i].region].push(data[i]);
    } else {
      formattedData[data[i].region] = [data[i]];
      finalOutageData.region.push({
        name: data[i].region,
        color: ConsumptionColors[finalOutageData.region.length],
      });
    }
    if (finalOutageData.date.indexOf(data[i].date) === -1) {
      finalOutageData.date.push(data[i].date);
    }
  }
  Object.keys(formattedData).forEach((key) => {
    for (let i = 0; i < formattedData[key].length; i++) {
      let dataIndex = finalOutageData.data.findIndex(
        (item) => item.date === formattedData[key][i].date
      );
      if (dataIndex !== -1) {
        finalOutageData.data[dataIndex][`${key}_stateSector`] = parseFloat(
          formattedData[key][i].state_sector
        );
        finalOutageData.data[dataIndex][`${key}_centralSector`] = parseFloat(
          formattedData[key][i].central_sector
        );
      } else {
        finalOutageData.data.push({
          date: formattedData[key][i].date,
          [`${key}_stateSector`]: parseFloat(
            formattedData[key][i].state_sector
          ),
          [`${key}_centralSector`]: parseFloat(
            formattedData[key][i].central_sector
          ),
        });
      }
    }
  });

  finalOutageData.date.sort((a: any, b: any) => {
    const dateA = parseDate(a);
    const dateB = parseDate(b);

    return dateA.getTime() - dateB.getTime();
  });
  return finalOutageData;
}

const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Dates
};

interface OutageAggregateData {
  date: string;
  stateSector: number;
  centralSector: number;
}

export const aggreageOutageData = (
  data: ChartOutageData,
  selectedRegion: string[]
) => {
  let aggregatedData: OutageAggregateData[] = [];

  for (let i = 0; i < data.data.length; i++) {
    let stateSector = 0;
    let centralSector = 0;
    Object.keys(data.data[i]).forEach((key) => {
      if (selectedRegion.length === 0) {
        if (key.includes("stateSector")) {
          stateSector += data.data[i][key];
        } else if (key.includes("centralSector")) {
          centralSector += data.data[i][key];
        }
      }
      selectedRegion.forEach((region) => {
        if (key === `${region}_stateSector`) {
          stateSector += data.data[i][key];
        } else if (key === `${region}_centralSector`) {
          centralSector += data.data[i][key];
        }
      });
    });
    aggregatedData.push({
      date: data.data[i].date,
      stateSector: stateSector,
      centralSector: centralSector,
    });
  }

  return aggregatedData;
};

export interface GenerationChartData{
  date: string[];
  data: any[];
  states: string[];
  

}

export function FormatGenerationData(data: any) : GenerationChartData {
  let finalGenerationData: GenerationChartData = {
    date: [],
    data: [],
    states: [],
  };
  let formattedData: any = {};
  for (let i = 0; i < data.length; i++) {
    if (Object.keys(formattedData).includes(data[i].power_type)) {
      formattedData[data[i].power_type].push(data[i]);
    } else {
      formattedData[data[i].power_type] = [data[i]];
    }
    if (finalGenerationData.states.indexOf(data[i].state) === -1) {
      finalGenerationData.states.push(data[i].state);
    }
    if (finalGenerationData.date.indexOf(data[i].date) === -1) {
      finalGenerationData.date.push(data[i].date);
    }
  }
  Object.keys(formattedData).forEach((key) => {
    for (let i = 0; i < formattedData[key].length; i++) {
      let dataIndex = finalGenerationData.data.findIndex(
        (item) => item.date === formattedData[key][i].date
      );
      if (dataIndex !== -1) {
        // finalGenerationData.data[dataIndex][`${key.toLocaleLowerCase()}`] =
        //   parseFloat(formattedData[key][i].generation_mu_actual);
        if(finalGenerationData.data[dataIndex][`${key.toLocaleLowerCase()}`]){
          finalGenerationData.data[dataIndex][`${key.toLocaleLowerCase()}`] += parseFloat(formattedData[key][i].generation_mu_actual);
        } else {
          finalGenerationData.data[dataIndex][`${key.toLocaleLowerCase()}`] = parseFloat(formattedData[key][i].generation_mu_actual);
        }
      } else {
        finalGenerationData.data.push({
          date: formattedData[key][i].date,
          [`${key.toLocaleLowerCase()}`]: parseFloat(formattedData[key][i].generation_mu_actual),
        });
      }
    }
  }); 
  finalGenerationData.date.sort((a: any, b: any) => {
    const dateA = parseDate(a);
    const dateB = parseDate(b);

    return dateA.getTime() - dateB.getTime();
  });
  console.log("formattedData", formattedData);
  console.log("returning finalGenerationData", finalGenerationData);
  return finalGenerationData;
}



export const ConsumptionColors: string[] = [
  // Shuffled using Math.random() approach
  "rgb(17, 141, 255)",
  "rgb(18, 35, 158)",
  "#FF8C00", // Dark Orange
  "#DC143C", // Crimson
  "#800080", // Purple
  "#FFA500", // Orange
  "#FF0000", // Red
  "#9400D3", // Dark Violet
  "#007F4E", // Dark Green
  "#FFA07A", // Mango
  "#FF4500", // Orange Red
  "#006400", // Emerald Green
  "#B76E79", // Rose Gold
  "#D8BFD8", // Thistle
  "#B22222", // Firebrick
  "#804000", // Burnt Sienna
  "#0018A8", // Deep Sapphire
  "#000080", // Navy Blue
  "#4169E1", // Royal Blue
  "#FFA07A", // Mango
  "#FF7F50", // Coral
  "#87CEEB", // Sky Blue
  "#A52A2A", // Brown
  "#FF6347", // Tomato
  "#8B0000", // Dark Red
  "#4B0082", // Indigo
  "#C71585", // Deep Pink
  "#2E8B57", // Sea Green
  "#C00000", // Maroon
  "#A9A9A9", // Medium Gray
  "#363636", // Charcoal
  "#696969", // Dark Gray
  "#000000", // Black
  "#6495ED", // Cornflower Blue
  "#FF6347", // Tomato
  "#2F4F4F", // Dark Gray
  "#C71585", // Deep Pink
  "#D2B48C", // Cinnamon
  "#DC143C", // Crimson
  "#B76E79", // Rose Gold
  "#4B0082", // Indigo
  "#FF8C00", // Dark Orange
  "#004347", // Deep Sea Green
  "#9400D3", // Dark Violet
  "#007F4E", // Dark Green
  "#8B0000", // Dark Red
  "#C00000", // Maroon
  "#FF0000", // Red
  "#0018A8", // Deep Sapphire
  "#4169E1", // Royal Blue
  "#6495ED", // Cornflower Blue
  "#87CEEB", // Sky Blue
  "#FFA500", // Orange
  "#FF4500", // Orange Red
  "#2E8B57", // Sea Green
  "#006400", // Emerald Green
  // ... (remaining shuffled colors)
];
