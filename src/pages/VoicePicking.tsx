
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Mic, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ZONES = [
  { id: "Zona A - Electrónica", label: "A", name: "Electrónica", color: "bg-blue-100 border-blue-300 text-blue-800", dot: "bg-blue-500", col: "col-start-1 row-start-1" },
  { id: "Zona B - Herramientas", label: "B", name: "Herramientas", color: "bg-orange-100 border-orange-300 text-orange-800", dot: "bg-orange-500", col: "col-start-2 row-start-1" },
  { id: "Zona C - Ropa", label: "C", name: "Ropa", color: "bg-purple-100 border-purple-300 text-purple-800", dot: "bg-purple-500", col: "col-start-1 row-start-2" },
  { id: "Zona D - Químicos", label: "D", name: "Químicos", color: "bg-red-100 border-red-300 text-red-800", dot: "bg-red-500", col: "col-start-2 row-start-2" },
  { id: "Zona E - Recepción", label: "E", name: "Recepción", color: "bg-green-100 border-green-300 text-green-800", dot: "bg-green-500", col: "col-start-1 row-start-3" },
  { id: "Zona F - Despacho", label: "F", name: "Despacho", color: "bg-amber-100 border-amber-300 text-amber-800", dot: "bg-amber-500", col: "col-start-2 row-start-3" },
];

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const SHIFTS = ["Mañana (06:00-14:00)", "Tarde (14:00-22:00)", "Noche (22:00-06:00)"];
const ROLES = ["Picker", "Supervisor", "Recepción", "Despacho"];
const emptyForm = { worker_name: "", zone: "Zona A - Electrónica", shift: "Mañana (06:00-14:00)", day: "Lunes", role: "Picker", voice_device_id: "" };

export default function VoicePicking() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [activeZone, setActiveZone] = useState(null);
  const [activeDay, setActiveDay] = useState("Lunes");
  const qc = useQueryClient();

  const { data: shifts = [], isLoading } = useQuery({
    queryKey: ["shifts"],
    queryFn: () => base44.entities.Shift.list(),
  });

  const createMutation = useMutation({
    mutationFn: (d) => base44.entities.Shift.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["shifts"] }); setDialogOpen(false); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Shift.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["shifts"] }),
  });

  const getZoneWorkers = (zoneId) => shifts.filter((s) => s.zone === zoneId);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-accent" />
            <h1 className="text-2xl font-bold">Voice Picking</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Distribución de zonas y asignación de operarios</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setDialogOpen(true); }} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Asignar Operario
        </Button>
      </div>

      {/* Warehouse Map */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-sm font-semibold mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent inline-block" /> Plano del Almacén</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {ZONES.map((z) => {
            const workers = getZoneWorkers(z.id);
            const isActive = activeZone === z.id;
            return (
              <button
                key={z.id}
                onClick={() => setActiveZone(isActive ? null : z.id)}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all hover:shadow-md",
                  z.color,
                  isActive && "ring-2 ring-primary ring-offset-2"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{z.label}</span>
                  <span className="flex items-center gap-1 text-xs font-medium">
                    <Users className="w-3.5 h-3.5" />{workers.length}
                  </span>
                </div>
                <p className="text-xs font-semibold">{z.name}</p>
                <p className="text-[10px] opacity-70 mt-0.5">Voice Picking Activo</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {workers.slice(0, 3).map((w, i) => (
                    <span key={i} className="text-[10px] bg-white/60 rounded px-1.5 py-0.5 font-medium">{w.worker_name}</span>
                  ))}
                  {workers.length > 3 && <span className="text-[10px] bg-white/60 rounded px-1.5 py-0.5">+{workers.length - 3}</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Zone detail */}
        {activeZone && (
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold">{activeZone} — Operarios asignados</p>
            {getZoneWorkers(activeZone).length === 0 ? (
              <p className="text-xs text-muted-foreground">Sin operarios asignados</p>
            ) : (
              <div className="divide-y divide-border">
                {getZoneWorkers(activeZone).map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">{s.worker_name}</p>
                      <p className="text-xs text-muted-foreground">{s.shift} · {s.day} · {s.role}</p>
                      {s.voice_device_id && <p className="text-[10px] text-muted-foreground">Dispositivo: {s.voice_device_id}</p>}
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteMutation.mutate(s.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Shift Quadrant */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary inline-block" /> Cuadrante de Turnos</h2>
          <div className="flex gap-1 flex-wrap">
            {DAYS.map((d) => (
              <button key={d} onClick={() => setActiveDay(d)} className={cn("text-xs px-2.5 py-1 rounded-md transition-colors font-medium", activeDay === d ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}>
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {SHIFTS.map((sh) => {
            const workers = shifts.filter((s) => s.day === activeDay && s.shift === sh);
            return (
              <div key={sh} className="rounded-lg border border-border overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30 border-b border-border">
                  <span className="text-xs font-semibold text-muted-foreground">{sh}</span>
                  <Badge variant="outline" className="text-[10px]">{workers.length} operarios</Badge>
                </div>
                {workers.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-muted-foreground">Sin asignaciones</p>
                ) : (
                  <div className="divide-y divide-border">
                    {workers.map((w) => {
                      const zone = ZONES.find((z) => z.id === w.zone);
                      return (
                        <div key={w.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 transition-colors">
                          <span className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold", zone?.color)}>{zone?.label}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{w.worker_name}</p>
                            <p className="text-xs text-muted-foreground">{w.zone} · {w.role}</p>
                          </div>
                          {w.voice_device_id && <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono">{w.voice_device_id}</span>}
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive shrink-0" onClick={() => deleteMutation.mutate(w.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Asignar Operario</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Label>Nombre del Operario</Label><Input value={form.worker_name} onChange={(e) => setForm({ ...form, worker_name: e.target.value })} required /></div>
              <div>
                <Label>Zona</Label>
                <Select value={form.zone} onValueChange={(v) => setForm({ ...form, zone: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ZONES.map((z) => <SelectItem key={z.id} value={z.id}>{z.id}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rol</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Turno</Label>
                <Select value={form.shift} onValueChange={(v) => setForm({ ...form, shift: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SHIFTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Día</Label>
                <Select value={form.day} onValueChange={(v) => setForm({ ...form, day: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{DAYS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="col-span-2"><Label>ID Dispositivo Voice (opcional)</Label><Input placeholder="VP-001" value={form.voice_device_id} onChange={(e) => setForm({ ...form, voice_device_id: e.target.value })} /></div>
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Asignando..." : "Asignar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}