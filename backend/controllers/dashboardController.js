const Dashboard = require("../models/Dashboard");

const TEMPLATES = [
  {
    name: "Sales Overview",
    isTemplate: true,
    templateName: "sales",
    category: "Sales",
    description: "Revenue KPIs, product breakdown, order status",
    widgets: [
      { id:"t1", type:"KPI Value",   title:"Total Revenue",    x:0, y:0, w:3, h:2, config:{ metric:"Total amount",  aggregation:"Sum",   dataFormat:"Currency", decimalPrecision:2 }},
      { id:"t2", type:"KPI Value",   title:"Total Orders",     x:3, y:0, w:3, h:2, config:{ metric:"Quantity",      aggregation:"Count", dataFormat:"Number",   decimalPrecision:0 }},
      { id:"t3", type:"KPI Value",   title:"Avg Order Value",  x:6, y:0, w:3, h:2, config:{ metric:"Total amount",  aggregation:"Average", dataFormat:"Currency", decimalPrecision:2 }},
      { id:"t4", type:"Bar Chart",   title:"Revenue by Product", x:0, y:2, w:7, h:5, config:{ xAxis:"Product", yAxis:"Total amount", chartColor:"#00d4aa" }},
      { id:"t5", type:"Pie Chart",   title:"Orders by Status",   x:7, y:2, w:5, h:5, config:{ chartData:"Status", showLegend:true }},
    ],
  },
  {
    name: "Revenue Report",
    isTemplate: true,
    templateName: "revenue",
    category: "Finance",
    description: "Avg value, trends, detailed order table",
    widgets: [
      { id:"r1", type:"KPI Value",   title:"Avg Order Value",  x:0, y:0, w:3, h:2, config:{ metric:"Total amount", aggregation:"Average", dataFormat:"Currency", decimalPrecision:2 }},
      { id:"r2", type:"KPI Value",   title:"Total Revenue",    x:3, y:0, w:3, h:2, config:{ metric:"Total amount", aggregation:"Sum",     dataFormat:"Currency", decimalPrecision:2 }},
      { id:"r3", type:"Line Chart",  title:"Revenue Trend",    x:0, y:2, w:9, h:5, config:{ xAxis:"Product", yAxis:"Total amount", chartColor:"#3b82f6" }},
      { id:"r4", type:"Table",       title:"Order Details",    x:0, y:7, w:12,h:4, config:{ columns:["Customer name","Product","Total amount","Status","Order date"], pagination:10 }},
    ],
  },
  {
    name: "Operations Monitor",
    isTemplate: true,
    templateName: "operations",
    category: "Operations",
    description: "Order status funnel, pending alerts, team performance",
    widgets: [
      { id:"o1", type:"KPI Value",    title:"Pending Orders",   x:0, y:0, w:2, h:2, config:{ metric:"Status",       aggregation:"Count", dataFormat:"Number", decimalPrecision:0 }},
      { id:"o2", type:"Funnel Chart", title:"Order Pipeline",   x:2, y:0, w:5, h:4, config:{} },
      { id:"o3", type:"Pie Chart",    title:"By Created By",    x:7, y:0, w:5, h:4, config:{ chartData:"Created by", showLegend:true }},
      { id:"o4", type:"Table",        title:"Pending Orders",   x:0, y:4, w:12,h:4, config:{ columns:["Customer name","Product","Quantity","Status","Created by"], sortBy:"Ascending" }},
    ],
  },
  {
    name: "Executive Summary",
    isTemplate: true,
    templateName: "executive",
    category: "Management",
    description: "High-level KPIs + AI insights for leadership",
    widgets: [
      { id:"e1", type:"KPI Value",    title:"Total Revenue",    x:0, y:0, w:3, h:2, config:{ metric:"Total amount", aggregation:"Sum",   dataFormat:"Currency", decimalPrecision:0 }},
      { id:"e2", type:"KPI Value",    title:"Total Orders",     x:3, y:0, w:3, h:2, config:{ metric:"Quantity",     aggregation:"Count", dataFormat:"Number",   decimalPrecision:0 }},
      { id:"e3", type:"KPI Value",    title:"Completed",        x:6, y:0, w:3, h:2, config:{ metric:"Status",       aggregation:"Count", dataFormat:"Number",   decimalPrecision:0 }},
      { id:"e4", type:"AI Insights",  title:"AI Summary",       x:0, y:2, w:6, h:3, config:{} },
      { id:"e5", type:"Bar Chart",    title:"Product Revenue",  x:6, y:2, w:6, h:5, config:{ xAxis:"Product", yAxis:"Total amount", chartColor:"#8b5cf6" }},
    ],
  },
  {
    name: "Product Performance",
    isTemplate: true,
    templateName: "product",
    category: "Product",
    description: "Which products drive revenue and volume",
    widgets: [
      { id:"p1", type:"Bar Chart",  title:"Revenue by Product",  x:0, y:0, w:7, h:5, config:{ xAxis:"Product", yAxis:"Total amount", chartColor:"#f59e0b" }},
      { id:"p2", type:"Pie Chart",  title:"Volume by Product",   x:7, y:0, w:5, h:5, config:{ chartData:"Product", showLegend:true }},
      { id:"p3", type:"KPI Value",  title:"Top Revenue",         x:0, y:5, w:3, h:2, config:{ metric:"Total amount", aggregation:"Sum",     dataFormat:"Currency", decimalPrecision:2 }},
      { id:"p4", type:"KPI Value",  title:"Units Sold",          x:3, y:5, w:3, h:2, config:{ metric:"Quantity",     aggregation:"Sum",     dataFormat:"Number",   decimalPrecision:0 }},
      { id:"p5", type:"Area Chart", title:"Sales Trend",         x:0, y:7, w:12,h:4, config:{ xAxis:"Product", yAxis:"Quantity", chartColor:"#f59e0b" }},
    ],
  },
  {
    name: "Customer Analytics",
    isTemplate: true,
    templateName: "customer",
    category: "Customers",
    description: "Orders by country, customer behaviour, heatmap",
    widgets: [
      { id:"c1", type:"Pie Chart",   title:"Orders by Country", x:0, y:0, w:5, h:5, config:{ chartData:"Status", showLegend:true }},
      { id:"c2", type:"Heatmap",     title:"Activity Heatmap",  x:5, y:0, w:7, h:4, config:{} },
      { id:"c3", type:"Table",       title:"Customer List",     x:0, y:5, w:12,h:4, config:{ columns:["Customer name","Email id","Product","Total amount","Status","Order date"], pagination:10 }},
      { id:"c4", type:"KPI Value",   title:"Unique Customers",  x:0, y:9, w:3, h:2, config:{ metric:"Customer name", aggregation:"Count", dataFormat:"Number", decimalPrecision:0 }},
    ],
  },
];

