import ChartLabelValue from "./Model";

const DemoTotalCostData=[
    [
        "APML 1200 MW",
        5885111610.0
    ],
    [
        "APML 125 MW",
        65012065.07100001
    ],
    [
        "APML 1320 MW",
        0.0
    ],
    [
        "APML 440 MW",
        159692475.071
    ],
    [
        "Bhusawal 3",
        155601004.45
    ],
    [
        "Bhusawal 4",
        577405903.43
    ],
    [
        "Bhusawal 5",
        577405903.43
    ],
    [
        "CGPL",
        1001995163.628
    ],
    [
        "Chandrapur 3",
        808500000.0
    ],
    [
        "Chandrapur 4",
        808500000.0
    ],
    [
        "Chandrapur 5",
        1555444003.85
    ],
    [
        "Chandrapur 6",
        1925000000.0
    ],
    [
        "Chandrapur 7",
        1925000000.0
    ],
    [
        "Chandrapur 8",
        567018803.34
    ],
    [
        "Chandrapur 9",
        567018803.34
    ],
    [
        "Dodson II",
        7900000.0
    ],
    [
        "Emco Power",
        674194710.0
    ],
    [
        "GTPS Uran",
        213268906.79
    ],
    [
        "Hydro (Ghatghar)",
        605100000.0
    ],
    [
        "JSW",
        111535287.206
    ],
    [
        "Khaparkheda 1 to 4",
        594637303.9100001
    ],
    [
        "Khaparkheda 5",
        2316113100.0
    ],
    [
        "Koradi 6",
        764284000.0
    ],
    [
        "Koradi 9",
        1592713937.2
    ],
    [
        "Nashik 3,4 & 5",
        566730304.17
    ],
    [
        "Paras 3",
        941672400.0
    ],
    [
        "Paras 4",
        941672400.0
    ],
    [
        "Parli 6",
        229538404.88
    ],
    [
        "Parli 7",
        229538404.88
    ],
    [
        "Parli Replacement U 8",
        256705504.85
    ],
    [
        "Pench",
        38600000.0
    ],
    [
        "SSP",
        453300000.0
    ],
    [
        "Sai Wardha",
        939527650.0
    ]
]

  export function ConvertTotalCostData(data: [string, number][]): ChartLabelValue {
    const labels: string[] = [];
    const values: number[] = [];
  
    data.forEach(([label, value]) => {
      labels.push(label);
      // Convert rupees to crores
      values.push(value / 10000000); // 1 crore = 10,000,000
    });
  
    return { labels, values };
  }
  
  // Usage
  const totalCostChartData: ChartLabelValue = ConvertTotalCostData(DemoTotalCostData as [string, number][]);
  
