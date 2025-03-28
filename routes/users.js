const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { auth } = require("../middleware/auth");

// 사용자 목록 조회 (관리자만)
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "관리자 권한이 필요합니다." });
  }
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err.message);
    res.status(500).json({ message: "사용자 조회 중 오류가 발생했습니다." });
  }
});

// 사용자 삭제 (관리자만)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "관리자 권한이 필요합니다." });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    if (user._id.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "자신의 계정은 삭제할 수 없습니다." });
    }
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: "사용자가 삭제되었습니다." });
  } catch (err) {
    console.error("Delete user error:", err.message);
    res.status(500).json({ message: "사용자 삭제 중 오류가 발생했습니다." });
  }
});

// 사용자 역할 변경 (관리자만)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "관리자 권한이 필요합니다." });
  }
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "유효하지 않은 역할입니다." });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    if (user._id.toString() === req.user.id && role !== "admin") {
      return res
        .status(400)
        .json({ message: "자신의 역할을 변경할 수 없습니다." });
    }
    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error("Update user role error:", err.message);
    res.status(500).json({ message: "역할 변경 중 오류가 발생했습니다." });
  }
});

module.exports = router;
