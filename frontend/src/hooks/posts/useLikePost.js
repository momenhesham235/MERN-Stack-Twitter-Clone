import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../../services/posts.service";

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => likePost(postId),

    onMutate: async (postId) => {
      // cancel refetches
      await queryClient.cancelQueries(["posts"]);

      const previousPosts = queryClient.getQueryData(["posts"]);

      // optimistic update
      queryClient.setQueryData(["posts"], (old) =>
        old?.map((post) =>
          post._id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );

      return { previousPosts };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(["posts"], context.previousPosts);
    },

    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
};
