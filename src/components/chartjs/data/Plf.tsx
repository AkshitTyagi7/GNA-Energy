import ChartLabelValue from "./Model";

const DemoPpaUtilData=[
    [
        "APML 1200 MW",
        57.67
    ],
    [
        "APML 125 MW",
        14.51
    ],
    [
        "APML 1320 MW",
        64.53
    ],
    [
        "APML 440 MW",
        8.51
    ],
    [
        "Bhusawal 3",
        14.2
    ],
    [
        "Bhusawal 4",
        45.57
    ],
    [
        "Bhusawal 5",
        45.57
    ],
    [
        "CGPL",
        16.5
    ],
    [
        "Chandrapur 3",
        0.0
    ],
    [
        "Chandrapur 4",
        0.0
    ],
    [
        "Chandrapur 5",
        132.11
    ],
    [
        "Chandrapur 6",
        0.0
    ],
    [
        "Chandrapur 7",
        0.0
    ],
    [
        "Chandrapur 8",
        37.44
    ],
    [
        "Chandrapur 9",
        37.44
    ],
    [
        "Dodson II",
        0.0
    ],
    [
        "Emco Power",
        70.8
    ],
    [
        "GTPS Uran",
        63.05
    ],
    [
        "Hydro (Ghatghar)",
        63.24
    ],
    [
        "JSW",
        16.71
    ],
    [
        "Khaparkheda 1 to 4",
        160.94
    ],
    [
        "Khaparkheda 5",
        48.54
    ],
    [
        "Koradi 6",
        35.31
    ],
    [
        "Koradi 9",
        29.44
    ],
    [
        "Nashik 3,4 & 5",
        75.43
    ],
    [
        "Paras 3",
        24.53
    ],
    [
        "Paras 4",
        24.53
    ],
    [
        "Parli 6",
        33.13
    ],
    [
        "Parli 7",
        33.13
    ],
    [
        "Parli Replacement U 8",
        26.55
    ],
    [
        "Pench",
        34.91
    ],
    [
        "SSP",
        56.56
    ],
    [
        "Sai Wardha",
        48.48
    ]
]

export function ConvertPlfData(data: [string, string][]): ChartLabelValue {
    const labels: string[] = [];
    const values: number[] = [];
  
    data.forEach(([label, value]) => {
      labels.push(label);
      values.push(parseFloat(value.toString().replace('%', '').replace(' ' ,'')) );
    });
    return { labels, values };
  }
  
