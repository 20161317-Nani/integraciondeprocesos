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
  // --- INICIO: LÓGICA DEL FORMULARIO ---
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // Estado para el mensaje de respuesta

   // 1. AÑADE UN NUEVO ESTADO PARA LA VISIBILIDAD
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsMessageVisible(false); // Oculta el mensaje anterior

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email }),
      });
      const data = await response.json();
      setMessage(data.message);
      
      // 2. ACTIVA LA ANIMACIÓN AL RECIBIR RESPUESTA
      setIsMessageVisible(true); 

    } catch (error) {
      setMessage('Error en el servidor. Por favor, intenta de nuevo más tarde.');
      setIsMessageVisible(true); // También muestra el mensaje de error con animación
    }
  };


  // --- FIN: LÓGICA DEL FORMULARIO ---

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

         {/* Se conecta el formulario y los inputs a la lógica de React */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <Input
              size="lg"
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="mt-4" fullWidth>
              Enviar enlace
            </Button>
          </form>

         {/* 👇 3. APLICA LAS CLASES DE TRANSICIÓN AL MENSAJE */}
          {message && (
            <Typography 
              color="blue-gray"  className={`mt-4 text-center font-normal transition-all duration-500 ease-in-out
                ${isMessageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'} `}
            >
              {message}
            </Typography>
          )}

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
