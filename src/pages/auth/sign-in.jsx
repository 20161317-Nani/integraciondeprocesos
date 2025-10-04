import { Input, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
        {/* Título */}
        <Typography variant="h3" className="text-center mb-8 font-bold">
          Registro
        </Typography>

        {/* Formulario */}
        <form className="space-y-5">
          <Input
            label="Nombre"
            className="!border-gray-400 focus:!border-blue-500"
            labelProps={{ className: "before:content-none after:content-none" }}
            error
          />
          <Input
            label="Apellidos"
            className="!border-gray-400 focus:!border-blue-500"
            labelProps={{ className: "before:content-none after:content-none" }}
            error
          />
          <Input
            label="Correo Electronico"
            type="email"
            className="!border-gray-400 focus:!border-blue-500"
            labelProps={{ className: "before:content-none after:content-none" }}
            error
          />
          <Input
            label="Contraseña"
            type="password"
            className="!border-gray-400 focus:!border-blue-500"
            labelProps={{ className: "before:content-none after:content-none" }}
            error
          />

          <Button
            type="submit"
            fullWidth
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          >
            Registrarse
          </Button>
        </form>

        {/* Link de ingresar */}
        <Typography variant="small" className="text-center text-gray-600 mt-4">
          Ya tienes una cuenta?
          <Link to="/auth/sign-in" className="ml-1 text-blue-600 font-medium">
            Ingresa aquí
          </Link>
        </Typography>

        {/* Línea separadora */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-500">______</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Botón Google */}
        <Button
          variant="outlined"
          size="md"
          fullWidth
          className="flex items-center justify-center gap-2 border-gray-400"
        >
          <img src="/img/google-logo.svg" alt="Google" className="w-5 h-5" />
          Regístrate con Google
        </Button>
      </div>
    </section>
  );
}

