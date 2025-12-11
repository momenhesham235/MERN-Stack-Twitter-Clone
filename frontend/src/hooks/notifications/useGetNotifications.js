import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../../services/notificationsService";

// Fetch all notifications
const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};

export default useNotifications;
