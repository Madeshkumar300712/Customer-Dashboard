import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function downloadCSV(orders) {
  const headers = ["ID","Name","Email","Phone","City","Country","Product","Qty","Unit Price","Total","Status","Created By","Date"];
  const rows = orders.map(o => [
    o._id?.slice(-6), `${o.firstName} ${o.lastName}`, o.email, o.phone,
    o.city, o.country, o.product, o.quantity,
    `$${o.unitPrice}`, `$${o.totalAmount?.toFixed(2)}`,
    o.status, o.createdBy, new Date(o.createdAt).toLocaleDateString(),
  ]);
  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `orders_export_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function generateInvoicePDF(order) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW  = 210; // page width
  const ACC = [0, 212, 170]; // accent teal

  // ── Header bar ──
  doc.setFillColor(...ACC);
  doc.rect(0, 0, PW, 48, "F");

  // Logo text
  doc.setTextColor(8, 11, 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("MADDY", 18, 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Customer Dashboard Builder Platform", 18, 30);
  doc.text("support@Maddy.com  ·  www.Maddy.com", 18, 36);

  // INVOICE label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("INVOICE", PW - 18, 22, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`#${String(order._id).slice(-8).toUpperCase()}`, PW - 18, 30, { align: "right" });
  doc.text(new Date().toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" }), PW - 18, 36, { align: "right" });

  // ── Two-column info section ──
  doc.setTextColor(30, 30, 30);
  let y = 60;

  // Bill To
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(14, y - 4, 86, 52, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("BILL TO", 18, y + 2);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(`${order.firstName} ${order.lastName}`, 18, y + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
  doc.text(order.email, 18, y + 17);
  doc.text(order.phone, 18, y + 23);
  doc.text(`${order.street}`, 18, y + 29);
  doc.text(`${order.city}, ${order.state} ${order.postalCode}`, 18, y + 35);
  doc.text(order.country, 18, y + 41);

  // Order Details
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(110, y - 4, 86, 52, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("ORDER DETAILS", 114, y + 2);
  const details = [
    ["Order ID",   `#${String(order._id).slice(-8).toUpperCase()}`],
    ["Status",     order.status],
    ["Created by", order.createdBy],
    ["Date",       new Date(order.createdAt).toLocaleDateString()],
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  details.forEach(([label, val], i) => {
    doc.setTextColor(120);
    doc.text(label, 114, y + 10 + i * 8);
    doc.setTextColor(30);
    doc.setFont("helvetica", "bold");
    doc.text(val, 192, y + 10 + i * 8, { align: "right" });
    doc.setFont("helvetica", "normal");
  });

  // ── Line items table ──
  const tableY = y + 58;
  autoTable(doc, {
    startY: tableY,
    margin: { left: 14, right: 14 },
    head: [["#", "Product / Service", "Qty", "Unit Price", "Amount"]],
    body: [[
      "01",
      order.product,
      order.quantity,
      `$${parseFloat(order.unitPrice).toFixed(2)}`,
      `$${parseFloat(order.totalAmount).toFixed(2)}`,
    ]],
    headStyles: {
      fillColor: ACC,
      textColor: [8, 11, 17],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 6,
    },
    bodyStyles: { fontSize: 10, cellPadding: 6 },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 16, halign: "center" },
      3: { cellWidth: 28, halign: "right" },
      4: { cellWidth: 28, halign: "right" },
    },
    alternateRowStyles: { fillColor: [250, 251, 253] },
    tableLineColor: [220, 225, 235],
    tableLineWidth: 0.2,
  });

  // ── Totals block ──
  const fy = doc.lastAutoTable.finalY + 6;
  const subtotal = parseFloat(order.totalAmount);
  const tax      = subtotal * 0.1;
  const total    = subtotal + tax;

  const totals = [
    ["Subtotal",    `$${subtotal.toFixed(2)}`, false],
    ["Tax (10%)",   `$${tax.toFixed(2)}`,      false],
    ["Total Due",   `$${total.toFixed(2)}`,    true ],
  ];

  let ty = fy;
  totals.forEach(([label, val, bold]) => {
    if (bold) {
      doc.setFillColor(...ACC);
      doc.roundedRect(PW - 80, ty - 4, 66, 12, 2, 2, "F");
      doc.setTextColor(8, 11, 17);
      doc.setFont("helvetica", "bold");
    } else {
      doc.setTextColor(80);
      doc.setFont("helvetica", "normal");
    }
    doc.setFontSize(10);
    doc.text(label, PW - 76, ty + 3);
    doc.text(val,   PW - 14,  ty + 3, { align: "right" });
    ty += 14;
  });

  // ── Notes / Thank you ──
  const noteY = ty + 10;
  doc.setDrawColor(...ACC);
  doc.setLineWidth(0.5);
  doc.line(14, noteY, PW - 14, noteY);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(130);
  doc.text("Thank you for your business! Payment is due within 30 days.", 14, noteY + 8);
  doc.text("For questions, contact support@halleyx.com", 14, noteY + 15);

  // ── Footer ──
  const pageH = doc.internal.pageSize.height;
  doc.setFillColor(240, 242, 245);
  doc.rect(0, pageH - 16, PW, 16, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(140);
  doc.text("Halleyx Dashboard Builder Platform  ·  Confidential", PW / 2, pageH - 6, { align: "center" });

  doc.save(`invoice_${String(order._id).slice(-8)}_${order.firstName}_${order.lastName}.pdf`);
}
export function downloadRevenueSummary(orders) {
  const byProduct = {};
  orders.forEach(o => {
    if (!byProduct[o.product]) byProduct[o.product] = { revenue: 0, count: 0 };
    byProduct[o.product].revenue += o.totalAmount || 0;
    byProduct[o.product].count  += 1;
  });

  const headers = ["Product", "Order Count", "Total Revenue", "Avg Order Value"];
  const rows = Object.entries(byProduct).map(([product, data]) => [
    product,
    data.count,
    `$${data.revenue.toFixed(2)}`,
    `$${(data.revenue / data.count).toFixed(2)}`,
  ]);

  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `revenue_summary_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadStatusReport(orders) {
  const byStatus = {};
  orders.forEach(o => {
    byStatus[o.status] = (byStatus[o.status] || 0) + 1;
  });

  const total   = orders.length;
  const headers = ["Status", "Count", "Percentage", "Total Revenue"];
  const rows    = Object.entries(byStatus).map(([status, count]) => {
    const revenue = orders
      .filter(o => o.status === status)
      .reduce((s, o) => s + (o.totalAmount || 0), 0);
    return [
      status,
      count,
      `${((count / total) * 100).toFixed(1)}%`,
      `$${revenue.toFixed(2)}`,
    ];
  });

  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `status_report_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}