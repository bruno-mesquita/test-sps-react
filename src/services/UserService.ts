import axios, { AxiosResponse } from "axios";
import { User } from "@/types";

const BASE = import.meta.env.VITE_SERVER_URL;

class UserService {
  list(): Promise<AxiosResponse<User[]>> {
    return axios.get(`${BASE}/users`);
  }
  get(id: number): Promise<AxiosResponse<User>> {
    return axios.get(`${BASE}/users/${id}`);
  }
  create(data: Omit<User, "id">): Promise<AxiosResponse<User>> {
    return axios.post(`${BASE}/users`, data);
  }
  update(id: number, data: Omit<User, "id">): Promise<AxiosResponse<User>> {
    return axios.put(`${BASE}/users/${id}`, data);
  }
  delete(id: number): Promise<AxiosResponse<void>> {
    return axios.delete(`${BASE}/users/${id}`);
  }
}

export default new UserService();
