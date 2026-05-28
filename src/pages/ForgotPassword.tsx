import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await base44.auth.resetPasswordRequest(email); } catch {}
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-xl font-bold text-center">Recuperar Contraseña</h1>
        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">Si el email existe, recibirás un enlace para restablecer tu contraseña.</p>
            <Link to="/login"><Button variant="outline" className="w-full">Volver al inicio</Button></Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Enviando..." : "Enviar enlace"}</Button>
            <p className="text-xs text-center"><Link to="/login" className="text-muted-foreground hover:text-foreground">Volver al inicio</Link></p>
          </form>
        )}
      </div>
    </div>
  );
}
