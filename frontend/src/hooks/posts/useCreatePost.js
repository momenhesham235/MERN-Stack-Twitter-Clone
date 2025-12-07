// hooks/posts/useCreatePost.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/tweetService.js";
import toast from "react-hot-toast";

const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData) => createPost(postData),

    // ---- Optimistic Update ----
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts", "all"] });

      const previousPosts = queryClient.getQueryData(["posts", "all"]);

      queryClient.setQueryData(["posts", "all"], (old) => {
        if (!old) return old;

        return {
          ...old,
          userPosts: [
            {
              ...newPost,
              _id: Math.random().toString(36).substring(2, 9),
              createdAt: new Date().toISOString(),
              isOptimistic: true,
            },
            ...(old.userPosts || []),
          ],
        };
      });

      return { previousPosts };
    },

    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(["posts", "all"], context.previousPosts);
      toast.error(`${_err.response.data.message}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "all"] });
      toast.success("Post created");
    }
  });
};

export default useCreatePost;
