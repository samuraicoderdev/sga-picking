import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Package, ClipboardList, AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import StatCard from "../components/StatCard";
import MonthlyOrdersChart from "../components/MonthlyOrdersChart";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const priorityColor = {
  Urgente: "bg-red-100 text-red-700",
  Alta: "bg-orange-100 text-orange-700",
  Media: "bg-blue-100 text-blue-700",
  Baja: "bg-slate-100 text-slate-600",
};

export default function Dashboard() {
  const { data: products = [], isLoading: loadingP } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list(),
  });
  const { data: orders = [], isLoading: loadingO } = useQuery({
    queryKey: ["pick-orders"],
    queryFn: () => base44.entities.PickOrder.list("-created_date"),
  });

  if (loadingP || loadingO) {
    return <div className="flex items-center justify-center h-full"><div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;
  }

  const totalStock = products.reduce((s, p) => s + (p.quantity || 0), 0);
  const lowStock = products.filter((p) => p.quantity <= (p.min_stock || 10));
  const pendingOrders = orders.filter((o) => o.status === "Pendiente");
  const inProgress = orders.filter((o) => o.status === "En Proceso");
  const completed = orders.filter((o) => o.status === "Completada");
  const recentOrders = orders.slice(0, 6);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Vista general del almacén</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Productos" value={products.length} sub={`${totalStock} unidades totales`} />
        <StatCard icon={AlertTriangle} label="Stock Bajo" value={lowStock.length} sub="Requieren atención" accent />
        <StatCard icon={Clock} label="Órdenes Pendientes" value={pendingOrders.length + inProgress.length} sub={`${inProgress.length} en proceso`} />
        <StatCard icon={CheckCircle2} label="Completadas" value={completed.length} sub="Órdenes de picking" />
      </div>

      {/* Reports */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-sm mb-1">Órdenes Completadas por Mes</h2>
          <p className="text-xs text-muted-foreground mb-4">Historial de picking completado</p>
          <MonthlyOrdersChart orders={orders} />
        </div>
        <div className="bg-card rounded-xl border border-border p-5 flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-sm mb-1">Valor Total del Inventario</h2>
            <p className="text-xs text-muted-foreground">Precio unitario × stock actual</p>
          </div>
          <div>
            <p className="text-4xl font-bold mt-4">
              ${products.reduce((sum, p) => sum + ((p.unit_price || 0) * (p.quantity || 0)), 0).toLocaleString("es", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{products.length} productos · {products.reduce((s, p) => s + (p.quantity || 0), 0)} unidades</p>
            <div className="mt-4 space-y-2">
              {["Electrónica", "Herramientas", "Ropa", "Químicos"].map((cat) => {
                const val = products.filter(p => p.category === cat).reduce((s, p) => s + ((p.unit_price || 0) * (p.quantity || 0)), 0);
                const total = products.reduce((s, p) => s + ((p.unit_price || 0) * (p.quantity || 0)), 0);
                const pct = total ? Math.round((val / total) * 100) : 0;
                return val > 0 ? (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{cat}</span><span className="font-medium">{pct}%</span></div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} /></div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Órdenes Recientes</h2>
            <Link to="/picking" className="text-xs text-accent font-medium hover:underline">Ver todas →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No hay órdenes aún</p>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{o.order_number}</p>
                    <p className="text-xs text-muted-foreground">{o.client_name || "Sin cliente"} · {o.items?.length || 0} items</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityColor[o.priority] || priorityColor.Media}`}>{o.priority}</span>
                    <Badge variant={o.status === "Completada" ? "default" : o.status === "En Proceso" ? "secondary" : "outline"} className="text-[10px]">
                      {o.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Alertas de Stock</h2>
            <Link to="/inventario" className="text-xs text-accent font-medium hover:underline">Ver todo →</Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Todo en orden</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {lowStock.slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sku} · {p.location}</p>
                  </div>
                  <span className="text-xs font-bold text-destructive">{p.quantity} uds</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}