import axios from "axios";

// Change this if your backend runs on another port
const API_URL = "http://localhost:5000/api/notifications";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get all notifications of a user
export const getNotifications = async (userId: string) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Mark a notification as read
export const markNotificationRead = async (notificationId: string) => {
  try {
    const response = await api.put(`/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (userId: string) => {
  try {
    const response = await api.put(`/read-all/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Delete a notification (optional)
export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await api.delete(`/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Create a notification (optional - useful for backend testing)
export const createNotification = async (notificationData: any) => {
  try {
    const response = await api.post("/", notificationData);
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};