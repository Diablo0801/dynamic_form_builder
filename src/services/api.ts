import axios from "axios";

const BASE_URL = "https://dynamic-form-generator-9rl7.onrender.com";

export const createUser = async (rollNumber: string, name: string) => {
  const res = await axios.post(`${BASE_URL}/create-user`, { rollNumber, name });
  return res.data;
};

export const getForm = async (rollNumber: string) => {
  const res = await axios.get(`${BASE_URL}/get-form?rollNumber=${rollNumber}`);
  return res.data;
};
