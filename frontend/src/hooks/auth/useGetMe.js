import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/userService.js";

const useGetMe = () => {
  return useQuery({
    queryKey: ["authUser"], // Unique key for the query
    queryFn: () => getMe(), // Function to fetch data from the API
    retry: false,
  });
};

export default useGetMe;
