import type { CampoConfiguracion } from "@/types";

interface DynamicFieldsRendererProps {
    schema?: CampoConfiguracion[];
    values: Record<string, string | number>;
    onChange: (key: string, value: string | number) => void;
}

const DynamicFieldsRenderer = ({ schema, values, onChange }: DynamicFieldsRendererProps) => {
    if (!schema || schema.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-base-300 bg-base-100 p-4 rounded-xl">
            <div className="col-span-full mb-2">
                <h3 className="font-bold text-sm opacity-70 uppercase tracking-widest">Datos Específicos de Obra Social</h3>
            </div>

            {schema.map((field) => (
                <div key={field.key} className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium">
                            {field.label} {field.required && <span className="text-error">*</span>}
                        </span>
                    </label>

                    {field.type === "select" ? (
                        <select
                            className="select select-bordered w-full"
                            value={values[field.key] || ""}
                            onChange={(e) => onChange(field.key, e.target.value)}
                        >
                            <option value="" disabled>Seleccione una opción</option>
                            {field.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.type}
                            className="input input-bordered w-full"
                            placeholder={field.label}
                            value={values[field.key] || ""}
                            onChange={(e) => onChange(field.key, e.target.value)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default DynamicFieldsRenderer;
