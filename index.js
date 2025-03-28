const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// 미들웨어
app.use(cors({ origin: "http://localhost:3000" })); // CORS 설정 명시
app.use(express.json());

// MongoDB 연결
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 라우트
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reviews", require("./routes/reviews")); // 리뷰 라우트 추가

app.get("/", (req, res) => {
  res.send("Digiocean MERN Server");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);
