import { api } from "../api";
import { AdditionalItem } from "../../Types/types";

class AdditionalItemRepositories {
  static async getAdditionalItems() {
    try {
      const response = await api.get("/additionalItems");
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar itens adicionais:", error);
      throw error;
    }
  }

  static async getAdditionalItemById(id: string) {
    try {
      const response = await api.get(`/additionalItems/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar item adicional:", error);
      throw error;
    }
  }

  static async deleteAdditionalItem(id: string) {
    try {
      await api.delete(`/additionalItems/${id}`);
    } catch (error) {
      console.error("Erro ao deletar item adicional:", error);
      throw error;
    }
  }

  static async updateAdditionalItem(id: string, bodyJson: {}) {
    try {
      await api.put(`/additionalItems/${id}`, bodyJson);
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
