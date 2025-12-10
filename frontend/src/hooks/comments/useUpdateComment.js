import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../../services/commentService";
import toast from "react-hot-toast";

export const useUpdateComment = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, updatedContent }) =>
      updateComment(commentId, updatedContent),

    onMutate: async ({ commentId, updatedContent }) => {
      await queryClient.cancelQueries(["posts", "posts/all"]);

      const prevData = queryClient.getQueryData(["posts", "posts/all"]);

      // 🔥 تحديث Optimistic بدون تغيير الـ ID
      queryClient.setQueryData(["posts", "posts/all"], (old) => ({
        ...old,
        data: old.data.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map((c) =>
                  c._id === commentId
                    ? { ...c, content: updatedContent, isEdited: true }
                    : c
                ),
              }
            : post
        ),
      }));

      return { prevData };
    },

    onError: (_err, _new, ctx) => {
      queryClient.setQueryData(["posts", "posts/all"], ctx.prevData);
      toast.error("Failed to update comment");
    },

    onSuccess: () => {
      toast.success("Comment updated");
    },
  });
};
