import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/posts.service.js";
import toast from "react-hot-toast";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created!");
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Re-fetch posts
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });
};
