import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/messages",
});

// Get all conversations of a user
export const getUserConversations = async (userId: string) => {
  const res = await API.get(`/user/${userId}`);
  return res.data.data;
};

// Get messages between two users
export const getConversation = async (
  senderId: string,
  receiverId: string
) => {
  const res = await API.get(`/${senderId}/${receiverId}`);
  return res.data.data;
};

// Send message
export const sendMessage = async (
  sender: string,
  receiver: string,
  content: string
) => {
  const res = await API.post("/", {
    sender,
    receiver,
    content,
  });

  return res.data.data;
};

// Mark message as read
export const markAsRead = async (id: string) => {
  const res = await API.put(`/${id}/read`);
  return res.data.data;
};

// Delete message
export const deleteMessage = async (id: string) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};