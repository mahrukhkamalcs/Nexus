import React, { useEffect, useState } from "react";
import {
  Bell,
  MessageCircle,
  UserPlus,
  DollarSign,
} from "lucide-react";
import { Card, CardBody } from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../api/notificationApi";

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications(user?.id??"");
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (id: string) => {
    try {
      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                unread: false,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;

    try {
      await markAllNotificationsRead(user.id);

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          unread: false,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle size={16} className="text-primary-600" />;

      case "connection":
        return <UserPlus size={16} className="text-secondary-600" />;

      case "investment":
        return <DollarSign size={16} className="text-accent-600" />;

      default:
        return <Bell size={16} className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Notifications
          </h1>

          <p className="text-gray-600">
            Stay updated with your network activity
          </p>
        </div>

        {notifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification._id}
              onClick={() =>
                handleNotificationClick(notification._id)
              }
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                notification.unread
                  ? "bg-primary-50 border-primary-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <CardBody className="flex items-start p-4">
                <Avatar
                  src={notification.sender?.avatarUrl}
                  alt={notification.sender?.name || "User"}
                  size="md"
                  className="flex-shrink-0 mr-4"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {notification.sender?.name || "Unknown User"}
                    </span>

                    {notification.unread && (
                      <Badge
                        variant="primary"
                        size="sm"
                        rounded
                      >
                        New
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 mt-1">
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    {getNotificationIcon(notification.type)}

                    <span>
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <Card>
            <CardBody className="py-12 flex flex-col items-center justify-center">
              <div className="bg-gray-100 p-5 rounded-full mb-4">
                <Bell size={32} className="text-gray-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                No Notifications
              </h3>

              <p className="text-gray-500 mt-2 text-center">
                You're all caught up! New notifications will appear
                here.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};