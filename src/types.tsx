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
  datos_adicionales?: Record<string, unknown>;
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
  datos_adicionales?: Record<string, unknown>;
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
  acreditada?: boolean;
  fecha_acreditacion?: string;
  estado: "Enviada" | "Procesando ARCA" | "Error" | "Pagada" | "Pendiente";
}

export interface PasajeroDetail extends Pasajero {
  facturas: Factura[];
}

export interface AccreditationPendingItem {
  id: number;
  letra: string;
  sucursal: string;
  numero: string;
  fecha_factura: string;
  pasajero: {
    nombre: string;
    apellido: string;
    obra_social: string;
  };
}

export interface WorkloadItem {
  id: number;
  nombre: string;
  completado: number;
  total: number;
}
