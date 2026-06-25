"use client";

import { useEffect, useState } from "react";

import { getUsers } from "../services/users.service";

import type { AppUser } from "../types/admin.types";

export default function useUsers() {
  const [users, setUsers] =
    useState<AppUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    loadUsers,
  };
}