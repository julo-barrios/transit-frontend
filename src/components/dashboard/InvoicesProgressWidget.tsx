import { FileCheck } from "lucide-react";

interface InvoicesProgressWidgetProps {
    current: number;
    total: number;
}

export default function InvoicesProgressWidget({ current, total }: InvoicesProgressWidgetProps) {
    const percentage = Math.min(Math.round((current / total) * 100), 100);
    const remaining = total - current;

    // Color logic
    const getColor = (pct: number) => {
        if (pct >= 100) return "text-success";
        if (pct >= 80) return "text-primary";
        return "text-secondary";
    };

    return (
        <div className="card bg-base-100 border border-base-200 shadow-sm relative overflow-hidden">
            <div className="card-body flex flex-row items-center justify-between p-6">

                {/* Left Content */}
                <div className="flex flex-col gap-1 z-10">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60">
                        <FileCheck size={16} />
                        Progreso Mensual
                    </div>
                    <div className="text-3xl font-black tracking-tight">
                        {current} <span className="text-lg opacity-40 font-bold">/ {total}</span>
                    </div>
                    <div className="text-xs font-medium opacity-60 mt-1">
                        Facturas cargadas
                    </div>

                    {remaining > 0 ? (
                        <div className="badge badge-warning badge-sm gap-1 mt-2 font-bold text-warning-content/80">
                            Faltan {remaining}
                        </div>
                    ) : (
                        <div className="badge badge-success badge-sm gap-1 mt-2 font-bold text-white">
                            ¡Objetivo Cumplido!
                        </div>
                    )}
                </div>

                {/* Right Content: Circular Progress */}
                <div className="flex flex-col items-center justify-center">
                    <div className={`radial-progress ${getColor(percentage)} bg-base-200/30 font-black text-xl`} style={{ "--value": percentage, "--size": "5rem", "--thickness": "6px" } as React.CSSProperties}>
                        {percentage}%
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.03] scale-150 pointer-events-none">
                    <FileCheck size={120} />
                </div>
            </div>
        </div>
    );
}