exports.getDashboards = async (req, res) => {
  try {
    const list = await Dashboard.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getTemplates = async (_req, res) => res.json(TEMPLATES);

exports.getDashboard = async (req, res) => {
  try {
    const dash = await Dashboard.findOne({ _id: req.params.id, userId: req.user._id });
    if (!dash) return res.status(404).json({ message: "Not found" });
    res.json(dash);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createDashboard = async (req, res) => {
  try {
    const dash = await Dashboard.create({ ...req.body, userId: req.user._id });
    res.status(201).json(dash);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.saveDashboard = async (req, res) => {
  try {
    const dash = await Dashboard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body, { new: true }
    );
    res.json(dash);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteDashboard = async (req, res) => {
  try {
    await Dashboard.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.duplicateDashboard = async (req, res) => {
  try {
    const src = await Dashboard.findOne({ _id: req.params.id, userId: req.user._id }).lean();
    if (!src) return res.status(404).json({ message: "Not found" });
    const { _id, createdAt, updatedAt, __v, ...rest } = src;
    const copy = await Dashboard.create({ ...rest, name: `${src.name} (copy)` });
    res.status(201).json(copy);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.renameDashboard = async (req, res) => {
  try {
    const dash = await Dashboard.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name: req.body.name }, { new: true }
    );
    res.json(dash);
  } catch (err) { res.status(400).json({ message: err.message }); }
};