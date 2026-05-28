import { cn } from "@/lib/utils";

// Grid: 9 cols × 7 rows representing the warehouse floor
// Each cell can be: aisle, shelf, zone, entry, dock
const FLOOR = [
  // row 0: top wall / label row
  ["wall","wall","wall","wall","wall","wall","wall","wall","wall"],
  // row 1: Zone A row
  ["wall","zone-A1","aisle","zone-A2","aisle","zone-A3","aisle","dock","wall"],
  // row 2: cross aisle
  ["wall","aisle","aisle","aisle","aisle","aisle","aisle","aisle","wall"],
  // row 3: Zone B row
  ["wall","zone-B1","aisle","zone-B2","aisle","zone-B3","aisle","dock","wall"],
  // row 4: cross aisle
  ["wall","aisle","aisle","aisle","aisle","aisle","aisle","aisle","wall"],
  // row 5: Zone C / D row
  ["wall","zone-C1","aisle","zone-C2","aisle","zone-D1","aisle","dock","wall"],
  // row 6: bottom - entry/exit
  ["wall","entry","aisle","zone-E1","aisle","zone-F1","aisle","exit","wall"],
];

const ZONE_META = {
  "A1": { label: "A1", sublabel: "Electrónica", bg: "bg-blue-100 border-blue-300", text: "text-blue-800" },
  "A2": { label: "A2", sublabel: "Electrónica", bg: "bg-blue-100 border-blue-300", text: "text-blue-800" },
  "A3": { label: "A3", sublabel: "Electrónica", bg: "bg-blue-100 border-blue-300", text: "text-blue-800" },
  "B1": { label: "B1", sublabel: "Herramientas", bg: "bg-orange-100 border-orange-300", text: "text-orange-800" },
  "B2": { label: "B2", sublabel: "Herramientas", bg: "bg-orange-100 border-orange-300", text: "text-orange-800" },
  "B3": { label: "B3", sublabel: "Herramientas", bg: "bg-orange-100 border-orange-300", text: "text-orange-800" },
  "C1": { label: "C1", sublabel: "Ropa", bg: "bg-purple-100 border-purple-300", text: "text-purple-800" },
  "C2": { label: "C2", sublabel: "Ropa", bg: "bg-purple-100 border-purple-300", text: "text-purple-800" },
  "C3": { label: "C3", sublabel: "Ropa", bg: "bg-purple-100 border-purple-300", text: "text-purple-800" },
  "D1": { label: "D1", sublabel: "Químicos", bg: "bg-red-100 border-red-300", text: "text-red-800" },
  "D2": { label: "D2", sublabel: "Químicos", bg: "bg-red-100 border-red-300", text: "text-red-800" },
  "D3": { label: "D3", sublabel: "Químicos", bg: "bg-red-100 border-red-300", text: "text-red-800" },
  "E1": { label: "E1", sublabel: "Recepción", bg: "bg-green-100 border-green-300", text: "text-green-800" },
  "F1": { label: "F1", sublabel: "Despacho", bg: "bg-amber-100 border-amber-300", text: "text-amber-800" },
};

const ROUTE_COLORS_BG = [
  "bg-blue-500","bg-emerald-500","bg-purple-500","bg-orange-500","bg-pink-500","bg-cyan-500",
];

export default function WarehouseFloorPlan({ routes, activeRouteId, onSelectRoute }) {
  // Build a map: zoneId -> [routeIndex, ...]
  const zoneRouteMap = {};
  routes.forEach((r, idx) => {
    (r.zones || []).forEach((z) => {
      if (!zoneRouteMap[z]) zoneRouteMap[z] = [];
      zoneRouteMap[z].push({ idx, id: r.id, number: r.route_number });
    });
  });

  const activeRoute = activeRouteId ? routes.find((r) => r.id === activeRouteId) : null;
  const activeZones = new Set(activeRoute?.zones || []);

  return (
    <div className="space-y-3">
      {/* Legend */}
      {routes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {routes.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => onSelectRoute(activeRouteId === r.id ? null : r.id)}
              className={cn("flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border transition-all font-medium", activeRouteId === r.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-muted/40")}
            >
              <span className={cn("w-2.5 h-2.5 rounded-full", ROUTE_COLORS_BG[idx % ROUTE_COLORS_BG.length])} />
              {r.route_number}
            </button>
          ))}
        </div>
      )}

      {/* Floor grid */}
      <div className="relative overflow-auto">
        <div
          className="grid gap-1 min-w-[380px]"
          style={{ gridTemplateColumns: "repeat(9, minmax(0,1fr))" }}
        >
          {FLOOR.flat().map((cell, i) => {
            const row = Math.floor(i / 9);
            const col = i % 9;

            if (cell === "wall") {
              return <div key={i} className="h-12 rounded bg-slate-200/60" />;
            }
            if (cell === "aisle") {
              return (
                <div key={i} className="h-12 rounded bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center">
                  <div className="w-0.5 h-full bg-slate-200/80" />
                </div>
              );
            }
            if (cell === "entry") {
              return (
                <div key={i} className="h-12 rounded bg-green-200 border border-green-400 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-bold text-green-800">ENTRADA</span>
                </div>
              );
            }
            if (cell === "exit" || cell === "dock") {
              return (
                <div key={i} className="h-12 rounded bg-slate-300 border border-slate-400 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-bold text-slate-700">{cell === "exit" ? "SALIDA" : "MUELLE"}</span>
                </div>
              );
            }

            // Zone cell
            const zoneId = cell.replace("zone-", "");
            const meta = ZONE_META[zoneId];
            const routesHere = zoneRouteMap[zoneId] || [];
            const isActiveZone = activeZones.has(zoneId);
            const stepNum = activeRoute ? (activeRoute.zones || []).indexOf(zoneId) + 1 : 0;

            return (
              <div
                key={i}
                className={cn(
                  "h-12 rounded border-2 flex flex-col items-center justify-center relative transition-all cursor-default",
                  meta?.bg || "bg-slate-100 border-slate-300",
                  isActiveZone && "ring-2 ring-primary ring-offset-1 scale-105 z-10 shadow-md"
                )}
              >
                <span className={cn("text-[11px] font-bold leading-none", meta?.text)}>{meta?.label}</span>
                <span className={cn("text-[8px] font-medium leading-none mt-0.5 opacity-70", meta?.text)}>{meta?.sublabel}</span>
                {/* Route dots */}
                {routesHere.length > 0 && (
                  <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5">
                    {routesHere.slice(0, 4).map((r, di) => (
                      <span key={di} className={cn("w-1.5 h-1.5 rounded-full", ROUTE_COLORS_BG[r.idx % ROUTE_COLORS_BG.length])} />
                    ))}
                  </div>
                )}
                {isActiveZone && stepNum > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center z-20">
                    {stepNum}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floor legend */}
      <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-50 border border-dashed border-slate-300 inline-block" /> Pasillo</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 border border-green-400 inline-block" /> Entrada</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-300 border border-slate-400 inline-block" /> Muelle</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-300 inline-block" /> Zona A · Electrónica</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-100 border border-orange-300 inline-block" /> Zona B · Herramientas</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-100 border border-purple-300 inline-block" /> Zona C · Ropa</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 border border-red-300 inline-block" /> Zona D · Químicos</span>
      </div>
    </div>
  );
}