import React, { useState, useEffect } from 'react';
import Select from 'react-select';
// import { ShimmerTable } from "react-shimmer-effects";
import Slider from './Slider';
import TotalCard from '../card/Card';
import './AnalysisTable.css';
import { BarChart, PieChart, PrepareGraphData } from '../../../../components/charts/Charts';
import GetEnergyData, { ConvertEnergyData } from '../../../../components/charts/data/EnergyChargeData';
import '../../../../components/charts/Charts';
import GetChartOptions from '../../../../components/charts/data/GetChartOption';
import { ConvertVariableData } from '../../../../components/charts/data/VariableRateData';
import ConvertSourceData from '../../../../components/charts/data/Source';
import { ConvertCostData } from '../../../../components/charts/data/CostOfGeneration';
import ConvertOwnershipData from '../../../../components/charts/data/Ownership';
import ConvertPPAData from '../../../../components/charts/data/Ppa';
import { ConvertCapacityUtilData } from '../../../../components/charts/data/CapacityUtilData';
import { ConvertNetGenerationData } from '../../../../components/charts/data/NetChargeData';
import { COST, COST_UNIT, ENERGY_UNIT } from '../../../../Units';
import { ConvertTotalCostData } from '../../../../components/charts/data/TotalCostData';
import { Bar } from 'react-chartjs-2';
import { ConvertData } from '../../../../components/charts/data/TotalUnitData';
import { ConvertPpaUtil } from '../../../../components/charts/data/PpaUtil';
import ChartLabelValue from '../../../../components/charts/data/Model';


interface TableRecord {

    Actual_Mus: number;
    Adjusted_Availability: string;
    Adjusted_Mus: number;
    Adjusted_variable_charge: number;
    Availability: string;
    Adjusted_Energy_charge: number;
    Generator: string;
    Net_generation: number;
    actual_cost: number;
    allocated_capactity: number;
    cap_util: number;
    variable_charge: number;
    variable_cost: number;
}


class AtrributeArguments {
    date_list?: string;
    active_cost?: number;
    active_gen?: string;
    active_gen_val?: number;
    active_charge?: string;
    active_charge_val?: number;
    active_mus?: number;

    constructor(date_list?: string, active_cost?: number, active_gen?: string, active_gen_val?: number, active_charge?: string, active_charge_val?: number) {
        this.date_list = date_list;
        this.active_cost = active_cost;
        this.active_gen = active_gen;
        this.active_gen_val = active_gen_val;
        this.active_charge = active_charge;
        this.active_charge_val = active_charge_val;
        this.active_mus = this.active_mus;


    }

    getFormData() {
        let formData = new FormData();

        for (const key in this) {
            if (this[key] !== undefined) {
                formData.append(key, String(this[key]));
            }
        }

        return formData;
    }
}

interface Mus {
    // {Actual -Mus: 2315.73, Adjusted Mus: 1904.61, Optimal Mus: 1904.61}
    Actual_Mus: number;
    Adjusted_Mus: number;
    Optimal_Mus: number;

}
interface Data {
    active_month: string;
    data: TableRecord[];
    cost: string[];
    date_list: string[];
    weighted_avg: [];
    source: [];
    ppa: [];
    ownership: [];
    net_charge: [];
    mus: any;
    energy_charge: [];
    eff_rate: [];
    cost_of_gen: [];
    cap_util: [];
    ppa_util: [];
    total_cost: [];
}


interface Props {
    GeneratorChartData: { id: number; year: number; userGain: number; userLost: number }[];
}

