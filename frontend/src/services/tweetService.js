import api from "./api.js";

// GET all posts (all, following , your posts , your liked posts)
export const getPosts = async (type = "posts/all") => {
  const { data } = await api.get(`/${type}`);
  return data.data;
};

// GET following posts
export const getFollowingPosts = async () => {
  const res = await api.get("/posts/following");
  return res.data;
};

// CREATE post
export const createPost = async (postData) => {
  console.log(postData);

  const res = await api.post("/posts/create", postData);
  return res.data;
};

// DELETE post
export const deletePost = async (postId) => {
  const res = await api.delete(`/posts/${postId}`);
  return res.data;
};

// LIKE or UNLIKE post
export const likePost = async (postId) => {
  const res = await api.post(`/posts/like/${postId}`);
  return res.data;
};
