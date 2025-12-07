import { useQuery } from "@tanstack/react-query";
import { getPostsByUsername } from "../../services/posts.service";

export const useGetPostsByUsername = (username) => {
  return useQuery({
    queryKey: ["posts-by-user", username],
    queryFn: () => getPostsByUsername(username),
    enabled: !!username, // important
  });
};
