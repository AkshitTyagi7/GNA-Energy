import React, { useEffect, useState } from "react";
import { BarChart } from "../../../../../components/charts/Charts";
import GetChartOptions from "../../../../../components/charts/data/GetChartOption";
import { DemoMahaGencoDataJson } from "./DemoMahaGenco";
import MahaGencoChart, { IdTitle, MahaGencoFilter } from "./Models";
import { SmallButton } from "../../../../../components/Button";
import Menu from "react-select/dist/declarations/src/components/Menu";
import { Filters, Generators } from "./Data";
import { PrimaryColor, SecondaryColor } from "../../../../../common";
import Select, { components, MultiValueGenericProps } from 'react-select';
import { ReactComponent as UpIcon } from '../../../../../icons/up.svg';
import { ReactComponent as DownIcon } from '../../../../../icons/down.svg';

export default function MahaGenco() {
    const [selectedLegend, setSelectedLegend] = React.useState<string[]>([]);
    const MahagencoFilters: MahaGencoFilter[] = Filters as MahaGencoFilter[];
    const [generator, selectGenerator] = useState<string[]>([Generators[0]])
    const [selectedFilter, setSelectedFilter] = React.useState<string | null>(Filters[0].name);
    const [selectedSubFilter, setSelectedSubFilter] = React.useState<IdTitle | null>(Filters[0].subfilters[0]);
    const [chartData, setChartData] = React.useState<MahaGencoChart>(MahaGencoChart.fromJson(DemoMahaGencoDataJson));

    useEffect(() => {
        FetchFilterData(
            {
                subfilter: selectedSubFilter?.title as string,
                generator: generator
            }
        );
    },[])
    return (
        <>
            <div className="flex space-x-1 justify-center">

            </div>
            <div className="flex space-x-1 justify-between">
                <div className="w-1/2 h-full border-r justify-star
t">
                    <SearchGenerator />
                    <div className="mt-2">
                        {
                            MahagencoFilters.map((item) => {
                                return (
                                    <div className="mt-1">
                                        <div className="filterItem flex justify-between align-middle"
                                            onClick={() => {
                                                setSelectedFilter(selectedFilter === item.name ? null : item.name);

                                            }}
                                            style={
                                                {
                                                    "background": PrimaryColor,
                                                    "color": "white"
                                                }

                                            }>
                                            {item.name}
                                            {/* <UpIcon width={20} height={20} color="white" className={
                        selectedFilter ===item.name ? "whiteIcon" : "blackIcon"
                        } 
                         /> */}
                                            {
                                                selectedFilter === item.name ? <UpIcon width={20} height={20} className="whiteIcon" /> : <DownIcon width={15} height={15} className="whiteIcon" />
                                            }
                                        </div>
                                        <div style={{
                                            "display": selectedFilter === item.name ? "block" : "none"

                                        }}>
                                            <SubMenu

                                                subfilters={item.subfilters} /></div></div>

                                )
                            })
                        }
                    </div>

                </div>
                <div className="mahagencoGraph justify-center text-center mt-10">
                    <div>
                    <h2 className="text-2xl text-slate-500 mt-5	">{
                        selectedSubFilter?.title
                    }</h2>
                    <div className="flex justify-center space-x-10 mt-5">
                        <div
                        onClick={()=>{
                            if (selectedLegend.includes("Actual")) {
                                setSelectedLegend(selectedLegend.filter((item) => item !== "Actual"));
                            } else {
                                setSelectedLegend([...selectedLegend, "Actual"]);
                            }
    
                        }}
                        className="flex justify-center space-x-2 ">
                            <div className="w-5 h-5" style={{background:selectedLegend.includes("Actual") ? SecondaryColor : "#cccccd"}}></div>
                            <span>Actual</span>
                        </div>
                        <div 
                        onClick={()=>{
                            if (selectedLegend.includes("Nomative")) {
                                setSelectedLegend(selectedLegend.filter((item) => item !== "Nomative"));
                            } else {
                                setSelectedLegend([...selectedLegend, "Nomative"]);
                            }
                        }}
                        className="flex justify-center space-x-2">
                            <div className="w-5 h-5" style={{background:selectedLegend.includes("Nomative") ? PrimaryColor : "#cccccd"}}></div>
                            <span>Nomative</span>
                            </div>
                    </div></div>
                    <BarChart className='' isRawData={true} data={chartData.toDataSet(
                        selectedLegend.length == 0 ? true : selectedLegend.includes("Actual"),
                        selectedLegend.length == 0 ? true : selectedLegend.includes("Nomative"),
                    )} options={GetChartOptions({ yLabelText: chartData.data[0]?.unit ?? '', displayYLabel: true, displayLegend: false, maintainAspectRatio: true })} />
                </div>
            </div>
        </>

    )

    function SearchGenerator() {
        return (<Select
            closeMenuOnSelect={false}
            isMulti
            styles={{
                multiValueLabel: (base: any) => ({
                    ...base,
                    backgroundColor: PrimaryColor,
                    color: 'white',
                }),
            }}
            onChange={(value) => {
                selectGenerator(
                    value.map((item) => {
                        return item.value;
                    })
                );
                FetchFilterData(
                    {
                        subfilter: selectedSubFilter?.id as string,
                        generator: value.map((item) => {
                            return item.value;
                        })
                    }
                );

            }}
            defaultValue={[
                ...generator.map((item) => { { return { label: item, value: item } } })
            ]}
            options={
                Generators.map((item) => {
                    return {
                        label: item,
                        value: item,
                    }
                })
            } />)
    }

    function FetchFilterData({ subfilter, generator }: { subfilter: string, generator: string[] }) {
        if(subfilter===null || generator.length===0){
            chartData.data=[];
            setChartData(chartData);
        }
        let filterForm = new FormData();

        filterForm.append("generator", generator.toString());
        filterForm.append("param", subfilter.toString() as string);

        fetch("http://13.233.117.192/mahagenco_api", {
            method: "POST",
            body: filterForm
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setChartData(MahaGencoChart.fromJson(data));
        })
    }

    function SubMenu({ subfilters }: { subfilters: IdTitle[] }) {

        return (
            <div className="flex flex-col ml-5">
                {
                    subfilters.map((item) => {
                        return <div
                            onClick={async () => {
                                setSelectedSubFilter(item);
                                // selectedSubFilter===item.id;
                                FetchFilterData(
                                    {
                                        subfilter: item.id,
                                        generator: generator
                                    }

                                );
                            }
                            }
                            className="flex justify-between subfilterItem" style={{ "background": selectedSubFilter?.id === item.id ? SecondaryColor : "#cccccd" }}>
                            <span style={{
                                color: selectedSubFilter?.id === item.id ? "white" : "black"
                            }}>{item.title}</span>

                        </div>
                    })
                }
            </div>


        )
    }
}