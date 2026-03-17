import KPIWidget from "../widgets/KPIWidget";
import ChartWidget from "../widgets/ChartWidget";
import PieWidget from "../widgets/PieWidget";
import TableWidget from "../widgets/TableWidget";

export default function WidgetRenderer({ widget }) {
  const { type, config } = widget;
  if (type === "KPI Value") return <KPIWidget config={config} />;
  if (type === "Pie Chart") return <PieWidget config={config} />;
  if (type === "Table") return <TableWidget config={config} />;
  return <ChartWidget config={config} type={type} />;
}