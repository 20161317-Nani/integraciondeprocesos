import { useEffect, useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

// Colección de imágenes para el panel izquierdo
const imageSet = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80", // laptop moderna
  "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1200&q=80", // oficina
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", // código nocturno
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80", // auroras
  "https://images.unsplash.com/photo-1486308510493-aa64833634ef?auto=format&fit=crop&w=1200&q=80", // ciudad
];

export function RecoverPassword() {
  // Selecciona una imagen aleatoria antes del primer render
  const [image] = useState(() => {
    const randomIndex = Math.floor(Math.random() * imageSet.length);
    return imageSet[randomIndex];
  });

  // (Opcional) Efecto suave al cargar la imagen
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => setLoaded(true);
  }, [image]);

  return (
    <section className="flex items-center justify-center min-h-screen bg-blue-100">
      <Card
        shadow={true}
        className="flex flex-col lg:flex-row w-full max-w-5xl p-6 bg-white rounded-2xl overflow-hidden"
      >
        {/* Imagen lado izquierdo */}
        <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center bg-black">
          {image && (
            <img
              src={image}
              alt="Recuperar contraseña"
              className={`object-cover w-full h-full transition-opacity duration-700 rounded-2xl ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>

        {/* Formulario lado derecho */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6">
          <div className="text-center mb-6">
            <Typography variant="h3" className="font-bold">
              Recuperar contraseña
            </Typography>
            <Typography color="gray" className="mt-1 text-sm">
              Ingresa tu correo electrónico para recibir el enlace de recuperación
            </Typography>
          </div>

          <form className="flex flex-col gap-6">
            <Input size="lg" label="Correo Electrónico" type="email" />

            <Button className="mt-4" fullWidth>
              Enviar enlace
            </Button>
          </form>

          <Typography color="gray" className="mt-4 text-center text-sm">
            <Link
              to="/auth/sign-in"
              className="text-blue-600 font-medium hover:underline"
            >
              Volver al inicio de sesión
            </Link>
          </Typography>
        </div>
      </Card>
    </section>
  );
}

export default RecoverPassword;
