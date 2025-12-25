import { ToastContainer } from 'react-toastify';
import './App.css'
import { Enrutador } from './assets/rutas/Enrutador'
import 'react-toastify/dist/ReactToastify.css';
import { ProveedorFuncionesCarrito } from './componentes/Navegacion/useCart';
import { useEffect } from 'react';
import { useAutenticacion } from './hooks/useAuth';
import { Analytics } from "@vercel/analytics/react"
import { UserRoleProvider } from './componentes/ModuloAdministracion/useUserRoleContext';


function App() {

    const {asignarSesionAnonima} = useAutenticacion();

    useEffect(() => {
    (async () => {await asignarSesionAnonima() ;})();
    }, [])

    return (
    <>
    {/* <Analytics/> */}
        <ProveedorFuncionesCarrito >
            <UserRoleProvider>
                <Enrutador/>
                <ToastContainer position="top-center" autoClose={3000} limit={1}/>
            </UserRoleProvider>
        </ProveedorFuncionesCarrito >
    </>
    )
}

export default App
