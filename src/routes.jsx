// routes.js
import {
  HomeIcon,
  UserCircleIcon,
  MapIcon,
  ClockIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  ServerStackIcon,
  ArrowLeftOnRectangleIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";

import { Home, Profile, Ubicacion, Configuracion, Historial, Guardados,Video, ResultadosBusqueda } from "@/pages/dashboard";
import { SignIn, SignUp, RecoverPassword, ResetPassword } from "@/pages/auth";

const iconProps = { className: "w-5 h-5 text-inherit" };

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...iconProps} />,
        name: "Dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <MapIcon {...iconProps} />,
        name: "Ubicacion",
        path: "/ubicacion",
        element: <Ubicacion />,
        isPrivate: true,
      },
      {
        icon: <ClockIcon {...iconProps} />,
        name: "Historial",
        path: "/historial",
        element: <Historial />,
        isPrivate: true,
      },
      {
        icon: <BookmarkIcon {...iconProps} />,
        name: "Guardados",
        path: "/guardados",
        element: <Guardados />,
        isPrivate: true,
      },
      {
        icon: <UserCircleIcon {...iconProps} />,
        name: "Perfil",
        path: "/profile",
        element: <Profile />,
        isPrivate: true,
      },
       {
        path: "/video/:videoId", // La ruta dinámica con el ID del video
        element: <Video />,
      },
      {
        path: "/search", // La ruta para los resultados
        element: <ResultadosBusqueda />,
      },
    ],
  },
  
];

export default routes;

