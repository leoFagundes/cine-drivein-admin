import { UserType, UserLogin } from "../../Types/types";
import { api } from "../api";

class UserRepositories {
  static async getUsers() {
    try {
      const response = await api.get("/users");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar usuários:", error);
      throw error;
    }
  }

  static async getUserById(id: string) {
    try {
      const response = await api.get(`/users/${id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar usuário:", error);
      throw error;
    }
  }

  static async deleteUser(id: string) {
    try {
      const response = await api.delete(`/users/${id}`);
      console.log(response.data.message);
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      throw error;
    }
  }

  static async updateUser(id: string, bodyJson: {}) {
    try {
      const response = await api.put(`/users/${id}`, bodyJson);
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao localizar usuário:", error);
      throw error;
    }
  }

  static async createUser(newUser: UserType) {
    try {
      await api.post("/users", newUser);
      return true;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return false;
    }
  }

  static async loginUser(userLogin: UserLogin) {
    try {
      const response = await api.post("/users/login", userLogin);
      console.log(response.data.message);
      return response.data;
    } catch (error) {
      console.error("Username ou Senha incorretos.");
      return false;
    }
  }
}

export default UserRepositories;
