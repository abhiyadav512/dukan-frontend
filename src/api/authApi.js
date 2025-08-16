import { axiosInstacne } from "../../lib/axiosInstance";

export const RegisterUser = async (data) => {
  const response = await axiosInstacne.post("/api/auth/register", data);
  return response.data;
};

export const LoginUser = async (data) => {
  const response = await axiosInstacne.post("/api/auth/login", data);
  return response.data;
};
