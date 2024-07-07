import React, { useEffect } from "react";
import Chart, { ReactGoogleChartEvent } from "react-google-charts";
import { FormatAtlasData } from "./ConvertData";
import AtlasData from "./DemoAtlas.json";
import {ReactComponent as Cross} from '../../../icons/cross.svg'
import "./Atlas.css";
import ReactSelect from "react-select";
export function PowerAtlas() {
  const colorMapping: {
    [key: string]: string;
  } = {
    "Solar": "orange",
    "Wind": "green",
    "Thermal": "yellow",
    "Hydro": "blue",
    "Nuclear": "red",
    "Bio Power": "lightgreen",
  }

  const [atlasData, setAtlasData] = React.useState<any>({
    data:[]
  });
  let [selectedLegend, setSelectedLegend] = React.useState<string[]>([]);
  const [data, setData] = React.useState(FormatAtlasData(AtlasData.data, getSelectedLegends()));



  useEffect(() => {
    fetchAtlasData();
  }, [])
  const [selectedPlant, setSelectedPlant] = React.useState<any>();

  function chartEvents(dataChart: any): ReactGoogleChartEvent[] {return [
    {
      eventName: "select",
      callback({ chartWrapper, props, eventArgs }: { chartWrapper: any, props: any, eventArgs: any }) {
        const selectedId = chartWrapper.getChart().getSelection();
  
        if (selectedId.length) {
          const selectedRow = selectedId[0].row;
          setSelectedPlant(atlasData.data.find((item: any) => item["ID"] === data.data[selectedRow+1][4]));
      
        } else {

        }
      }
    },
    {
      eventName: "ready",
      callback: ({ chartWrapper, google }: {
        chartWrapper: any,
        google: any
      }) => {
      }
    }
  ];}
  return (
    <>
      <h1
        className="text-2xl center text-center mt-2 ">
        Power Atlas
      </h1>
      <div className="legend flex justify-center space-x-2 mt-3 mb-2">

        {


          Object.keys(colorMapping).map((key, index) => {

            return (
              <div
                onClick={() => {
                  if (selectedLegend.includes(key)) {
                    selectedLegend = selectedLegend.filter((item) => item !== key);
                    handleFilterData();
                    setSelectedLegend(selectedLegend);
                  } else {
                    selectedLegend.push(key);
                    handleFilterData();
                  }
                }}
                className="flex justify-center space-x-2 ">
                <div className="w-5 h-5 rounded-full" style={{ background: colorMapping[key] }}></div>
                <span className={

                  selectedLegend.includes(key) ? "font-bold" : ""

                }>{key}</span>
              </div>
            );
          })

        }

      </div>

      <div className="absolute left-12 ml-1 mt-1 z-10 flex justify-center">
      </div>


      <div className="fixed  right-8 z-10 flex justify-center">

      

        <div className="plantInfo bg-white rounded-t-lg shadow-lg">
         
          {selectedPlant &&
           <><div className="flex justify-between items-center p-1 pl-4 pr-4 align-middle	 ">
              <h1 className="text-lg">Plant Info</h1>
              <button
                onClick={() => {
                  setSelectedPlant(null);
                } }
                className="text-lg ">
                <Cross />
              </button>
            </div><table className="generatorTable">
                <thead>
                </thead>
                <tbody>
                  {Object.keys(selectedPlant).map((key, index) => {
                    if (key.includes("Latitude") || key.includes("Longitude") || key.includes("ID")) {
                      return null;
                    }
                    return (
                      <tr key={index}>
                        <th className="text-sm">{key}</th>
                        <td className="border text-sm	 ">{selectedPlant[key]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table></>
          }
        </div>
      </div>
      <center>
        {data.data.length > 0 &&
          <Chart
            chartType="GeoChart"
            width="97%"
            height="100%"
            data={data.data.map(subArray => subArray.slice(0, 4))}

            chartEvents={chartEvents(data.data)}
           chartWrapperParams={{
            view: { columns: [0, 1, 2, 3] 
            },
           }}
            
            options={{
      
              legend: 'none',
              resolution: 'provinces',
              sizeAxis: { minValue: 0, maxValue: 100 },
              enableRegionInteractivity: true,
              region: 'IN',
              colorAxis: { colors: data.colors },
              displayMode: 'markers',
              domain: 'IN',
              // is3D: true,
              backgroundColor: "#81d4fa",
              // datalessRegionColor: "rgb(255 255 255)",
              defaultColor: "#f5f5f5",
            }}
          />}
      </center></>
  );

  async function fetchAtlasData() {
    // https://datahub.gna.energy/power_atlas_api
    const response = await fetch("https://datahub.gna.energy/power_atlas_api");
    const res = await response.json();
    setAtlasData(res);
    setData(FormatAtlasData(res.data, getSelectedLegends()));
  }

  function handleSelectChange(selectedRow: any) {
      }

 async function handleFilterData() {
  setData(FormatAtlasData(AtlasData.data, getSelectedLegends()));
  // sleep for a second
  await new Promise(r => setTimeout(r, 100));
  let filteredAtlasData = atlasData.data;
    if (selectedLegend.length > 0) {
      filteredAtlasData = atlasData.data.filter((item: any) => selectedLegend.includes(item["Type"]));
    }
    else {
      filteredAtlasData = atlasData.data;
    }

   
    setData(FormatAtlasData(filteredAtlasData, getSelectedLegends()));
    console.log("--------------------------", "Date when filtering")
    console.log(data);
  }
  function getSelectedLegends(): string[]{
    if(selectedLegend.length===0){
      return Object.keys(colorMapping);
    }
    return selectedLegend;
  }
  function onlyUnique(value: any, index: any, array: any) {
    return array.indexOf(value) === index;
  }
}