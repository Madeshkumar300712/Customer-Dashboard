import { useSelector } from "react-redux";
import { filterOrdersByDate, getChartData } from "../../utils/dataAggregator";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList
} from "recharts";

export default function ChartWidget({ config, type }) {
  const orders = useSelector(s => s.orders.items);
  const dateFilter = useSelector(s => s.dashboard.dateFilter);
  const filtered = filterOrdersByDate(orders, dateFilter);
  const { xAxis = "Product", yAxis = "Total amount", chartColor = "#54bd95", showDataLabel } = config || {};
  const data = getChartData(filtered, xAxis, yAxis);
  const color = chartColor || "#54bd95";

  const commonProps = {
    data,
    children: [
      <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#2a3040" />,
      <XAxis key="x" dataKey="name" tick={{ fill: "#7a8299", fontSize: 14 }} />,
      <YAxis key="y" tick={{ fill: "#7a8299", fontSize: 14 }} />,
      <Tooltip key="tip" contentStyle={{ background: "#161921", border: "1px solid #2a3040", borderRadius: 8, fontSize: 15 }} />,
    ]
  };

  const renderChart = () => {
    if (type === "Line Chart") return (
      <LineChart {...commonProps}>
        {commonProps.children}
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color }}>
          {showDataLabel && <LabelList dataKey="value" position="top" style={{ fill: "#e8ecf4", fontSize: 13 }} />}
        </Line>
      </LineChart>
    );
    if (type === "Area Chart") return (
      <AreaChart {...commonProps}>
        {commonProps.children}
        <Area type="monotone" dataKey="value" stroke={color} fill={color + "33"} />
      </AreaChart>
    );
    if (type === "Scatter Plot") return (
      <ScatterChart {...commonProps}>
        {commonProps.children}
        <Scatter dataKey="value" fill={color} />
      </ScatterChart>
    );
    return (
      <BarChart {...commonProps}>
        {commonProps.children}
        <Bar dataKey="value" fill={color} radius={[4,4,0,0]}>
          {showDataLabel && <LabelList dataKey="value" position="top" style={{ fill: "#e8ecf4", fontSize: 13 }} />}
        </Bar>
      </BarChart>
    );
  };

  return (
    <div style={{ height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">{renderChart()}</ResponsiveContainer>
    </div>
  );
}