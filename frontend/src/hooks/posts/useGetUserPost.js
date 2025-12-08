import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "../../services/posts.service";

export const useGetUserPost = (username) => {
  return useQuery({
    queryKey: ["userPosts", username],
    queryFn: () => getUserPosts(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
