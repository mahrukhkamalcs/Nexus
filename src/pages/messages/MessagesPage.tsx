import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ChatUserList } from "../../components/chat/ChatUserList";
import { getUserConversations } from "../../api/messageApi";

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();

  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const data = await getUserConversations(user!.id);
      setConversations(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

 return (
  <div className="animate-fade-in">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      <p className="text-gray-600 mt-1">
        Connect and chat with investors and entrepreneurs.
      </p>
    </div>

    <div className="h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {conversations.length > 0 ? (
        <ChatUserList conversations={conversations} />
      ) : (
        <div className="h-full flex flex-col items-center justify-center px-6">
          <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h8M8 14h5m8 4l-3.5-3.5A8 8 0 104 12a8 8 0 0014.5 6z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No Messages Yet
          </h2>

          <p className="text-gray-500 text-center max-w-md">
            You haven't started any conversations yet.
            Connect with entrepreneurs or investors to begin chatting.
          </p>

          <button
            onClick={() => window.location.href = "/entrepreneurs"}
            className="mt-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md"
          >
            Explore Users
          </button>
        </div>
      )}
    </div>
  </div>
);
};