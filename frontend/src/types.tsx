export interface PasajeroListItem {
  id: number;
  nombre: string;
  apellido: string;
  obra_social: string;
  cuil: string;
  fecha_nacimiento: string;
  created_at: NullableDate;
}

export interface NullableDate {
  Time: Date;
  Valid: boolean;
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
  numero_ad: number;
  obra_social?: ObraSocial;
  fecha_nacimiento: string;
  created_at: NullableDate;
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