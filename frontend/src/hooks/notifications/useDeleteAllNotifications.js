import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotifications } from "../../services/notificationsService";
import toast from "react-hot-toast";

const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteNotifications(),
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], []);
      toast.success("All notifications deleted");
    },
    onError: () => toast.error("Failed to delete all notifications"),
  });
};

export default useDeleteAllNotifications;
