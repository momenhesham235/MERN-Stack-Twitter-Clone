import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followOrUnfollowUser } from "../../services/userService";
import toast from "react-hot-toast";

const useFollowOrUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => followOrUnfollowUser(userId),

    // ███████  OPTIMISTIC UPDATE  ███████
    onMutate: async (userId) => {
      // 1) Cancel queries
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["authUser"] }),
        queryClient.cancelQueries({ queryKey: ["profile"] }),
        queryClient.cancelQueries({ queryKey: ["suggestedUsers"] }),
      ]);

      // 2) snapshot before mutate
      const previousAuth = queryClient.getQueryData(["authUser"]);
      const previousProfile = queryClient.getQueryData(["profile"]);
      const previousSuggested = queryClient.getQueryData(["suggestedUsers"]);

      // 3) Update authUser
      queryClient.setQueryData(["authUser"], (old) => {
        if (!old?.data) return old;

        const isFollowing = old.data.following.includes(userId);

        return {
          ...old,
          data: {
            ...old.data,
            following: isFollowing
              ? old.data.following.filter((id) => id !== userId)
              : [...old.data.following, userId],
          },
        };
      });

      // 4) Update profile (follower count)
      queryClient.setQueryData(["profile"], (old) => {
        if (!old?.data) return old;

        const isFollowed = previousAuth?.data?.following.includes(userId);

        return {
          ...old,
          data: {
            ...old.data,
            followers: isFollowed
              ? old.data.followers - 1
              : old.data.followers + 1,
          },
        };
      });

      // 5) Update suggestedUsers
      queryClient.setQueryData(["suggestedUsers"], (old = []) => {
        if (!Array.isArray(old)) return old;

        return old.filter((user) => user._id !== userId);
      });

      return { previousAuth, previousProfile, previousSuggested };
    },

    // ███████  ERROR → ROLLBACK  ███████
    onError: (error, _, context) => {
      if (context?.previousAuth)
        queryClient.setQueryData(["authUser"], context.previousAuth);

      if (context?.previousProfile)
        queryClient.setQueryData(["profile"], context.previousProfile);

      if (context?.previousSuggested)
        queryClient.setQueryData(["suggestedUsers"], context.previousSuggested);

      toast.error(error?.response?.data?.message || "Something went wrong");
    },

    // ███████ SUCCESS MESSAGE ███████
    onSuccess: (res) => {
      toast.success(res.code === "followed" ? "Followed" : "Unfollowed");

      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
      ]);
    },
  });
};

export default useFollowOrUnfollowUser;
