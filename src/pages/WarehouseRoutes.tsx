import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Route, Clock, User, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import WarehouseFloorPlan from "../components/WarehouseFloorPlan";

const ZONE_OPTIONS = ["A1","A2","A3","B1","B2","B3","C1","C2","C3","D1","D2","D3","E1","F1"];
const SHIFTS = ["Mañana (06:00-14:00)", "Tarde (14:00-22:00)", "Noche (22:00-06:00)"];

const statusColor = {
  Pendiente: "bg-yellow-100 text-yellow-700 border-yellow-200",
  "En Curso": "bg-blue-100 text-blue-700 border-blue-200",
  Completada: "bg-green-100 text-green-700 border-green-200",
};

const priorityDot = { Normal: "bg-slate-400", Alta: "bg-orange-500", Urgente: "bg-red-500" };

const ROUTE_COLORS = [
  "text-blue-600 bg-blue-50 border-blue-200",
  "text-emerald-600 bg-emerald-50 border-emerald-200",
  "text-purple-600 bg-purple-50 border-purple-200",
  "text-orange-600 bg-orange-50 border-orange-200",
  "text-pink-600 bg-pink-50 border-pink-200",
];

const emptyForm = { route_number: "", name: "", zones: [], assigned_picker: "", shift: "Mañana (06:00-14:00)", estimated_minutes: 30, status: "Pendiente", priority: "Normal" };

export default function WarehouseRoutes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const qc = useQueryClient();

  const { data: routes = [], isLoading } = useQuery({
    queryKey: ["routes"],
    queryFn: () => base44.entities.Route.list(),
  });

  const createMutation = useMutation({
    mutationFn: (d) => base44.entities.Route.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["routes"] }); setDialogOpen(false); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Route.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["routes"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Route.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["routes"] }); setSelectedRoute(null); },
  });

  const toggleZone = (z) => {
    setForm((f) => ({
      ...f,
      zones: f.zones.includes(z) ? f.zones.filter((x) => x !== z) : [...f.zones, z],
    }));
  };

  const activeRoute = selectedRoute ? routes.find((r) => r.id === selectedRoute) : null;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Route className="w-5 h-5 text-accent" />
            <h1 className="text-2xl font-bold">Cuadrante de Rutas</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Plano logístico del almacén con rutas de picking</p>
        </div>
        <Button onClick={() => { setForm({ ...emptyForm, route_number: `R-${String(routes.length + 1).padStart(2,"0")}` }); setDialogOpen(true); }} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Nueva Ruta
        </Button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Floor Plan */}
        <div className="lg:col-span-3 bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold mb-4">Plano del Almacén</h2>
          <WarehouseFloorPlan routes={routes} activeRouteId={selectedRoute} onSelectRoute={setSelectedRoute} />
          {activeRoute && (
            <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{activeRoute.route_number} — {activeRoute.name}</p>
                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", statusColor[activeRoute.status])}>{activeRoute.status}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Recorrido: {activeRoute.zones?.join(" → ")}</p>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                {activeRoute.assigned_picker && <span className="flex items-center gap-1"><User className="w-3 h-3" />{activeRoute.assigned_picker}</span>}
                {activeRoute.estimated_minutes && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{activeRoute.estimated_minutes} min</span>}
              </div>
              <div className="flex gap-2 mt-3">
                {activeRoute.status === "Pendiente" && (
                  <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => updateMutation.mutate({ id: activeRoute.id, data: { status: "En Curso" } })}>
                    <Play className="w-3 h-3 mr-1" /> Iniciar
                  </Button>
                )}
                {activeRoute.status === "En Curso" && (
                  <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => updateMutation.mutate({ id: activeRoute.id, data: { status: "Completada" } })}>
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Completar
                  </Button>
                )}
                <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30" onClick={() => deleteMutation.mutate(activeRoute.id)}>
                  <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Route list */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold">Rutas Activas</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{routes.length} rutas configuradas</p>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
          ) : routes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <Route className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No hay rutas configuradas</p>
            </div>
          ) : (
            <div className="divide-y divide-border overflow-auto flex-1">
              {routes.map((r, idx) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoute(selectedRoute === r.id ? null : r.id)}
                  className={cn("w-full flex items-start gap-3 px-4 py-3.5 hover:bg-muted/20 transition-colors text-left", selectedRoute === r.id && "bg-muted/40")}
                >
                  <span className={cn("w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5", ROUTE_COLORS[idx % ROUTE_COLORS.length])}>
                    {r.route_number || `R${idx + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{r.name}</p>
                      <span className={cn("w-2 h-2 rounded-full shrink-0", priorityDot[r.priority] || "bg-slate-400")} />
                    </div>
                    <p className="text-[11px] text-muted-foreground">{r.zones?.length || 0} zonas · {r.estimated_minutes || "—"} min</p>
                    {r.assigned_picker && <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5"><User className="w-3 h-3" />{r.assigned_picker}</p>}
                  </div>
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 shrink-0", statusColor[r.status])}>{r.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Nueva Ruta de Picking</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Número de Ruta</Label><Input value={form.route_number} onChange={(e) => setForm({ ...form, route_number: e.target.value })} required /></div>
              <div><Label>Nombre</Label><Input placeholder="Ej: Ruta Norte" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            </div>
            <div>
              <Label className="mb-2 block">Zonas del Recorrido <span className="text-muted-foreground font-normal">(orden importa)</span></Label>
              <div className="grid grid-cols-5 gap-1.5">
                {ZONE_OPTIONS.map((z) => {
                  const sel = form.zones.includes(z);
                  const idx = form.zones.indexOf(z);
                  return (
                    <button
                      key={z}
                      type="button"
                      onClick={() => toggleZone(z)}
                      className={cn("relative h-10 rounded-lg border text-xs font-semibold transition-all", sel ? "bg-accent text-accent-foreground border-accent" : "bg-muted/30 border-border hover:bg-muted")}
                    >
                      {z}
                      {sel && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">{idx + 1}</span>}
                    </button>
                  );
                })}
              </div>
              {form.zones.length > 0 && <p className="text-xs text-muted-foreground mt-2">Recorrido: {form.zones.join(" → ")}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Picker Asignado</Label><Input value={form.assigned_picker} onChange={(e) => setForm({ ...form, assigned_picker: e.target.value })} /></div>
              <div><Label>Tiempo Est. (min)</Label><Input type="number" value={form.estimated_minutes} onChange={(e) => setForm({ ...form, estimated_minutes: Number(e.target.value) })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Turno</Label>
                <Select value={form.shift} onValueChange={(v) => setForm({ ...form, shift: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SHIFTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prioridad</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Normal","Alta","Urgente"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={createMutation.isPending || form.zones.length === 0}>
              {createMutation.isPending ? "Creando..." : "Crear Ruta"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}