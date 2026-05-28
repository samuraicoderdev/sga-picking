import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { format, parseISO, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";

export default function MonthlyOrdersChart({ orders }) {
  const data = useMemo(() => {
    const map = {};
    orders
      .filter((o) => o.status === "Completada" && o.completed_date)
      .forEach((o) => {
        const month = format(parseISO(o.completed_date), "MMM yy", { locale: es });
        map[month] = (map[month] || 0) + 1;
      });
    // last 6 months including empties
    const result = Object.entries(map).map(([name, value]) => ({ name, value }));
    return result.slice(-6);
  }, [orders]);

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">Sin datos de órdenes completadas aún</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Órdenes" />
      </BarChart>
    </ResponsiveContainer>
  );
}