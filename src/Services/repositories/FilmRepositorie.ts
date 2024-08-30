import { FilmProps } from "../../Types/types";
import { api } from "../api";

class FilmRepositories {
  static async getFilms() {
    try {
      const response = await api.get("/films");
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar filmes:", error);
      throw error;
    }
  }

  static async getFilmById(id: string) {
    try {
      const response = await api.get(`/films/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao localizar filme:", error);
      throw error;
    }
  }

  static async deleteFilm(id: string) {
    try {
      await api.delete(`/films/${id}`);
    } catch (error) {
      console.error("Erro ao deletar filme:", error);
      throw error;
    }
  }

  static async updateFilm(id: string, bodyJson: Partial<FilmProps>) {
    try {
      await api.put(`/films/${id}`, bodyJson);
    } catch (error) {
      console.error("Erro ao atualizar filme:", error);
      throw error;
    }
  }

  static async createFilm(newFilm: FilmProps) {
    try {
      await api.post("/films", newFilm);
      return true;
    } catch (error) {
      console.error("Erro ao criar filme:", error);
      return false;
    }
  }
}

export default FilmRepositories;
