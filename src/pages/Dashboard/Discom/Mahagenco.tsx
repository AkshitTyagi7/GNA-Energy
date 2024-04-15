import React, { useEffect, useState } from "react";
import MahaGencoChart, { IdTitle, MahaGencoFilter } from "./Models";
import { Filters, Generators } from "./Data";
import { DemoMahaGencoDataJson } from "../AttributeAnalysis/attributteAnalysis/DemoMahaGenco";
import "./Discom.css";
import GetChartOptions from "../../../components/charts/data/GetChartOption";
import { BarChart } from "../../../components/charts/Charts";
import Select from "react-select";
import { PrimaryColor, SecondaryColor } from "../../../common";
import { searchStyle } from "../../../components/Search";
import {
  LegendItem,
  MediumLegendItem,
} from "../../../components/charts/ReCharts";

import { ReactComponent as UpIcon } from '../../../icons/up.svg';
import { ReactComponent as DownIcon } from '../../../icons/down.svg';

export default function MahaGenco() {
  const [selectedLegend, setSelectedLegend] = React.useState<string[]>([]);
  const MahagencoFilters: MahaGencoFilter[] = Filters as MahaGencoFilter[];
  const [generator, selectGenerator] = useState<string[]>([Generators[0]]);
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(
    Filters[0].name
  );
  const [selectedSubFilter, setSelectedSubFilter] =
    React.useState<IdTitle | null>(Filters[0].subfilters[0]);
  const [chartData, setChartData] = React.useState<MahaGencoChart>(
    MahaGencoChart.fromJson(DemoMahaGencoDataJson)
  );
  useEffect(() => {
    FetchFilterData({
      subfilter: selectedSubFilter?.id as string,
      generator: generator,
    });
  }, []);
  return (
    <div className="body-container">
      <div className="discom-left-container">
        <SearchGenerator />
        {MahagencoFilters.map((item) => {
          return (
            <div className="discom-mahagenco-filter">
              <div className="discom-filter-head" 
              onClick={
                () => {
                  setSelectedFilter(selectedFilter === item.name ? null : item.name);
                }
              }
              >{item.name} {
                selectedFilter === item.name ? <UpIcon width={20} height={20} className="whiteIcon" /> : <DownIcon width={15} height={15} className="whiteIcon" />
              }</div>
              {
              
              selectedFilter == item.name &&  
              item.subfilters.map((subItem) => {
                return (
                  <>
                    <div
                      className={`discom-filter-item ${
                        selectedSubFilter?.id === subItem.id
                          ? "discom-filter-item-selected"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedSubFilter(subItem);
                        FetchFilterData({
                          subfilter: subItem.id,
                          generator: generator,
                        });
                      }}
                    >
                      {subItem.title}
                    </div>
                    <hr />
                  </>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="discom-right-container">
        <div className="discom-mahagenco-chart-container">
          <div className="chartHeading">{selectedSubFilter?.title}</div>
          <div className="mahagenco-chart-legend">
            <MediumLegendItem color={PrimaryColor} name="Actual MUs" />
            <MediumLegendItem color={SecondaryColor} name="Adjusted MUs" />
          </div>
          <BarChart
            className=""
            isRawData={true}
            data={chartData.toDataSet(
              selectedLegend.length == 0
                ? true
                : selectedLegend.includes("Actual"),
              selectedLegend.length == 0
                ? true
                : selectedLegend.includes("Nomative")
            )}
            options={GetChartOptions({
              yLabelText: chartData.data[0]?.unit ?? "",
              displayYLabel: true,
              displayLegend: false,
              maintainAspectRatio: true,
            })}
          />
        </div>
      </div>
    </div>
  );

  function SearchGenerator() {
    return (
      <Select
        closeMenuOnSelect={false}
        isMulti
        onChange={(value) => {
          selectGenerator(
            value.map((item) => {
              return item.value;
            })
          );
          FetchFilterData({
            subfilter: selectedSubFilter?.id as string,
            generator: value.map((item) => {
              return item.value;
            }),
          });
        }}
        defaultValue={[
          ...generator.map((item) => {
            {
              return { label: item, value: item };
            }
          }),
        ]}
        options={Generators.map((item) => {
          return {
            label: item,
            value: item,
          };
        })}
        styles={searchStyle as any}
      />
    );
  }

  function FetchFilterData({
    subfilter,
    generator,
  }: {
    subfilter: string;
    generator: string[];
  }) {
    if (subfilter === null || generator.length === 0) {
      chartData.data = [];
      setChartData(chartData);
    }
    let filterForm = new FormData();

    filterForm.append("generator", generator.toString());
    filterForm.append("param", subfilter.toString() as string);

    fetch("https://datahub.gna.energy/mahagenco_api", {
      method: "POST",
      body: filterForm,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setChartData(MahaGencoChart.fromJson(data));
      });
  }
}
