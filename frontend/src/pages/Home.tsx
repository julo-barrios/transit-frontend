import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  UserPlus, 
  ArrowUpRight,
  Clock
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { PasajeroListItem } from "../types";
import { Link } from "react-router-dom";

// Datos de ejemplo para el gráfico (luego los conectarás a tu API)
const dataGrafico = [
  { name: 'Ene', total: 4000 },
  { name: 'Feb', total: 3000 },
  { name: 'Mar', total: 2000 },
  { name: 'Abr', total: 2780 },
  { name: 'May', total: 1890 },
  { name: 'Jun', total: 2390 },
];

export default function Home() {
  const [pasajeros, setPasajeros] = useState<PasajeroListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reutilizamos tu lógica de fetching para mostrar datos reales
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
    <PageLayout title="Panel de Control" breadcrumbs={["Inicio"]}>
      {/* 1. Fila de KPIs (Métricas clave) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            <div className="stat-figure text-secondary">
              <FileText size={24} />
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
        {/* 2. Gráfico de Facturación (Ocupa 2 columnas) */}
        <div className="lg:col-span-2 card bg-base-100 shadow-sm border border-base-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Evolución de Facturación
            </h3>
            <select className="select select-bordered select-sm">
              <option>Últimos 6 meses</option>
              <option>Este año</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataGrafico}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {dataGrafico.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === dataGrafico.length - 1 ? '#570df8' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Lista de Pasajeros Recientes (Ocupa 1 columna) */}
        <div className="card bg-base-100 shadow-sm border border-base-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Pasajeros Recientes</h3>
            <Link to="/pasajeros" className="btn btn-ghost btn-xs text-primary">Ver todos</Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10"><span className="loading loading-spinner text-primary"></span></div>
            ) : (
              pasajeros.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-10 h-10 bg-base-200">
                        <img src={`https://api.dicebear.com/7.x/personas/svg?seed=${p.nombre}`} alt="avatar" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{p.nombre} {p.apellido}</p>
                      <p className="text-xs opacity-50">{p.obra_social || "Sin Obra Social"}</p>
                    </div>
                  </div>
                  <Link to={`/pasajeros/${p.cuil}`} className="btn btn-ghost btn-circle btn-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              ))
            )}
            <button className="btn btn-outline btn-primary btn-sm w-full mt-4 gap-2">
              <UserPlus size={16} />
              Nuevo Pasajero
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}