import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function SignIn() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-blue-100">
      {/* Card contenedor */}
      <Card shadow={true} className="flex flex-col lg:flex-row w-full max-w-5xl p-6 bg-white rounded-2xl">
        
        {/* Imagen lado izquierdo */}
        <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center">
          <img
            src="/img/pattern.png"
            alt="Registro"
            className="rounded-2xl object-cover w-full h-full"
          />
        </div>

        {/* Formulario lado derecho */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6">
          <div className="text-center mb-6">
            <Typography variant="h3" className="font-bold">Registro</Typography>
            <Typography color="gray" className="mt-1 text-sm">
              Completa los siguientes campos para crear tu cuenta
            </Typography>
          </div>

          <form className="flex flex-col gap-6">
            <Input size="lg" label="Nombre" />
            <Input size="lg" label="Apellidos" />
            <Input size="lg" label="Correo Electrónico" type="email" />
            <Input size="lg" label="Contraseña" type="password" />

            <Button className="mt-4" fullWidth>
              Registrarse
            </Button>
          </form>

          <Typography color="gray" className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?
            <Link to="/auth/sign-up" className="text-blue-600 ml-1 font-medium">
              Inicia sesión
            </Link>
          </Typography>

          {/* Botón Google */}
          <div className="mt-6">
            <Button
              size="lg"
              color="white"
              className="flex items-center gap-2 justify-center shadow-md"
              fullWidth
            >
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                {/* svg paths */}
              </svg>
              <span>Registrarse con Google</span>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
