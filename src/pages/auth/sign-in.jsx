import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function SignIn() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-blue-200">
      {/* Contenedor principal */}
      <Card className="w-full max-w-4xl flex flex-col lg:flex-row shadow-xl rounded-2xl overflow-hidden">
        
        {/* Imagen a la izquierda */}
        <div className="hidden lg:flex w-2/5 items-center justify-center bg-white">
          <img
            src="/img/pattern.png"
            alt="Ilustración de inicio de sesión"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Formulario */}
        <div className="flex-1 bg-white p-10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <Typography variant="h3" className="font-bold">
              Iniciar Sesión
            </Typography>
            <Typography variant="paragraph" color="blue-gray" className="text-base mt-2">
              Ingresa tus datos para acceder
            </Typography>
          </div>

          <form className="space-y-5">
            {/* Nombre y Apellido */}
            <div className="flex gap-4">
              <Input
                size="md"
                label="Nombre"
                placeholder="Juan"
                className="!border-gray-300 focus:!border-blue-500"
                labelProps={{ className: "before:content-none after:content-none" }}
              />
              <Input
                size="md"
                label="Apellido"
                placeholder="Pérez"
                className="!border-gray-300 focus:!border-blue-500"
                labelProps={{ className: "before:content-none after:content-none" }}
              />
            </div>

            {/* Correo */}
            <Input
              size="md"
              label="Correo electrónico"
              type="email"
              placeholder="ejemplo@mail.com"
              className="!border-gray-300 focus:!border-blue-500"
              labelProps={{ className: "before:content-none after:content-none" }}
            />

            {/* Contraseña */}
            <Input
              size="md"
              type="password"
              label="Contraseña"
              placeholder="********"
              className="!border-gray-300 focus:!border-blue-500"
              labelProps={{ className: "before:content-none after:content-none" }}
            />

            {/* Botón principal */}
            <Button type="submit" fullWidth className="bg-blue-500 hover:bg-blue-600">
              Ingresar
            </Button>
          </form>

          {/* Separador */}
          <div className="flex items-center my-5">
            <hr className="flex-1 border-gray-300" />
            <span className="px-2 text-gray-500">o</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Botón Google */}
          <Button
            size="md"
            color="white"
            className="flex items-center gap-2 justify-center border border-gray-300 shadow-sm"
            fullWidth
          >
            <img src="/img/google-logo.svg" alt="Google" className="w-5 h-5" />
            <span>Iniciar sesión con Google</span>
          </Button>

          {/* Enlace de registro */}
          <Typography variant="small" className="text-center text-gray-600 mt-5">
            ¿No tienes cuenta?
            <Link to="/auth/sign-up" className="ml-1 text-blue-600 font-medium">
              Regístrate aquí
            </Link>
          </Typography>
        </div>
      </Card>
    </section>
  );
}

export default SignIn;
