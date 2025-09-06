import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { blogEndpoints } from "../apis";
import { 
  updateBlogLike, 
  addCommentToBlog as addCommentToStore,
  removeBlog 
} from "../../slices/communitySlice";

const {
  GET_ALL_BLOGS_API,
  GET_BLOG_BY_ID_API,
  CREATE_BLOG_API,
  EDIT_BLOG_API,
  DELETE_BLOG_API,
  TOGGLE_LIKE_BLOG_API,
  ADD_COMMENT_API,
  GET_BLOGS_BY_CATEGORY_API,
  GET_BLOG_STATS_API,
} = blogEndpoints;

// Get all blogs
export function getAllBlogs() {
  return async (dispatch) => {
    const toastId = toast.loading("Loading blogs...");
    try {
      const response = await apiConnector("GET", GET_ALL_BLOGS_API);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      console.log("GET_ALL_BLOGS_API ERROR............", error);
      toast.error("Failed to load blogs");
      throw error;
    } finally {
      toast.dismiss(toastId);
    }
  };
}

// Get blog by ID
export function getBlogById(blogId) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading blog...");
    try {
      const response = await apiConnector("GET", `${GET_BLOG_BY_ID_API}/${blogId}`);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      console.log("GET_BLOG_BY_ID_API ERROR............", error);
      toast.error("Failed to load blog");
      throw error;
    } finally {
      toast.dismiss(toastId);
    }
  };
}

// Create a new blog
export function createBlog(blogData) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating blog...");
    try {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("content", blogData.content);
      formData.append("category", blogData.category);
      formData.append("status", blogData.status || "published");
      
      if (blogData.image) {
        formData.append("image", blogData.image);
      }

      const response = await apiConnector("POST", CREATE_BLOG_API, formData, {
        "Content-Type": "multipart/form-data",
      });
      
      if (!response?.data?.success) {
        throw new Error(response.data.message);
      }

      toast.success("Blog created successfully");
      return response.data;
    } catch (error) {
      console.log("CREATE_BLOG_API ERROR............", error);
      toast.error(error.response?.data?.message || "Failed to create blog");
      throw error;
    } finally {
      toast.dismiss(toastId);
    }
  };
}

// Edit a blog
export function editBlog(blogId, blogData) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating blog...");
    try {
      const formData = new FormData();
      if (blogData.title) formData.append("title", blogData.title);
      if (blogData.content) formData.append("content", blogData.content);
      if (blogData.category) formData.append("category", blogData.category);
      if (blogData.status) formData.append("status", blogData.status);
      
      if (blogData.image) {
        formData.append("image", blogData.image);
      }

      const response = await apiConnector("PUT", `${EDIT_BLOG_API}/${blogId}`, formData, {
        "Content-Type": "multipart/form-data",
      });
      
      if (!response?.data?.success) {
        throw new Error(response.data.message);
      }

      toast.success("Blog updated successfully");
      return response.data;
    } catch (error) {
      console.log("EDIT_BLOG_API ERROR............", error);
      toast.error(error.response?.data?.message || "Failed to update blog");
      throw error;
    } finally {
      toast.dismiss(toastId);
    }
  };
}

// Delete a blog
export function deleteBlog(blogId) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting blog...");
    try {
      const response = await apiConnector("DELETE", `${DELETE_BLOG_API}/${blogId}`);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message);
      }

      // Update Redux state
      dispatch(removeBlog(blogId));

      toast.success("Blog deleted successfully");
      return response.data;
    } catch (error) {
      console.log("DELETE_BLOG_API ERROR............", error);
      toast.error(error.response?.data?.message || "Failed to delete blog");
      throw error;
    } finally {
      toast.dismiss(toastId);
    }
  };
}

// Toggle like on a blog
export function toggleLikeBlog(blogId) {
  return async (dispatch) => {
    try {
      const response = await apiConnector("POST", `${TOGGLE_LIKE_BLOG_API}/${blogId}/like`);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message);
      }

      // Update Redux state
      dispatch(updateBlogLike({
        blogId: blogId,
        likesCount: response.data.data.likesCount,
        action: response.data.data.action
      }));

      return response.data;
    } catch (error) {
      console.log("TOGGLE_LIKE_BLOG_API ERROR............", error);
      toast.error("Failed to update like");
      throw error;
    }
  };
}

// Add comment to a blog
export function addCommentToBlog(blogId, comment) {
  return async (dispatch) => {
    try {
      const response = await apiConnector("POST", `${ADD_COMMENT_API}/${blogId}/comment`, {
        comment: comment,
      });
      
      if (!response?.data?.success) {
        throw new Error(response.data.message);
      }

      // Update Redux state
      dispatch(addCommentToStore({
        blogId: blogId,
        comment: response.data.data.comment
      }));

      toast.success("Comment added successfully");
      return response.data;
    } catch (error) {
      console.log("ADD_COMMENT_API ERROR............", error);
      toast.error("Failed to add comment");
      throw error;
    }
  };
}

// Get blogs by category
export function getBlogsByCategory(category) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading blogs...");
    try {
      const response = await apiConnector("GET", `${GET_BLOGS_BY_CATEGORY_API}/${category}`);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      console.log("GET_BLOGS_BY_CATEGORY_API ERROR............", error);
      toast.error("Failed to load blogs");
      throw error;
    } finally {
      toast.dismiss(toastId);
    }
  };
}

// Get blog statistics
export function getBlogStats() {
  return async (dispatch) => {
    try {
      const response = await apiConnector("GET", GET_BLOG_STATS_API);
      
      if (!response?.data?.success) {
        throw new Error(response.data.message);
      }

      return response.data;
    } catch (error) {
      console.log("GET_BLOG_STATS_API ERROR............", error);
      toast.error("Failed to load blog statistics");
      throw error;
    }
  };
}
