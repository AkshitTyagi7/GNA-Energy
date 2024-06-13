import ChartLabelValue from "./Model";

let DemoCapacityUtilData=
[
    {
        "Actual_Mus": 692.09,
        "Adjusted_Mus": 1200.0,
        "Generator": "APML 1200 MW",
        "Optimal_Mus": 1200.0,
        "allocated_capactity": 1200.0,
        "cap_util": 42.325833333333335
    },
    {
        "Actual_Mus": 18.14,
        "Adjusted_Mus": 0.0,
        "Generator": "APML 125 MW",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 125.0,
        "cap_util": 85.488
    },
    {
        "Actual_Mus": 851.81,
        "Adjusted_Mus": 0.0,
        "Generator": "APML 1320 MW",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 1320.0,
        "cap_util": 35.4689393939394
    },
    {
        "Actual_Mus": 37.43,
        "Adjusted_Mus": 0.0,
        "Generator": "APML 440 MW",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 440.0,
        "cap_util": 91.49318181818182
    },
    {
        "Actual_Mus": 29.82,
        "Adjusted_Mus": 0.0,
        "Generator": "Bhusawal 3",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 210.0,
        "cap_util": 85.8
    },
    {
        "Actual_Mus": 227.87,
        "Adjusted_Mus": 0.0,
        "Generator": "Bhusawal 4",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 500.0,
        "cap_util": 54.426
    },
    {
        "Actual_Mus": 227.87,
        "Adjusted_Mus": 0.0,
        "Generator": "Bhusawal 5",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 500.0,
        "cap_util": 54.426
    },
    {
        "Actual_Mus": 132.03,
        "Adjusted_Mus": 0.0,
        "Generator": "CGPL",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 800.0,
        "cap_util": 83.49625
    },
    {
        "Actual_Mus": 0.0,
        "Adjusted_Mus": 210.0,
        "Generator": "Chandrapur 3",
        "Optimal_Mus": 210.0,
        "allocated_capactity": 210.0,
        "cap_util": 100.0
    },
    {
        "Actual_Mus": 0.0,
        "Adjusted_Mus": 210.0,
        "Generator": "Chandrapur 4",
        "Optimal_Mus": 210.0,
        "allocated_capactity": 210.0,
        "cap_util": 100.0
    },
    {
        "Actual_Mus": 660.56,
        "Adjusted_Mus": 0.0,
        "Generator": "Chandrapur 5",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 500.0,
        "cap_util": -32.11199999999999
    },
    {
        "Actual_Mus": 0.0,
        "Adjusted_Mus": 500.0,
        "Generator": "Chandrapur 6",
        "Optimal_Mus": 500.0,
        "allocated_capactity": 500.0,
        "cap_util": 100.0
    },
    {
        "Actual_Mus": 0.0,
        "Adjusted_Mus": 500.0,
        "Generator": "Chandrapur 7",
        "Optimal_Mus": 500.0,
        "allocated_capactity": 500.0,
        "cap_util": 100.0
    },
    {
        "Actual_Mus": 187.18,
        "Adjusted_Mus": 0.0,
        "Generator": "Chandrapur 8",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 500.0,
        "cap_util": 62.564
    },
    {
        "Actual_Mus": 187.18,
        "Adjusted_Mus": 0.0,
        "Generator": "Chandrapur 9",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 500.0,
        "cap_util": 62.564
    },
    {
        "Actual_Mus": 0.0,
        "Adjusted_Mus": 34.0,
        "Generator": "Dodson II",
        "Optimal_Mus": 34.0,
        "allocated_capactity": 34.0,
        "cap_util": 100.0
    },
    {
        "Actual_Mus": 141.59,
        "Adjusted_Mus": 200.0,
        "Generator": "Emco Power",
        "Optimal_Mus": 200.0,
        "allocated_capactity": 200.0,
        "cap_util": 29.205
    },
    {
        "Actual_Mus": 68.09,
        "Adjusted_Mus": 0.0,
        "Generator": "GTPS Uran",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 108.0,
        "cap_util": 36.9537037037037
    },
    {
        "Actual_Mus": 158.09,
        "Adjusted_Mus": 250.0,
        "Generator": "Hydro (Ghatghar)",
        "Optimal_Mus": 250.0,
        "allocated_capactity": 250.0,
        "cap_util": 36.764
    },
    {
        "Actual_Mus": 50.12,
        "Adjusted_Mus": 0.0,
        "Generator": "JSW",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 300.0,
        "cap_util": 83.29333333333334
    },
    {
        "Actual_Mus": 337.97,
        "Adjusted_Mus": 0.0,
        "Generator": "Khaparkheda 1 to 4",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 210.0,
        "cap_util": -60.93809523809526
    },
    {
        "Actual_Mus": 242.71,
        "Adjusted_Mus": 500.0,
        "Generator": "Khaparkheda 5",
        "Optimal_Mus": 500.0,
        "allocated_capactity": 500.0,
        "cap_util": 51.45799999999999
    },
    {
        "Actual_Mus": 74.15,
        "Adjusted_Mus": 210.0,
        "Generator": "Koradi 6",
        "Optimal_Mus": 210.0,
        "allocated_capactity": 210.0,
        "cap_util": 64.69047619047619
    },
    {
        "Actual_Mus": 194.32,
        "Adjusted_Mus": 389.42,
        "Generator": "Koradi 9",
        "Optimal_Mus": 389.42,
        "allocated_capactity": 660.0,
        "cap_util": 70.55757575757576
    },
    {
        "Actual_Mus": 158.41,
        "Adjusted_Mus": 0.0,
        "Generator": "Nashik 3,4 & 5",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 210.0,
        "cap_util": 24.566666666666666
    },
    {
        "Actual_Mus": 61.32,
        "Adjusted_Mus": 250.0,
        "Generator": "Paras 3",
        "Optimal_Mus": 250.0,
        "allocated_capactity": 250.0,
        "cap_util": 75.472
    },
    {
        "Actual_Mus": 61.32,
        "Adjusted_Mus": 250.0,
        "Generator": "Paras 4",
        "Optimal_Mus": 250.0,
        "allocated_capactity": 250.0,
        "cap_util": 75.472
    },
    {
        "Actual_Mus": 82.82,
        "Adjusted_Mus": 0.0,
        "Generator": "Parli 6",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 250.0,
        "cap_util": 66.872
    },
    {
        "Actual_Mus": 82.82,
        "Adjusted_Mus": 0.0,
        "Generator": "Parli 7",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 250.0,
        "cap_util": 66.872
    },
    {
        "Actual_Mus": 66.37,
        "Adjusted_Mus": 0.0,
        "Generator": "Parli Replacement U 8",
        "Optimal_Mus": 0.0,
        "allocated_capactity": 250.0,
        "cap_util": 73.452
    },
    {
        "Actual_Mus": 18.85,
        "Adjusted_Mus": 54.0,
        "Generator": "Pench",
        "Optimal_Mus": 54.0,
        "allocated_capactity": 54.0,
        "cap_util": 65.0925925925926
    },
    {
        "Actual_Mus": 221.14,
        "Adjusted_Mus": 391.0,
        "Generator": "SSP",
        "Optimal_Mus": 391.0,
        "allocated_capactity": 391.0,
        "cap_util": 43.44245524296675
    },
    {
        "Actual_Mus": 116.35,
        "Adjusted_Mus": 240.0,
        "Generator": "Sai Wardha",
        "Optimal_Mus": 240.0,
        "allocated_capactity": 240.0,
        "cap_util": 51.520833333333336
    }
]
export function ConvertCapacityUtilData(data: any): ChartLabelValue {
    const labels: string[] = [];
  const values: number[] = [];

  data.forEach((entry: any) => {
    labels.push(entry.Generator);
    values.push(entry.cap_util);
  });

  return { labels, values };
}

// Usage
