import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../../services/tweetService.js";

export const useGetPosts = (type = "all") => {
  return useQuery({
    queryKey: ["posts", type],
    queryFn: () => getPosts(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
