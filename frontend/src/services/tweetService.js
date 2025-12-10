import api from "./api.js";

// GET all posts (all, following , your posts , your liked posts)
export const getPosts = async (type = "posts/all") => {
  const { data } = await api.get(`/${type}`);
  return data;
};
// CREATE post
export const createPost = async (postData) => {
  const res = await api.post("/posts/create", postData);
  return res.data;
};

// DELETE post
export const deletePost = async (postId) => {
  const res = await api.delete(`/posts/${postId}`);
  return res.data;
};

// LIKE or UNLIKE post
export const likeOrUnLikePost = async (postId) => {

  const { data } = await api.post(`/posts/like/${postId}`);
  return data;
};


