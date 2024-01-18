// [
//         {
//             "Installed Capacity (MW)": 30.0,
//             "Latitude": 28.6878494,
//             "Longitude": 77.003986,
//             "Name of Project": "I.P. CCPP",
//             "Owner": "IPGCL",
//             "Prime Mover": "GT-Gas",
//             "Region": "North",
//             "Sector": "State Sector",
//             "State": "Delhi",
//             "Status": 0,
//             "Type": "Thermal",
//             "Unit No.": 1.0,
//             "Year of Comm.": 1986
//         },
//         {
//             "Installed Capacity (MW)": 30.0,
//             "Latitude": 28.6878494,
//             "Longitude": 77.003986,
//             "Name of Project": "I.P. CCPP",
//             "Owner": "IPGCL",
//             "Prime Mover": "GT-Gas",
//             "Region": "North",
//             "Sector": "State Sector",
//             "State": "Delhi",
//             "Status": 0,
//             "Type": "Thermal",
//             "Unit No.": 2.0,
//             "Year of Comm.": 1986
//         },
//         {
//             "Installed Capacity (MW)": 30.0,
//             "Latitude": 28.6878494,
//             "Longitude": 77.003986,
//             "Name of Project": "I.P. CCPP",
//             "Owner": "IPGCL",
//             "Prime Mover": "GT-Gas",
//             "Region": "North",
//             "Sector": "State Sector",
//             "State": "Delhi",
//             "Status": 0,
//             "Type": "Thermal",
//             "Unit No.": 3.0,
//             "Year of Comm.": 1986
//         },
//         {
//             "Installed Capacity (MW)": 30.0,
//             "Latitude": 28.6878494,
//             "Longitude": 77.003986,
//             "Name of Project": "I.P. CCPP",
//             "Owner": "IPGCL",
//             "Prime Mover": "GT-Gas",
//             "Region": "North",
//             "Sector": "State Sector",
//             "State": "Delhi",
//             "Status": 0,
//             "Type": "Thermal",
//             "Unit No.": 4.0,
//             "Year of Comm.": 1986
//         },
// ]


interface DataEntry {
    [key: string]: string | number;
}

export function FormatAtlasData(inputData: DataEntry[]): { data: (string | number)[][], colors: string[] } {
    if (inputData.length === 0) {
        return { data: [], colors: [] };
    }

    // Extract desired keys
    const keysToInclude: string[] = ["Latitude", "Longitude","Owner","Type",];

    // Extract header with desired keys
    const header: string[] = keysToInclude.slice();

    const types: number[] = [];

    // Extract values for each entry with desired keys
    const formattedData: (string | number)[][] = [header, ...inputData.map(entry => keysToInclude.map(key => {
//         console.log("-------------------------");
// console.log(entry[key]);
// console.log(key);
// console.log(entry);

        if(key==="Type"){
            console.log(entry[key]);
            if(entry[key].toString().toLowerCase().includes('solar')){
    
            //    colors.push("orange");
                

                
                return 2;

            }
            else if(entry[key].toString().toLowerCase().includes('wind')){
                // colors.push("green");
                return 2.1;
            }
            else if(entry[key].toString().toLowerCase().includes('bio')){
                // colors.push("lightgreen");
                return 2.2;
            }
            else if(entry[key].toString().toLowerCase().includes('hydro')){
            //   colors.push("blue");
                return 2.3;
            }
            else if(entry[key].toString().toLowerCase().includes('nuclear')){
       
                // colors.push("red");
                return 2.4;
            }
            else if(entry[key].toString().toLowerCase().includes('thermal')){
            //   colors.push("yellow");
                return 2.5;
            }

            

        }
        return entry[key];
    }))];
    // let colors: string[]=["orange","green","lightgreen","blue","red","yellow"];
    const colorMapping: {
        [key: string]: string;
       }={
        "Solar":"orange",
        "Wind":"green",
        "Thermal":"yellow",
        "Hydro":"blue",
        "Nuclear":"red",
        "Bio":"lightgreen",
    }
    let colors: string[]=[];
    formattedData.map((item)=>{{
        if(item[3]===2 && !colors.includes(colorMapping["Solar"])){
            colors.push(colorMapping["Solar"]);
        }
        else if(item[3]===2.1 && !colors.includes(colorMapping["Wind"])){
            colors.push(colorMapping["Wind"]);
        }
        else if(item[3]===2.2 && !colors.includes(colorMapping["Bio"])){
            colors.push(colorMapping["Bio"]);
        }
        else if(item[3]===2.3 && !colors.includes(colorMapping["Hydro"])){
            colors.push(colorMapping["Hydro"]);
        }
        else if(item[3]===2.4 && !colors.includes(colorMapping["Nuclear"])){
            colors.push(colorMapping["Nuclear"]);
        }
        else if(item[3]===2.5 && !colors.includes(colorMapping["Thermal"])){
            colors.push(colorMapping["Thermal"]);
        }


    }})
        // let colors: string[]=["orange","green","lightgreen","blue","red","yellow"];
    let finalOrderedColors: string[]=[];
    if(colors.includes(colorMapping["Solar"])){
        finalOrderedColors.push(colorMapping["Solar"]);
    }
    if(colors.includes(colorMapping["Wind"])){
        finalOrderedColors.push(colorMapping["Wind"]);
    }
    if(colors.includes(colorMapping["Bio"])){
        finalOrderedColors.push(colorMapping["Bio"]);
    }
    if(colors.includes(colorMapping["Hydro"])){
        finalOrderedColors.push(colorMapping["Hydro"]);
    }
    if(colors.includes(colorMapping["Nuclear"])){
        finalOrderedColors.push(colorMapping["Nuclear"]);
    }
    if(colors.includes(colorMapping["Thermal"])){
        finalOrderedColors.push(colorMapping["Thermal"]);
    }
    colors=finalOrderedColors;
    





    // Extract colors based on the "Type" field
    console.log(colors);






    return { data: formattedData, colors: colors };
}