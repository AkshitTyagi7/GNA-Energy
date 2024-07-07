export const DemoRatedata = [
    {
        "Generator": "APML 1200 MW",
        "New_Variable_Rate": 11.58691817447973
    },
    {
        "Generator": "APML 125 MW",
        "New_Variable_Rate": 3.583906761571487
    },
    {
        "Generator": "APML 1320 MW",
        "New_Variable_Rate": 0.0
    },
    {
        "Generator": "APML 440 MW",
        "New_Variable_Rate": 4.266430118552768
    },
    {
        "Generator": "Bhusawal 3",
        "New_Variable_Rate": 5.218008372501957
    },
    {
        "Generator": "Bhusawal 4",
        "New_Variable_Rate": 2.533926826541128
    },
    {
        "Generator": "Bhusawal 5",
        "New_Variable_Rate": 2.533926826541128
    },
    {
        "Generator": "CGPL",
        "New_Variable_Rate": 7.589147702924697
    },
    {
        "Generator": "Chandrapur 3",
        "New_Variable_Rate": 3.85
    },
    {
        "Generator": "Chandrapur 4",
        "New_Variable_Rate": 3.85
    },
    {
        "Generator": "Chandrapur 5",
        "New_Variable_Rate": 2.354735385437712
    },
    {
        "Generator": "Chandrapur 6",
        "New_Variable_Rate": 3.85
    },
    {
        "Generator": "Chandrapur 7",
        "New_Variable_Rate": 3.85
    },
    {
        "Generator": "Chandrapur 8",
        "New_Variable_Rate": 3.029270255204991
    },
    {
        "Generator": "Chandrapur 9",
        "New_Variable_Rate": 3.029270255204991
    },
    {
        "Generator": "Dodson II",
        "New_Variable_Rate": 0.2323529411764706
    },
    {
        "Generator": "Emco Power",
        "New_Variable_Rate": 11.54245351823318
    },
    {
        "Generator": "GTPS Uran",
        "New_Variable_Rate": 3.132161990338699
    },
    {
        "Generator": "Hydro (Ghatghar)",
        "New_Variable_Rate": 6.583614405396584
    },
    {
        "Generator": "JSW",
        "New_Variable_Rate": 2.225364912836491
    },
    {
        "Generator": "Khaparkheda 1 to 4",
        "New_Variable_Rate": 1.75943813258407
    },
    {
        "Generator": "Khaparkheda 5",
        "New_Variable_Rate": 9.00195538108749
    },
    {
        "Generator": "Koradi 6",
        "New_Variable_Rate": 5.62594037541406
    },
    {
        "Generator": "Koradi 9",
        "New_Variable_Rate": 8.163578167460601
    },
    {
        "Generator": "Nashik 3,4 & 5",
        "New_Variable_Rate": 3.577616992283422
    },
    {
        "Generator": "Paras 3",
        "New_Variable_Rate": 4.990843756624973
    },
    {
        "Generator": "Paras 4",
        "New_Variable_Rate": 4.990843756624973
    },
    {
        "Generator": "Parli 6",
        "New_Variable_Rate": 2.771533538415039
    },
    {
        "Generator": "Parli 7",
        "New_Variable_Rate": 2.771533538415039
    },
    {
        "Generator": "Parli Replacement U 8",
        "New_Variable_Rate": 3.867794315470759
    },
    {
        "Generator": "Pench",
        "New_Variable_Rate": 1.098150782361309
    },
    {
        "Generator": "SSP",
        "New_Variable_Rate": 2.66866831508301
    },
    {
        "Generator": "Sai Wardha",
        "New_Variable_Rate": 7.598282652648605
    }
];

// export default function GetData(): { labels: string[], values: GLfloat[] } {

//     let labels: string[] = [];
//     let values: GLfloat[] = [];

//     DemoRatedata.forEach((item) => {
//         labels.push(item.Generator)
//         values.push(item.New_Effective_Rate)
//     })
//     return { labels, values }
// };

export function ConvertVariableData(data: any[]) {
    let labels: string[] = [];
    let values: GLfloat[] = [];
    //Sort the data by New_Variable_Rate
    data.sort((a: { New_Effective_Rate: number; }, b: { New_Effective_Rate: number; }) => {
        return b.New_Effective_Rate - a.New_Effective_Rate;
    })

    data.forEach((item: { Generator: string; New_Effective_Rate: number; }) => {
        labels.push(item.Generator)
        values.push(item.New_Effective_Rate)
    })
    return { labels, values }
}