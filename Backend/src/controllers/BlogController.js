require("dotenv").config();
const Blog = require("../models/BlogModel");
const User = require("../models/User");
const mongoose = require("mongoose");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create a new blog post
exports.createBlog = async (req, res) => {
    try {
        const { title, content, category, status = "published" } = req.body;
        const userId = req.user.id;
        
        // Check if image file is provided
        if (!req.files || !req.files.image) {
            return res.status(400).json({
                success: false,
                message: "Blog image is required"
            });
        }

        const BlogImage = req.files.image;
        
        // Step 1: Validate file type before Cloudinary upload
        const validImageTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        const fileExtension = BlogImage.name.split('.').pop().toLowerCase();
        
        if (!validImageTypes.includes(fileExtension)) {
            return res.status(400).json({
                success: false,
                message: "Invalid image type. Only jpg, jpeg, png, webp, and gif are allowed"
            });
        }
        
        // Validate required fields
        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        // Step 2: Upload to Cloudinary and get the URL
        const uploadedImage = await uploadImageToCloudinary(
            BlogImage,
            process.env.CLOUDINARY_FOLDER || "blogs"
        );
        
        console.log("Uploaded image:", uploadedImage);
        
        // Create the blog with the Cloudinary URL
        const blog = await Blog.create({
            title,
            content,
            author: userId,
            image: uploadedImage.secure_url,
            category,
            status,
            publishedAt: status === "published" ? new Date() : null
        });

        // Add blog to user's blogs array
        await User.findByIdAndUpdate(
            userId,
            { $push: { blogs: blog._id } },
            { new: true }
        );

        // Populate author details for response
        await blog.populate('author', 'firstName lastName email image');

        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog
        });

    } catch (error) {
        console.error("Error creating blog:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create blog",
            error: error.message
        });
    }
};

// Get all blogs (simplified - no filters, no pagination)
exports.getAllBlogs = async (req, res) => {
    try {
        // Fetch all published, non-deleted blogs
        const blogs = await Blog.find({ 
            status: "published", 
            isDeleted: false 
        })
            .populate('author', 'firstName lastName email image')
            .populate('likes', 'firstName lastName')
            .populate('comments.user', 'firstName lastName image')
            .sort({ createdAt: -1 }); // Sort by latest first

        // Add virtual fields for likes and comments count
        const blogsWithCounts = blogs.map(blog => ({
            ...blog.toJSON(),
            likesCount: blog.likes.length,
            commentsCount: blog.comments.length
        }));

        return res.status(200).json({
            success: true,
            message: "All blogs fetched successfully",
            data: blogsWithCounts,
            totalBlogs: blogsWithCounts.length
        });

    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blogs",
            error: error.message
        });
    }
};

// Get blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }

        const blog = await Blog.findOne({ _id: blogId, isDeleted: false })
            .populate('author', 'firstName lastName email image')
            .populate('likes', 'firstName lastName')
            .populate('comments.user', 'firstName lastName image');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Add virtual fields for counts
        const blogWithCounts = {
            ...blog.toJSON(),
            likesCount: blog.likes.length,
            commentsCount: blog.comments.length
        };

        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blogWithCounts
        });

    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog",
            error: error.message
        });
    }
};

// Like or unlike a blog post
exports.toggleLikeBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }

        const blog = await Blog.findOne({ _id: blogId, isDeleted: false });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const userLikedIndex = blog.likes.indexOf(userId);
        let action = "";

        if (userLikedIndex === -1) {
            // User hasn't liked the blog, add like
            blog.likes.push(userId);
            action = "liked";
        } else {
            // User has already liked the blog, remove like
            blog.likes.splice(userLikedIndex, 1);
            action = "unliked";
        }

        await blog.save();

        return res.status(200).json({
            success: true,
            message: `Blog ${action} successfully`,
            data: {
                blogId: blog._id,
                likesCount: blog.likes.length,
                action
            }
        });

    } catch (error) {
        console.error("Error toggling blog like:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle blog like",
            error: error.message
        });
    }
};

