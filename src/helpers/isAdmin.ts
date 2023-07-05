import { References } from "../constants/References";

const { AdminUsername, AdminPassword } = References;
const isAdmin = (username: string, password: string) => {
  return username === AdminUsername && password === AdminPassword;
};

export default isAdmin;
