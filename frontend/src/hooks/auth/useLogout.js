import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../../services/userService.js";
import toast from "react-hot-toast";

const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutUser(),

    onSuccess: () => {
      toast.success("Logout successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    },
    onError: (error) => {
      toast.error(`Logout failed: ${error.response.data.message}`);
    },
  });
};

export default useLogout;
