import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUser } from "../../../pages/Protected";

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
interface DiscomData {
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
    plf: [];
    total_cost: [];
}

class DiscomArguments {
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

    }
}

const fetchDiscomData = createAsyncThunk(
    "discom/fetchDiscomData",
    async (args: DiscomArguments) => {
        const res = await fetch("https://datahub.gna.energy/attribution_analysis_api", {
            method: "POST",
            body: args.getFormData()
        });
        return res.json();
    }
);


const DiscomSlice = createSlice({
    name: "discom",
    initialState: {
        data: {
            data: [] as TableRecord[],
        } as DiscomData,
        arguments: new DiscomArguments(),
        loading: false,
        error: false,
    },
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
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
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDiscomData.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchDiscomData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchDiscomData.rejected, (state) => {
            state.loading = false;
            state.error = true;
        });
    }
});

export default DiscomSlice.reducer;
export  const { setData, setArguments, setLoading, setError } = DiscomSlice.actions;
export { fetchDiscomData };