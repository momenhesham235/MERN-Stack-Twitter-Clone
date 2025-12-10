import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../services/commentService";
import toast from "react-hot-toast";

const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => deleteComment(commentId),

    onMutate: async (commentId) => {
      await queryClient.cancelQueries(["posts", "posts/all"]);
      const previousPosts = queryClient.getQueryData(["posts", "posts/all"]);

      queryClient.setQueryData(["posts", "posts/all"], (old = {}) => ({
        ...old,
        data: (old.data || []).map((post) => ({
          ...post,
          comments: (post.comments || []).filter((c) => c._id !== commentId),
        })),
      }));

      return { previousPosts };
    },

    onError: (error, _, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", "posts/all"], context.previousPosts);
      }
      toast.error(error?.response?.data?.message || "Failed to delete comment");
    },

    onSuccess: () => {
      toast.success("Comment deleted");
    },
  });
};

export default useDeleteComment;
