import { UtilizationTrendData } from "./ExchangeState";

export const DemoFilterData: {
    buyer_name: string[];
    seller_name: string[];
  }= {
    "buyer_name": [
        "CHANDIGARH",
        "JK&LADAKH",
        "Assam Ben",
        "KSEB",
        "Meghalaya Ben",
        "Manipur Ben",
        "UPPCL",
        "TNEB",
        "UTTARAKHAND",
        "WBSETCL",
        "NEPAL ELECTRICITY AUTHORITY MUZAFFARPUR",
        "HARYANA",
        "NEPAL ELECTRICITY AUTHORITY TANAKPUR",
        "PUNJAB",
        "MPSEB Beneficiary",
        "ArcelorMittal Nippon Steel India Limited",
        "KPTCL",
        "BHARAT ALUMINIUM COMPANY LTD (Bulk Consumer)",
        "SIMHAPURI ENERGY LIMITED",
        "BHARAT ALUMINIUM COMPANY LTD",
        "GOA SR",
        "Jaypee Nigrie Super Thermal Power Plant",
        "DNHDDPDCL",
        "TSTRANSCO",
        "GEB Beneficiary",
        "RAJASTHAN",
        "DVC",
        "Ratnagiri Gas & Power Private Limited",
        "North Central Railway Prayagraj",
        "MSEB Beneficiary",
        "GOA Beneficiary",
        "APTRANSCO",
        "NTPC Jhanor Gandhar GPS",
        "DELHI",
        "ODISHA",
        "HP",
        "Arunachal Ben",
        "Druk Green Power Corporation Limited (DGPCL-Bhutan)",
        "BSPHCL",
        "JHARKHAND",
        "Coastal Gujarat Power Limited",
        "SIKKIM",
        "Tripura Ben",
        "ACB (INDIA) LIMITED",
        "DNH Beneficiary",
        "CSEB Beneficiary",
        "Jindal Power Limited, Stage-2",
        "DD Beneficiary",
        "Sainj HEP",
        "Nagaland Ben",
        "Maruti Clean Coal and Power Limited",
        "IND BARATH ENERGY UTKAL LIMITED",
        "MAHAN ENERGEN LIMITED.",
        "NTPC Kawas GPS",
        "Jhabua Power Limited",
        "IL&FS TAMIL NADU POWER COMPANY LIMITED",
        "RAIGARH ENERGY GENERATION LIMITED",
        "KARCHAM WANGTOO HYDRO ELECTRIC PLANT.",
        "Singoli Bhatwari HEP",
        "SHREE CEMENT LIMITED TPS",
        "Adani Power Limited-Raipur TPP",
        "Jindal Steel & Power Ltd , DCPP",
        "Adani Power Limited - Raigarh TPP",
        "PONDY",
        "MB POWER (MADHYA PRADESH) LIMITED",
        "SKS Power Generation Chhattisgarh Limited",
        "NLC INDIA LIMITED NEYVELI NEW THERMAL POWER STATION",
        "Jindal Power Limited, Stage-1",
        "NTPC Gadarwara",
        "NTECL VALLUR",
        "Budhil HEP (Greenko Budhil Hydro Power Pvt. Ltd.)",
        "RAIPUR ENERGEN LIMITED",
        "Sikkim Urja Limited",
        "GMR Warora Energy Limited",
        "Mizoram Ben",
        "Dhariwal ISTS"
    ],
    "seller_name": [
        "CHANDIGARH",
        "MAHAN ENERGEN LIMITED.",
        "ACB (INDIA) LIMITED",
        "TNEB",
        "JORETHANG LOOP HEP, DANS ENERGY PRIVATE LIMITED",
        "JK&LADAKH",
        "PONDY",
        "Manipur Ben",
        "APTRANSCO",
        "ODISHA",
        "BHARAT ALUMINIUM COMPANY LTD",
        "NEPAL ELECTRICITY AUTHORITY MUZAFFARPUR",
        "KSEB",
        "Ramagundam Floating solar",
        "Jindal Power Limited, Stage-2",
        "Meghalaya Ben",
        "UPPCL",
        "DHARIWAL INFRASTRUCTURE LIMITED, CTU",
        "NTPC Kahalgaon stage II",
        "MSEB Beneficiary",
        "HARYANA",
        "DNHDDPDCL",
        "TSTRANSCO",
        "Ostro Energy Private Limited",
        "NPCIL KAKRAPAR ATOMIC POWER STATION UNITS 3 & 4",
        "NTPC Kahalgaon stage I",
        "KARCHAM WANGTOO HYDRO ELECTRIC PLANT.",
        "CSEB Beneficiary",
        "R.K.M POWERGEN PRIVATE LIMITED",
        "SIMHAPURI ENERGY LIMITED",
        "SEIL ENERGY INDIA LIMITED",
        "NABINAGAR POWER GENERATING COMPANY LIMITED",
        "COASTAL ENERGEN PRIVATE LIMITED",
        "NTPC Vindhyachal Stage I",
        "SEIL Energy India Limited Project II",
        "Sainj HEP",
        "GEB Beneficiary",
        "NLC Tamilnadu Power Limited",
        "NTPC Unchahar Stage IV",
        "Jhabua Power Limited",
        "SIKKIM",
        "NTPC Vindhyachal Stage III",
        "Maruti Clean Coal and Power Limited",
        "DELHI",
        "Simhadri FSP 15 MW",
        "NTPC Ramagundam Stage III",
        "TRN ENERGY PRIVATE LIMITED",
        "Budhil HEP (Greenko Budhil Hydro Power Pvt. Ltd.)",
        "Sasan Power Limited",
        "MPSEB Beneficiary",
        "AHEJOL SOLAR",
        "Sikkim Urja Limited",
        "Nagaland Ben",
        "NTPC Simhadri Stage II",
        "BSPHCL",
        "JHARKHAND",
        "SHREE CEMENT LIMITED TPS",
        "RSEJ3PL FTG2",
        "RAJASTHAN",
        "Assam Ben",
        "AHEJ3L SOLAR",
        "D B Power Limited",
        "UTTARAKHAND",
        "WBSETCL",
        "HP",
        "IL&FS TAMIL NADU POWER COMPANY LIMITED",
        "ADANI HYBRID ENERGY JAISALMER FOUR LIMITED APS",
        "Arunachal Ben",
        "Simhadri Floating solar (10 MW)",
        "OSTRO KANNADA POWER PRIVATE  LIMITED",
        "GMR KAMALANGA ENERGY LTD-CTU",
        "The Tata Power Co Ltd (MTPS)",
        "ADANI SOLAR ENERGY JODHPUR TWO LIMITED",
        "Ratnagiri Gas and Power Private Limited-LTRLNG",
        "NTPC Unchahar Stage II",
        "NLC INDIA LIMITED THERMAL POWER STATION II STAGE I",
        "GMR Warora Energy Limited",
        "NTPC Rihand stage III",
        "RAIPUR ENERGEN LIMITED",
        "NTPC Gadarwara",
        "Jindal Power Limited, Stage-1",
        "NTPC SOLAPUR SOLAR PV Station",
        "MB POWER (MADHYA PRADESH) LIMITED",
        "NTPC KUDGI",
        "DVC",
        "Singoli Bhatwari HEP",
        "KAMENG HYDRO POWER STATION",
        "Palatana Plant",
        "NTPC Talcher Super Thermal Power Station Stage II",
        "RAIGARH ENERGY GENERATION LIMITED",
        "Chuzachen HEP",
        "NTPC Unchahar Stage III",
        "DNH Beneficiary",
        "NTPC Dadri Stage II",
        "Jaypee Nigrie Super Thermal Power Plant",
        "Adani Power Limited-Raipur TPP",
        "AD HYDRO POWER LIMITED",
        "NLC INDIA LIMITED THERMAL POWER STATION II STAGE II",
        "NTPC Talcher Stage I",
        "NTPC Tanda Stage II",
        "Tashiding HEP, Shiga Energy Private Limited",
        "Jindal India Thermal Power Limited",
        "ReNew Surya Ravi Private Limited",
        "KPTCL",
        "ADHUNIK POWER & NATURAL RESOURCES LIMITED",
        "Bongaigaon Thermal Power Station  NTPC",
        "RENEW SURYA ROSHNI PRIVATE LIMITED Koppal PS",
        "AHEJ2L SOLAR",
        "SKS Power Generation Chhattisgarh Limited",
        "ASEJOPL W FTG2",
        "NEPAL ELECTRICITY AUTHORITY TANAKPUR",
        "Sorang HEP (Himachal Sorang Power Pvt. Ltd.))",
        "ASSAM GAS BASED POWER STATION",
        "NTPC khargone",
        "RGPPL MSEB",
        "Mizoram Ben",
        "CONTINUUM POWER TRADING (TN) PRIVATE LIMITED",
        "WIND FIVE RENERGY LIMITED",
        "Amp Energy Green Six Private Limited",
        "ADANI WIND ENERGY KUTCHH FOUR Ltd. Nakhatrana",
        "Tripura Ben",
        "ADANI WIND ENERGY KUTCHH FIVE LIMITED",
        "NTPC BARH Stage II",
        "IGSTPS JHAJJAR",
        "GOA Beneficiary",
        "NREL-Dayapar  Wind",
        "NTPC Sipat Stage I",
        "NTPC Solapur",
        "Jindal Steel & Power Ltd , DCPP",
        "Doyang HPS, NEEPCO",
        "KANTI BIJLEE UTPADAN NIGAM LIMITED",
        "KSK MAHANADI POWER COMPANY LIMITED",
        "NTPC Farakka stage I",
        "NTPC Ramagundam Stage I &II",
        "NTPC Mouda Stage II",
        "Kopili Power Station NEEPCO",
        "Adani Power Limited - Raigarh TPP",
        "RSUPL FTG2",
        "PUNJAB",
        "NTPC Darlipali",
        "NLC INDIA LIMITED NEYVELI NEW THERMAL POWER STATION",
        "NLC INDIA LIMITED THERMAL POWER STATION II EXPANSION",
        "Coastal Gujarat Power Limited",
        "Dikchu Hydro Electric Project (Sneha Kinetic Power Projects Pvt. Ltd.)",
        "RENEW SURYA VIHAAN PRIVATE LIMITED",
        "APL Stage 3",
        "Ranganadi Hydro Power Station",
        "INOX GREEN ENERGY SERVICES LIMITED",
        "SBSR Power Cleantech Eleven Private Limited",
        "ADANI RENEWABLE ENERGY HOLDING FOUR LIMITED",
        "NTPC Vindhyachal Stage V",
        "ESSARMPL",
        "NTPC Rihand stage I",
        "Ratnagiri Gas & Power Private Limited",
        "NTPC Singrauli",
        "NTPC Lara Stage I",
        "NTPC BARH Stage I",
        "Dhariwal ISTS",
        "DHARIWAL STU OTH",
        "Grian Energy Private Limited",
        "DGEN MEGA POWER PROJECT",
        "BARHinfirm",
        "Pare Hydro Power Station",
        "NTPC Kawas GPS RLNG",
        "PARBATI II HE PROJECT",
        "NTPC Sipat Stage II",
        "NTPC Farakka stage III",
        "NTPC Mouda Stage I",
        "ADANI SOLAR ENERGY JAISALMER TWO PRIVATE LIMITED(Project-2)",
        "NTPC Korba Stage I &II",
        "NTPC Dadri Stage I",
        "RGPPL OTHERS",
        "NLC INDIA LIMITED THERMAL POWER STATION I EXPANSION",
        "NTPC Korba Stage III",
        "ASEJOPL S FTG2",
        "NTPC Vindhyachal Stage IV",
        "NTPC Simhadri Stage I",
        "RENEW SURYA PRATAP PRIVATE LIMITED",
        "NTPC Rihand stage II",
        "ALTRA XERGI POWER PRIVATE LIMITED",
        "NTPC North Karanpura  STPS",
        "AP41PL BHDL",
        "NTECL VALLUR",
        "Basochhu Hydropower Plant Bhutan",
        "Onevolt Energy Private Limited",
        "NTPC Vindhyachal Stage II",
        "Amplus Ages Private Limited",
        "NTPC Telangana",
        "NTPC Unchahar Stage I",
        "Ayana Renewable Power Six Private Limited",
        "AGARTALA GAS BASED POWER STATION",
        "NTPC North Karanpura  STPS infirm ( UNIT # 2 )",
        "NTPC DADRI GPS RLNG",
        "GOA SR",
        "NTPC SAIL POWER COMPANY LIMITED",
        "MASAYA SOLAR ENERGY PRIVATE LIMITED",
        "ARP1PL BKN",
        "Druk Green Power Corporation Limited (DGPCL-Bhutan)",
        "IND BARATH ENERGY UTKAL LIMITED",
        "Nathpa Jhakri HPS",
        "APMPL BHDL",
        "NTPC JhanorGandhar GPS RLNG",
        "NTPC ANTA GPS  RLNG",
        "ADANI SOLAR ENERGY RJ TWO PRIVATE LIMITED",
        "NTPC AURAIYA  GPS RLNG",
        "PARBATI III POWER STATION",
        "DD Beneficiary",
        "RGPPL IR",
        "NTPC Kawas GPS_COMGAS",
        "TANAKPUR POWER STATION",
        "AP43PL BKN",
        "NTPC ANTA  GPS Spot RF",
        "NTPC  Jhanor Gandhar GPS_COMGAS",
        "SALAL POWER STATION",
        "Rampur HPS",
        "Adept Renewable Technologies Private Limited",
        "Kopili 1 IN",
        "JSW RENEW ENERGY LIMITED",
        "MAITHON POWER LIMITED",
        "KISHANGANGA POWER STATION",
        "CHAMERA I  POWER STATION",
        "URI I POWER STATION",
        "URI II POWER STATION",
        "DULHASTI POWER STATION",
        "NTPC AURAIYA GPS Spot RF",
        "CHAMERA II  POWER STATION",
        "DHAULIGANGA POWER STATION",
        "NTPC ANTA GPS",
        "SEWA II POWER STATION",
        "CHAMERA III  POWER STATION",
        "NTPC KOLDAM"
    ]
}

