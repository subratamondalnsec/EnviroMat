const express = require("express");
const router = express.Router();

// Import blog controller
const {
    createBlog,
    getAllBlogs,
    getBlogById,
    toggleLikeBlog,
    editBlog,
    deleteBlog,
    getBlogsByCategory,
    addComment,
    getBlogStats
} = require("../controllers/BlogController");



// Import auth middleware
const { auth } = require("../middleware/auth");

// Public routes (no authentication required)
router.get("/", getAllBlogs);                          // GET /api/blogs - Get all blogs (simplified)
router.get("/stats", getBlogStats);                    // GET /api/blogs/stats - Get blog statistics
router.get("/category/:category", getBlogsByCategory); // GET /api/blogs/category/:category - Get blogs by category
router.get("/:blogId", getBlogById);                   // GET /api/blogs/:blogId - Get single blog by ID

// Protected routes (authentication required)
router.post("/create-blog", auth, createBlog);                    // POST /api/blogs - Create new blog
router.post("/:blogId/like", auth, toggleLikeBlog);    // POST /api/blogs/:blogId/like - Like/unlike blog
router.post("/:blogId/comment", auth, addComment);     // POST /api/blogs/:blogId/comment - Add comment to blog
router.put("/:blogId", auth, editBlog);                // PUT /api/blogs/:blogId - Edit blog (author only)
router.delete("/:blogId", auth, deleteBlog);           // DELETE /api/blogs/:blogId - Delete blog (author only)

module.exports = router;
