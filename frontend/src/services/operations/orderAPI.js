import { apiConnector } from "../apiConnector";
import { orderEndpoints } from "../apis";
// import { toast } from "react-hot-toast"; // Uncomment if using toast notifications

export const getAllItems = async () => {
  try {
    const response = await apiConnector("GET", orderEndpoints.GET_ALL_ITEMS_API);
    if (!response?.data?.success) {
      throw new Error(response.data.message || "Failed to fetch items");
    }
    return response.data.orders;
  } catch (error) {
    // toast.error("Failed to load items"); // Optional
    console.error("GET_ALL_ITEMS_API ERROR:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await apiConnector("POST", orderEndpoints.CREATE_ORDER_API, orderData);
    if (!response?.data?.success && !response?.data?.order) {
      throw new Error(response.data.message || "Failed to create order");
    }
    return response.data.order;
  } catch (error) {
    // toast.error("Failed to create order");
    console.error("CREATE_ORDER_API ERROR:", error);
    throw error;
  }
};

export const requestOrder = async (requestData) => {
  try {
    const response = await apiConnector("POST", orderEndpoints.REQUEST_ORDER_API, requestData);
    if (!response?.data?.order) {
      throw new Error(response.data.message || "Failed to request order");
    }
    return response.data.order;
  } catch (error) {
    // toast.error("Failed to request order");
    console.error("REQUEST_ORDER_API ERROR:", error);
    throw error;
  }
};

export const addToCard = async (data) => {
  try {
    const response = await apiConnector("POST", orderEndpoints.ADD_TO_CARD_API, data);
    if (!response?.data?.order) {
      throw new Error(response.data.message || "Failed to add to cart");
    }
    return response.data.order;
  } catch (error) {
    // toast.error("Failed to add to cart");
    console.error("ADD_TO_CARD_API ERROR:", error);
    throw error;
  }
};

export const cancelRequestOfOrder = async (data) => {
  try {
    const response = await apiConnector("POST", orderEndpoints.CANCEL_REQUEST_API, data);
    if (!response?.data?.order) {
      throw new Error(response.data.message || "Failed to cancel order request");
    }
    return response.data.order;
  } catch (error) {
    // toast.error("Failed to cancel order request");
    console.error("CANCEL_REQUEST_API ERROR:", error);
    throw error;
  }
};

export const cancelFromAddToCard = async (data) => {
  try {
    const response = await apiConnector("POST", orderEndpoints.CANCEL_FROM_ADD_TO_CARD_API, data);
    if (!response?.data?.order) {
      throw new Error(response.data.message || "Failed to remove from cart");
    }
    return response.data.order;
  } catch (error) {
    // toast.error("Failed to remove from cart");
    console.error("CANCEL_FROM_ADD_TO_CARD_API ERROR:", error);
    throw error;
  }
};

export const getAllOrdersByUser = async (userId) => {
  try {
    const response = await apiConnector("GET", `${orderEndpoints.GET_ALL_ORDERS_BY_USER_API}/${userId}`);
    if (!response?.data?.success) {
      throw new Error(response.data.message || "Failed to fetch user orders");
    }
    return response.data.orders;
  } catch (error) {
    // toast.error("Failed to load user orders");
    console.error("GET_ALL_ORDERS_BY_USER_API ERROR:", error);
    throw error;
  }
};

export const getAllAddToCardsByUser = async (userId) => {
  try {
    const response = await apiConnector("POST", orderEndpoints.GET_ALL_ADD_TO_CARDS_BY_USER_API, { userId });
    if (!response?.data?.success) {
      throw new Error(response.data.message || "Failed to fetch cart items");
    }
    return response.data.addToCard;
  } catch (error) {
    // toast.error("Failed to load cart items");
    console.error("GET_ALL_ADD_TO_CARDS_BY_USER_API ERROR:", error);
    throw error;
  }
};