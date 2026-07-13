import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Send,
  Phone,
  Video,
  Info,
  Smile,
  MessageCircle,
} from "lucide-react";

import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ChatMessage } from "../../components/chat/ChatMessage";
import { ChatUserList } from "../../components/chat/ChatUserList";
import { useAuth } from "../../context/AuthContext";
import { Message } from "../../types";

const API = "http://localhost:5000/api";

export const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [conversations, setConversations] = useState<any[]>([]);
  const [chatPartner, setChatPartner] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Trigger redirection to full screen standalone WebRTC call room framework
  const handleStartVideoCall = () => {
    if (!userId) return;
    navigate(`/meeting/room/${userId}`);
  };

  // Load all conversations
  useEffect(() => {
    if (!currentUser) return;

    const loadConversations = async () => {
      try {
        const res = await axios.get(
          `${API}/messages/conversations/${currentUser.id}`
        );

        setConversations(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadConversations();
  }, [currentUser]);

  // Load selected chat partner
  useEffect(() => {
    if (!userId) return;

    const loadPartner = async () => {
      try {
        const res = await axios.get(`${API}/users/${userId}`);
        setChatPartner(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadPartner();
  }, [userId]);

  // Load messages
  useEffect(() => {
    if (!currentUser || !userId) return;

    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `${API}/messages/${currentUser.id}/${userId}`
        );

        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadMessages();
  }, [currentUser, userId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send Message
  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !newMessage.trim() ||
      !currentUser ||
      !userId
    )
      return;

    try {
      const res = await axios.post(`${API}/messages`, {
        sender: currentUser.id,
        receiver: userId,
        content: newMessage,
      });

      setMessages((prev) => [...prev, res.data]);

      setNewMessage("");

      // Refresh conversation list
      const conv = await axios.get(
        `${API}/messages/conversations/${currentUser.id}`
      );

      setConversations(conv.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) return null;
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white border border-gray-200 rounded-lg overflow-hidden animate-fade-in">
      {/* Sidebar */}
      <div className="hidden md:block w-1/3 lg:w-1/4 border-r border-gray-200">
        <ChatUserList conversations={conversations} />
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {chatPartner ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-4 flex justify-between items-center bg-white">
              <div className="flex items-center">
                <Avatar
                  src={chatPartner.avatarUrl}
                  alt={chatPartner.name}
                  size="md"
                  status={chatPartner.isOnline ? "online" : "offline"}
                  className="mr-3"
                />

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {chatPartner.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {chatPartner.isOnline
                      ? "Online"
                      : "Last seen recently"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2"
                >
                  <Phone size={18} />
                </Button>

                {/* Video call navigation action attached below */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2"
                  onClick={handleStartVideoCall}
                >
                  <Video size={18} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2"
                >
                  <Info size={18} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isCurrentUser={
                        message.senderId === currentUser.id
                      }
                    />
                  ))}

                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center">
                  <div className="bg-white rounded-full shadow-md p-5 mb-5">
                    <MessageCircle
                      size={40}
                      className="text-gray-400"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-700">
                    No messages yet
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Send your first message to start chatting.
                  </p>
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2"
                  aria-label="Emoji"
                >
                  <Smile size={20} />
                </Button>

                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  fullWidth
                  className="flex-1"
                />

                <Button
                  type="submit"
                  size="sm"
                  disabled={!newMessage.trim()}
                  className="rounded-full p-2 w-10 h-10 flex items-center justify-center"
                  aria-label="Send"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white rounded-full shadow-lg p-6 mb-6">
              <MessageCircle
                size={48}
                className="text-primary-500"
              />
            </div>

            <h2 className="text-2xl font-semibold text-gray-800">
              Select a Conversation
            </h2>

            <p className="text-gray-500 mt-2 text-center max-w-md">
              Choose a conversation from the left sidebar to start
              chatting with an entrepreneur or investor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};