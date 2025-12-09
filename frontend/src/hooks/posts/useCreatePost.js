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
      // 1️⃣ Cancel old queries
      await queryClient.cancelQueries(["posts", "posts/all"]);

      // 2️⃣ Get previous posts (rollback)
      const previousPosts = queryClient.getQueryData(["posts", "posts/all"]);

      // 3️⃣ Get logged-in user
      const authUser = queryClient.getQueryData(["authUser"])?.data;

      // 4️⃣ Optimistic UI update
      queryClient.setQueryData(["posts", "posts/all"], (old) => {
        if (!old) return old;

        return {
          ...old,
          data: [
            {
              ...newPost,
              _id: Math.random().toString(36).substring(2, 9),
              createdAt: new Date().toISOString(),
              isOptimistic: true,
              likes: [],
              comments: [],
              // User object MUST MATCH real backend shape
              user: {
                _id: authUser?._id,
                username: authUser?.username,
                profileImg: authUser?.profileImg,
              },
            },
            ...(old.data || []),
          ],
        };
      });

      return { previousPosts };
    },

    // ---- Rollback if error ----
    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(["posts", "posts/all"], context.previousPosts);
      toast.error(_err?.response?.data?.message || "Error creating post");
    },

    // ---- On success (no refetch needed) ----
    onSuccess: () => {
      toast.success("Post created");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export default useCreatePost;
