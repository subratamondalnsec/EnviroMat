const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Blog title is required"],
        trim: true,
        maxLength: [200, "Title cannot exceed 200 characters"]
    },
    content: {
        type: String,
        required: [true, "Blog content is required"],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Author is required"]
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: {
            values: [
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
            ],
            message: 'Please select a valid category'
        }
    },
    status: {
        type: String,
        enum: ["published", "draft"],
        default: "published"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        comment: {
            type: String,
            maxLength: [200, "Comment cannot exceed 200 characters"]
        }
    }],
    publishedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model("Blog", blogSchema);