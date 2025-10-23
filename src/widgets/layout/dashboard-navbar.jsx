// src/widgets/layout/DashboardNavbar.jsx
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

  const getReadableName = (path) => {
    const names = {
      home: "Inicio",
      location: "Ubicación",
      historial: "Historial",
      profile: "Perfil",
      settings: "Configuración",
      search: "Búsqueda",
    };
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  const [layout, page] = pathname.split("/").filter((el) => el !== "");
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

  // Dark mode
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  // --------------------------
  // GOOGLE TRANSLATE SCRIPT (solo una vez, incluye Español)
  // --------------------------
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "es",
          includedLanguages: "es,en,fr,pt,ja,zh-CN", // Agregamos "es" para que aparezca
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
            <Breadcrumbs
              className={`bg-transparent p-0 transition-all ${
                fixedNavbar ? "mt-1" : ""
              }`}
            >
              <Link to={`/${layout}`}>
                <Typography
                  variant="small"
                  className={`font-normal hover:text-blue-500 ${
                    darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-blue-gray-500 hover:text-blue-700"
                  }`}
                >
                  {translatedLayout}
                </Typography>
              </Link>
              <Typography
                variant="small"
                className={`${darkMode ? "text-gray-200" : "text-blue-gray-700"}`}
              >
                {translatedPage}
              </Typography>
            </Breadcrumbs>
            <Typography
              variant="h6"
              className={`${darkMode ? "text-white" : "text-blue-gray-900"}`}
            >
              {translatedPage}
            </Typography>
          </div>
        </div>

        {/* Barra de búsqueda y botones */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Buscar */}
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

          {/* Google Translate */}
          <div id="google_translate_element"></div>

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

          {/* Login */}
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

          {/* Configurador */}
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
