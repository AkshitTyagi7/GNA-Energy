import ChartLabelValue from "./Model";

interface SourceData {
    Generator: string;
    source: string;
    Actual_Mus: number;
  }
  

  
  function ConvertSourceDataToChart(data: SourceData[]): ChartLabelValue {
    const sourceCount: { [key: string]: number } = {};
    const labels: string[] = [];
    const values: GLfloat[] = [];
    const backgroundColor: string[] = [];
  
    data.forEach((entry) => {
      const source = entry.source;
        sourceCount[source] = (sourceCount[source] || 0) + entry.Actual_Mus;
    });
  
    Object.keys(sourceCount).forEach((source) => {
      labels.push(source);
      values.push(sourceCount[source]);
    });
  
    return { labels, values, backgroundColor };
  }
  
  // Given source data
  const sourceData: SourceData[] = [
    // ... (as provided in the question)
  ];
  
  // Count the occurrences of each source
  const chartData: ChartLabelValue = ConvertSourceDataToChart(sourceData);
  
  // Output the result


export default ConvertSourceDataToChart;