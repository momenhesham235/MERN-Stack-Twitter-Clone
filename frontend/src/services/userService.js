import api from "./api.js";

/**
 * @desc signup user
 * @param  userData
 * @returns response data
 */
export const signupUser = async (userData) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

/**
 * @desc login user
 * @param  credentials
 * @returns response data
 * */
export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

/**
 * @desc logout user
 * @returns response data
 * */
export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

/**
 * @desc get current user
 * @returns response data
 * */
export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

/**
 * @desc get suggested users
 * @returns response data
 * */
export const getSuggestedUsers = async () => {
  const res = await api.get("/users/suggested");
  return res.data.data;
};

/**
 * @desc get user profile
 * @param  username
 * @returns response data
 * */
export const getUserProfile = async (username) => {
  const { data } = await api.get(`users/profile/${username}`);
  return data.data;
};
