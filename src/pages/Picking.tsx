import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, ClipboardList, Check, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import PickOrderDetail from "../components/PickOrderDetail";

const statusColor = {
  Pendiente: "bg-yellow-100 text-yellow-700 border-yellow-200",
  "En Proceso": "bg-blue-100 text-blue-700 border-blue-200",
  Completada: "bg-green-100 text-green-700 border-green-200",
  Cancelada: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function Picking() {
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOrder, setDetailOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["pick-orders"],
    queryFn: () => base44.entities.PickOrder.list("-created_date"),
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list(),
  });

  const [form, setForm] = useState({ client_name: "", priority: "Media", notes: "", selectedProducts: {} });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PickOrder.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["pick-orders"] }); setCreateOpen(false); },
  });

  const handleCreate = () => {
    const items = Object.entries(form.selectedProducts)
      .filter(([, v]) => v.selected && v.qty > 0)
      .map(([id, v]) => {
        const p = products.find((pr) => pr.id === id);
        return { product_id: id, product_name: p?.name, sku: p?.sku, location: p?.location, quantity_requested: v.qty, quantity_picked: 0, picked: false };
      });
    if (items.length === 0) return;
    const orderNum = `PO-${Date.now().toString(36).toUpperCase()}`;
    createMutation.mutate({ order_number: orderNum, status: "Pendiente", priority: form.priority, client_name: form.client_name, notes: form.notes, items });
  };

  const toggleProduct = (id) => {
    setForm((f) => ({
      ...f,
      selectedProducts: {
        ...f.selectedProducts,
        [id]: { selected: !f.selectedProducts[id]?.selected, qty: f.selectedProducts[id]?.qty || 1 },
      },
    }));
  };

  const setQty = (id, qty) => {
    setForm((f) => ({ ...f, selectedProducts: { ...f.selectedProducts, [id]: { ...f.selectedProducts[id], qty: Number(qty) } } }));
  };

  const filtered = orders.filter((o) => filterStatus === "all" || o.status === filterStatus);

  if (detailOrder) {
    return <PickOrderDetail order={detailOrder} onBack={() => setDetailOrder(null)} />;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Órdenes de Picking</h1>
          <p className="text-sm text-muted-foreground mt-1">{orders.length} órdenes totales</p>
        </div>
        <Button onClick={() => { setForm({ client_name: "", priority: "Media", notes: "", selectedProducts: {} }); setCreateOpen(true); }} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Nueva Orden
        </Button>
      </div>

      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-44"><SelectValue placeholder="Estado" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {["Pendiente", "En Proceso", "Completada", "Cancelada"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardList className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No hay órdenes</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((o) => (
            <button key={o.id} onClick={() => setDetailOrder(o)} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-md transition-all text-left w-full">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{o.order_number}</p>
                  <p className="text-xs text-muted-foreground">{o.client_name || "Sin cliente"} · {o.items?.length || 0} items · {o.priority}</p>
                </div>
              </div>
              <span className={cn("text-[11px] font-semibold px-3 py-1 rounded-full border", statusColor[o.status])}>{o.status}</span>
            </button>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Nueva Orden de Picking</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Cliente</Label><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} /></div>
              <div>
                <Label>Prioridad</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Baja", "Media", "Alta", "Urgente"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Seleccionar Productos</Label>
              <div className="border border-border rounded-lg divide-y divide-border max-h-60 overflow-y-auto">
                {products.map((p) => {
                  const sel = form.selectedProducts[p.id]?.selected;
                  return (
                    <div key={p.id} className={cn("flex items-center gap-3 px-3 py-2.5 transition-colors", sel && "bg-accent/5")}>
                      <Checkbox checked={!!sel} onCheckedChange={() => toggleProduct(p.id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">{p.sku} · {p.location} · {p.quantity} disp.</p>
                      </div>
                      {sel && <Input type="number" min={1} max={p.quantity} value={form.selectedProducts[p.id]?.qty || 1} onChange={(e) => setQty(p.id, e.target.value)} className="w-16 h-8 text-xs" />}
                    </div>
                  );
                })}
                {products.length === 0 && <p className="p-4 text-sm text-muted-foreground text-center">No hay productos en inventario</p>}
              </div>
            </div>
            <div><Label>Notas</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <Button onClick={handleCreate} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creando..." : "Crear Orden"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}