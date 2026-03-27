import { AxiosResponse } from "axios";
import api from "@/lib/api";
import { User } from "@/types";

class UserService {
  list(): Promise<AxiosResponse<User[]>> {
    return api.get(`/users`);
  }
  get(id: number): Promise<AxiosResponse<User>> {
    return api.get(`/users/${id}`);
  }
  create(
    data: Omit<User, "id"> & { password: string },
  ): Promise<AxiosResponse<User>> {
    return api.post(`/users`, data);
  }
  update(
    id: number,
    data: Omit<User, "id"> & { password?: string },
  ): Promise<AxiosResponse<User>> {
    return api.put(`/users/${id}`, data);
  }
  delete(id: number): Promise<AxiosResponse<void>> {
    return api.delete(`/users/${id}`);
  }
}

export default new UserService();
