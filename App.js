import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import AdminScreen from './AdminScreen'; // Ejemplo de pantalla de admin
import ScannerScreen from './ScannerScreen'; // Ejemplo de pantalla de scanner

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/scanner" element={<ScannerScreen />} />
        {/* Agrega más rutas según sea necesario */}
      </Routes>
    </Router>
  );
}

export default App;
