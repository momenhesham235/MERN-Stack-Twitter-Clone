import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification } from "../../services/notificationsService";
import toast from "react-hot-toast";

const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteNotification(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(["notifications"], (oldData) =>
        oldData.filter((n) => n._id !== id)
      );
      toast.success("Notification deleted");
    },
    onError: () => toast.error("Failed to delete notification"),
  });
};

export default useDeleteNotification;
