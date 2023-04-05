import axios from "axios";
import { BASE_URL, token } from "../config";

const urlBase = `${BASE_URL}/api/auth`;

const userLogin = async (username, password) => {
  console.log("userLogin - login service");
  const response = await axios.post(`${urlBase}/signin`, {
    username,
    password,
  });
  return response.data;
};

const userRegister = async (username, email, password) => {
  console.log("userRegister - login service");
  await axios.post(`${urlBase}/signup`, {
    username,
    password,
    email,
  });
};

export { userLogin, userRegister };