function TableRow({
    record,
    onAdjustedNetChange,
    onAdjustedVariableChange,
    maxOptimalMus,
    isAdjusted,
}: {
    record: TableRecord;
    onAdjustedVariableChange: (adjustedMus: number, generator: string) => void;
    onAdjustedNetChange: (adjustedMus: number, generator: string) => void;
    maxOptimalMus: number;
    isAdjusted: boolean;
}) {
    return (
        <tr>
            <td>
                <div className='tablefield'>{record.Generator}</div>
            </td>
            <td className='actualmu '>

                <div className='tablefield'>{isAdjusted ? record.Adjusted_Mus : record.Actual_Mus}</div>
            </td>
            <td className='optimalmu'>
                <div className='tablefield'>{isAdjusted ? record.Adjusted_variable_charge : record.variable_charge}</div>
            </td>
            <td>
                <div className='tablefield'>
                    {isAdjusted ? <Slider
                        currentValue={(parseFloat(record.Adjusted_Availability.toString().replace('%', '').replace(' ' ,'')) * 100).toFixed(2)}
                        minValue={0}
                        maxValue={100}
                        onChange={(v: any) => onAdjustedNetChange(v, record.Generator)}
                    /> : (parseFloat(record.Availability.toString().replace('%', '')) * 100).toFixed(2)}
                </div>
            </td>
            <td>
                <div className='tablefield'>
                    {isAdjusted ?
                        <Slider
                            currentValue={isAdjusted ? record.Adjusted_variable_charge : record.variable_charge}
                            minValue={0}
                            maxValue={20}
                            onChange={(v: any) => onAdjustedVariableChange(v, record.Generator)}
                        /> : record.variable_charge}
                </div>
            </td>
        </tr>
    );
}

