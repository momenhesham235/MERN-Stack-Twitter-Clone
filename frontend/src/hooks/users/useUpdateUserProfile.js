import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateUserProfile } from "../../services/userService";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => updateUserProfile(formData),

    onMutate: async (formData) => {
      const authUser = queryClient.getQueryData(["authUser"])?.data;


      Promise.all([
        queryClient.cancelQueries(["authUser"]),
        queryClient.cancelQueries(["profile", authUser?.username]),
      ]);

      const previousAuthUser = queryClient.getQueryData(["authUser"]);
      const previousUserProfile = queryClient.getQueryData([
        "profile",
        authUser?.username,
      ]);

      queryClient.setQueryData(["authUser"], (oldData) => ({
        ...oldData,
        data: { ...oldData?.data, ...formData },
      }));

      queryClient.setQueryData(["profile", authUser?.username], (oldData) => ({
        ...oldData,
        data: { ...oldData?.data, ...formData },
      }));

      return { previousAuthUser, previousUserProfile };
    },

    onError: (error, _variables, context) => {
      const authUser = queryClient.getQueryData(["authUser"])?.data;
      if (context?.previousAuthUser)
        queryClient.setQueryData(["authUser"], context.previousAuthUser);

      if (context?.previousUserProfile)
        queryClient.setQueryData(
          ["profile", authUser?.username],
          context.previousUserProfile
        );

      toast.error(error.message || "Failed to update profile");
    },

    onSuccess: () => {
      const authUser = queryClient.getQueryData(["authUser"])?.data;
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({
        queryKey: ["profile", authUser?.username],
      });
      toast.success("Profile updated successfully");
    },
  });
};

export default useUpdateUserProfile;
