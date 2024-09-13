import { SiteConfig } from "../../Types/types";
import { api } from "../api";

class SiteConfigsRepository {
  static async getConfigs() {
    try {
      const response = await api.get("/site-configs");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar as configurações do site:", error);
      throw error;
    }
  }

  static async getConfigById(id: string) {
    try {
      const response = await api.get(`/site-configs/${id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar a configuração por ID:", error);
      throw error;
    }
  }

  static async createConfig(newConfig: SiteConfig) {
    try {
      const response = await api.post("/site-configs", newConfig);
      console.log(response.data.message);
      return true;
    } catch (error) {
      console.error("Erro ao criar a configuração do site:", error);
      return false;
    }
  }

  static async updateConfig(id: string, updatedConfig: Partial<SiteConfig>) {
    try {
      const response = await api.put(`/site-configs/${id}`, updatedConfig);
      console.log(response.data.message);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar a configuração do site:", error);
      return false;
    }
  }

  static async deleteConfig(id: string) {
    try {
      const response = await api.delete(`/site-configs/${id}`);
      console.log(response.data.message);
      return true;
    } catch (error) {
      console.error("Erro ao deletar a configuração do site:", error);
      return false;
    }
  }

  static async deleteItemImage(imageName: string) {
    try {
      const response = await api.post("/site-configs/deleteImage", {
        imageName,
      });
      return response.data.message;
    } catch (error) {
      console.error(`Erro ao deletar imagem ${imageName}:`, error);
      return false;
    }
  }

  static async createImageItem(file: FormData) {
    try {
      const response = await api.post("/site-configs/image", file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.message;
    } catch (error) {
      console.error("Erro ao criar imagem:", error);
      throw error;
    }
  }
}

export default SiteConfigsRepository;
