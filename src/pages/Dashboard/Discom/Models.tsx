// import { PrimaryColor, SecondaryColor } from "../../../../common";
// import { DemoMahaGencoDataJson } from "./DemoMahaGenco";

import { SecondaryColor, PrimaryColor } from "../../../common";

interface MahaGencoGeneratorData  {
    actual: number[];
    nomative: number[];
}

export interface IdTitle{
    id: string,
    title: string
}

interface MahaGencoGenerator {
    generator: string;
    unit: string;
    actual_param: number[];
    normative_param: number[];
}

export interface MahaGencoFilter {
    name: string;
    subfilters: IdTitle[];
}

class MahaGencoChart{
    constructor(
        public months: string[],
        public data: MahaGencoGenerator[],
    )
    {
        this.months = months;
        this.data = data;
    }

    static fromJson(json: any): MahaGencoChart {
        return new MahaGencoChart(
            json["months"],
            json["data"],
        );
    }

    static toJson(mahaGencoChart: MahaGencoChart): any {
        return {
            months: mahaGencoChart.months,
            data: mahaGencoChart.data,
        };
    }

    toDataSet(
        showActual=true,
        showNomative=true,
    ): any {
        console.log(this);
        let chartData = [];

for (let i = 0; i < this.data.length; i++) {
  let actualData = {
    label: this.data[i].generator + " Actual " + this.data[i].unit,
    data: this.data[i].actual_param,
    backgroundColor: SecondaryColor,
    borderRadius: 4
  };

  let nomativeData = {
    label: this.data[i].generator + " Nomative " + this.data[i].unit,
    data: this.data[i].normative_param,
    backgroundColor: PrimaryColor,
    borderRadius: 4,
    borderWidth: 2,


  };

  chartData.push(
    
    showActual ? actualData : {}, 
    showNomative ? nomativeData : {});
}

        return {
            labels: this.months,
            datasets: chartData,
            };
        }
    }


export default MahaGencoChart;

