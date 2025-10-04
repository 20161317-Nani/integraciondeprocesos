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
      <Card className="w-full max-w-5xl flex flex-col lg:flex-row shadow-xl rounded-2xl">
        
        {/* Imagen a la izquierda */}
        <div className="hidden lg:flex w-2/5 items-center justify-center bg-white rounded-l-2xl">
          <img
            src="/img/pattern.png"
            alt="Sign in illustration"
            className="w-full h-full object-cover rounded-l-2xl"
          />
        </div>

        {/* Formulario a la derecha */}
        <div className="flex-1 bg-white p-10 rounded-r-2xl">
          <Typography variant="h3" className="text-center mb-6 font-bold">
            Inicia Sesión
          </Typography>

          <form className="space-y-5">
            {/* Nombre y Apellido en una fila */}
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
              label="Correo Electrónico"
              type="email"
              placeholder="ejemplo@mail.com"
              className="!border-gray-300 focus:!border-blue-500"
              labelProps={{ className: "before:content-none after:content-none" }}
            />

            {/* Contraseña */}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Contraseña
            </Typography>
            <Input
              size="md"
              type="password"
              placeholder="********"
              className="!border-gray-300 focus:!border-blue-500"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />

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
            <span>Inicia sesión con Google</span>
          </Button>

          <Typography
            variant="small"
            className="text-center text-gray-600 mt-5"
          >
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
