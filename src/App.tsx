import { ToastContainer } from 'react-toastify';
import './App.css'
import { Enrutador } from './assets/rutas/Enrutador'
import 'react-toastify/dist/ReactToastify.css';

function App() {

    return (
    <>
        <Enrutador/>
        <ToastContainer position="top-center" autoClose={3000} limit={1}/>
    </>
    )
}

export default App
