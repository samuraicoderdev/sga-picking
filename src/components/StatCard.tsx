import { cn } from "@/lib/utils";

export default function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
        accent ? "bg-accent/10 text-accent" : "bg-primary/5 text-primary"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}