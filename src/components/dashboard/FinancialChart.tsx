import { TrendingUp } from "lucide-react";
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
import { useFinancialEvolution } from "../../hooks/useDashboard";

export default function FinancialChart() {
    const { data, isLoading } = useFinancialEvolution();

    if (isLoading || !data) return <div className="h-80 w-full flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="card bg-base-100 border border-base-200 p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Evolución Financiera (Últimos meses)
            </h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} hide />
                        <Tooltip
                            cursor={{ fill: '#34465774' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="facturado" name="Facturado" fill="#570df8" radius={[4, 4, 0, 0]} barSize={25} />
                        <Bar dataKey="acreditado" name="Acreditado" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={25} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
