export const Filters = [


    {
        "name": "Operational Parameters",
        "subfilters": [
            { "id": "Total Capacity", "title": "Total Capacity(MW)" },
            { "id": "Availability", "title": "Availability (%)" },
            { "id": "PLF", "title": "PLF (%)" },
            { "id": "Gross Generation", "title": "Gross Generation (MU)" },
            // "Auxiliary Consumption excluding FGD",
            // "Auxiliary Consumption for FGD",
            { "id": "Total Auxiliary Consumption", "title": "Total Auxiliary Consumption (%)" },
            // "Total Auxiliary Consumption (= 1.6 + 1.8)",
            { "id": "Net Generation (= 1.4 - 1.10)", "title": "Net Generation (MU)" },
            { "id": "Heat Rate", "title": "Heat Rate (KCAL/KWh)" },
            { "id": "Secondary Fuel Oil Consumption", "title": "Secondary Fuel Oil Consumption(ML/KWh)" },
            { "id": "Transit Lossnts a category, and each subfilter represents a specific parameter or aspect within that c for Domestic and Washed Coal", "title": "Transit Loss for Domestic and Washed Coal (%)" },
            { "id": "Transit Loss for Imported Coal", "title": "Transit Loss for Imported Coal (%)" },
            { "id": "SHR coal component", "title": "SHR Coal Component" }
        ]
    },
    {
        "name": "Fuel Parameters",
        "subfilters": [
            // {"id": "Calorific Value", "title": "Calorific Value"},
            // {"id": "Domestic Coal (As Billed)", "title": "Domestic Coal (As Billed)"},
            // {"id": "Imported Coal (As Billed)", "title": "Imported Coal (As Billed)"},
            // {"id": "Wash Coal (As Billed)", "title": "Wash Coal (As Billed)"},
            // {"id": "Domestic Coal (As Received)-", "title": "Domestic Coal (As Received)-"},
            // {"id": "GCV loss between loading end and unloading end-- Domestic", "title": "GCV loss between loading end and unloading end-- Domestic"},
            // {"id": "GCV loss between loading end and unloading end as per directions in MERC Order in Case No. 180 0f 202020 ( Min. of or 625)", "title": "GCV loss between loading end and unloading end as per directions in MERC Order in Case No. 180 0f 202020 ( Min. of or 625)"},
            // {"id": "Domestic coal As received GCV for FAC computation", "title": "Domestic coal As received GCV for FAC computation"},
            // {"id": "Wash Coal (As Received)", "title": "Wash Coal (As Received)"},
            // {"id": "GCV loss between loading end and unloading end-- Wash Coal", "title": "GCV loss between loading end and unloading end-- Wash Coal"},
            // {"id": "GCV loss between loading end and unloading end for Wash Coal as per Case No. 296 0f 2019 ( Min. of or 300)", "title": "GCV loss between loading end and unloading end for Wash Coal as per Case No. 296 0f 2019 ( Min. of or 300)"},
            // {"id": "Wash coal As received GCV for FAC computation", "title": "Wash coal As received GCV for FAC computation"},
            // {"id": "Imported Coal (As Received)", "title": "Imported Coal (As Received)"},
            // {"id": "Weighted Avg Raw,Wash & Imported Coal for FAC Computations", "title": "Weighted Avg Raw,Wash & Imported Coal for FAC Computations"},
            // {"id": "Weighted avg. received GCV -", "title": "Weighted avg. received GCV -"},
            // {"id": "L.D.O", "title": "L.D.O"},
            // {"id": "F.O", "title": "F.O"},
            // {"id": "Fuel 4", "title": "Fuel 4"},
            // {"id": "Calorific Value after stacking loss", "title": "Calorific Value after stacking loss"},
            // {"id": "Domestic Coal (As Fired)--", "title": "Domestic Coal (As Fired)--"},
            // {"id": "Stacking Loss", "title": "Stacking Loss"},
            // {"id": "Stacking Loss Approved", "title": "Stacking Loss Approved"},
            // {"id": "stacking loss to be considered as per MERC Regulations", "title": "stacking loss to be considered as per MERC Regulations"},
            // {"id": "Coal (As Fired)- to be considered for energy charge computation", "title": "Coal (As Fired)- to be considered for energy charge computation"},
            // { "id": "Landed Fuel Price per unit", "title": "Landed Fuel Price per unit" },
            { "id": "Domestic Coal", "title": "Domestic Coal (₹ Cr)" },
            { "id": "Imported Coal", "title": "Imported Coal (₹ Cr)" },
            { "id": "Wash Coal", "title": "Wash Coal (₹ Cr)" },
            { "id": "Weighted AVG price", "title": "Weighted Avg Price – Coal (₹/MT)" },
            { "id": "Wtd. Avg. Oil price", "title": "Weighted Avg Price – Oil (₹/KL)" },
            // {"id": "Fuel Consumption and Heat Contribution (for each fuel separately)", "title": "Fuel Consumption and Heat Contribution (for each fuel separately)"},
            // {"id": "Specific Fuel Consumption", "title": "Specific Fuel Consumption"},
            // { "id": "Total Fuel Consumption", "title": "Total Fuel Consumption" },
            // {"id": "Heat content", "title": "Heat content"},
            // {"id": "Total Heat content", "title": "Total Heat content"},
            // { "id": "Total Fuel Cost", "title": "Total Fuel Cost" },
            // {"id": "Other Charges and Adjustments", "title": "Other Charges and Adjustments"},
            // {"id": "Other Charges (Pl. specify details)", "title": "Other Charges (Pl. specify details)"},
            // {"id": "Other Adjustments (Pl. specify details)", "title": "Other Adjustments (Pl. specify details)"},
            // {"id": "Total Other Charges and Adjustments", "title": "Total Other Charges and Adjustments"},
            { "id": "Total Cost (= 4 + 5)", "title": "Total Cost of Generation (₹ Cr)" },
            { "id": "Cost of Generation (at Generation Terminal) (", "title": "Cost of Generation (₹/KWh)" },
            { "id": "Energy Charge (= 6/1.11)", "title": "Energy Charge (₹/KWh)" }
        ]
    }
]


