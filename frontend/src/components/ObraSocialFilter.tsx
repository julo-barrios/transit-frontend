import { Building2 } from "lucide-react";
import { MOCK_OBRAS_SOCIALES } from "../mocks/Data";

interface ObraSocialFilterProps {
    value: string;
    onChange: (value: string) => void;
}

const ObraSocialFilter = ({ value, onChange }: ObraSocialFilterProps) => {
    return (
        <div className="flex items-center gap-2 bg-base-100 px-3 py-1 rounded-lg border border-base-300">
            <Building2 size={16} className="opacity-50 text-primary" />
            <select
                className="select select-ghost select-sm focus:bg-transparent font-medium"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="Todas">Todas las Obras Sociales</option>
                {MOCK_OBRAS_SOCIALES.map((os) => (
                    <option key={os.id} value={os.nombre}>
                        {os.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ObraSocialFilter;
