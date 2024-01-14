import { PrimaryColor, SecondaryColor } from "../../../../../common";
import { DemoMahaGencoDataJson } from "./DemoMahaGenco";

interface MahaGencoGeneratorData  {
    actual: number[];
    nomative: number[];
}

interface MahaGencoGenerator {
    generator: string;
    unit: string;
    actual: number[];
    nomative: number[];
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
    data: this.data[i].actual,
    backgroundColor: SecondaryColor,
  };

  let nomativeData = {
    label: this.data[i].generator + " Nomative " + this.data[i].unit,
    data: this.data[i].nomative,
    backgroundColor: PrimaryColor,
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

