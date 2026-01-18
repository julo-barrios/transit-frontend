export const calcularDiasTranscurridos = (fechaFactura: string) => {
    const fechaInicio = new Date(fechaFactura);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fechaInicio.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
};
