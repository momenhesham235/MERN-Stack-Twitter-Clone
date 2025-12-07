import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../../services/tweetService.js";
import toast from "react-hot-toast";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => deletePost(postId),

    // 1️⃣ قبل إرسال الـ API → Optimistic Update
    onMutate: async (postId) => {
      // وقف أي refetch شغال
      await queryClient.cancelQueries(["posts"]);

      // هات النسخة القديمة
      const previousPosts = queryClient.getQueryData(["posts"]);
      
      // اعمل Optimistic Update → امسح البوست من UI
      queryClient.setQueryData(["posts"], (oldPosts = []) =>
        oldPosts.filter((post) => post._id !== postId)
      );

      // رجّع النسخة القديمة لو حصلت مشكلة
      return { previousPosts };
    },

    // 2️⃣ لو حصل Error → roll back
    onError: (error, postId, context) => {
      queryClient.setQueryData(["posts"], context.previousPosts);
      toast.error(error.response?.data?.message || "Failed to delete post");
    },

    // 3️⃣ لو Success → اعمل refetch بسيط للتأكيد
    onSuccess: (data) => {
      toast.success(`${data.message}`);
    },

    // 4️⃣ نهاية العملية → فعل refetch
    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
};
