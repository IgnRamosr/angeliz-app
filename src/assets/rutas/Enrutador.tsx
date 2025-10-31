import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Login } from '../../paginas/Login';
import { Registro } from '../../paginas/Registro';
import { MenuPrincipal } from '../../paginas/MenuPrincipal';
import { Productos } from '../../paginas/Productos';
import { ProductoDetalle } from '../../paginas/ProductoDetalle';
import { CarritoDeCompras } from '../../paginas/CarritoDeCompras';
import { MisPedidos } from '../../paginas/MisPedidos';
import NoEncontrado from '../../paginas/NoEncontrado';
import { AgradecimientoPostCompra } from '../../paginas/SolicitudExitosa';



export const Enrutador = () => {
return (
    <BrowserRouter>
        <Routes>
            <Route path='/inicio' element={<Login/>}></Route>
            <Route path='/registro' element={<Registro/>}></Route>
            <Route path='/' element={<MenuPrincipal/>}>
                <Route path='/' element={<Productos/>}></Route>
                <Route path='producto/:id' element={<ProductoDetalle/>}></Route>
                <Route path='/carrito' element={<CarritoDeCompras/>}></Route>
                <Route path='/pedidos' element={<MisPedidos/>}></Route>
                <Route path='/solicitudExitosa' element={<AgradecimientoPostCompra/>}></Route>
                <Route path='*' element={<NoEncontrado/>}></Route>
            </Route>
            <Route path='*' element={<NoEncontrado/>}></Route>
        </Routes>
    </BrowserRouter>
)
}
