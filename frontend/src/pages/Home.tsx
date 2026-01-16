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
  Info
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import type { PasajeroListItem } from "../types";
import { Link } from "react-router-dom";

// Datos de ejemplo que reflejan el desfasaje de 3 meses
const dataGrafico = [
  { name: 'Ago', facturado: 85000, acreditado: 85000 },
  { name: 'Sep', facturado: 92000, acreditado: 92000 },
  { name: 'Oct', facturado: 75000, acreditado: 0 },
  { name: 'Nov', facturado: 110000, acreditado: 0 },
  { name: 'Dic', facturado: 98000, acreditado: 0 },
];

export default function Home() {
  const [pasajeros, setPasajeros] = useState<PasajeroListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/v1/pasajeros');
        if (response.ok) {
          const data = await response.json();
          setPasajeros(data);
        }
      } catch (err) {
        console.error("Error cargando stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <PageLayout 
      title="Panel de Control" 
      breadcrumbs={["Inicio"]}
      // Usamos el prop 'action' que definimos antes para un botón global
      action={
        <Link to="/facturas/nueva" className="btn btn-primary btn-sm gap-2">
          <Plus size={16} /> Nueva Factura
        </Link>
      }
    >
      {/* 1. Fila de KPIs (Resumen rápido) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow bg-base-100 border border-base-200">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Users size={24} />
            </div>
            <div className="stat-title text-xs uppercase font-semibold">Total Pasajeros</div>
            <div className="stat-value text-primary">{loading ? "..." : pasajeros.length}</div>
            <div className="stat-desc text-success">↗︎ 4 (este mes)</div>
          </div>
        </div>
        <div className="stats shadow bg-base-100 border border-base-200">
          <div className="stat">
            <div className="stat-figure text-success">
              <TrendingUp size={24} />
            </div>
            <div className="stat-title text-xs uppercase font-semibold">Facturas Pendientes</div>
            <div className="stat-value text-secondary">12</div>
            <div className="stat-desc text-info">6 requieren atención</div>
          </div>
        </div>
        <div className="stats shadow bg-base-100 border border-base-200">
          <div className="stat">
            <div className="stat-figure text-success">
              <TrendingUp size={24} />
            </div>
            <div className="stat-title text-xs uppercase font-semibold">Facturación Mensual</div>
            <div className="stat-value text-success">$425k</div>
            <div className="stat-desc">21% más que el mes pasado</div>
          </div>
        </div>
        <div className="stats shadow bg-base-100 border border-base-200">
          <div className="stat">
            <div className="stat-figure text-warning">
              <Clock size={24} />
            </div>
            <div className="stat-title text-xs uppercase font-semibold">Promedio Cobro</div>
            <div className="stat-value text-warning">45d</div>
            <div className="stat-desc">Días desde facturación</div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Sección del Gráfico (Ocupa 2 columnas) */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 border border-base-200 p-6">
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
                  
                  <Bar 
                    dataKey="facturado" 
                    name="Facturado" 
                    fill="#570df8" 
                    radius={[4, 4, 0, 0]} 
                    barSize={25}
                  />
                  
                  <Bar 
                    dataKey="acreditado" 
                    name="Acreditado (Cobrado)" 
                    fill="#22c55e" 
                    radius={[4, 4, 0, 0]} 
                    barSize={25}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-3 bg-base-200/50 rounded-lg flex gap-3 items-center">
              <Info size={16} className="text-info" />
              <p className="text-[10px] opacity-70 leading-tight">
                <b>Nota de Negocio:</b> El gráfico refleja un ciclo de acreditación promedio de 90 días, 
                permitiendo visualizar el desfasaje financiero típico de las Obras Sociales.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Columna lateral (Pasajeros recientes o Acciones rápidas) */}
        <div className="space-y-6">
           {/* Aquí iría tu lista de pasajeros recientes */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Gráfico Principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* 3. NUEVO CUADRO: ACCIONES RÁPIDAS (Nueva Factura) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-lg group">
              <div className="card-body p-6">
                <div className="flex justify-between items-start text-white/80">
                  <FileText size={32} />
                  <PlusCircle size={20} className="group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="card-title text-2xl mt-4">Nueva Factura</h2>
                <p className="text-sm opacity-80">Carga una nueva factura al sistema para un pasajero existente.</p>
                <div className="card-actions justify-end mt-4">
                  <Link to="/facturas/nueva" className="btn btn-sm bg-white text-primary border-none hover:bg-white/90">
                    Comenzar <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border-2 border-dashed border-base-300 hover:border-primary/50 transition-colors">
              <div className="card-body p-6 items-center justify-center text-center">
                <Users size={32} className="opacity-20 mb-2" />
                <h3 className="font-bold opacity-40 italic">Módulo de Reportes</h3>
                <p className="text-xs opacity-40">Próximamente: Exportación de datos para obras sociales</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Lista Lateral */}
        <div className="card bg-base-100 border border-base-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Pasajeros Recientes</h3>
            <Link to="/pasajeros" className="text-xs text-primary font-bold hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <span className="loading loading-dots loading-md text-primary"></span>
            ) : (
              pasajeros.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-base-200/50 rounded-lg transition-colors cursor-pointer">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${p.nombre}`} alt="avatar" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{p.nombre} {p.apellido}</p>
                    <p className="text-[10px] opacity-50 uppercase tracking-tighter">OS: {p.obra_social || "OSECAC"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}