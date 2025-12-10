import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../../services/tweetService.js";
import toast from "react-hot-toast";

const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => deletePost(postId),
    onMutate: async (postId) => {
      const authUser = queryClient.getQueryData(["authUser"])?.data;

      // Promise.all([
      //   queryClient.cancelQueries(["posts", "posts/all"]),
      //   queryClient.cancelQueries([
      //     "posts",
      //     `posts/user/${authUser?.username}`,
      //   ]),
      //   queryClient.cancelQueries(["posts", `posts/likes/${authUser?._id}`]),
      // ]);

      const previousPostsAll = queryClient.getQueryData(["posts", "posts/all"]);
      const previousPostsUser = queryClient.getQueryData([
        "posts",
        `posts/user/${authUser?.username}`,
      ]);
      const previousPostsLikes = queryClient.getQueryData([
        "posts",
        `posts/likes/${authUser?._id}`,
      ]);

      queryClient.setQueryData(["posts", "posts/all"], (old = {}) => ({
        ...old,
        data: (old.data || []).filter((post) => post._id !== postId),
      }));

      queryClient.setQueryData(
        ["posts", `posts/user/${authUser?.username}`],
        (old = {}) => ({
          ...old,
          data: (old.data || []).filter((post) => post._id !== postId),
        })
      );

      queryClient.setQueryData(
        ["posts", `posts/likes/${authUser?._id}`],
        (old = {}) => ({
          ...old,
          data: (old.data || []).filter((post) => post._id !== postId),
        })
      );

      return { previousPostsAll, previousPostsUser, previousPostsLikes };
    },

    onError: (error, __, context) => {
      const authUser = queryClient.getQueryData(["authUser"])?.data;

      if (context?.previousPostsAll) {
        queryClient.setQueryData(
          ["posts", "posts/all"],
          context.previousPostsAll
        );

        queryClient.setQueryData(
          ["posts", `posts/user/${authUser?.username}`],
          context.previousPostsUser
        );

        queryClient.setQueryData(
          ["posts", `posts/likes/${authUser?._id}`],
          context.previousPostsLikes
        );
      }

      toast.error(error?.response?.data?.message || "Failed to delete post");
    },

    onSuccess: (data) => {
      toast.success(data?.message || "Post deleted successfully");
    },
  });
};

export default useDeletePost;
