import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, MapPin, Check, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function PickOrderDetail({ order, onBack }) {
  const [items, setItems] = useState(order.items || []);
  const qc = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.PickOrder.update(order.id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pick-orders"] }),
  });

  const togglePicked = (idx) => {
    const updated = items.map((it, i) => i === idx ? { ...it, picked: !it.picked, quantity_picked: !it.picked ? it.quantity_requested : 0 } : it);
    setItems(updated);
    updateMutation.mutate({ items: updated });
  };

  const allPicked = items.length > 0 && items.every((it) => it.picked);
  const pickedCount = items.filter((it) => it.picked).length;

  const changeStatus = (status) => {
    const data = { status };
    if (status === "Completada") data.completed_date = new Date().toISOString();
    updateMutation.mutate(data);
    onBack();
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a órdenes
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">{order.client_name || "Sin cliente"} · {order.priority}</p>
        </div>
        <div className="flex gap-2">
          {order.status === "Pendiente" && (
            <Button size="sm" onClick={() => changeStatus("En Proceso")} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Play className="w-3.5 h-3.5 mr-1.5" /> Iniciar
            </Button>
          )}
          {order.status === "En Proceso" && allPicked && (
            <Button size="sm" onClick={() => changeStatus("Completada")} className="bg-green-600 hover:bg-green-700 text-white">
              <Check className="w-3.5 h-3.5 mr-1.5" /> Completar
            </Button>
          )}
          {(order.status === "Pendiente" || order.status === "En Proceso") && (
            <Button size="sm" variant="outline" onClick={() => changeStatus("Cancelada")}>
              <X className="w-3.5 h-3.5 mr-1.5" /> Cancelar
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Progreso</span>
          <span className="text-xs font-bold">{pickedCount}/{items.length}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${items.length ? (pickedCount / items.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Pick list */}
      <div className="bg-card rounded-xl border border-border divide-y divide-border overflow-hidden">
        {items.map((item, idx) => (
          <div key={idx} className={cn("flex items-center gap-4 px-4 py-3.5 transition-all", item.picked && "bg-green-50/60")}>
            <Checkbox
              checked={item.picked}
              onCheckedChange={() => togglePicked(idx)}
              disabled={order.status !== "En Proceso"}
            />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", item.picked && "line-through text-muted-foreground")}>{item.product_name}</p>
              <p className="text-xs text-muted-foreground">{item.sku}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-mono bg-muted px-2 py-0.5 rounded">{item.location}</span>
            </div>
            <span className="text-sm font-bold w-10 text-right">{item.quantity_requested}</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Notas</p>
          <p className="text-sm">{order.notes}</p>
        </div>
      )}
    </div>
  );
}