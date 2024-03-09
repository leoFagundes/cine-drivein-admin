import { api } from "../api";
import { Item } from "../../Types/types";

class ItemRepositories {
  static async getItems() {
    try {
      const response = await api.get("/items");
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar itens:", error);
      throw error;
    }
  }

  static async getUniqueTypes() {
    try {
      const items: Item[] = await this.getItems();
      const types = items.map((item) => item.type);
      const uniqueTypes = Array.from(new Set(types));
      return uniqueTypes;
    } catch (error) {
      console.error("Erro ao obter tipos únicos:", error);
      throw error;
    }
  }

  static async getItemById(id: string) {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar item:", error);
      throw error;
    }
  }

  static async deleteItem(id: string) {
    try {
      const response = await api.delete(`/items/${id}`);
      console.log(response.data.message);
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      throw error;
    }
  }

  static async updateItem(id: string, bodyJson: {}) {
    try {
      const response = await api.put(`/items/${id}`, bodyJson);
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      throw error;
    }
  }

  static async createItem(newItem: Item) {
    try {
      await api.post("/items", newItem);
      return true;
    } catch (error) {
      console.error("Erro ao criar item:", error);
      return false;
    }
  }
}

export default ItemRepositories;
