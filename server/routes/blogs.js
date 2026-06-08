import express from "express";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sort = "-createdAt",
    } = req.query;

    const query = { status: "approved" };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const total = await Blog.countDocuments(query);
    const blog = await Blog.find(query)
      .populate("author", "username avatar")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      blogs: blog,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/pending", protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const query = { status: "pending" };
    const total = await Blog.countDocuments(query);
    const blog = await Blog.find(query)
      .populate("author", "username avatar")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({
      blogs: blog,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/my-submissions", protect, async (req, res) => {
  try {
    const blog = await Blog.find({ author: req.user._id })
      .populate("author", "username avatar")
      .sort("-createdAt");
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/top", async (req, res) => {
  try {
    const blog = await Blog.find({ status: "approved" })
      .populate("author", "username avatar")
      .sort("-views -likes.length")
      .limit(10);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const blog = await Blog.find({ status: "approved" })
      .populate("author", "username avatar")
      .sort("-createdAt")
      .limit(20);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/local", async (req, res) => {
  try {
    const { location } = req.query;
    const query = { status: "approved", isLocal: true };

    if (location) {
      query.$or = [{ category: "local" }, { tags: location }];
    }

    const blog = await Blog.find(query)
      .populate("author", "username avatar")
      .sort("-createdAt");
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/trp", async (req, res) => {
  try {
    const allBlog = await Blog.find({ status: "approved" })
      .sort("-views")
      .limit(50);
    
    const totalViews = allBlog.reduce((sum, n) => sum + (n.views || 0), 0);
    const totalLikes = allBlog.reduce((sum, n) => sum + (n.likes?.length || 0), 0);
    const totalRatings = allBlog.reduce((sum, n) => sum + (n.ratingCount || 0), 0);
    
    const avgRating = totalRatings > 0 
      ? allBlog.reduce((sum, n) => sum + (n.rating || 0), 0) / allBlog.length 
      : 0;
    
    const trpScore = calculateTRP(totalViews, totalLikes, avgRating, allBlog.length);
    
    const topBlogs = allBlog.slice(0, 10).map(n => ({
      _id: n._id,
      title: n.title,
      views: n.views,
      likes: n.likes?.length || 0,
      rating: n.rating,
      trp: calculateSingleTRP(n.views, n.likes?.length || 0, n.rating)
    }));
    
    res.json({
      trp: trpScore,
      trend: trpScore > 5 ? 'up' : trpScore < 3 ? 'down' : 'stable',
      totalViews,
      totalLikes,
      totalRatings,
      avgRating: Math.round(avgRating * 10) / 10,
      blogCount: allBlog.length,
      topBlogs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count = await Blog.countDocuments({ status: "approved" });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/slug/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true },
    ).populate("author", "username avatar");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/short/:shortId", async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { shortId: req.params.shortId },
      { $inc: { views: 1 } },
      { new: true },
    ).populate("author", "username avatar");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    ).populate("author", "username avatar");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const countWords = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    if (countWords(req.body.title) > 20) return res.status(400).json({ message: 'Title exceeds 20 word limit' });
    if (req.body.contentType !== 'html-only' && countWords(req.body.description) > 50) return res.status(400).json({ message: 'Description exceeds 50 word limit' });
    const status = req.body.status === "pending" ? "pending" : "approved";
    const data = { ...req.body, author: req.user._id, status };
    if (data.contentType === 'html-only') {
      data.description = '';
      data.image = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';
    }
    const blog = await Blog.create(data);
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/submit", protect, async (req, res) => {
  try {
    if (countWords(req.body.title) > 20) return res.status(400).json({ message: 'Title exceeds 20 word limit' });
    if (req.body.contentType !== 'html-only' && countWords(req.body.description) > 50) return res.status(400).json({ message: 'Description exceeds 50 word limit' });
    const data = { ...req.body, author: req.user._id, status: "pending" };
    if (data.contentType === 'html-only') {
      data.description = '';
      data.image = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';
    }
    if (!data.description) {
      data.description = data.title;
    }
    const blog = await Blog.create(data);
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (countWords(req.body.title) > 20) return res.status(400).json({ message: 'Title exceeds 20 word limit' });
    if (req.body.contentType !== 'html-only' && countWords(req.body.description) > 50) return res.status(400).json({ message: 'Description exceeds 50 word limit' });
    const data = { ...req.body };
    if (data.contentType === 'html-only') {
      data.description = '';
      data.image = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/stats", protect, adminOnly, async (req, res) => {
  try {
    const { views, likes } = req.body;
    const updateData = {};
    
    if (typeof views === 'number' && views >= 0) {
      updateData.views = views;
    }
    
    if (Array.isArray(likes)) {
      updateData.likes = likes;
    }
    
    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/approve/:id", protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true },
    ).populate("author", "username avatar");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog approved successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/reject/:id", protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true },
    ).populate("author", "username avatar");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog rejected", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/like", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userId = req.user._id.toString();
    const likeIndex = blog.likes.findIndex((id) => id.toString() === userId);

    if (likeIndex > -1) {
      blog.likes.splice(likeIndex, 1);
      await blog.save();
      await User.findByIdAndUpdate(req.user._id, { $pull: { likedNews: blog._id } });
      res.json({ likes: blog.likes.length, liked: false });
    } else {
      blog.likes.push(req.user._id);
      await blog.save();
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { likedNews: blog._id } });
      res.json({ likes: blog.likes.length, liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/rate", async (req, res) => {
  try {
    const { rating } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newRatingCount = blog.ratingCount + 1;
    const newRating =
      (blog.rating * blog.ratingCount + rating) / newRatingCount;

    blog.rating = Math.round(newRating * 10) / 10;
    blog.ratingCount = newRatingCount;

    await blog.save();
    res.json({ rating: blog.rating, ratingCount: blog.ratingCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function calculateTRP(views, likes, rating, blogCount) {
  const viewScore = Math.min(views / 20000, 10);
  const likeScore = Math.min(likes / 50, 10);
  const ratingScore = rating * 2;
  const countScore = Math.min(blogCount / 10, 10);
  
  let trp = (viewScore * 0.35) + (likeScore * 0.25) + (ratingScore * 0.25) + (countScore * 0.15);
  return Math.round(trp * 10) / 10;
}

function calculateSingleTRP(views, likes, rating) {
  const viewScore = Math.min(views / 5000, 10);
  const likeScore = Math.min(likes / 10, 10);
  const ratingScore = rating * 2;
  
  let trp = (viewScore * 0.4) + (likeScore * 0.3) + (ratingScore * 0.3);
  return Math.round(trp * 10) / 10;
}

export default router;
