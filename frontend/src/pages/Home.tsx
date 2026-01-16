import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  PlusCircle, 
  ArrowRight,
  Plus,
  Clock,
  Info,
  Building2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useNavigate, Link } from "react-router-dom";
import { MOCK_FACTURAS, MOCK_PASAJEROS, MOCK_OBRAS_SOCIALES } from "../mocks/Data";
import type { PasajeroListItem } from "../types";

// Datos de ejemplo para el gráfico de barras
const dataGrafico = [
  { name: 'Ago', facturado: 85000, acreditado: 85000 },
  { name: 'Sep', facturado: 92000, acreditado: 92000 },
  { name: 'Oct', facturado: 75000, acreditado: 0 },
  { name: 'Nov', facturado: 110000, acreditado: 0 },
  { name: 'Dic', facturado: 98000, acreditado: 0 },
];

export default function Home() {
  const navigate = useNavigate();
  const [pasajeros, setPasajeros] = useState<PasajeroListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Periodo actual de referencia para calcular faltantes
  const PERIODO_ACTUAL = "2023-12";

  useEffect(() => {
    // Simulación de carga (en producción usaría fetch)
    const timer = setTimeout(() => {
      setPasajeros(MOCK_PASAJEROS as unknown as PasajeroListItem[]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // LÓGICA DE CÁLCULO PARA "ESTADO POR OBRA SOCIAL"
  const statsObrasSociales = MOCK_OBRAS_SOCIALES.map(os => {
    // 1. Buscamos todos los pasajeros de esta OS
    const pasajerosDeEstaOS = MOCK_PASAJEROS.filter(p => p.obra_social?.nombre === os.nombre);
    const totalPasajeros = pasajerosDeEstaOS.length;

    // 2. Contamos cuántos de esos pasajeros tienen factura en el periodo actual
    const facturasCargadas = pasajerosDeEstaOS.filter(p => 
      MOCK_FACTURAS.some(f => 
        f.nro_ad === p.numero_ad.toString() && 
        f.periodo_desde.startsWith(PERIODO_ACTUAL)
      )
    ).length;

    const faltantes = totalPasajeros - facturasCargadas;

    return {
      nombre: os.nombre,
      completado: facturasCargadas,
      total: totalPasajeros,
      faltante: faltantes,
      // Color dinámico según gravedad
      color: faltantes > 0 ? (faltantes > 2 ? "progress-error" : "progress-warning") : "progress-success"
    };
  })
  // 3. ORDENAMIENTO: Listar primero las que tienen más faltantes
  .sort((a, b) => b.faltante - a.faltante);

  return (
    <PageLayout 
      title="Panel de Control" 
      breadcrumbs={["Inicio"]}
      action={
        <Link to="/facturas/nueva" className="btn btn-primary btn-sm gap-2">
          <Plus size={16} /> Nueva Factura
        </Link>
      }
    >
      {/* 1. KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow bg-base-100 border border-base-200">
          <div className="stat">
            <div className="stat-figure text-primary"><Users size={24} /></div>
            <div className="stat-title text-xs uppercase font-semibold tracking-wider">Total Pasajeros</div>
            <div className="stat-value text-primary">{loading ? "..." : pasajeros.length}</div>
            <div className="stat-desc text-success font-bold">↗︎ 4 este mes</div>
          </div>
        </div>

        <div className="stats shadow bg-base-100 border border-base-200">
          <div className="stat">
            <div className="stat-figure text-secondary"><FileText size={24} /></div>
            <div className="stat-title text-xs uppercase font-semibold tracking-wider">Pendientes de Pago</div>
            <div className="stat-value text-secondary">12</div>
            <div className="stat-desc text-info font-bold">Ver facturas enviadas</div>
          </div>
        </div>

        <div className="stats shadow bg-base-100 border border-base-200">
          <div className="stat">
            <div className="stat-figure text-success"><TrendingUp size={24} /></div>
            <div className="stat-title text-xs uppercase font-semibold tracking-wider">Facturado Mes</div>
            <div className="stat-value text-success">$425k</div>
            <div className="stat-desc text-success font-bold">Corte: 20 Dic</div>
          </div>
        </div>

        <div className="stats shadow bg-base-100 border border-base-200">
          <div className="stat">
            <div className="stat-figure text-warning"><Clock size={24} /></div>
            <div className="stat-title text-xs uppercase font-semibold tracking-wider">Días p/ Cobro</div>
            <div className="stat-value text-warning">45d</div>
            <div className="stat-desc font-bold">Promedio histórico</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Gráfico de Facturación */}
          <div className="card bg-base-100 border border-base-200 p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Facturación vs. Acreditación
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGrafico} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} hide />
                  <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="facturado" name="Facturado" fill="#570df8" radius={[4, 4, 0, 0]} barSize={25} />
                  <Bar dataKey="acreditado" name="Acreditado" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sub-grid de Acciones y Salud de OS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-lg group overflow-hidden relative">
               <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                <FileText size={120} />
              </div>
              <div className="card-body p-6">
                <div className="flex justify-between items-start text-white/80">
                  <FileText size={32} />
                  <PlusCircle size={20} className="group-hover:scale-125 transition-transform duration-300" />
                </div>
                <h2 className="card-title text-2xl mt-4 font-black">Nueva Factura</h2>
                <p className="text-sm opacity-80">Procesa los kilómetros del mes para generar facturas ARCA automáticamente.</p>
                <div className="card-actions justify-end mt-4">
                  <Link to="/facturas/nueva" className="btn btn-sm bg-white text-primary border-none hover:bg-white/90 font-bold px-6 rounded-full">
                    Comenzar <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border-2 border-dashed border-base-300 hover:border-primary/50 transition-all group flex items-center justify-center text-center p-6">
               <Users size={32} className="opacity-20 mb-2 group-hover:scale-110 transition-transform" />
               <h3 className="font-bold opacity-40 italic">Módulo de Reportes</h3>
               <p className="text-xs opacity-40 max-w-[150px]">Próximamente: Exportación de auditorías para convenios.</p>
            </div>

            {/* WIDGET CORREGIDO: ESTADO DE CARGA POR OBRA SOCIAL */}
            <div className="card bg-base-100 border border-base-200 shadow-sm md:col-span-2">
              <div className="card-body p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Building2 size={20} className="text-primary" />
                  Estado de Carga - Período {PERIODO_ACTUAL}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statsObrasSociales.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-2xl border border-base-200 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group bg-base-50/30"
                      onClick={() => navigate('/facturas/nueva')}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:text-primary transition-colors">
                          {item.nombre}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.faltante === 0 ? 'bg-success/20 text-success' : 'bg-error/10 text-error'}`}>
                          {item.faltante === 0 ? 'COMPLETO' : `FALTAN ${item.faltante}`}
                        </span>
                      </div>
                      <div className="flex items-end justify-between mb-2">
                        <span className="text-xl font-black">{item.completado} <span className="text-xs font-normal opacity-40">/ {item.total}</span></span>
                      </div>
                      <progress 
                        className={`progress ${item.color} w-full h-1.5`} 
                        value={item.completado} 
                        max={item.total}
                      ></progress>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-3 bg-blue-50 rounded-xl flex items-center gap-3">
                  <div className="bg-blue-500 text-white p-1 rounded-full shadow-sm">
                    <Info size={12}/>
                  </div>
                  <p className="text-[10px] text-blue-700 font-bold uppercase tracking-tight">
                    Análisis: {statsObrasSociales[0]?.nombre} requiere atención inmediata de carga.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Pendientes Críticos */}
        <div className="space-y-6">
          <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
             <div className="bg-warning/10 px-5 py-3 border-b border-warning/10">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm flex items-center gap-2 text-warning-content">
                    <Clock size={16} /> Pendientes de Carga
                  </h3>
                  <span className="badge badge-warning font-black text-[10px]">CRÍTICO</span>
                </div>
             </div>
            <div className="card-body p-5">
              <div className="space-y-3">
                {[
                  { id: 101, nombre: "Julian Barrios", os: "OSECAC", periodo: "Dic 2023" },
                  { id: 102, nombre: "Marta Rodriguez", os: "OSDE", periodo: "Dic 2023" },
                  { id: 103, nombre: "Ricardo Darín", os: "PAMI", periodo: "Nov 2023" },
                ].map((p) => (
                  <div key={p.id} className="p-3 rounded-xl border border-base-200 hover:border-primary/30 transition-all bg-base-50/50 group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-bold leading-tight">{p.nombre}</p>
                        <p className="text-[10px] opacity-50 font-bold uppercase">{p.os}</p>
                      </div>
                      <span className="text-[10px] font-black text-warning bg-warning/10 px-2 py-0.5 rounded">FALTA {p.periodo}</span>
                    </div>
                    <Link to={`/pasajeros/${p.id}/facturas/nueva`} className="btn btn-primary btn-xs btn-block gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={12} /> Cargar Planilla
                    </Link>
                  </div>
                ))}
              </div>
              <Link to="/pasajeros" className="btn btn-ghost btn-xs btn-block mt-2 opacity-50 font-bold">Ver todos los pasajeros</Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}