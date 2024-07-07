import Select from "react-select";
import { IdTitle } from "./SubMenu";

interface Option{
    value: number;
    label: string;
}

export default function StartEndDate({options, onStartMonthChange, onEndMonthChange, startMonth, endMonth}:{options: {id: number, title: string}[], onStartMonthChange: (selectedOption: any) => void, onEndMonthChange: (selectedOption: any) => void, startMonth: Option, endMonth: Option}){
return <div className="flex space-x-2">
              <Select
                placeholder="Start Month"
                className="dateSelect"
                options={options.map((item) => {
                  if (
                    endMonth.value === -1 ||
                    parseInt(item.id.toString()) <
                      parseInt(endMonth.value.toString())
                  ) {
                    return {
                      value: item.id,
                      label: item.title,
                    };
                  } else {
                    return {
                      value: item.id,
                      label: item.title,
                      isDisabled: true,
                    };
                  }
                })}
                onChange={(selectedOption) => {

                  startMonth = {
                    value: selectedOption!.value as number,
                    label: selectedOption!.label,
                  };

                    onStartMonthChange(startMonth);
                }}
              />
              <Select
                placeholder="End Month"
                className="dateSelect"
                // options that are ahead of the start month
                options={options.map((item) => {
                  if (
                    parseInt(item.id.toString()) >
                    parseInt(startMonth.value.toString())
                  ) {
                    return {
                      value: item.id,
                      label: item.title,
                    };
                  } else {
                    return {
                      value: item.id,
                      label: item.title,
                      isDisabled: true,
                    };
                  }
                })}
                onChange={(selectedOption) => {
                  endMonth = {
                    value: selectedOption!.value as number,
                    label: selectedOption!.label,
                  };
                    onEndMonthChange(endMonth);
                  // fetchVolumeData();
                }}
              />
            </div>
}