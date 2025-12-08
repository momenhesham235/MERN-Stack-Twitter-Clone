import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../services/userService.js";

export const useGetProfile = (username) => {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => getUserProfile(username),
    enabled: !!username,
    retry: false,
  });
};

export default useGetProfile;
