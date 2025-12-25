import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Login } from '../../paginas/Login';
import { Registro } from '../../paginas/Registro';
import { MenuPrincipal } from '../../paginas/MenuPrincipal';
// import { Productos } from '../../paginas/Productos';
import { ProductoDetalle } from '../../paginas/ProductoDetalle';
import { CarritoDeCompras } from '../../paginas/CarritoDeCompras';
import { MisPedidos } from '../../paginas/MisPedidos';
import NoEncontrado from '../../paginas/NoEncontrado';
import { AgradecimientoPostCompra } from '../../paginas/SolicitudExitosa';
import ProductoDetalleNombre from '../../paginas/ProductoDetalleNombre';
import SeccionesPorSubcategoria from '../../paginas/SeccionesPorSubcategoria';
import ModuloAdministracion from '../../paginas/ModuloAdministracion';
import AdminPedidoDetalle from '../../componentes/ModuloAdministracion/AdminPedidoDetalle';
import RequiereAdmin from '../../componentes/ModuloAdministracion/RequiereAdmin';



export const Enrutador = () => {
return (
    <BrowserRouter>
        <Routes>
        {/* Rutas fuera del layout */}
        <Route path="/inicio" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Layout principal con Outlet */}
        <Route path="/" element={<MenuPrincipal />}>
            <Route index element={<SeccionesPorSubcategoria />} />
            <Route path="producto/:id" element={<ProductoDetalle />} />
            <Route path="buscarProducto/:nombre" element={<ProductoDetalleNombre />} />
            <Route path="carrito" element={<CarritoDeCompras />} />
            <Route path="pedidos" element={<MisPedidos />} />
            
            <Route path="solicitudExitosa" element={<AgradecimientoPostCompra />} />


            {/* Módulo admin y detalle */}
            <Route path="admin" element={<ModuloAdministracion />} />
            <Route path="admin/pedido/:id" element={<AdminPedidoDetalle />} />

            {/* ÚNICO comodín dentro del layout */}
            <Route path="*" element={<NoEncontrado />} />
        </Route>

        {/* Resguardo extra (opcional) */}
        <Route path="*" element={<NoEncontrado />} />
        </Routes>
    </BrowserRouter>
)
}
