import { api } from "../api";
import { Order } from "../../Types/types";

class OrderRepositories {
  static async getOrders() {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      console.error("Erro ao obter pedidos:", error);
      throw error;
    }
  }

  static async getOrderById(id: string) {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter pedido:", error);
      throw error;
    }
  }

  static async deleteOrder(id: string) {
    try {
      const response = await api.delete(`/orders/${id}`);
      console.log(response.data.message);
    } catch (error) {
      console.error("Erro ao excluir pedido:", error);
      throw error;
    }
  }

  static async updateOrder(id: string, bodyJson: {}) {
    try {
      await api.put(`/orders/${id}`, bodyJson);
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      throw error;
    }
  }

  static async createOrder(newOrder: Order) {
    try {
      await api.post("/orders", newOrder);
      return true;
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      return false;
    }
  }
}

export default OrderRepositories;
