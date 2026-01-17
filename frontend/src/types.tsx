export interface PasajeroListItem {
  id: number;
  nombre: string;
  apellido: string;
  obra_social: ObraSocial | string;
  numero_ad: number;
  cuil: string;
  fecha_nacimiento: string;
  created_at: NullableDate;
  ultimo_periodo?: string | null;
}

export interface NullableDate {
  Time: Date;
  Valid: boolean;
}

// Configuración de un campo dinámico (Schema)
export interface CampoConfiguracion {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select";
  required?: boolean;
  options?: string[]; // Para tipo 'select'
}

export interface ObraSocial {
  id: number;
  nombre: string;
  // Schema: Qué datos pide esta OS a sus pasajeros
  configuracion_pasajeros?: CampoConfiguracion[];
  // Data: Datos extra de la propia OS
  datos_adicionales?: Record<string, any>;
}

export interface Pasajero {
  id: number;
  nombre: string;
  apellido: string;
  cuil: string;
  numero_ad: number;
  obra_social?: ObraSocial;
  fecha_nacimiento: string;
  created_at: NullableDate;
  // Data: Valores de los campos dinámicos
  datos_adicionales?: Record<string, any>;
}

export interface Factura {
  id: number;
  fecha_factura: string;
  fecha_cai: string;
  periodo_desde: string;
  importe_total: number;
  cai: string;
  letra: string;
  sucursal: string;
  numero: string;
  nro_ad: string;
  pdf_path: string;
  created_at: string;
}

export interface PasajeroDetail extends Pasajero {
  facturas: Factura[];
}