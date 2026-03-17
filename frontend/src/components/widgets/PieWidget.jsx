import { useSelector } from "react-redux";
import { filterOrdersByDate, getPieData } from "../../utils/dataAggregator";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#54bd95","#3d9eff","#f5a623","#ff5a5a","#c084fc","#38bdf8"];

export default function PieWidget({ config }) {
  const orders = useSelector(s => s.orders.items);
  const dateFilter = useSelector(s => s.dashboard.dateFilter);
  const filtered = filterOrdersByDate(orders, dateFilter);
  const { chartData = "Product", showLegend } = config || {};
  const data = getPieData(filtered, chartData);

  return (
    <div style={{ height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: "#161921", border: "1px solid #2a3040", borderRadius: 8, fontSize: 15 }} />
          {showLegend && <Legend wrapperStyle={{ fontSize: 14, color: "#7a8299" }} />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}