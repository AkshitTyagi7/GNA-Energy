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
  
      // If the source is not in sourceCount, initialize it with 1; otherwise, increment the count
      sourceCount[source] = (sourceCount[source] || 0) + entry.Actual_Mus;
    });
  
    // Populate labels and values arrays
    Object.keys(sourceCount).forEach((source) => {
      labels.push(source);
      values.push(sourceCount[source]);
      // Optional: You can set background colors here if needed
      // backgroundColor.push("#RRGGBB"); // Replace with actual color codes
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