export const Generators = [
    'Bhusawal 3', 'Bhusawal 4', 'Bhusawal 5', 'Khaparkheda 1 to 4', 'Khaparkheda 5', 'Nashik 3,4 & 5', 'Chandrapur 3', 'Chandrapur 4', 'Chandrapur 5', 'Chandrapur 6', 'Chandrapur 7', 'Paras 3', 'Paras 4', 'Parali 4', 'Parali 6', 'Parali 7', 'Koradi 6', 'Koradi 7', 'GTPS Uran', 'Hydro (Ghatghar)', 'Parali 8', 'Chandrapur 8', 'Chandrapur 9', 'Koradi R U8', 'Koradi 9', 'Koradi10', 'MSPGCL Infirm', 'MSPGCL Dhariwal', 'IEPL', 'Dodson I', 'Dodson II', 'KSTPS', 'KSTPS III', 'VSTP I', 'VSTP II', 'VSTP III', 'VSTP IV', 'VSTP V', 'Kawas', 'Gandhar', 'KhSTPSII', 'SIPAT TPS 2', 'SIPAT TPS 1', 'Mauda I', 'Mauda II', 'RRAS (Gas)', 'KAPP', 'TAPP 1&2', 'TAPP 3&4', 'NTPC NVVN Coal', 'RGPPL', 'SSP', 'Pench', 'Inter State', 'JSW', 'CGPL', 'APML 125 MW', 'APML 1320 MW', 'APML 1200 MW', 'APML 440 MW', 'Emco Power', 'RIPL 450 MW', 'RIPL 750 MW', 'Sai Wardha', 'Hydro (NCE)', 'Wind', 'Bagasse', 'Biomass', 'MSW', 'GDAM Non Solar', 'Solar', 'SECI', 'NVVN (Solar)', 'Solar Rooftop', 'GDAM Solar', 'REC', 'Short Term', 'FBSM/DSM', 'Parali 5', 'Koradil0', 'Farakka STPS', 'RRAS (Thermal)', 'Exchange'
]