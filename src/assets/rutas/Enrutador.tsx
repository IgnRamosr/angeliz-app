import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Login } from '../../paginas/Login';
import { Registro } from '../../paginas/Registro';
import { MenuPrincipal } from '../../paginas/MenuPrincipal';
import { Productos } from '../../paginas/Productos';

export const Enrutador = () => {
return (
    <BrowserRouter>
        <Routes>
            <Route path='/inicio' element={<Login/>}></Route>
            <Route path='/registro' element={<Registro/>}></Route>
            <Route path='/' element={<MenuPrincipal/>}>
                <Route path='/' element={<Productos/>}></Route>
            </Route>
        </Routes>
    </BrowserRouter>
)
}
