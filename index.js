const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// CORS 설정 (Cloudflare 프론트엔드 도메인 추가)
app.use(
  cors({
    origin: ["http://localhost:3000", "https://digiocean-mern-fn.pages.dev"],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 라우트
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/users", require("./routes/users"));

app.get("/", (req, res) => {
  res.send("Digiocean MERN Server is Running!");
});

// 서버 실행 (0.0.0.0 추가)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
