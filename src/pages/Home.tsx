import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import PageLayout from "../components/Layout/PageLayout";
import DashboardMetrics from "../components/dashboard/DashboardMetrics";
import FinancialChart from "../components/dashboard/FinancialChart";
import WorkloadStatus from "../components/dashboard/WorkloadStatus";
import AccreditationPending from "../components/dashboard/AccreditationPending";
import CriticalPending from "../components/dashboard/CriticalPending";
import { useDashboardKpis } from "../hooks/useDashboard";

export default function Home() {
  const { data: metrics, isLoading, isError } = useDashboardKpis();

  if (isError) {
    return (
      <PageLayout title="Panel de Control" breadcrumbs={[{ label: "Inicio", path: "/" }]}>
        <div className="alert alert-error">Error al cargar datos del dashboard. Reintente más tarde.</div>
      </PageLayout>
    );
  }

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
      <DashboardMetrics metrics={metrics || null} loading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Gráfico de Facturación (Refactorizar para usar hook interno si es necesario, o pasar data por props) */}
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
