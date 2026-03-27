import axios from "axios";

const BASE = process.env.REACT_APP_SERVER_URL;

class UserService {
  async list() {
    return axios.get(`${BASE}/users`);
  }
  async get(id) {
    return axios.get(`${BASE}/users/${id}`);
  }
  async create(data) {
    return axios.post(`${BASE}/users`, data);
  }
  async update(id, data) {
    return axios.put(`${BASE}/users/${id}`, data);
  }
  async delete(id) {
    return axios.delete(`${BASE}/users/${id}`);
  }
}

export default new UserService();
