import { useSelector } from "react-redux";
import {
  filterOrdersByDate,
  getPreviousPeriodOrders,
  aggregate,
  calcTrend,
  getSparklineData,
} from "../../utils/dataAggregator";
import Sparkline from "./Sparkline.jsx";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function KPIWidget({ config }) {
  const orders     = useSelector(s => s.orders.items);
  const dateFilter = useSelector(s => s.dashboard.dateFilter);

  const {
    metric         = "Total amount",
    aggregation    = "Sum",
    dataFormat     = "Number",
    decimalPrecision = 0,
  } = config || {};

  const current  = filterOrdersByDate(orders, dateFilter);
  const previous = getPreviousPeriodOrders(orders, dateFilter);

  const currVal = aggregate(current,  metric, aggregation);
  const prevVal = aggregate(previous, metric, aggregation);
  const trend   = calcTrend(currVal, prevVal);

  const sparkData = getSparklineData(current, metric, 12);

  const format = (v) => {
    const n = parseFloat(v).toFixed(decimalPrecision);
    return dataFormat === "Currency" ? `$${Number(n).toLocaleString()}` : Number(n).toLocaleString();
  };

  const trendColor = trend.dir === "up" ? "#10b981" : trend.dir === "down" ? "#ef4444" : "#64748b";
  const TrendIcon  = trend.dir === "up" ? TrendingUp : trend.dir === "down" ? TrendingDown : Minus;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2px 0" }}>
      {/* Top: metric label */}
      <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
        {metric} · {aggregation}
      </div>

      {/* Middle: value + trend */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 6 }}>
        <div>
          <div style={{
            fontSize: "clamp(22px, 3vw, 32px)",
            fontFamily: "Outfit", fontWeight: 800,
            letterSpacing: "-0.03em", color: "var(--text)",
            lineHeight: 1.1,
          }}>
            {format(currVal)}
          </div>

          {/* Trend badge */}
          {dateFilter !== "All time" && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              marginTop: 6, padding: "3px 8px", borderRadius: 20,
              background: trendColor + "18",
              fontSize: 12, fontWeight: 600, color: trendColor,
            }}>
              <TrendIcon size={12} />
              {trend.pct.toFixed(1)}%
              <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: 11 }}>
                vs prev
              </span>
            </div>
          )}
        </div>

        {/* Sparkline */}
        <div style={{ opacity: 0.9 }}>
          <Sparkline
            data={sparkData}
            color={trend.dir === "down" ? "#ef4444" : "var(--accent)"}
            height={48}
            width={100}
          />
        </div>
      </div>

      {/* Previous period */}
      {dateFilter !== "All time" && (
        <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
          Previous: {format(prevVal)}
        </div>
      )}
    </div>
  );
}