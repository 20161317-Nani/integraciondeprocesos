import React, { useState } from "react";
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
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon, // 👈 Importamos el nuevo ícono de idioma/traductor
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
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  const executeSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/dashboard/search?q=${searchTerm}`);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") executeSearch();
  };

  // 👈 Función de ejemplo para el botón de traductor
  const handleTranslateClick = () => {
    console.log("Botón de traductor presionado. Implementa la lógica de traducción aquí.");
    // Aquí puedes añadir la lógica para abrir un modal de traducción,
    // o llamar a un servicio de traducción, etc.
  };

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
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography variant="small" color="blue-gray" className="font-normal">
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color={darkMode ? "white" : "blue-gray"}>
            {page}
          </Typography>
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

          {/* Menú lateral */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon className={`h-6 w-6 ${darkMode ? "text-white" : "text-blue-gray-500"}`} />
          </IconButton>

          {/* Botón Traductor (Nuevo) */}
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={handleTranslateClick} // 👈 Nuevo manejador de clics
            className="transition-colors"
          >
            <LanguageIcon className={`h-6 w-6 ${darkMode ? "text-white" : "text-blue-gray-500"}`} />
          </IconButton>

          {/* Botón modo oscuro (Mantenido) */}
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setDarkMode(dispatch, !darkMode)}
            className="transition-colors"
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            ) : (
              <MoonIcon className="h-6 w-6 text-gray-700" />
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
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

export default DashboardNavbar;