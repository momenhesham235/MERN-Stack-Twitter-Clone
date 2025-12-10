import api from "./api"; // Axios instance

// Create comment
export const createComment = async (commentData) => {
  const { data } = await api.post("/comments", commentData);
  console.log(data.data.userid);
  return data;
};

// Delete comment
export const deleteComment = async (commentId) => {
  const { data } = await api.delete(`/comments/${commentId}`);
  return data;
};

// Update comment
export const updateComment = async (commentId, content) => {
  const { data } = await api.patch(`/comments/${commentId}`, { content });
  console.log(data);
  return data;
};
