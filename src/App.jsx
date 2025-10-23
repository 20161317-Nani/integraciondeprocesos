// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { LanguageProvider } from "@/context/LanguageContext"; // 🔹 importa el provider
import 'leaflet/dist/leaflet.css'; 

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
