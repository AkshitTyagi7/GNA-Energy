
interface MarketMonitoringState {
    tabIndex: number;
  }
export interface Product {
    id: number;
    name: string;
  }
  
  export interface Filter {
    id: number;
    name: string;
    products: Product[];
  }