import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Fotografo from './pages/PhotographerForm';
import InfoContrato from './pages/InfoContrato';
import Dashboard from './pages/dashboard';
import ClientForm from './pages/ClientForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/fotografo" element={<Fotografo />} />
        <Route path="/infoContrato" element={<InfoContrato />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/clientForm/:userName" element={<ClientForm />} />
      </Routes>
    </Router>
  );
}

export default App;