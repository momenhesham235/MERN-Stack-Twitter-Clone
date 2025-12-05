import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signupUser } from "../../services/userService.js";
import toast from "react-hot-toast";

const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => signupUser(userData),

    onSuccess: () => {
      toast.success("Account created successfully");

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(`Signup failed: ${error.response.data.message}`);
    },
  });
};

export default useSignup;
