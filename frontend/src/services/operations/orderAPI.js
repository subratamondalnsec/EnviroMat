import { apiConnector } from "../apiConnector";
import { orderEndpoints } from "../apis";
import { toast } from "react-hot-toast";

export const getAllItems = async () => {
  try {
    const response = await apiConnector("GET", orderEndpoints.GET_ALL_ITEMS_API);
    if (!response?.data?.success) {
      throw new Error(response.data.message || "Failed to fetch items");
    }
    return response.data.orders;
  } catch (error) {
    console.error("GET_ALL_ITEMS_API ERROR:", error);
    toast.error("Failed to load items");
    throw error;
  }
};

export const createOrder = async (orderData, token) => {
  try {
    const response = await apiConnector("POST", orderEndpoints.CREATE_ORDER_API, orderData, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success && !response?.data?.order) {
      throw new Error(response.data.message || "Failed to create order");
    }
    toast.success("Order created successfully!");
    return response.data.order;
  } catch (error) {
    console.error("CREATE_ORDER_API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to create order");
    throw error;
  }
};

export const requestOrder = async (requestData, token) => {
  try {
    const response = await apiConnector("POST", orderEndpoints.REQUEST_ORDER_API, requestData, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.order) {
      throw new Error(response.data.message || "Failed to request order");
    }
    toast.success("Order requested successfully!");
    return response.data.order;
  } catch (error) {
    console.error("REQUEST_ORDER_API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to request order");
    throw error;
  }
};

export const addToCard = async (data, token) => {
  try {
    const response = await apiConnector("POST", orderEndpoints.ADD_TO_CARD_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.order) {
      throw new Error(response.data.message || "Failed to add to cart");
    }
    toast.success("Item added to cart!");
    return response.data.order;
  } catch (error) {
    console.error("ADD_TO_CARD_API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to add to cart");
    throw error;
  }
};

export const cancelRequestOfOrder = async (data, token) => {
  try {
    const response = await apiConnector("POST", orderEndpoints.CANCEL_REQUEST_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.order) {
      throw new Error(response.data.message || "Failed to cancel order request");
    }
    toast.success("Order request cancelled!");
    return response.data.order;
  } catch (error) {
    console.error("CANCEL_REQUEST_API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to cancel order request");
    throw error;
  }
};

export const cancelFromAddToCard = async (data, token) => {
  try {
    const response = await apiConnector("POST", orderEndpoints.CANCEL_FROM_ADD_TO_CARD_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.order) {
      throw new Error(response.data.message || "Failed to remove from cart");
    }
    toast.success("Item removed from cart!");
    return response.data.order;
  } catch (error) {
    console.error("CANCEL_FROM_ADD_TO_CARD_API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to remove from cart");
    throw error;
  }
};

export const getAllOrdersByUser = async (userId, token) => {
  try {
    const response = await apiConnector("GET", `${orderEndpoints.GET_ALL_ORDERS_BY_USER_API}/${userId}`, null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error(response.data.message || "Failed to fetch user orders");
    }
    return response.data.orders;
  } catch (error) {
    console.error("GET_ALL_ORDERS_BY_USER_API ERROR:", error);
    toast.error("Failed to load user orders");
    throw error;
  }
};

export const getAllAddToCardsByUser = async (userId, token) => {
  try {
    const response = await apiConnector("POST", orderEndpoints.GET_ALL_ADD_TO_CARDS_BY_USER_API, { userId }, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error(response.data.message || "Failed to fetch cart items");
    }
    return response.data.addToCard;
  } catch (error) {
    console.error("GET_ALL_ADD_TO_CARDS_BY_USER_API ERROR:", error);
    toast.error("Failed to load cart items");
    throw error;
  }
};