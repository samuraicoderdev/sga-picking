import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return; }
    setLoading(true); setError("");
    try {
      await base44.auth.register({ email, password });
      setStep(2);
    } catch (err) { setError(err.message || "Error al registrarse"); }
    finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await base44.auth.verifyOtp({ email, otpCode: otp });
      base44.auth.setToken(res.access_token);
      window.location.href = "/";
    } catch (err) { setError(err.message || "Código inválido"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">Crear Cuenta</h1>
        </div>
        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div><Label>Contraseña</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            <div><Label>Confirmar Contraseña</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Registrando..." : "Registrarse"}</Button>
            <Button variant="outline" className="w-full" type="button" onClick={() => base44.auth.loginWithProvider("google", "/")}>Continuar con Google</Button>
            <p className="text-xs text-center text-muted-foreground">¿Ya tienes cuenta? <Link to="/login" className="hover:text-foreground">Inicia sesión</Link></p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">Ingresa el código enviado a {email}</p>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>{[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Verificando..." : "Verificar"}</Button>
            <button type="button" className="text-xs text-muted-foreground hover:text-foreground w-full text-center" onClick={() => base44.auth.resendOtp(email)}>Reenviar código</button>
          </form>
        )}
      </div>
    </div>
  );
}
