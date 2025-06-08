import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Login } from '../../paginas/Login';
import { Registro } from '../../paginas/Registro';
import { MenuPrincipal } from '../../paginas/MenuPrincipal';

export const Enrutador = () => {
return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>}></Route>
            <Route path='/registro' element={<Registro/>}></Route>
            <Route path='/MenuPrincipal' element={<MenuPrincipal/>}></Route>
        </Routes>
    </BrowserRouter>
)
}
