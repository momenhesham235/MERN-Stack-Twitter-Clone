import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../../services/notificationsService";

// Fetch all notifications
const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
  });
};

export default useNotifications;
