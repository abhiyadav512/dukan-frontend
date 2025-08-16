import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllRating, getAllStore, makeRating } from "../src/api/userApi";

const handleError = (err) => {
  // console.log(err);
  if (err.response?.data?.details) {
    err.response.data.details.forEach((d) => {
      toast.error(`${d.field}: ${d.message}`);
    });
  } else {
    toast.error(err.response?.data?.error || "Internal server error");
  }
};

export const useGetAllRatings = () => {
  return useQuery({
    queryKey: ["rating"],
    queryFn: getAllRating,
    refetchOnWindowFocus: false,
    retry: false,
    onError: handleError,
  });
};

export const useGetAllStore = (name, byfilter, page) => {
  return useQuery({
    queryKey: ["stores", name, byfilter, page],
    queryFn: () => getAllStore(name, byfilter, page),
    refetchOnWindowFocus: false,
    retry: false,
    onError: handleError,
  });
};

export const useMakeRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeRating,
    onSuccess: (res) => {
      toast.success(res.message || "rated successfully");
      queryClient.invalidateQueries(["rating"]);
    },
    onError: handleError,
  });
};
