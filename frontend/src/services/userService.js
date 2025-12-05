import api from "./api.js";

/**
 * @desc signup user
 * @param {*} userData
 * @returns response data
 */
export const signupUser = async (userData) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

/**
 * @desc login user
 * @param {*} credentials
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

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
