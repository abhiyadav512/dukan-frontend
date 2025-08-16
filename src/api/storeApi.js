import { axiosInstacne } from "../../lib/axiosInstance";

// export const getMyStore = async () => {
//   const response = await axiosInstacne.get("/api/store/dashboard");
//   return response.data;
// };

export const getMyInfo = async () => {
  const response = await axiosInstacne.get("/api/store/info");
  return response.data;
};

export const getAllRatingUser = async (page) => {
  const response = await axiosInstacne.get(
    `/api/store/ratings?page=${page}&limit=10&sortBy=rating&sortOrder=desc`
  );
  return response.data;
};
