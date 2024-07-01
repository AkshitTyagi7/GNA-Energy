import { NameType, Payload, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { COLORS } from "../components/recharts/ReCharts";

export interface ReChartData {
    [key: string]: number | string | Date | null | undefined;
  }
  
  export enum ChartType {
    Line,
    Bar,
  }
  
  export interface LegendKey {
    name?: string;
    stroke?: string;
    dataKey: string;
    type?: ChartType;
    yAxisId?: string;
    // color: string;
  }
  
  export const BAR_RADIUS: number | [number, number, number, number] = [
    4, 4, 0, 0,
  ];
  
  export function getColorList(length: number) {
    let colors = [];
    for (let i = 0; i < length; i++) {
      colors.push(COLORS[i % COLORS.length]);
    }
    return colors;
  }
  
  export enum BrushStart {
    Start,
    End,
  }

export interface ChartArguements {
    data: ReChartData[];
    legends: LegendKey[];
    syncid?: string;
    unit?: string;
    xDataKey: string;
    xTick? : any ; 
    xLabel?: string;
    yAxisWidth?: number;
    secondXDataKey?: string;
    yAxisLabel?: string;
    fontSize?: number;
    isTimeSlot?: boolean;
    showBrush?: boolean;
    brushHeight?: number;
    brushStart?: BrushStart;
    secondYAxisLabel?: string;

  }

