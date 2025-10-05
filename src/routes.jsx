// routes.js
import {
  HomeIcon,
  UserCircleIcon,
  MapIcon,
  ClockIcon,
  BookmarkIcon,
  Cog6ToothIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";

import { Home, Profile, Ubicacion, Configuracion, Historial, Guardados } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { RecoverPassword } from "@/pages/auth/contraseña";

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
      },
      {
        icon: <ClockIcon {...iconProps} />,
        name: "Historial",
        path: "/historial",
        element: <Historial />,
      },
      {
        icon: <BookmarkIcon {...iconProps} />,
        name: "Guardados",
        path: "/guardados",
        element: <Guardados />,
      },
      {
        icon: <Cog6ToothIcon {...iconProps} />,
        name: "Configuracion",
        path: "/configuracion",
        element: <Configuracion />,
      },
      {
        icon: <UserCircleIcon {...iconProps} />,
        name: "Perfil",
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    title: "Registro",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...iconProps} />,
        name: "Sign In",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...iconProps} />,
        name: "Sign Up",
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        icon: <RectangleStackIcon {...iconProps} />,
        name: "Recuperar Contraseña",
        path: "/contraseña",
        element: <RecoverPassword />,
      },
    ],
  },
];

export default routes;

