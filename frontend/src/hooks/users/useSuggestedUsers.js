// hooks/users/useSuggestedUsers.js
import { useQuery } from "@tanstack/react-query";
import { getSuggestedUsers } from "../../services/userService.js";

export const useSuggestedUsers = () => {
  return useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: getSuggestedUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 60, // 1 hour
  });
};
