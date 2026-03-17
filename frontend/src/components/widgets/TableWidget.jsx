import { useState } from "react";
import { useSelector } from "react-redux";
import { filterOrdersByDate } from "../../utils/dataAggregator";

const FIELD_MAP = {
  "Customer ID": o => o._id?.slice(-6),
  "Customer name": o => `${o.firstName} ${o.lastName}`,
  "Email id": "email", "Phone number": "phone",
  "Address": o => `${o.street}, ${o.city}`,
  "Order ID": o => o._id?.slice(-8),
  "Order date": o => new Date(o.createdAt).toLocaleDateString(),
  "Product": "product", "Quantity": "quantity",
  "Unit price": o => `$${o.unitPrice}`,
  "Total amount": o => `$${o.totalAmount?.toFixed(2)}`,
  "Status": "status", "Created by": "createdBy",
};

export default function TableWidget({ config }) {
  const orders = useSelector(s => s.orders.items);
  const dateFilter = useSelector(s => s.dashboard.dateFilter);
  const filtered = filterOrdersByDate(orders, dateFilter);
  const [page, setPage] = useState(0);

  const {
    columns = ["Customer name","Product","Status","Total amount"],
    sortBy = "", pagination = 10,
    fontSize = 14, headerBg = "#54bd95",
  } = config || {};

  let data = [...filtered];
  if (sortBy === "Ascending") data.sort((a,b) => a.totalAmount - b.totalAmount);
  if (sortBy === "Descending") data.sort((a,b) => b.totalAmount - a.totalAmount);
  if (sortBy === "Order date") data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  const perPage = parseInt(pagination) || 10;
  const total = Math.ceil(data.length / perPage);
  const paged = data.slice(page * perPage, (page + 1) * perPage);

  const getVal = (o, col) => {
    const k = FIELD_MAP[col];
    if (!k) return "";
    return typeof k === "function" ? k(o) : o[k];
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ overflowX: "auto", flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize }}>
          <thead>
            <tr>
              {columns.map(c => (
                <th key={c} style={{
                  background: headerBg, color: "#fff", padding: "8px 12px",
                  textAlign: "left", fontSize: fontSize - 1, whiteSpace: "nowrap",
                }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((o, i) => (
              <tr key={o._id} style={{ borderBottom: "1px solid var(--border)", background: i%2===0?"transparent":"var(--surface2)" }}>
                {columns.map(c => (
                  <td key={c} style={{ padding: "7px 12px", whiteSpace: "nowrap" }}>{getVal(o, c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 1 && (
        <div style={{ display: "flex", gap: 6, padding: "8px 0", justifyContent: "center" }}>
          {Array.from({ length: total }, (_, i) => (
            <button key={i} onClick={() => setPage(i)} className="btn" style={{
              padding: "4px 10px", fontSize: 15,
              background: page === i ? "var(--accent)" : "var(--surface2)",
              color: page === i ? "#0d0f14" : "var(--text-muted)",
            }}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}