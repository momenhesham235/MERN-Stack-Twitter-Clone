// // hooks/posts/useLikeOrUnlikePost.js
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { likeOrUnLikePost } from "../../services/tweetService";
// import toast from "react-hot-toast";

// const useLikeOrUnlikePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (postId) => likeOrUnLikePost(postId),

//     onMutate: async (postId) => {
//       await queryClient.cancelQueries({ queryKey: ["posts", "posts/all"] });

//       const previousPosts = queryClient.getQueryData(["posts", "posts/all"]);
//       const authUser = queryClient.getQueryData(["authUser"]);
//       const authUserId = authUser?.data?._id;

//       if (!authUserId) return { previousPosts };

//       queryClient.setQueryData(["posts", "posts/all"], (old = {}) => ({
//         ...old,
//         data: (old.data || []).map((post) => {
//           if (post._id !== postId) return post;

//           const likesSet = new Set(post.likes ?? []);
//           if (likesSet.has(authUserId)) {
//             likesSet.delete(authUserId);
//           } else {
//             likesSet.add(authUserId);
//           }

//           return {
//             ...post,
//             likes: Array.from(likesSet),
//           };
//         }),
//       }));

//       return { previousPosts };
//     },

//     onError: (error, __, context) => {
//       if (context?.previousPosts) {
//         queryClient.setQueryData(["posts", "posts/all"], context.previousPosts);
//       }
//       console.log(error);
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     },

//     onSuccess: (data, postId) => {
//       queryClient.setQueryData(["posts", "posts/all"], (old = {}) => ({
//         ...old,
//         data: (old.data || []).map((post) => {
//           if (post._id !== postId) return post;
//           return {
//             ...post,
//             likes: data ?? [],
//           };
//         }),
//       }));
//     },
//   });
// };

// export default useLikeOrUnlikePost;


import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeOrUnLikePost } from "../../services/tweetService";
import toast from "react-hot-toast";

const useLikeOrUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => likeOrUnLikePost(postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries(["posts", "posts/all"]);

      const previousPosts = queryClient.getQueryData(["posts", "posts/all"]);
      const authUser = queryClient.getQueryData(["authUser"])?.data;
      const authUserId = authUser?._id;

      if (!authUserId) return { previousPosts };

      queryClient.setQueryData(["posts", "posts/all"], (old = {}) => ({
        ...old,
        data: (old.data || []).map((post) => {
          if (post._id !== postId) return post;

          const likesSet = new Set(post.likes ?? []);
          likesSet.has(authUserId)
            ? likesSet.delete(authUserId)
            : likesSet.add(authUserId);

          return {
            ...post,
            likes: Array.from(likesSet),
          };
        }),
      }));

      return { previousPosts };
    },

    onError: (error, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", "posts/all"], context.previousPosts);
      }
      toast.error(error?.response?.data?.message || "Something went wrong");
    },

    onSuccess: (data, postId) => {
      queryClient.setQueryData(["posts", "posts/all"], (old = {}) => ({
        ...old,
        data: (old.data || []).map((post) => {
          if (post._id !== postId) return post;
          return { ...post, likes: data ?? [] };
        }),
      }));
    },
  });
};

export default useLikeOrUnlikePost;
