interface DataEntry {
    [key: string]: string | number;
}

export function FormatAtlasData(inputData: DataEntry[], selectedLegend: string[]): { data: (string | number)[][], colors: string[], } {
    if (inputData.length === 0) {
        return { data: [], colors: [] };
    }

    // Extract desired keys
    let colorKeys: 
    {
        "key":string,
        "title":string,
        "color":string,
       
    
    }[]= [
        {
            "key":"solar",
            "title":"Solar",
            "color":"orange"
       
        },
        {
            "key":"wind",
            "title":"Wind",
            "color":"green"
         
        },
        {
            "key":"bio",
            "title":"Bio Power",
            "color":"lightgreen"
       
        },
        {
            "key":"hydro",
            "title":"Hydro",
            "color":"blue"
    
        },
        {
            "key":"nuclear",
            "title":"Nuclear",
            "color":"red"
         
        },
        {
            "key":"thermal",
            "title":"Thermal",
            "color":"yellow"
           
        },
    ];
    const keysToInclude: string[] = ["Latitude", "Longitude","Name of Project","Type","ID"];
    const colorKeysToInclude: {
        "key":string,
        "title":string,
        "color":string,
        "value":number
       
    }[]
     = [];
    colorKeys.map((item)=>{
        if(selectedLegend.toString().toLowerCase().includes(item.title.toString().toLowerCase())){
            colorKeysToInclude.push(
                {
                    "key":item.key,
                    "title":item.title,
                    "color":item.color,
                    "value":0
                }
            );
            
        }
    }

    )
    colorKeysToInclude.forEach((item, index) => {
        item.value = 2 + index * 0.1;
    });
    const header: string[] = keysToInclude.slice();


    const formattedData: (string | number)[][] = [header, ...inputData.map(entry => keysToInclude.map(key => {
        if (key === "Type") {
            const vkey: number = colorKeysToInclude.find((item)=>entry[key].toString().toLowerCase().includes(item.key))?.value || 0;
            return vkey || 0; 
        }
        if(key==="Name of Project" &&  entry[key] === "" || entry[key] === null){
            return entry["Owner"];
        }
        return entry[key];
    }))];
    // console.log(formattedData);
    let colors: string[]=[];
    formattedData.map((item)=>{
        colorKeysToInclude.map((colorItem)=>{
            if(item[3]===colorItem.value && !colors.includes(colorItem.color)){
                colors.push(colorItem.color);
            }
        }
        )
    });
     let sortedColors: string[]=[];
    colorKeys.map((colorItem)=>{
        if(colors.includes(colorItem.color)){
            sortedColors.push(colorItem.color);
        }
    });

    return { data: formattedData, colors: sortedColors};
}