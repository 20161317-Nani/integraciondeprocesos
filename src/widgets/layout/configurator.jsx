import {
  Card,
  Typography,
  Switch,
  Button,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setFixedNavbar, setDarkMode } from "@/context";

export function Configurator() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, darkMode } = controller;

  return (
    <aside className="w-72 p-4 bg-white rounded-xl shadow-lg">
      {/* Título */}
      <div className="mb-4 flex items-center justify-between">
        <Typography variant="h6" color="blue-gray">
          Configuración
        </Typography>
      </div>

      {/* Colores del menú principal */}
      <div className="mb-4">
        <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
          Colores de las opciones del menú principal
        </Typography>
        <div className="flex gap-2">
          {["bg-white", "bg-black", "bg-green-500", "bg-orange-500", "bg-red-500", "bg-pink-500"].map((color, idx) => (
            <button
              key={idx}
              className={`h-6 w-6 rounded-full border border-blue-gray-100 ${color}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Colores de la barra lateral */}
      <div className="mb-4">
        <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
          Colores de la barra lateral
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">Oscuro</Button>
          <Button variant="outlined" size="sm">Transparente</Button>
          <Button variant="outlined" size="sm">Blanco</Button>
        </div>
      </div>

      {/* Navbar fija y modo oscuro */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Typography variant="small" color="blue-gray" className="font-semibold">
            Barra de navegación fija
          </Typography>
          <Switch
            checked={fixedNavbar}
            onChange={() => setFixedNavbar(dispatch, !fixedNavbar)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Typography variant="small" color="blue-gray" className="font-semibold">
            Modo oscuro
          </Typography>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(dispatch, !darkMode)}
          />
        </div>
      </div>
    </aside>
  );
}

export default Configurator;
