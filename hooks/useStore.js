import { useQuery } from "@tanstack/react-query";
import { getAllRatingUser, getMyInfo } from "../src/api/storeApi";
import toast from "react-hot-toast";

const handleError = (err) => {
  if (err.response?.data?.details) {
    err.response.data.details.forEach((d) => {
      toast.error(`${d.field}: ${d.message}`);
    });
  } else {
    toast.error(err.response?.data?.error || "Internal server error");
  }
};

export const useAllRatingUser = (page) => {
  return useQuery({
    queryKey: ["ratinguser"],
    queryFn:()=> getAllRatingUser(page),
    refetchOnWindowFocus: false,
    retry: false,
    onError: handleError,
  });
};

export const useStoreInfo = () => {
  return useQuery({
    queryKey: ["store"],
    queryFn: getMyInfo,
    refetchOnWindowFocus: false,
    retry: false,
    onError: handleError,
  });
};
