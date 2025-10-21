import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav, darkMode } = controller;

  // Tipos base de sidenav (tema claro)
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900 text-white",
    white: "bg-white text-blue-gray-900 shadow-sm",
    transparent: "bg-transparent text-blue-gray-900",
  };

  // Aplica el modo oscuro (sobrescribe colores)
  const darkModeClasses = darkMode
    ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700"
    : "border border-blue-gray-100";

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/sign-in";
  };

  // Token del usuario logeado
  const token = localStorage.getItem("token");

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} fixed inset-0 z-50 my-4 ml-4 
        h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 
        ${darkModeClasses} 
        ${openSidenav ? "translate-x-0 xl:translate-x-0" : "-translate-x-80 xl:-translate-x-80"}
      `}
    >
      {/* 🔹 Encabezado del menú */}
      <div className="relative">
        <Link to="/" className="py-6 px-8 text-center block">
          <Typography
            variant="h6"
            color={darkMode ? "white" : sidenavType === "dark" ? "white" : "blue-gray"}
          >
            {brandName}
          </Typography>
        </Link>

        {/*  Botón para cerrar sidenav en móviles */}
        <IconButton
          variant="text"
          color={darkMode ? "white" : "blue-gray"}
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon
            strokeWidth={2.5}
            className={`h-5 w-5 ${darkMode ? "text-white" : "text-blue-gray-800"}`}
          />
        </IconButton>
      </div>

      {/* 🔹 Lista de rutas */}
      <div className="m-4">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={darkMode ? "white" : sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}

            {pages
              .filter((page) => page.name && page.icon)
              .map(({ icon, name, path, isPrivate }) =>
                (!isPrivate || token) && (
                  <li key={path}>
                    <NavLink to={`/${layout}${path}`}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color={
                            isActive
                              ? sidenavColor
                              : darkMode
                              ? "white"
                              : sidenavType === "dark"
                              ? "white"
                              : "blue-gray"
                          }
                          className="flex items-center gap-4 px-4 capitalize"
                          fullWidth
                        >
                          {icon}
                          <Typography color="inherit" className="font-medium capitalize">
                            {name}
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                )
              )}
          </ul>
        ))}
      </div>

      {/* 🔹 Botón cerrar sesión */}
      {token && (
        <div className="absolute bottom-4 w-full px-4">
          <Button
            variant="text"
            color="red"
            className="flex items-center gap-4 px-4 capitalize"
            fullWidth
            onClick={handleLogout}
          >
            <ArrowLeftOnRectangleIcon strokeWidth={2.5} className="h-5 w-5 text-inherit" />
            <Typography color="inherit" className="font-medium capitalize">
              Cerrar Sesión
            </Typography>
          </Button>
        </div>
      )}
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "4U Player",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
