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
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      {/* Menú lateral */}
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />

      <div className="p-4 xl:ml-80">
        {/* Barra superior */}
        <DashboardNavbar />

        {/* Configurador flotante */}
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        {/* Aquí se renderizan las páginas según la ruta */}
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
        <div className="text-blue-gray-600 mt-8">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
