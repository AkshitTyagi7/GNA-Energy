import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUser } from "../../../pages/Protected";
import swal from "sweetalert";
import { buildFormDataRequest, HttpMethod } from "../../../Rest_api/network_utility";

export interface TableRecord {

    Actual_Mus: number;
    Adjusted_Availability: string;
    Adjusted_Mus: number;
    Adjusted_variable_charge: number;
    Availability: string | number;
    Generator: string;
    actual_cost: number;
    allocated_capactity: number;
    cap_util: number;
    variable_charge: number;
    variable_cost: number;
}

export enum SortType {
    ASC,
    DESC
}

export interface SortState {
    sortType: SortType;
    sortColumn: string;
}

export interface GeneratorData{
    Generator: string;
    [key: string]: number | string;
}

export interface DiscomData {
    active_month: string | undefined;
    data: TableRecord[];
    cost: number[];
    date_list: string[];
    weighted_avg: GeneratorData[];
    source: GeneratorData[];
    ppa: GeneratorData[];
    ownership: GeneratorData[];
    net_charge: GeneratorData[];
    mus: any;
    max_mus: number;
    status: number;
    energy_charge: GeneratorData[];
    eff_rate: GeneratorData[];
    cost_of_gen: GeneratorData[];
    cap_util: (string | number)[][];
    ppa_util: (string | number)[][];
    plf: (string | number)[][];
    total_cost: (string | number)[][];
}

class DiscomArguments {
    date_list?: string;
    active_cost?: number;
    active_gen?: string;
    active_gen_val?: number;
    active_charge?: string;
    active_charge_val?: number;
    active_mus?: number;
    


    constructor(date_list?: string, active_cost?: number, active_gen?: string, active_gen_val?: number, active_charge?: string, active_charge_val?: number, active_mus?: number) {
        this.date_list = date_list;
        this.active_cost = active_cost;
        this.active_gen = active_gen;
        this.active_gen_val = active_gen_val;
        this.active_charge = active_charge;
        this.active_charge_val = active_charge_val;
        this.active_mus = active_mus;


    }

    getFormData() {
        let formData = new FormData();

        for (const key in this) {
            if (this[key] !== undefined) {
                formData.append(key, String(this[key]));
            }
        }
        formData.append('token', getUser().accessToken!);

        return formData;
    }

    

    reset() {
        delete this.active_cost;
        delete this.active_gen;
        delete this.active_gen_val;
        delete this.active_charge;
        delete this.active_charge_val;
        delete this.active_mus;
        return this;

    }

    copyWith(newData: Partial<DiscomArguments>) {
        return new DiscomArguments(
            newData.date_list !== undefined ? newData.date_list : this.date_list,
            newData.active_cost !== undefined ? newData.active_cost : this.active_cost,
            newData.active_gen !== undefined ? newData.active_gen : this.active_gen,
            newData.active_gen_val !== undefined ? newData.active_gen_val : this.active_gen_val,
            newData.active_charge !== undefined ? newData.active_charge : this.active_charge,
            newData.active_charge_val !== undefined ? newData.active_charge_val : this.active_charge_val,
            newData.active_mus !== undefined ? newData.active_mus : this.active_mus
        );
    }

}

const fetchDiscomData = createAsyncThunk(
    "discom/fetchDiscomData",
    async (args: DiscomArguments) => {
        const res = await buildFormDataRequest({endpoint:"data/attribution_analysis_api", 
            method:HttpMethod.POST,
            // method: "POST",
            body: args
        });
        return res;
    }
);


const DiscomSlice = createSlice({
    name: "discom",
    initialState: {
        data: {
            active_month: undefined,
            data: [],
            cost: [],
         
            date_list: [],
            weighted_avg: [],
            source: [],
            ppa: [],
            ownership: [],
            net_charge: [],
            mus: {},
            max_mus: 0,
            status: 0,
            energy_charge: [],
            eff_rate: [],
            cost_of_gen: [],
            cap_util: [],
            ppa_util: [],
            plf: [],
            total_cost: [],
        } as DiscomData,
        tableType: "plan",
        sortState: {
            sortType: SortType.ASC,
            sortColumn: "Generator"
        } as SortState ,
        arguments: new DiscomArguments(),
        chartIndex: 0,
        pageIndex: 0,
        loading: false,
        error: false,
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
        setTableType: (state, action) => {  
            state.tableType = action.payload;
        },
        setTableData: (state, action) => {
            state.data.data = action.payload;
        },

        setChartIndex: (state, action) => {
            state.chartIndex = action.payload;
        },
        setArguments: (state, action) => {
            state.arguments = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setSort: (state, action) => {
            state.sortState = action.payload;
        },
        clearArguments: (state) => {
           // Clear all arguments except date_list and refetch data
            state.arguments.reset();
        },
        changePlf: (state, action) => {
            state.arguments.active_gen = action.payload.generator;
            state.arguments.active_gen_val = action.payload.value;
        },
        setPageIndex: (state, action) => {
            state.pageIndex = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDiscomData.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
     
                state.arguments.date_list = action.payload.date_list[0];
            
        });
        builder.addCase(fetchDiscomData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchDiscomData.rejected, (state) => {
            state.loading = false;
            swal("Please Try Again", "", "warning");
            state.error = true;
        });
    }
});


export default DiscomSlice.reducer;
export  const { setData,clearArguments,setSort,setPageIndex, setTableType , setTableData, setArguments, setLoading, setError,setChartIndex } = DiscomSlice.actions;
export { fetchDiscomData };