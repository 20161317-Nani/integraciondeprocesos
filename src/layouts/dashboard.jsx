import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
//  Importamos setOpenSidenav y openSidenav
import { useMaterialTailwindController, setOpenConfigurator, setOpenSidenav } from "@/context"; 

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  //  Usamos openSidenav del contexto, no un estado local
  const { sidenavType, darkMode, openSidenav } = controller; 

  // Eliminamos: const [sidenavOpen, setSidenavOpen] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Función para manejar el clic del botón
  const handleToggleSidenav = () => {
    //  Llamamos a la función del Contexto para cambiar el estado global
    setOpenSidenav(dispatch, !openSidenav); 
  };


  return (
    // Usamos openSidenav para controlar el margen del contenido
    <div className="min-h-screen flex transition-colors bg-blue-gray-50/50 dark:bg-gray-900 dark:text-gray-100">

      {/* Menú lateral (YA NO NECESITA EL PROP 'open', lo lee del contexto) */}
      <Sidenav
        routes={routes}
        brandImg={sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"}
        darkMode={darkMode}
        onLogout={() => {
          localStorage.removeItem("token");
          // Si usas navigate, asegúrate de que esté disponible
          // navigate("/auth/sign-in"); 
          window.location.href = "/auth/sign-in"; // Uso alternativo si 'navigate' no está definido
        }}
      />
      
      {/* 🛑 Contenedor del Widget de Google Translate */}
      {/* Se mantiene fuera del flujo principal, ya que será renderizado por Google */}
      {/* Puedes mover este div a DashboardNavbar.jsx si quieres que esté allí directamente */}
      <div id="google_translate_element"></div>


      {/* Botón desplegable */}
      <IconButton
        size="lg"
        color={darkMode ? "white" : "blue-gray"}
        className="fixed top-4 left-4 z-50"
        //  Usamos la función handleToggleSidenav
        onClick={handleToggleSidenav} 
      >
        {/* Usamos openSidenav para cambiar el ícono */}
        {openSidenav ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </IconButton>

      {/* Contenido principal */}
      <div className={`flex-1 flex flex-col transition-all ${openSidenav ? "xl:ml-80" : "xl:ml-0"}`}>
        {/* Navbar */}
        <DashboardNavbar />

        {/* Configurador flotante */}
        <Configurator />

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
      </div>
    </div>
  );
}

export default Dashboard;