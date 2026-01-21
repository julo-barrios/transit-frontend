import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import PageLayout from "../components/Layout/PageLayout";
import DashboardMetrics from "../components/dashboard/DashboardMetrics";
import FinancialChart from "../components/dashboard/FinancialChart";
import WorkloadStatus from "../components/dashboard/WorkloadStatus";
import AccreditationPending from "../components/dashboard/AccreditationPending";
import CriticalPending from "../components/dashboard/CriticalPending";
import { dashboardService } from "../services/dashboard";
import type { DashboardMetricsData } from "../components/dashboard/DashboardMetrics";

export default function Home() {
  const [metrics, setMetrics] = useState<DashboardMetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <PageLayout
      title="Panel de Control"
      breadcrumbs={[{ label: "Inicio", path: "/" }]}
      action={
        <Link to="/facturas/nueva" className="btn btn-primary btn-sm gap-2">
          <Plus size={16} /> Nueva Factura
        </Link>
      }
    >
      {/* 1. KPIs */}
      <DashboardMetrics metrics={metrics} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Gráfico de Facturación */}
          <FinancialChart />

          {/* 3. WIDGET ESPECÍFICO: ESTADO DE CARGA */}
          <WorkloadStatus />
        </div>

        {/* COLUMNA DERECHA: Pendientes Críticos & Acreditación */}
        <div className="space-y-6">
          <CriticalPending />
          <AccreditationPending />
        </div>
      </div>
    </PageLayout>
  );
}
