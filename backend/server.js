require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const http       = require("http");
const { Server } = require("socket.io");
const connectDB  = require("./config/db");

connectDB();

const app    = express();
const server = http.createServer(app);

// Allow ALL origins in production (you can tighten this later)
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Maddy's API is running" });
});

app.use("/api/auth",          require("./routes/authRoutes"));
app.use("/api/orders",        require("./routes/orderRoutes"));
app.use("/api/dashboard",     require("./routes/dashboardRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

io.on("connection", socket => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Disconnected:", socket.id));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));