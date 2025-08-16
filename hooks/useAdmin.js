// src/hooks/useAdmin.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAdminDashBoard,
  createUser,
  getListOfUser,
  getListOfStor,
  getUserById,
  createStore,
} from "../src/api/adminApi";

const handleError = (err) => {
  if (err.response?.data?.details) {
    err.response.data.details.forEach((d) => {
      toast.error(`${d.field}: ${d.message}`);
    });
  } else {
    toast.error(err.response?.data?.error || "Internal server error");
  }
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getAdminDashBoard,
    refetchOnWindowFocus: false,
    retry: false,
    onError: handleError,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (res) => {
      toast.success(res.message || "User created successfully");
      queryClient.invalidateQueries(["users"]);
    },
    onError: handleError,
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStore,
    onSuccess: (res) => {
      toast.success(res.message || "Store created successfully");
      queryClient.invalidateQueries(["stores"]);
    },
    onError: handleError,
  });
};

export const useListOfUsers = (name, page, sortBy, filterBy) => {
  return useQuery({
    queryKey: ["users", name, page, sortBy],
    queryFn: () => getListOfUser(name, page, sortBy, filterBy),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: false,
    onError: handleError,
  });
};

export const useListOfStores = (name, page, sortBy) => {
  return useQuery({
    queryKey: ["stores", name, page, sortBy],
    queryFn: () => getListOfStor(name, page, sortBy),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: false,
    onError: handleError,
  });
};

export const useUserById = (userId) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    onError: handleError,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
