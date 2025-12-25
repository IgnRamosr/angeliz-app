// UserRoleContext.tsx
import { createContext, useContext, type ReactNode } from 'react';
import { useUserRole } from '../../hooks/useUserProfile';
import type { Rol } from '../../assets/types-interfaces/types';

const UserRoleContext = createContext<{
rol: Rol;
esAdmin: boolean;
cargando: boolean;
} | null>(null);

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
const value = useUserRole(); // tu hook original aquí
return (
    <UserRoleContext.Provider value={value}>
    {children}
    </UserRoleContext.Provider>
);
};

export const useUserRoleContext = () => {
const context = useContext(UserRoleContext);
if (!context) throw new Error('useUserRoleContext debe usarse dentro de UserRoleProvider');
return context;
};