export const DemoTrendData : UtilizationTrendData = {
    "buyer": [
        {
            "TSTRANSCO": 64010.69,
            "UPPCL": 22189.75,
            "name": "11-01-2024"
        },
        {
            "TSTRANSCO": 58772.13,
            "UPPCL": 20758.86,
            "name": "12-01-2024"
        },
        {
            "TSTRANSCO": 47588.47,
            "UPPCL": 18775.56,
            "name": "13-01-2024"
        },
        {
            "TSTRANSCO": 39509.48,
            "UPPCL": 23125.69,
            "name": "14-01-2024"
        },
        {
            "TSTRANSCO": 34250.07,
            "UPPCL": 24748.69,
            "name": "15-01-2024"
        },
        {
            "TSTRANSCO": 26956.86,
            "UPPCL": 25651.37,
            "name": "16-01-2024"
        },
        {
            "TSTRANSCO": 33687.39,
            "UPPCL": 25317.91,
            "name": "17-01-2024"
        },
        {
            "TSTRANSCO": 39039.3,
            "UPPCL": 21999.21,
            "name": "18-01-2024"
        },
        {
            "TSTRANSCO": 44463.28,
            "UPPCL": 17532.9,
            "name": "19-01-2024"
        },
        {
            "TSTRANSCO": 40198.96,
            "UPPCL": 15104.61,
            "name": "20-01-2024"
        },
        {
            "TSTRANSCO": 38672.65,
            "UPPCL": 23982.17,
            "name": "21-01-2024"
        },
        {
            "TSTRANSCO": 39611.99,
            "UPPCL": 24645.16,
            "name": "22-01-2024"
        },
        {
            "TSTRANSCO": 43283.45,
            "UPPCL": 15682.55,
            "name": "23-01-2024"
        },
        {
            "TSTRANSCO": 47620.93,
            "UPPCL": 13815.11,
            "name": "24-01-2024"
        },
        {
            "TSTRANSCO": 43905.22,
            "UPPCL": 15717.24,
            "name": "25-01-2024"
        },
        {
            "TSTRANSCO": 42332.78,
            "UPPCL": 37281.74,
            "name": "26-01-2024"
        },
        {
            "TSTRANSCO": 39563.66,
            "UPPCL": 20786.34,
            "name": "27-01-2024"
        },
        {
            "TSTRANSCO": 41728.66,
            "UPPCL": 23984.41,
            "name": "28-01-2024"
        },
        {
            "TSTRANSCO": 40167.02,
            "UPPCL": 17322.04,
            "name": "29-01-2024"
        },
        {
            "TSTRANSCO": 36729.67,
            "UPPCL": 16951.56,
            "name": "30-01-2024"
        },
        {
            "TSTRANSCO": 37115.52,
            "UPPCL": 13248.77,
            "name": "31-01-2024"
        },
        {
            "TSTRANSCO": 14999.31,
            "UPPCL": 13811.2,
            "name": "01-02-2024"
        },
        {
            "TSTRANSCO": 15098.73,
            "UPPCL": 18493.74,
            "name": "02-02-2024"
        },
        {
            "TSTRANSCO": 14047.33,
            "UPPCL": 16784.12,
            "name": "03-02-2024"
        },
        {
            "TSTRANSCO": 17050.99,
            "UPPCL": 20154.39,
            "name": "04-02-2024"
        },
        {
            "TSTRANSCO": 21312.8,
            "UPPCL": 18576.65,
            "name": "05-02-2024"
        },
        {
            "TSTRANSCO": 15194.42,
            "UPPCL": 12606.88,
            "name": "06-02-2024"
        },
        {
            "TSTRANSCO": 21055.79,
            "UPPCL": 13170.67,
            "name": "07-02-2024"
        },
        {
            "TSTRANSCO": 22290.41,
            "UPPCL": 11764.68,
            "name": "08-02-2024"
        },
        {
            "TSTRANSCO": 19233.26,
            "UPPCL": 9169.21,
            "name": "09-02-2024"
        },
        {
            "TSTRANSCO": 17418.83,
            "UPPCL": 11823.79,
            "name": "10-02-2024"
        }
    ],
    "buyer_selected": [
        {
            "name": "UPPCL",
            "value": 584976.97
        },
        {
            "name": "TSTRANSCO",
            "value": 1056910.04
        }
    ],
    "seller": [
        {
            "TSTRANSCO": 2073.36,
            "UPPCL": 18324.27,
            "name": "11-01-2024"
        },
        {
            "TSTRANSCO": 865.89,
            "UPPCL": 16890.67,
            "name": "12-01-2024"
        },
        {
            "TSTRANSCO": 2547.75,
            "UPPCL": 24848.9,
            "name": "13-01-2024"
        },
        {
            "TSTRANSCO": 4712.37,
            "UPPCL": 20900.11,
            "name": "14-01-2024"
        },
        {
            "TSTRANSCO": 6858.99,
            "UPPCL": 9744.9,
            "name": "15-01-2024"
        },
        {
            "TSTRANSCO": 7933.82,
            "UPPCL": 8857.81,
            "name": "16-01-2024"
        },
        {
            "TSTRANSCO": 7307.05,
            "UPPCL": 5415.45,
            "name": "17-01-2024"
        },
        {
            "TSTRANSCO": 4893.02,
            "UPPCL": 5311.01,
            "name": "18-01-2024"
        },
        {
            "TSTRANSCO": 1650.75,
            "UPPCL": 4894.15,
            "name": "19-01-2024"
        },
        {
            "TSTRANSCO": 4345.77,
            "UPPCL": 12039.22,
            "name": "20-01-2024"
        },
        {
            "TSTRANSCO": 7459.54,
            "UPPCL": 13955.14,
            "name": "21-01-2024"
        },
        {
            "TSTRANSCO": 2912.03,
            "UPPCL": 6496.98,
            "name": "22-01-2024"
        },
        {
            "TSTRANSCO": 3420.11,
            "UPPCL": 12528.18,
            "name": "23-01-2024"
        },
        {
            "TSTRANSCO": 937.85,
            "UPPCL": 14797.36,
            "name": "24-01-2024"
        },
        {
            "TSTRANSCO": 3188.9,
            "UPPCL": 11625.94,
            "name": "25-01-2024"
        },
        {
            "TSTRANSCO": 5176.67,
            "UPPCL": 10632.4,
            "name": "26-01-2024"
        },
        {
            "TSTRANSCO": 5432.82,
            "UPPCL": 12174.83,
            "name": "27-01-2024"
        },
        {
            "TSTRANSCO": 5001.6,
            "UPPCL": 18696.44,
            "name": "28-01-2024"
        },
        {
            "TSTRANSCO": 7267.69,
            "UPPCL": 24312.85,
            "name": "29-01-2024"
        },
        {
            "TSTRANSCO": 4037.32,
            "UPPCL": 27850.76,
            "name": "30-01-2024"
        },
        {
            "TSTRANSCO": 3559.63,
            "UPPCL": 21814.97,
            "name": "31-01-2024"
        },
        {
            "TSTRANSCO": 17255.8,
            "UPPCL": 12109.04,
            "name": "01-02-2024"
        },
        {
            "TSTRANSCO": 17587.97,
            "UPPCL": 9678.15,
            "name": "02-02-2024"
        },
        {
            "TSTRANSCO": 19996.85,
            "UPPCL": 11123.63,
            "name": "03-02-2024"
        },
        {
            "TSTRANSCO": 14551.74,
            "UPPCL": 16118.36,
            "name": "04-02-2024"
        },
        {
            "TSTRANSCO": 9535.41,
            "UPPCL": 23624.54,
            "name": "05-02-2024"
        },
        {
            "TSTRANSCO": 12919.32,
            "UPPCL": 21047.31,
            "name": "06-02-2024"
        },
        {
            "TSTRANSCO": 9500.63,
            "UPPCL": 24238.54,
            "name": "07-02-2024"
        },
        {
            "TSTRANSCO": 10708.99,
            "UPPCL": 32720.15,
            "name": "08-02-2024"
        },
        {
            "TSTRANSCO": 15654.36,
            "UPPCL": 42623.0,
            "name": "09-02-2024"
        },
        {
            "TSTRANSCO": 13171.42,
            "UPPCL": 41065.56,
            "name": "10-02-2024"
        }
    ],
    "seller_selected": [
        {
            "name": "TSTRANSCO",
            "value": 232465.41
        },
        {
            "name": "UPPCL",
            "value": 536460.62
        }
    ]
}
