import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "../../services/userService.js";

export const useGetProfile = (username) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => getUserProfile(username),
    enabled: !!username,
    retry: false,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["posts", `posts/user/${username}`],
      });
    },
  });
};

export default useGetProfile;
