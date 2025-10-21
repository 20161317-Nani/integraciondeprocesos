import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
} from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, darkMode, openSidenav } = controller;

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex transition-colors bg-blue-gray-50/50 dark:bg-gray-900 dark:text-gray-100">
      
      {/* Menú lateral */}
      <Sidenav
        routes={routes}
        brandImg={sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"}
        darkMode={darkMode}
        onLogout={() => {
          localStorage.removeItem("token");
          window.location.href = "/auth/sign-in";
        }}
      />

      {/* Widget de Google Translate */}
      <div id="google_translate_element"></div>

      {/* Contenido principal */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${openSidenav ? "xl:ml-80" : "xl:ml-0"}`}>
        
        {/* Navbar superior */}
        <DashboardNavbar />

        {/* Configurador flotante */}
        <Configurator />

        {/* Botón de Configuración flotante */}
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10 dark:bg-gray-800 dark:text-gray-100"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        {/* Rutas dinámicas */}
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))
          )}
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
