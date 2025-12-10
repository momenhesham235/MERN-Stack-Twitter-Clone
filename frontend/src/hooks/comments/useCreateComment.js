import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../services/commentService";
import toast from "react-hot-toast";

const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentData) => createComment(commentData),

    onMutate: async (newComment) => {
      await queryClient.cancelQueries(["posts", "posts/all"]);

      const previousPosts = queryClient.getQueryData(["posts", "posts/all"]);
      const authUser = queryClient.getQueryData(["authUser"])?.data;

      queryClient.setQueryData(["posts", "posts/all"], (old = {}) => ({
        ...old,
        data: (old.data || []).map((post) => {
          if (post._id !== newComment.postid) return post;

          const tempComment = {
            _id: Math.random().toString(36).substring(2, 9),
            content: newComment.content,
            userid: {
              _id: authUser?._id || "unknown",
              username: authUser?.username || "unknown",
              fullname: authUser?.fullname || "unknown",
              profileImg: authUser?.profileImg || "",
            },
            createdAt: new Date().toISOString(),
            isOptimistic: true,
          };

          return { ...post, comments: [...(post.comments || []), tempComment] };
        }),
      }));

      return { previousPosts };
    },

    onSuccess: () => {
      toast.success("Comment added");
    },

    onError: (_err, _newComment, context) => {
      queryClient.setQueryData(["posts", "posts/all"], context.previousPosts);
      toast.error(_err?.response?.data?.message || "Failed to create comment");
    },
  });
};

export default useCreateComment;
