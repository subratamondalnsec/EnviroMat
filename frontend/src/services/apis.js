
const BASE_URL = "http://localhost:3000/api/v1";

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  LOGOUT_API: BASE_URL + "/auth/logout",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

// PICKER ENDPOINTS
export const pickerEndpoints = {
  SENDOTP_API: BASE_URL + "/picker/sendotp",
  SIGNUP_API: BASE_URL + "/picker/signup",
  LOGIN_API: BASE_URL + "/picker/login",
  LOGOUT_API: BASE_URL + "/picker/logout",
  RESETPASSTOKEN_API: BASE_URL + "/picker/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/picker/reset-password",
  GET_PROFILE_API: BASE_URL + "/picker/profile",
  UPDATE_PROFILE_API: BASE_URL + "/picker/profile",
  GET_ASSIGNED_PICKUPS_API: BASE_URL + "/picker/assigned-pickups",
  GET_EMERGENCY_PICKUPS_API: BASE_URL + "/picker/emergency-pickups",
  GET_DASHBOARD_STATS_API: BASE_URL + "/picker/dashboard-stats",
  COMPLETE_TASK_API: BASE_URL + "/picker/complete-task",
};

// USER PROFILE ENDPOINTS
export const userEndpoints = {
  GET_PROFILE_API: BASE_URL + "/user/profile",
  UPDATE_PROFILE_API: BASE_URL + "/user/profile",
};

// BLOG ENDPOINTS
export const blogEndpoints = {
  GET_ALL_BLOGS_API: BASE_URL + "/blogs",
  GET_BLOG_BY_ID_API: BASE_URL + "/blogs",
  CREATE_BLOG_API: BASE_URL + "/blogs/create-blog",
  EDIT_BLOG_API: BASE_URL + "/blogs",
  DELETE_BLOG_API: BASE_URL + "/blogs",
  TOGGLE_LIKE_BLOG_API: BASE_URL + "/blogs",
  ADD_COMMENT_API: BASE_URL + "/blogs",
  GET_BLOGS_BY_CATEGORY_API: BASE_URL + "/blogs/category",
  GET_BLOG_STATS_API: BASE_URL + "/blogs/stats",
};

export const orderEndPoints = {
  GET_ALL_ITEMS:BASE_URL+'/order/get-items',
  REQUEST_ORDER_API: BASE_URL + "/order/request-order",
  CANCEL_ORDER_API: BASE_URL + "/order/cancel-order",
  ADD_TO_CART_API: BASE_URL + "/order/add-to-card",
  GET_ALL_CART_ITEMS_API: BASE_URL + "/order/get-all-addtocard/user",
  GET_ALL_ORDERS_API: BASE_URL + "/order/get-all-orders/user",
};
