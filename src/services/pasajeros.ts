import api from "@/api/axios";
import type { Pasajero, PasajeroDetail, PasajeroListItem, CreatePasajeroPayload, UpdatePasajeroPayload } from "../types";

export const pasajerosService = {
  getAll: async (params?: { search?: string; obra_social_id?: number }): Promise<PasajeroListItem[]> => {
    try {
      const { data } = await api.get('/pasajeros', { params });
      return data.data || data || [];
    } catch (error) {
      console.error("Error fetching pasajeros:", error);
      throw error;
    }
  },

  getById: async (id: number | string): Promise<PasajeroDetail> => {
    try {
      const { data } = await api.get(`/pasajeros/${id}`);
      return data.data || data;
    } catch (error) {
      console.error(`Error fetching pasajero ${id}:`, error);
      throw error;
    }
  },

  create: async (payload: CreatePasajeroPayload): Promise<Pasajero> => {
    try {
      const { data } = await api.post('/pasajeros', payload);
      return data;
    } catch (error) {
      console.error("Error creating pasajero:", error);
      throw error;
    }
  },

  update: async (id: number | string, payload: UpdatePasajeroPayload): Promise<Pasajero> => {
    try {
      const { data } = await api.put(`/pasajeros/${id}`, payload);
      return data;
    } catch (error) {
      console.error(`Error updating pasajero ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number | string): Promise<void> => {
    try {
      await api.delete(`/pasajeros/${id}`);
    } catch (error) {
      console.error(`Error deleting pasajero ${id}:`, error);
      throw error;
    }
  }
};