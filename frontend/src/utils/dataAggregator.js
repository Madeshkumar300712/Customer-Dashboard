export function filterOrdersByDate(orders, filter) {
  if (filter === "All time") return orders;
  const now = new Date();
  const daysMap = { Today: 0, "Last 7 Days": 7, "Last 30 Days": 30, "Last 90 Days": 90 };
  const days = daysMap[filter] ?? 0;
  return orders.filter(o => {
    const diff = (now - new Date(o.createdAt)) / (1000 * 60 * 60 * 24);
    return diff <= (days === 0 ? 1 : days);
  });
}

export function getPreviousPeriodOrders(orders, filter) {
  if (filter === "All time") return [];
  const now = new Date();
  const daysMap = { Today: 1, "Last 7 Days": 7, "Last 30 Days": 30, "Last 90 Days": 90 };
  const days = daysMap[filter] ?? 7;
  return orders.filter(o => {
    const diff = (now - new Date(o.createdAt)) / (1000 * 60 * 60 * 24);
    return diff > days && diff <= days * 2;
  });
}

export function calcTrend(current, previous) {
  if (previous === 0 && current === 0) return { pct: 0, dir: "flat" };
  if (previous === 0) return { pct: 100, dir: "up" };
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  return { pct: Math.abs(pct), dir: pct > 0 ? "up" : pct < 0 ? "down" : "flat" };
}

export function aggregate(orders, metric, aggregation) {
  const fieldMap = {
    "Customer ID": "_id",
    "Customer name": o => `${o.firstName} ${o.lastName}`,
    "Email id": "email", "Address": "street",
    "Order date": "createdAt", "Product": "product",
    "Created by": "createdBy", "Status": "status",
    "Total amount": "totalAmount", "Unit price": "unitPrice",
    "Quantity": "quantity",
  };
  const key = fieldMap[metric];
  const values = orders.map(o => typeof key === "function" ? key(o) : o[key]);

  if (aggregation === "Count")   return values.length;
  if (aggregation === "Sum")     return values.reduce((a, v) => a + (parseFloat(v) || 0), 0);
  if (aggregation === "Average") {
    const nums = values.map(v => parseFloat(v) || 0);
    return nums.length ? nums.reduce((a, v) => a + v, 0) / nums.length : 0;
  }
  return values.length;
}

export function getSparklineData(orders, metric, buckets = 10) {
  if (!orders.length) return Array(buckets).fill(0);
  const sorted = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const size   = Math.ceil(sorted.length / buckets);
  const result = [];
  for (let i = 0; i < buckets; i++) {
    const slice = sorted.slice(i * size, (i + 1) * size);
    const val   = slice.reduce((s, o) => {
      if (metric === "Total amount") return s + (o.totalAmount || 0);
      if (metric === "Quantity")     return s + (o.quantity || 0);
      if (metric === "Unit price")   return s + (o.unitPrice  || 0);
      return s + slice.length;
    }, 0);
    result.push(val);
  }
  return result;
}

export function getChartData(orders, xAxis, yAxis) {
  const group = {};
  orders.forEach(o => {
    const xVal = getFieldValue(o, xAxis);
    const yVal = parseFloat(getFieldValue(o, yAxis)) || 1;
    group[xVal] = (group[xVal] || 0) + yVal;
  });
  return Object.entries(group).map(([name, value]) => ({ name, value }));
}

export function getPieData(orders, field) {
  const group = {};
  orders.forEach(o => {
    const val = getFieldValue(o, field) || "Unknown";
    group[val] = (group[val] || 0) + 1;
  });
  return Object.entries(group).map(([name, value]) => ({ name, value }));
}

function getFieldValue(o, field) {
  const map = {
    Product: "product", Quantity: "quantity",
    "Unit price": "unitPrice", "Total amount": "totalAmount",
    Status: "status", "Created by": "createdBy",
    Duration: o => Math.ceil((Date.now() - new Date(o.createdAt)) / 86400000) + "d",
  };
  const k = map[field];
  if (!k) return "";
  return typeof k === "function" ? k(o) : o[k];
}