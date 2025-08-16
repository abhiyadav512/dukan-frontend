import { axiosInstacne } from "../../lib/axiosInstance";

export const getAllStore = async (name, filterBy, page) => {
  const res = await axiosInstacne.get(
    `/api/user/stores?${filterBy}=${name}&page=${page}&limit=10&sortBy=rating&sortOrder=desc`
  );
  return res.data;
};

export const makeRating = async (data, storeId) => {
  const res = await axiosInstacne.post("/api/user/ratings", data, storeId);
  return res.data;
};

export const getAllRating = async () => {
  const res = await axiosInstacne.get("/api/user/ratings");
  return res.data;
};
