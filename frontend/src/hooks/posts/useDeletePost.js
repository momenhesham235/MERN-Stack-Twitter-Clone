// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { deletePost } from "../../services/tweetService.js";
// import toast from "react-hot-toast";

// export const useDeletePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (postId) => deletePost(postId),

//     // 1️⃣ Optimistic Update قبل الـ API
//     onMutate: async (postId) => {
//       await queryClient.cancelQueries({ queryKey: ["posts"] });

//       // خزن كل النسخ القديمة للـ rollback
//       const previousPosts = queryClient.getQueriesData({ queryKey: ["posts"] });

//       // تحديث الـ cache فورياً
//       queryClient.setQueriesData({ queryKey: ["posts"] }, (old = []) => {
//         if (!old) return old;

//         // لو old object فيه data (مثل pagination)
//         if (Array.isArray(old)) {
//           return old.filter((post) => post._id !== postId);
//         } else if (old.data) {
//           return {
//             ...old,
//             data: old.data.filter((post) => post._id !== postId),
//           };
//         }
//         return old;
//       });

//       return { previousPosts };
//     },

//     // 2️⃣ لو حصل Error → rollback
//     onError: (error, postId, context) => {
//       if (context?.previousPosts) {
//         context.previousPosts.forEach(([key, data]) => {
//           queryClient.setQueryData(key, data);
//         });
//       }
//       toast.error(error.response?.data?.message || "Failed to delete post");
//     },

//     // 3️⃣ لو Success → رسالة تأكيد
//     onSuccess: (data) => {
//       toast.success(data.message || "Post deleted successfully");
//     },
//   });
// };


import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../../services/tweetService.js";
import toast from "react-hot-toast";

 const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => deletePost(postId),

    onMutate: async (postId) => {
      await queryClient.cancelQueries(["posts", "posts/all"]);
      const previousPosts = queryClient.getQueryData(["posts", "posts/all"]);

      queryClient.setQueryData(["posts", "posts/all"], (old = {}) => ({
        ...old,
        data: (old.data || []).filter((post) => post._id !== postId),
      }));

      return { previousPosts };
    },

    onError: (error, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts", "posts/all"], context.previousPosts);
      }
      toast.error(error?.response?.data?.message || "Failed to delete post");
    },

    onSuccess: (data) => {
      toast.success(data?.message || "Post deleted successfully");
    },
  });
};

export default useDeletePost;

