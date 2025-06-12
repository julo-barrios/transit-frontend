export interface PasajeroListItem {
  id: number;
  nombre: string;
  apellido: string;
  obra_social: string;
  cuil: string;
  fecha_nacimiento: string;
  created_at: string;
}

export interface ObraSocial {
  id: number;
  nombre: string;
}

export interface Pasajero {
  id: number;
  nombre: string;
  apellido: string;
  cuil: string;
  obra_social?: ObraSocial;
  fecha_nacimiento: string;
  created_at: string;
}
