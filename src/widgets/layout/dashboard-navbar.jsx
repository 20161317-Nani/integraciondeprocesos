import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  Bars3Icon,
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

// Idiomas disponibles
const languages = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
  { code: "pt", name: "Português" },
  { code: "zh", name: "中文 (Chino)" },
  { code: "ja", name: "日本語 (Japonés)" },
  { code: "fr", name: "Français" },
];

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav, darkMode } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  const [currentLangCode, setCurrentLangCode] = useState("es");

  const executeSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/dashboard/search?q=${searchTerm}`);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") executeSearch();
  };

  const handleLanguageChange = (code) => {
    setCurrentLangCode(code);
    console.log("Idioma seleccionado:", code);
    // Aquí puedes agregar tu lógica de traducción, ej. i18n.changeLanguage(code)
  };

  const currentLang = languages.find((lang) => lang.code === currentLangCode);
  const currentLangDisplay = currentLang ? currentLang.code.toUpperCase() : "ES";

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
          {/* 🔍 Barra de búsqueda */}
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

          {/* Botón de idiomas */}
          <Menu>
            <MenuHandler>
              <div className="relative cursor-pointer">
                <IconButton
                  variant="text"
                  color="blue-gray"
                  className="transition-colors"
                >
                  <LanguageIcon className={`h-6 w-6 ${darkMode ? "text-white" : "text-blue-gray-500"}`} />
                </IconButton>
                <span
                  className={`absolute -bottom-1 -right-1 text-[10px] font-bold rounded-full px-1 
                             ${darkMode ? "bg-white text-gray-900" : "bg-blue-gray-900 text-white"}`}
                >
                  {currentLangDisplay}
                </span>
              </div>
            </MenuHandler>
            <MenuList className={darkMode ? "bg-gray-800 border-gray-700" : ""}>
              <Typography variant="small" className="p-2 font-bold opacity-70">
                Seleccionar Idioma
              </Typography>
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  className={`${darkMode ? "hover:bg-gray-700" : ""} ${
                    currentLangCode === lang.code ? "font-bold bg-blue-50 text-blue-500" : ""
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Modo oscuro */}
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
