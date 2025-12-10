import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeOrUnlikePost } from "../../services/tweetService.js";

const useLikeOrUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }) => likeOrUnlikePost(postId),

    // onMutate: async ({ postId, userId }) => {
    //   await queryClient.cancelQueries(["posts", "posts/all"]);

    //   // جِيب نسخة من البوستات
    //   const previousPosts = queryClient.getQueryData(["posts", "posts/all"]);

    //   // OPTIMISTIC UPDATE
    //   queryClient.setQueryData(["posts", "posts/all"], (oldData) => {
    //     if (!oldData?.data) return oldData;

    //     return {
    //       ...oldData,
    //       data: oldData.data.map((post) => {
    //         if (post._id !== postId) return post;

    //         // هل اليوزر عامل لايك قبل كدا؟
    //         const alreadyLiked = post.likes.includes(userId);

    //         return {
    //           ...post,
    //           likes: alreadyLiked
    //             ? post.likes.filter((id) => id !== userId) // unlike
    //             : [...post.likes, userId], // like
    //         };
    //       }),
    //     };
    //   });

    //   return { previousPosts };
    // },

    // onError: (_error, _vars, ctx) => {
    //   queryClient.setQueryData(["posts", "posts/all"], ctx.previousPosts);
    // },

    onSuccess: (data = {}, postId) => {
      const { likes: updatedLikes } = data;

      queryClient.setQueryData(["posts", "posts/all"], (oldData) => {
        if (!oldData || !oldData.data) return oldData;

        return {
          ...oldData,
          data: oldData.data.map((p) => {
            if (p._id === postId._id) {
              return { ...p, likes: updatedLikes };
            }
            return p;
          }),
        };
      });
    },
  });
};

export default useLikeOrUnlikePost;
