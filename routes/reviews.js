const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

// 리뷰 작성 (인증 필요)
router.post("/", auth, async (req, res) => {
  const { content } = req.body;
  try {
    if (!content) {
      return res.status(400).json({ message: "리뷰 내용을 입력해주세요." });
    }

    console.log("req.user:", req.user);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const review = new Review({
      content,
      userId: req.user.id,
      email: user.email,
    });
    await review.save();
    const populatedReview = await Review.findById(review._id).populate(
      "userId",
      "name"
    );
    res.status(201).json(populatedReview);
  } catch (err) {
    console.error("Create review error:", err.message);
    res.status(500).json({ message: "리뷰 작성 중 오류가 발생했습니다." });
  }
});

// 리뷰 조회 (모든 리뷰)
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().populate("userId", "name");
    res.json(reviews);
  } catch (err) {
    console.error("Fetch reviews error:", err.message);
    res.status(500).json({ message: "리뷰 조회 중 오류가 발생했습니다." });
  }
});

// 리뷰 삭제 (인증 필요, 본인 또는 관리자)
router.delete("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "리뷰를 찾을 수 없습니다." });
    }
    if (review.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "본인의 리뷰만 삭제할 수 있습니다." });
    }
    await Review.deleteOne({ _id: req.params.id });
    res.json({ message: "리뷰가 삭제되었습니다." });
  } catch (err) {
    console.error("Delete review error:", err.message);
    res.status(500).json({ message: "리뷰 삭제 중 오류가 발생했습니다." });
  }
});

// 리뷰 수정 (인증 필요, 본인 또는 관리자)
router.put("/:id", auth, async (req, res) => {
  const { content } = req.body;
  try {
    if (!content) {
      return res.status(400).json({ message: "리뷰 내용을 입력해주세요." });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "리뷰를 찾을 수 없습니다." });
    }
    if (review.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "본인의 리뷰만 수정할 수 있습니다." });
    }

    review.content = content;
    await review.save();
    const updatedReview = await Review.findById(review._id).populate(
      "userId",
      "name"
    );
    res.json(updatedReview);
  } catch (err) {
    console.error("Update review error:", err.message);
    res.status(500).json({ message: "리뷰 수정 중 오류가 발생했습니다." });
  }
});

module.exports = router;
