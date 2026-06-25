"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/context/AuthContext";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../services/notifications.service";
import type { Notification } from "../types/notification.types";

export default function useNotifications() {
  const { user, loading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!user) return;
    try {
      const data = await getNotifications(user.uid);
      setNotifications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      load();
    }
  }, [user?.uid, authLoading]);

  async function handleMarkAsRead(id: string) {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  async function handleMarkAllAsRead() {
    if (!user) return;
    await markAllAsRead(user.uid);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
  };
}
