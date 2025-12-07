import api from "./api.js";

// GET all posts (all, following)
export const getPosts = async (type = "all") => {
  const res = await api.get(`/posts/${type}`);
  return res.data;
};

// GET following posts
export const getFollowingPosts = async () => {
  const res = await api.get("/posts/following");
  return res.data;
};

// GET posts by username
export const getUserPosts = async (username) => {
  const res = await api.get(`/posts/user/${username}`);
  return res.data;
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
export const likePost = async (postId) => {
  const res = await api.post(`/posts/like/${postId}`);
  return res.data;
};



