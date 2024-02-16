export interface subfilter {
    id: number;
    name: string;
  }
  
  export interface Filter {
    id: number;
    name: string;
    filters: subfilter[];
  }

  export const Filters = [
    {
        id: 1,
        name: "Exchange",
        filters: [
            { id: 1, name: "HPX" },
            { id: 2, name: "IEX" },
            { id: 3, name: "PXIL" },
        ],
        },
        {
        id: 2,
        name: "Product",
        filters: [
            { id: 1, name: "DAM" },
            { id: 2, name: "RTM" },
            { id: 3, name: "GDAM" },
            { id: 4, name: "HPDAM" },
        ],
        },
        {
        id: 3,
        name: "Region",
        filters: [
            { id: 1, name: "NRLDC" },
            { id: 2, name: "SRLDC" },
            { id: 3, name: "ERLDC" },
            { id: 4, name: "WRLDC" },
            {id: 5, name: "NERLDC" },
        ],
        
    }
  ];
