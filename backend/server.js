require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const http      = require("http");
const { Server }= require("socket.io");
const connectDB = require("./config/db");

connectDB();
const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: "*" } });

app.set("io", io);
app.use(cors());
app.use(express.json());

app.use("/api/auth",          require("./routes/authRoutes"));
app.use("/api/orders",        require("./routes/orderRoutes"));
app.use("/api/dashboard",     require("./routes/dashboardRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));
