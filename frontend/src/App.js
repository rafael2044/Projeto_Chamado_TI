import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChamadoForm from "./pages/ChamadoForm";
import Chamados from "./pages/Chamados";
import PrivateRoute from "./PrivateRoute";
import UnidadePage from "./pages/UnidadePage";
import ModuloPage from "./pages/ModuloPage";
import UsuarioPage from "./pages/UsuarioPage";

function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route
                    path="/chamados/abrir"
                    element={
                        <PrivateRoute>
                            <ChamadoForm/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/chamados"
                    element={
                        <PrivateRoute>
                            <Chamados/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/unidades"
                    element={
                        <PrivateRoute>
                            <UnidadePage/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/modulos"
                    element={
                        <PrivateRoute>
                            <ModuloPage/>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/usuarios"
                    element={
                        <PrivateRoute>
                            <UsuarioPage/>
                        </PrivateRoute>
                    }
                />
                <Route path="/"
                       element={<div className="container mt-5"><h2 className="text-center">Bem-vindo ao Sistema de
                           Chamados T.I</h2></div>}/>
            </Routes>
        </Router>
    );
}

export default App;
