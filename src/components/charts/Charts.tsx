import React from 'react';
import './Charts.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement

} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import ChartLabelValue from './data/Model';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  
  Title,
  Tooltip,
  Legend
);


const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
 const demoData = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};
export function PrepareGraphData(data: ChartLabelValue) {
  const labels: string[] = [];
  const values: GLfloat[] = [];
  // return demoData;
  return {labels: data.labels, datasets: [{label:'' ,data: data.values, backgroundColor: [
    '#34656D', '#F1935C', '#333333', '#7CB5EC', '#FF7F50', '#B8860B',
    ]}]};
}

export function  BarChart({ data, options, className='', isRawData=false}: {data: ChartLabelValue, options: any, className?: string, isRawData?: boolean}) {
  return <Bar options={options} data={isRawData ? data as any:  PrepareGraphData(data)}   className={className} />;
}

export function PieChart({ options, data, className=''}: {options: any, data: ChartLabelValue, className?: string}) {
  return <Pie options={options} data={PrepareGraphData(data)} className={className}/>;
};

export function LineChart({ options, data, className='' }: {options: any, data: ChartLabelValue, className?: string}) {
  return <Line options={options} data={PrepareGraphData(data)} className={className}/>;
};
 
