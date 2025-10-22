// src/widgets/layout/dashboard-navbar.jsx
import React, { useState, useEffect } from "react";
import LanguageSelector from "@/components/LanguageSelector";
import { translateText } from "../../api/translate"; // solo una import
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

  const [texts, setTexts] = useState({
    breadcrumbLayout: "Inicio",
    breadcrumbPage: "Dashboard",
    title: "Dashboard",
    searchLabel: "Buscar",
    login: "Iniciar Sesión",
    settings: "Configuración",
  });

  const [lang, setLang] = useState(localStorage.getItem("lang") || "es"); // idioma guardado
  const [translating, setTranslating] = useState(false);

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

  const executeSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/dashboard/search?q=${searchTerm}`);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") executeSearch();
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  // Traduce todos los textos y guarda el idioma
  const handleTranslate = async (newLang) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    setTranslating(true);
    try {
      const pathParts = pathname.split("/").filter((el) => el !== "");
      const layout = getReadableName(pathParts[0] || "home");
      const page = getReadableName(pathParts[1] || "Dashboard");

      const newTexts = {
        breadcrumbLayout: (await translateText(layout, "es", newLang)).translatedText,
        breadcrumbPage: (await translateText(page, "es", newLang)).translatedText,
        title: (await translateText(page, "es", newLang)).translatedText,
        searchLabel: (await translateText("Buscar", "es", newLang)).translatedText,
        login: (await translateText("Iniciar Sesión", "es", newLang)).translatedText,
        settings: (await translateText("Configuración", "es", newLang)).translatedText,
      };

      setTexts(newTexts);
    } catch (err) {
      console.error("Error traduciendo textos:", err);
    } finally {
      setTranslating(false);
    }
  };

  // Traducir automáticamente al montar el componente
  useEffect(() => {
    handleTranslate(lang);
  }, [pathname]);

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
                className={`h-6 w-6 ${darkMode ? "text-white" : "text-blue-gray-700"}`}
              />
            ) : (
              <Bars3Icon
                className={`h-6 w-6 ${darkMode ? "text-white" : "text-blue-gray-700"}`}
              />
            )}
          </IconButton>

          <div>
            <Breadcrumbs className="bg-transparent p-0 transition-all">
              <Link to={`/${pathname.split("/")[1] || ""}`}>
                <Typography
                  variant="small"
                  className={`font-normal transition-all hover:text-blue-500 ${
                    darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-blue-gray-500 hover:text-blue-700"
                  }`}
                >
                  {texts.breadcrumbLayout}
                </Typography>
              </Link>
              <Typography
                variant="small"
                className={`font-normal ${darkMode ? "text-gray-200" : "text-blue-gray-700"}`}
              >
                {texts.breadcrumbPage}
              </Typography>
            </Breadcrumbs>

            <Typography
              variant="h6"
              className={`${darkMode ? "text-white" : "text-blue-gray-900"}`}
            >
              {texts.title}
            </Typography>
          </div>
        </div>

        {/* Barra de búsqueda y botones */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative mr-auto md:mr-4 md:w-64">
            <Input
              label={texts.searchLabel}
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

          <LanguageSelector handleTranslate={handleTranslate} />

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

          {!token && (
            <Link to="/auth/sign-in">
              <Button
                variant="text"
                color="blue-gray"
                className="hidden items-center gap-1 px-4 xl:flex normal-case"
              >
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                {texts.login}
              </Button>
            </Link>
          )}

          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon
              className={`h-5 w-5 ${darkMode ? "text-white" : "text-blue-gray-500"}`}
            />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

export default DashboardNavbar;
