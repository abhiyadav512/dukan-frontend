import { useMutation } from "@tanstack/react-query";
import { LoginUser, RegisterUser } from "../src/api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
const encrypt = (data) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const handleError = (err) => {
  if (err.response?.data?.details) {
    err.response.data.details.forEach((d) => {
      toast.error(`${d.field}: ${d.message}`);
    });
  } else {
    toast.error(err.response?.data?.error || "Internal server error");
  }
};

export const useRegitser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: RegisterUser,
    onSuccess: (res) => {
      toast.success(res.message || "Register SuccessFull");
      navigate("/login");
    },
    onError: (err) => {
      // console.log(err);
      handleError(err);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: LoginUser,
    onSuccess: (response) => {

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", encrypt(response.user || null));

      toast.success(response.message || "Login SuccessFull");
      navigate("/");
    },
    onError: (err) => {
      handleError(err);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return logout;
};

export const getStoredUser = () => {
  const userEncrypted = localStorage.getItem("user");
  if (!userEncrypted) return null;
  try {
    return decrypt(userEncrypted);
  } catch {
    return null;
  }
};
