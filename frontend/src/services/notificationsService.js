import api from "./api.js";

export const getNotifications = async () => {
  const { data } = await api.get("/notifications");
  return data.data;
};

export const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}`);
  return res.data;
};

export const deleteNotifications = async () => {
  const res = await api.delete("/notifications");
  return res.data;
};
