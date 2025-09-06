import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  blogStats: null,
  totalBlogs: 0,
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    setTotalBlogs: (state, action) => {
      state.totalBlogs = action.payload;
    },
    addBlog: (state, action) => {
      state.blogs = [action.payload, ...state.blogs];
      state.totalBlogs += 1;
    },
    updateBlog: (state, action) => {
      const updatedBlog = action.payload;
      state.blogs = state.blogs.map((blog) =>
        blog._id === updatedBlog._id ? updatedBlog : blog
      );
      if (state.currentBlog?._id === updatedBlog._id) {
        state.currentBlog = updatedBlog;
      }
    },
    removeBlog: (state, action) => {
      const blogId = action.payload;
      state.blogs = state.blogs.filter((blog) => blog._id !== blogId);
      if (state.currentBlog?._id === blogId) {
        state.currentBlog = null;
      }
      state.totalBlogs = Math.max(0, state.totalBlogs - 1);
    },
    setCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
    },
    updateBlogLike: (state, action) => {
      const { blogId, likesCount, action: likeAction } = action.payload;
      
      // Update in blogs array
      state.blogs = state.blogs.map((blog) =>
        blog._id === blogId 
          ? { ...blog, likesCount } 
          : blog
      );
      
      // Update in current blog if it's the same
      if (state.currentBlog?._id === blogId) {
        state.currentBlog = {
          ...state.currentBlog,
          likesCount
        };
      }
    },
    addCommentToBlog: (state, action) => {
      const { blogId, comment } = action.payload;
      
      // Update in blogs array
      state.blogs = state.blogs.map((blog) =>
        blog._id === blogId 
          ? { 
              ...blog, 
              comments: [...(blog.comments || []), comment],
              commentsCount: (blog.commentsCount || 0) + 1
            } 
          : blog
      );
      
      // Update in current blog if it's the same
      if (state.currentBlog?._id === blogId) {
        state.currentBlog = {
          ...state.currentBlog,
          comments: [...(state.currentBlog.comments || []), comment],
          commentsCount: (state.currentBlog.commentsCount || 0) + 1
        };
      }
    },
    setBlogStats: (state, action) => {
      state.blogStats = action.payload;
    },
    resetCommunityState: (state) => {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setBlogs,
  setTotalBlogs,
  addBlog,
  updateBlog,
  removeBlog,
  setCurrentBlog,
  updateBlogLike,
  addCommentToBlog,
  setBlogStats,
  resetCommunityState,
} = communitySlice.actions;

export default communitySlice.reducer;
