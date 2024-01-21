import { api } from "../api";
import { AdditionalItem } from "../../Types/types";

class AdditionalItemRepositories {
  static async getAdditionalItems() {
    try {
      const response = await api.get("/additionalItems");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar itens adicionais:", error);
      throw error;
    }
  }

  static async getAdditionalItemById(id: string) {
    try {
      const response = await api.get(`/additionalItems/${id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar item adicional:", error);
      throw error;
    }
  }

  static async deleteAdditionalItem(id: string) {
    try {
      const response = await api.delete(`/additionalItems/${id}`);
      console.log(response.data.message);
    } catch (error) {
      console.error("Erro ao deletar item adicional:", error);
      throw error;
    }
  }

  static async updateAdditionalItem(id: string, bodyJson: {}) {
    try {
      const response = await api.put(`/additionalItems/${id}`, bodyJson);
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao atualizar item adicional:", error);
      throw error;
    }
  }

  static async createAdditionalItem(newAdditionalItem: AdditionalItem) {
    try {
      await api.post("/additionalItems", newAdditionalItem);
      return true;
    } catch (error) {
      console.error("Erro ao criar item adicional:", error);
      return false;
    }
  }
}

export default AdditionalItemRepositories;
