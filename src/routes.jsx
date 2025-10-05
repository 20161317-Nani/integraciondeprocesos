import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Ubicacion,Configuracion,Historial,Guardados } from "@/pages/dashboard";
import { SignIn, SignUp  } from "@/pages/auth";
import { RecoverPassword } from "@/pages/auth/contraseña";
const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Ubicacion",
        path: "/ubicacion",
        element: <Ubicacion />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Historial",
        path: "/historial",
        element: <Historial />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Guardados",
        path: "/guardados",
        element: <Guardados />,
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Configuracion",
        path: "/configuracion",
        element: <Configuracion />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
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
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Recuperar contraseña",
        path: "/contraseña",
        element: <RecoverPassword />,
      },
    ],
  },
];

export default routes;
