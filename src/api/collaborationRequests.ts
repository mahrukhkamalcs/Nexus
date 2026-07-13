import axios from "axios";

const API = "http://localhost:5000/api/collaboration";

// Get all requests received by the logged-in entrepreneur
export const getRequestsForEntrepreneur = async () => {
  try {
    const res = await axios.get(`${API}/entrepreneur`);
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Get all requests sent by the logged-in investor
export const getRequestsFromInvestor = async () => {
  try {
    const res = await axios.get(`${API}/investor`);
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Investor creates a collaboration request
export const createCollaborationRequest = async (
  entrepreneurId: string,
  message: string
) => {
  try {
    const res = await axios.post(API, {
      entrepreneurId,
      message,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Entrepreneur accepts a request
export const acceptRequest = async (requestId: string) => {
  try {
    const res = await axios.put(`${API}/${requestId}/accept`, {});
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Entrepreneur rejects a request
export const rejectRequest = async (requestId: string) => {
  try {
    const res = await axios.put(`${API}/${requestId}/reject`, {});
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Combined handler expected by CollaborationRequestCard.tsx
 * Routes the call to accept or reject based on the incoming status string
 */
export const updateRequestStatus = async (requestId: string, status: 'accepted' | 'rejected') => {
  if (status === 'accepted') {
    return await acceptRequest(requestId);
  } else {
    return await rejectRequest(requestId);
  }
};