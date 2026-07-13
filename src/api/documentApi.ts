import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/documents",
});

// Get all documents
export const getDocuments = async () => {
  try {
    const response = await API.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
};

// Upload document
export const uploadDocument = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("document", file);

    const response = await API.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

// Delete document
export const deleteDocument = async (id: string) => {
  try {
    const response = await API.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// Share document
export const shareDocument = async (id: string) => {
  try {
    const response = await API.put(`/${id}/share`);
    return response.data;
  } catch (error) {
    console.error("Error sharing document:", error);
    throw error;
  }
};

// Download document
export const downloadDocument = async (id: string) => {
  try {
    const response = await API.get(`/${id}/download`, {
      responseType: "blob",
    });

    return response.data;
  } catch (error) {
    console.error("Error downloading document:", error);
    throw error;
  }
};

// Get single document
export const getDocumentById = async (id: string) => {
  try {
    const response = await API.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching document:", error);
    throw error;
  }
};

// Rename document
export const renameDocument = async (
  id: string,
  name: string
) => {
  try {
    const response = await API.put(`/${id}`, {
      name,
    });

    return response.data;
  } catch (error) {
    console.error("Error renaming document:", error);
    throw error;
  }
};

// Toggle Shared Status
export const toggleShareDocument = async (id: string) => {
  try {
    const response = await API.patch(`/${id}/toggle-share`);
    return response.data;
  } catch (error) {
    console.error("Error updating share status:", error);
    throw error;
  }
};