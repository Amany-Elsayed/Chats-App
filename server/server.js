const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const socket = require("./socket");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "https://amany-elsayed.github.io",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

socket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
