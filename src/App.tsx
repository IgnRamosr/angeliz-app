import { ToastContainer } from 'react-toastify';
import './App.css'
import { Enrutador } from './assets/rutas/Enrutador'
import 'react-toastify/dist/ReactToastify.css';
import { ProveedorFuncionesCarrito } from './componentes/useCart';
import { useEffect } from 'react';
import { useAutenticacion } from './hooks/useAuth';


function App() {

    const {asignarSesionAnonima} = useAutenticacion();

    useEffect(() => {
    (async () => {await asignarSesionAnonima() ;})();
    }, [])

    return (
    <>
        <ProveedorFuncionesCarrito >
            <Enrutador/>
            <ToastContainer position="top-center" autoClose={3000} limit={1}/>
        </ProveedorFuncionesCarrito >
    </>
    )
}

export default App
