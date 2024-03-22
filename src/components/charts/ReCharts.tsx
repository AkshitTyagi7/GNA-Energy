import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const COLORS = ["#34656D", "#F1935C", "#7CB5EC", "#333333", "#B8860B"];
interface chartData {
  [key: string]: number;
}

export interface LegendKey {
  name?: string;
  stroke?: string;
  dataKey: string;
  // color: string;
}
export function ReLineChart({
  data,
  legends,
  syncid,
  unit,
  xDataKey,
}: {
  data: chartData[];
  legends: string[] | LegendKey[];
  syncid?: string;
  unit?: string;
  xDataKey: string;
}) {
  return (
    <div className="chart-container">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-5">
        {legends.map((legend, index) => {
          return (
            <div className="realTime-Legend">
              <p style={{ color:   typeof legend === "string"
                    ? COLORS[
                        index > COLORS.length - 1
                          ? index - COLORS.length
                          : index
                      ]
                    : legend.stroke }}>
                {" "}
                <div
                  className="dot"
                  style={{ backgroundColor: typeof legend === "string" ? COLORS[index] : legend.stroke }}
                ></div>{" "}
                {typeof legend === "string" ? legend : legend.name}
              </p>
            </div>
          );
        })}
      </div>

      <ResponsiveContainer height={"80%"}>
        <LineChart syncId={syncid} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xDataKey} />
          <YAxis>
            {/* <Label value={"MWh"} angle={-90} position="insideLeft" style={{ textAnchor: "middle" }} /> */}
          </YAxis>
          <Tooltip
            formatter={(value, name, props) => {
              return [
                name +
                  " : " +
                  parseFloat(value.toString())
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                  " " +
                  unit,
              ];
            }}
          />

          {legends.map((legend, index) => {
            return (
              <Line
                key={index}
                type="monotone"
                name={typeof legend === "string" ? legend : legend.name}
                dataKey={typeof legend === "string" ? legend : legend.dataKey}
                stroke={
                  typeof legend === "string"
                    ? COLORS[
                        index > COLORS.length - 1
                          ? index - COLORS.length
                          : index
                      ]
                    : legend.stroke
                }
                dot={false}
                strokeWidth={2}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
