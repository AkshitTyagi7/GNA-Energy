import Select from "react-select";

export const searchStyle = {
    valueContainer: (base: any) => ({
      ...base,
      maxHeight: 40,
      overflowY: "auto",
    }),
    multiValue: (base: any, state: { data: { isFixed: any } }) => {
      return state.data.isFixed ? { ...base, backgroundColor: "gray" } : base;
    },
    multiValueLabel: (base: any, state: { data: { isFixed: any } }) => {
      return state.data.isFixed
        ? { ...base, fontWeight: "bold", color: "white", paddingRight: 6 }
        : base;
    },
    multiValueRemove: (
      base: any,
      state: {
        data: {
          value: any;
          isFixed: any;
        };
      }
    ) => {
      return state.data.isFixed ? { ...base, display: "none" } : base;
    },
  }

  export function SearchBox({options, selectedOptions, onChange, placeholder, isMany}: {options: any[], selectedOptions: any[], onChange: any, placeholder: string, isMany?: boolean}){
    return <Select
    placeholder={placeholder}
    value={selectedOptions.map((option) => ({
      ...option,
      isFixed: false,
    }))}
    isMulti={isMany}
    onChange={onChange}
    styles={searchStyle}
    options={options}
  />
  }