import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { CampoConfiguracion } from "@/types";

interface SchemaBuilderProps {
    fields: CampoConfiguracion[];
    onChange: (fields: CampoConfiguracion[]) => void;
}

const SchemaBuilder = ({ fields, onChange }: SchemaBuilderProps) => {
    const [newField, setNewField] = useState<Partial<CampoConfiguracion>>({
        type: "text",
        required: false
    });

    const handleAddField = () => {
        if (!newField.label || !newField.key) return;

        onChange([...fields, {
            ...newField,
            key: newField.key.toLowerCase().replace(/\s+/g, '_') // Auto-generate key from label if needed, but here we require both
        } as CampoConfiguracion]);

        setNewField({ type: "text", required: false, label: "", key: "" });
    };

    const handleRemoveField = (index: number) => {
        const nextFields = fields.filter((_, i) => i !== index);
        onChange(nextFields);
    };

    return (
        <div className="card bg-base-100 border border-base-200">
            <div className="card-body p-4">
                <h3 className="card-title text-sm uppercase opacity-70 mb-4">Configuración de Campos para Pasajeros</h3>

                {/* Lista de Campos Existentes */}
                <div className="space-y-2 mb-6">
                    {fields.length === 0 && (
                        <div className="text-center py-4 text-base-content/50 text-sm italic border-2 border-dashed border-base-200 rounded-lg">
                            No hay campos configurados. Agrega uno abajo.
                        </div>
                    )}

                    {fields.map((field, index) => (
                        <div key={index} className="flex items-center gap-2 bg-base-200/50 p-2 rounded-lg group">
                            <GripVertical size={16} className="opacity-30 cursor-move" />
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div className="font-bold">{field.label}</div>
                                <div className="font-mono text-xs opacity-70 self-center">{field.key}</div>
                                <div className="badge badge-sm">{field.type}</div>
                                <div className="text-xs self-center">
                                    {field.required ? <span className="text-error font-bold">* Obligatorio</span> : "Opcional"}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveField(index)}
                                className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Formulario de Nuevo Campo */}
                <div className="bg-base-200 p-3 rounded-xl">
                    <div className="text-xs font-bold uppercase opacity-50 mb-2">Nuevo Campo</div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                        <div className="form-control md:col-span-2">
                            <label className="label py-0"><span className="label-text text-xs">Etiqueta (Label)</span></label>
                            <input
                                type="text"
                                className="input input-sm input-bordered"
                                placeholder="Ej: N° Credencial"
                                value={newField.label || ""}
                                onChange={e => {
                                    const val = e.target.value;
                                    // Auto-generate key
                                    const key = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');
                                    setNewField(prev => ({ ...prev, label: val, key: key }));
                                }}
                            />
                        </div>

                        <div className="form-control md:col-span-1">
                            <label className="label py-0"><span className="label-text text-xs">Key (Auto)</span></label>
                            <input
                                type="text"
                                className="input input-sm input-bordered font-mono text-xs"
                                value={newField.key || ""}
                                onChange={e => setNewField(prev => ({ ...prev, key: e.target.value }))}
                            />
                        </div>

                        <div className="form-control md:col-span-1">
                            <label className="label py-0"><span className="label-text text-xs">Tipo</span></label>
                            <select
                                className="select select-sm select-bordered"
                                value={newField.type}
                                onChange={e => setNewField(prev => ({ ...prev, type: e.target.value as CampoConfiguracion["type"] }))}
                            >
                                <option value="text">Texto</option>
                                <option value="number">Número</option>
                                <option value="date">Fecha</option>
                                <option value="select">Selección</option>
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-2 py-0 border border-base-300 rounded-lg h-[32px] px-2 bg-base-100">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-xs checkbox-primary"
                                    checked={newField.required}
                                    onChange={e => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                                />
                                <span className="label-text text-xs">Obligatorio</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddField}
                        disabled={!newField.label || !newField.key}
                        className="btn btn-primary btn-sm w-full mt-3 gap-2"
                    >
                        <Plus size={16} /> Agregar Campo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SchemaBuilder;