export default function AnalysisTable() {
    const [tableRecords, setTableRecords] = useState<TableRecord[]>([]);
    const [data, setData] = useState<Data>({ data: [], cost: ['-', '-', '-'], date_list: [], weighted_avg: [], source: [], ppa: [], ownership: [], net_charge: [], energy_charge: [], eff_rate: [], cost_of_gen: [], cap_util: [], total_cost: [], ppa_util: [], mus: {}, active_month:"" });
    const [date, selectDate] = useState<string | undefined>(undefined);
    const [maxOptimalMus, setMaxOptimalMus] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [isFirst, setisFirst] = useState(true);
    const [isAdjusted, setIsAdjusted] = useState(true);
    const [req, setReq] = useState(new AtrributeArguments());
    const [msedChartIndex, setMSEDChartIndex] = useState(0);
    const [mahagencoChartIndex, setMahagencoChartIndex] = useState(0);

    useEffect(() => {
        // setData(DemoSourceData as unknown as Data);
        // setLoading(false);
        // setTableRecords(DemoSourceData.data as unknown as TableRecord[]);
        // let maxAdjusted_Mus = DemoSourceData.data.reduce((prev, current) => (prev.Adjusted_Mus > current.Adjusted_Mus ? prev : current));
        //     setMaxOptimalMus(maxAdjusted_Mus.Adjusted_Mus);

        fetchTableData();
    }, []);
    
    return (
        <div className='AnalysisBody'>

            <div className='item1'>
                <TableArea />
            </div>
            <div className='item2'>
                <Cards />
                <div className='chartArea flex'>

                    <div className='row'>

                        <div className='col mahagenco'>
                            <div className='centreRow'>
                                MSED
                            </div>
                            <div className='gapRow mahagenco'>
                                <MSEDButton buttonTitle={'Total Generation'} index={0} />
                                <MSEDButton buttonTitle={'Total Cost'} index={1} />
                                <MSEDButton buttonTitle={'Energy Charge'} index={2} />
                                {/* <MSEDButton buttonTitle={'Plant Load Factor'} index={3} /> */}
                            </div>
                            <div className='col-2'>
                                <Bar className='' data={
                                    msedChartIndex === 0 ? ConvertData(data.data) :
                                        msedChartIndex === 1 ? PrepareGraphData(ConvertTotalCostData(data.total_cost)) :
                                            msedChartIndex === 2 ? PrepareGraphData(ConvertVariableData(data.eff_rate)) :
                                                msedChartIndex === 3 ? PrepareGraphData(ConvertPpaUtil(data.ppa_util)) : { labels: [], datasets: [] }
                                }
                                    options={
                                        msedChartIndex === 0 ? GetChartOptions({ textTitle: `Total Generation (${ENERGY_UNIT})`, yLabelText: ENERGY_UNIT, displayYLabel: true, displayLegend: true }) :
                                            msedChartIndex === 1 ? GetChartOptions({ textTitle: `Total Cost (${COST})`, yLabelText: COST, displayYLabel: true, displayLegend: false }) :
                                                msedChartIndex === 2 ? GetChartOptions({ textTitle: `Variable Energy Charge (${COST_UNIT})`, yLabelText: COST_UNIT, displayYLabel: true, displayLegend: false }) : {}
                                        // msedChartIndex === 3 ? GetChartOptions({ textTitle: `Plant Load Factor (%)`, yLabelText: "%", displayYLabel: true, displayLegend: false }) : {}
                                    } />
                            </div>
                        </div>
                        <div className='col mahagenco'>
                            <div className='centreRow'>
                                MAHAGENCO
                            </div>
                            <div className='gapRow'>
                                {/* <MahagencoButton buttonTitle={'Total Generation'} index={0} /> */}
                                <MahagencoButton buttonTitle={'Generation Cost'} index={0} />
                                <MahagencoButton buttonTitle={'Energy Charge'} index={1} />
                                <MahagencoButton buttonTitle={'Plant Load Factor'} index={2} />
                            </div>
                            <div className='col-2'>
                                <BarChart data={
                                    // mahagencoChartIndex === 0 ? ConvertNetGenerationData(data.net_charge) :
                                    mahagencoChartIndex === 0 ? ConvertCostData(data.cost_of_gen) :
                                        mahagencoChartIndex === 1 ? ConvertEnergyData(data.energy_charge) :
                                            mahagencoChartIndex === 2 ? ConvertCapacityUtilData(data.data) : {} as ChartLabelValue
                                }
                                    options={
                                        // mahagencoChartIndex === 0 ? GetChartOptions({ textTitle: `Total Generation (${ENERGY_UNIT})`, yLabelText: ENERGY_UNIT, displayYLabel: true, displayLegend: false }) :
                                        mahagencoChartIndex === 0 ? GetChartOptions({ textTitle: `Generation Cost (${COST_UNIT})`, yLabelText: COST_UNIT, displayYLabel: true, displayLegend: false }) :
                                            mahagencoChartIndex === 1 ? GetChartOptions({ textTitle: `Energy Charge (${COST_UNIT})`, yLabelText: COST_UNIT, displayYLabel: true, displayLegend: false }) :
                                                mahagencoChartIndex === 2 ? GetChartOptions({ textTitle: `Plant Load Factor (%)`, yLabelText: "%", displayYLabel: true, displayLegend: false }) : []
                                    } />
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-3 pie'>
                            <PieChart data={ConvertSourceData(data.source)} options={GetChartOptions({ textTitle: "Source", yLabelText: "MUs", displayYLabel: true, displayLegend: true, isSmallLegend: true })} />
                        </div>
                        <div className='col-3 pie' >
                            <PieChart data={ConvertOwnershipData(data.ownership)} options={GetChartOptions({ textTitle: "Ownership", yLabelText: "MUs", displayYLabel: true, displayLegend: false, isSmallLegend: true })} />
                        </div>
                        <div className='col-3 pie'>
                            <PieChart data={ConvertPPAData(data.ppa)} options={GetChartOptions({
                                textTitle: "PPA",
                                yLabelText: "MUs",
                                displayYLabel: true,
                                isSmallLegend: true,
                                displayLegend: true,
                            })} />
                        </div>
                    </div>
                </div>
            </div>

        </div>


    );
    function SearchSelect() {
        return (
            <><h1 className='title-5'>Discom Analytics</h1><Select
                className='select'
                options={data.date_list.map((date) => ({ value: date, label: date }))}
                value={date && { value: date, label: date }}
                onChange={(e) => {
                    selectDate(e ? e.value : undefined);
                    req.date_list = e ? e.value : undefined;
                    fetchTableData();
                    // fetchTableData({ date_list: e ? e.value : undefined });
                }} /></>
        )
    }

    function MahagencoButton({ buttonTitle, index }: { buttonTitle: string; index: number; }) {
        return (
            <button className={`btn rectangle btn-primary btn-small ${mahagencoChartIndex === index ? 'btn-active' : ''}`}
                onClick={
                    () => {
                        setMahagencoChartIndex(index);
                    }
                }
            >{
                    buttonTitle
                }</button>);
    };

    function MSEDButton({ buttonTitle, index }: { buttonTitle: string; index: number; }) {
        return (
            <button className={`btn rectangle btn-primary btn-small ${msedChartIndex === index ? 'btn-active' : ''}`}
                onClick={
                    () => {
                        setMSEDChartIndex(index);
                    }
                }
            >{
                    buttonTitle
                }</button>);
    }

    function TableArea() {
        return (<div>    <SearchSelect />

            <div className='gapRow'>
                <button className={`btn rectangle btn-primary btn-small ${!isAdjusted ? 'btn-active' : ''}`}
                    onClick={
                        () => {
                            setIsAdjusted(false);
                            // setData(actualData ? actualData : data);
                        }
                    }
                >
                    Actual
                </button>

                <button className={`btn rectangle btn-primary btn-small ${isAdjusted ? 'btn-active' : ''}`}
                    onClick={
                        () => {
                            setIsAdjusted(true);
                        }
                    }
                > Adjusted</button>

            </div>
            <br />
            <div className='tableArea'>
                <AnalysisTableContent
                    tableRecords={tableRecords}
                    maxOptimalMus={maxOptimalMus}

                />


            </div>
            <br />
            <button
                className='btn btn-primary'
                onClick={() => {

                    fetchTableData();
                }}
            >
                Reset to optimal
            </button>

        </div>
        )
    }

    function AnalysisTableContent({
        tableRecords,
        maxOptimalMus,

    }: {
        tableRecords: TableRecord[];
        maxOptimalMus: number;
    }) {
        return (
            <>
                <table className='analysisTable'>
                    <thead>
                        <tr>
                            <th>Generator</th>
                            <th>MUs</th>
                            <th>Variable Cost</th>
                            <th>Plant Availability</th>
                            <th>Variable Charge</th>
                        </tr>
                    </thead>
                    {/* {tableRecords.map((record) => (
        <TableRow key={record.Generator} record={record} onChange={onChange} maxOptimalMus={maxOptimalMus} />
    ))} */}
                    {loading ?

                        // <ShimmerTable row={tableRecords.length > 0 ? tableRecords.length : 5} col={5} />
                        <p></p>
                        : tableRecords.map((record) => (
                            <TableRow
                                key={record.Generator}
                                record={record}
                                isAdjusted={isAdjusted}
                                onAdjustedNetChange={(v) => {


                                    req.active_gen_val = v;
                                    req.active_gen = record.Generator;
                                    setIsAdjusted(true);
                                    fetchTableData();
                                }}
                                onAdjustedVariableChange={(v) => {

                                    req.active_charge_val = v;
                                    req.active_charge = record.Generator;
                                    setIsAdjusted(true);
                                    fetchTableData();
                                }}
                                maxOptimalMus={maxOptimalMus} />
                        ))}
                </table></>
        );
    }

    function Cards() {
        return (
            <div className='cards'>
                <TotalCard totalAmount={data.mus['Adjusted Mus']} isEditable={true} totalText='Total Actual MUs' onEdit={
                    (v) => {
                        req.active_mus = v;
                        data.mus['Adjusted Mus'] = v;
                        fetchTableData();
                    }
                } />
                <TotalCard totalAmount={data.cost[0]} totalText='Total Actual Cost' />
                <TotalCard totalAmount={data.cost[2]} totalText='Total Adjusted Cost' />
            </div>
        );
    }

    async function fetchTableData() {
        try {
            setLoading(true);
            const response = await fetch('https://datahub.gna.energy/attribution_analysis_api', {
                method: 'POST',
                body: req.getFormData(),
            });
            const stringResponse = await response.text();

            const newdata: Data = await JSON.parse(stringResponse);
            const newRecords = newdata.data.map((element) => (
                element as TableRecord));
            let maxAdjusted_Mus = newRecords.reduce((prev, current) => (prev.Adjusted_Mus > current.Adjusted_Mus ? prev : current));
            setMaxOptimalMus(maxAdjusted_Mus.Adjusted_Mus);

            setData(newdata);
            setTableRecords(newRecords);

            if (isFirst == true) {
                setisFirst(false);
                setMahagencoChartIndex(0);
                req.date_list = newdata.date_list[0];
                selectDate(newdata.active_month);


            }
            setTableRecords(newRecords);
            setLoading(false);

        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    }
}
