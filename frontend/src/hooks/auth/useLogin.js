import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../../services/userService.js";
import toast from "react-hot-toast";

const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => loginUser(credentials),

    onSuccess: () => {
      toast.success("Login successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(`Login failed: ${error.response.data.message}`);
    },
  });
};

export default useLogin;
