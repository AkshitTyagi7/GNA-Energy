import React, { useEffect } from "react";
import Chart, { ReactGoogleChartEvent } from "react-google-charts";
import { FormatAtlasData } from "./ConvertData";
import AtlasData from "./DemoAtlas.json";
import "./Atlas.css";
import ReactSelect from "react-select";
export function PowerAtlas() {
  const [atlasData, setAtlasData] = React.useState<any>({
    data:[]
  });
  const [data, setData] = React.useState(FormatAtlasData(AtlasData.data));

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
  let [selectedLegend, setSelectedLegend] = React.useState<string[]>([]);

  useEffect(() => {
    fetchAtlasData();
  }, [])
  const [selectedPlant, setSelectedPlant] = React.useState<any>();

  const chartEvents: ReactGoogleChartEvent[] = [
    {
      eventName: "select",
      callback({ chartWrapper }: { chartWrapper: any }) {
        const selectedId = chartWrapper.getChart().getSelection();
        if (selectedId.length) {
          setSelectedPlant(atlasData.data[selectedId[0].row])
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
  ];
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
                    selectedLegend = selectedLegend.filter((item) => item !== key)
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
        {/* <ReactSelect
          className="w-96"
        options={atlasData.data.map((item: any) => {
          return {
            label: item["Name of Project"],
            value: item["Name of Project"],
          }
        }
        ).filter(
          onlyUnique

        )
      } onChange={(e) => {
          const selectedPlant = atlasData.data.find((item: any) => item["Plant Name"] === e);
          if (selectedPlant) {
            setSelectedPlant(selectedPlant);
          }
        }} /> */}
      </div>


      <div className="fixed  right-8 z-10 flex justify-center">

      

        <div className="plantInfo bg-white rounded-t-lg shadow-lg">
          {selectedPlant &&
            <table className="generatorTable">
              <thead>
              </thead>
              <tbody>
                {Object.keys(selectedPlant).map((key, index) => {
                  if (key.includes("Latitude") || key.includes("Longitude")) {
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
            </table>
          }
        </div>
      </div>
      <center>
        {data.data.length > 0 &&
          <Chart
            chartType="GeoChart"
            width="97%"
            height="100%"
            data={data.data}

            chartEvents={chartEvents}
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
    // http://13.233.117.192/power_atlas_api
    const response = await fetch("http://13.233.117.192/power_atlas_api");
    const res = await response.json();
    setAtlasData(res);
    setData(FormatAtlasData(res.data));
  }

  function handleFilterData() {
    let filteredData;
    if (selectedLegend.length > 0) {
      filteredData = atlasData.data.filter((item: any) => selectedLegend.includes(item["Type"]));
    }
    else {
      filteredData = atlasData.data;
    }
    setData(FormatAtlasData(filteredData));
  }
  function onlyUnique(value: any, index: any, array: any) {
    return array.indexOf(value) === index;
  }
}