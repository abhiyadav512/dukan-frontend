import { axiosInstacne } from "../../lib/axiosInstance";

export const getAdminDashBoard = async () => {
  const res = await axiosInstacne.get("/api/admin/dashboard");
  return res.data;
};

export const createUser = async (data) => {
  const res = await axiosInstacne.post("/api/admin/users", data);
  return res.data;
};

export const createStore = async (data) => {
  const res = await axiosInstacne.post("/api/admin/stores", data);
  return res.data;
};

export const getListOfUser = async (name, page, sortBy,filterBy) => {
  const res = await axiosInstacne.get(
    `/api/admin/users?${filterBy}=${name}&page=${page}&limit=10&sortBy=${sortBy}&sortOrder=asc`
  );
  return res.data;
};


export const getListOfStor = async (name, page, sortBy) => {
  const res = await axiosInstacne.get(
    `/api/admin/stores?name=${name}&page=${page}&limit=10&sortBy=${sortBy}&sortOrder=asc`
  );
  return res.data;
};

export const getUserById = async (userId) => {
  const res = await axiosInstacne.get(`/api/admin/users/${userId}`);
  return res.data;
};
