// routes/RequireAdmin.tsx
import { Navigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserProfile";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
const { esAdmin, cargando } = useUserRole();
if (cargando) return <div className="p-6 text-gray-600">Cargando…</div>;
if (!esAdmin) return <Navigate to="/" replace />;
return <>{children}</>;
}
