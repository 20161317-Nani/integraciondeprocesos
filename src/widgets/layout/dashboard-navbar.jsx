import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
  setDarkMode,
} from "@/context";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav, darkMode } = controller;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  // Función para convertir el nombre del path en texto legible
  const getReadableName = (path) => {
    const names = {
      home: "Inicio",
      location: "Ubicación",
      historial: "Historial",
      profile: "Perfil",
      settings: "Configuración",
      search: "Búsqueda",
      // Agrega aquí más rutas según tu proyecto
    };
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Obtenemos layout y página actual
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  // Traducción automática de nombres
  const translatedLayout = getReadableName(layout);
  const translatedPage = getReadableName(page);

  const executeSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/dashboard/search?q=${searchTerm}`);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") executeSearch();
  };

  const handleLanguageClick = () => {
    const select = document.querySelector(".goog-te-combo");
    if (select) select.dispatchEvent(new Event("change"));
  };

  // cambia el fondo global del body según modo oscuro
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  return (
    <Navbar
      color={fixedNavbar ? (darkMode ? "gray-900" : "white") : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        
        {/* Breadcrumb y título */}
        <div className="capitalize flex items-center gap-3">
          {/* 🔹 Botón menú lateral */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="block"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            {openSidenav ? (
              <XMarkIcon
                className={`h-6 w-6 ${
                  darkMode ? "text-white" : "text-blue-gray-700"
                }`}
              />
            ) : (
              <Bars3Icon
                className={`h-6 w-6 ${
                  darkMode ? "text-white" : "text-blue-gray-700"
                }`}
              />
            )}
          </IconButton>

          <div>
            {/* Breadcrumb dinámico */}
            <Breadcrumbs
              className={`bg-transparent p-0 transition-all ${
                fixedNavbar ? "mt-1" : ""
              }`}
            >
              <Link to={`/${layout}`}>
                <Typography
                  variant="small"
                  className={`font-normal transition-all hover:text-blue-500 ${
                    darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-blue-gray-500 hover:text-blue-700"
                  }`}
                >
                  {translatedLayout || "Dashboard"}
                </Typography>
              </Link>
              <Typography
                variant="small"
                className={`font-normal ${
                  darkMode ? "text-gray-200" : "text-blue-gray-700"
                }`}
              >
                {translatedPage || "Inicio"}
              </Typography>
            </Breadcrumbs>

            {/* Título dinámico */}
            <Typography
              variant="h6"
              className={`${darkMode ? "text-white" : "text-blue-gray-900"}`}
            >
              {translatedPage || "Inicio"}
            </Typography>
          </div>
        </div>

        {/* Barra de búsqueda y botones */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Barra de búsqueda */}
          <div className="relative mr-auto md:mr-4 md:w-64">
            <Input
              label="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pr-10"
            />
            <IconButton
              size="sm"
              className="!absolute right-1 top-1/2 -translate-y-1/2 rounded"
              onClick={executeSearch}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </IconButton>
          </div>

          {/* Modo oscuro */}
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setDarkMode(dispatch, !darkMode)}
            className="transition-colors h-8 w-8"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700" />
            )}
          </IconButton>

          {/* Login si no hay token */}
          {!token && (
            <Link to="/auth/sign-in">
              <Button
                variant="text"
                color="blue-gray"
                className="hidden items-center gap-1 px-4 xl:flex normal-case"
              >
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                Iniciar Sesión
              </Button>
            </Link>
          )}

          {/* Configuración */}
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon
              className={`h-5 w-5 ${
                darkMode ? "text-white" : "text-blue-gray-500"
              }`}
            />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

export default DashboardNavbar;
