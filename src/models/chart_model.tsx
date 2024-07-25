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
    legendColor?:string;
    stackId?: string;
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

  interface BrushIndex{
    startIndex: number;
    endIndex: number;
  }

export interface ChartArguements {
    data: ReChartData[];
    legends: LegendKey[];
    legendBreakIndex?: number;
    syncid?: string;
    unit?: string;
    xDataKey: string;
  
    xTick? : any ; 
    barCategoryGap?: number;
    xLabel?: string;
    onlyTitle?: boolean;
    xAxisPosition?: string;
    disableLegend?: boolean;
    yAxisWidth?: number;
    xaxisHeight? : number;
        secondXDataKey?: string;
    yAxisLabel?: string;
    fontSize?: number;
    isTimeSlot?: boolean;
    hidePrice?: boolean;
    showBrush?: boolean;
    brushHeight?: number;

    brushIndex?: BrushIndex;
    brushStart?: BrushStart;
    secondYAxisLabel?: string;
    showSecondYAxis?: boolean;
  

  }

