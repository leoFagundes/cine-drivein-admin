import { api } from "../api";
import { Statistics } from "../../Types/types";

class StatisticsRepositories {
  static async getStatistics() {
    try {
      const response = await api.get("/statistics");
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar estatísticas:", error);
      throw error;
    }
  }

  static async getStatisticById(id: string) {
    try {
      const response = await api.get(`/statistics/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar estatística:", error);
      throw error;
    }
  }

  static async deleteStatistic(id: string) {
    try {
      await api.delete(`/statistics/${id}`);
    } catch (error) {
      console.error("Erro ao deletar estatística:", error);
      throw error;
    }
  }

  static async updateStatistic(id: string, bodyJson: {}) {
    try {
      await api.put(`/statistics/${id}`, bodyJson);
    } catch (error) {
      console.error("Erro ao atualizar estatística:", error);
      throw error;
    }
  }

  static async createStatistic(newStatistic: Statistics) {
    try {
      await api.post("/statistics", newStatistic);
      return true;
    } catch (error) {
      console.error("Erro ao criar estatística:", error);
      return false;
    }
  }
}

export default StatisticsRepositories;
