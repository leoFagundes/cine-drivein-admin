import { Schedule } from "../../Types/types";
import { api } from "../api";

class ScheduleRepositories {
  static async getSchedule() {
    try {
      const response = await api.get("/schedule");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar horários:", error);
      throw error;
    }
  }

  static async deleteSchedule(id: string) {
    try {
      const response = await api.delete(`/schedule/${id}`);
      console.log(response.data.message);
    } catch (error) {
      console.error("Erro ao localizar schedule:", error);
      throw error;
    }
  }

  static async updateSchedule(id: string, bodyJson: {}) {
    try {
      const response = await api.put(`/schedule/${id}`, bodyJson);
      console.log(response.data.message);
    } catch (error) {
      console.error("Erro ao localizar schedule:", error);
      throw error;
    }
  }

  static async createSchedule(newSchedule: Schedule) {
    try {
      await api.post("/schedule", newSchedule);
      return true;
    } catch (error) {
      console.error("Erro ao criar schedule:", error);
      return false;
    }
  }
}

export default ScheduleRepositories;