// Edit a blog post (only by author)
exports.editBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id;
        const { title, content, category, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }

        const blog = await Blog.findOne({ _id: blogId, isDeleted: false });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Check if the user is the author of the blog
        if (blog.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this blog"
            });
        }

        // Update fields if provided
        const updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (category) updateData.category = category;
        
        // Handle image update if provided
        if (req.files && req.files.image) {
            const BlogImage = req.files.image;
            
            // Step 1: Validate file type before Cloudinary upload
            const validImageTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
            const fileExtension = BlogImage.name.split('.').pop().toLowerCase();
            
            if (!validImageTypes.includes(fileExtension)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid image type. Only jpg, jpeg, png, webp, and gif are allowed"
                });
            }
            
            // Step 2: Upload to Cloudinary and get the URL
            const uploadedImage = await uploadImageToCloudinary(
                BlogImage,
                process.env.CLOUDINARY_FOLDER || "blogs"
            );
            
            console.log("Updated image:", uploadedImage);
            updateData.image = uploadedImage.secure_url;
        }
        
        if (status) {
            updateData.status = status;
            if (status === "published" && !blog.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            updateData,
            { new: true, runValidators: true }
        ).populate('author', 'firstName lastName email image');

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog
        });

    } catch (error) {
        console.error("Error editing blog:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to edit blog",
            error: error.message
        });
    }
};

// Delete a blog post (only by author)
exports.deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }

        const blog = await Blog.findOne({ _id: blogId, isDeleted: false });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Check if the user is the author of the blog
        if (blog.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this blog"
            });
        }

        // Soft delete the blog
        blog.isDeleted = true;
        await blog.save();

        // Remove blog from user's blogs array
        await User.findByIdAndUpdate(
            userId,
            { $pull: { blogs: blogId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete blog",
            error: error.message
        });
    }
};

// Get blogs by category
exports.getBlogsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        // Validate category
        const validCategories = [
            'Environment',
            'Recycling',
            'Waste Management',
            'Sustainability',
            'Green Technology',
            'Climate Change',
            'Conservation',
            'Renewable Energy',
            'Eco-friendly Living',
            'News'
        ];

        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category",
                validCategories
            });
        }

        const blogs = await Blog.find({ 
            category, 
            status: "published", 
            isDeleted: false 
        })
            .populate('author', 'firstName lastName email image')
            .populate('likes', 'firstName lastName')
            .sort({ createdAt: -1 });

        // Add virtual fields for counts
        const blogsWithCounts = blogs.map(blog => ({
            ...blog.toJSON(),
            likesCount: blog.likes.length,
            commentsCount: blog.comments.length
        }));

        return res.status(200).json({
            success: true,
            message: `Blogs in ${category} category fetched successfully`,
            data: blogsWithCounts,
            totalBlogs: blogsWithCounts.length
        });

    } catch (error) {
        console.error("Error fetching blogs by category:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blogs by category",
            error: error.message
        });
    }
};

// Add comment to blog
exports.addComment = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { comment } = req.body;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }

        if (!comment || comment.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Comment is required"
            });
        }

        const blog = await Blog.findOne({ _id: blogId, isDeleted: false });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Add comment
        blog.comments.push({
            user: userId,
            comment: comment.trim()
        });

        await blog.save();

        // Populate the newly added comment
        await blog.populate('comments.user', 'firstName lastName image');

        const newComment = blog.comments[blog.comments.length - 1];

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: {
                comment: newComment,
                commentsCount: blog.comments.length
            }
        });

    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add comment",
            error: error.message
        });
    }
};

// Get blog statistics
exports.getBlogStats = async (req, res) => {
    try {
        // Get most liked blogs
        const mostLikedBlogs = await Blog.aggregate([
            { $match: { isDeleted: false, status: "published" } },
            { $addFields: { likesCount: { $size: "$likes" } } },
            { $sort: { likesCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },
            {
                $project: {
                    title: 1,
                    likesCount: 1,
                    "author.firstName": 1,
                    "author.lastName": 1,
                    createdAt: 1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            message: "Blog statistics fetched successfully",
            data: {
                mostLikedBlogs
            }
        });

    } catch (error) {
        console.error("Error fetching blog stats:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog statistics",
            error: error.message
        });
    }
};
