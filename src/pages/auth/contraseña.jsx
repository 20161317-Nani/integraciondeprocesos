import { useState, useEffect } from "react"; // 👈 Asegúrate de importar useEffect
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useMaterialTailwindController } from "@/context";

// Colecciones de imágenes por tema y modo
const imageSets = {
  light: [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  ],
  dark: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1486308510493-aa64833634ef?auto=format&fit=crop&w=1200&q=80",
  ],
};


export function RecoverPassword() {
  // --- LÓGICA DE ESTADOS ---
  const [controller] = useMaterialTailwindController();
  const { darkMode } = controller;
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState("");
  const [loaded, setLoaded] = useState(false);

  // --- LÓGICA DE EFECTOS ---
  useEffect(() => {
    const selectedImages = darkMode ? imageSets.dark : imageSets.light;
    const randomIndex = Math.floor(Math.random() * selectedImages.length);
    setImage(selectedImages[randomIndex]);
    setLoaded(false); // Reinicia el estado de carga al cambiar de imagen
  }, [darkMode]);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => setLoaded(true);
  }, [image]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // --- LÓGICA DEL FORMULARIO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error en el servidor. Por favor, intenta de nuevo más tarde.');
    }
  };

  // --- ÚNICO RETURN CON EL JSX ---
  return (
    <section className={`flex items-center justify-center min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-900" : "bg-blue-100"}`}>
      <Card shadow={true} className={`flex flex-col lg:flex-row w-full max-w-5xl p-6 rounded-2xl overflow-hidden transition-colors duration-500 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        
        {/* Imagen lado izquierdo */}
        <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center bg-black">
          {image && (
            <img
              src={image}
              alt="Recuperar contraseña"
              className={`object-cover w-full h-full transition-opacity duration-700 rounded-2xl ${loaded ? "opacity-100" : "opacity-0"} ${darkMode ? "filter brightness-75" : ""}`}
            />
          )}
        </div>

        {/* Formulario lado derecho */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6">
          <div className="text-center mb-6">
            <Typography variant="h3" className="font-bold">Recuperar contraseña</Typography>
            <Typography color={darkMode ? "gray" : "blue-gray"} className="mt-1 text-sm">
              Ingresa tu correo electrónico para recibir el enlace de recuperación
            </Typography>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <Input 
              size="lg" 
              label="Correo Electrónico" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="mt-4" fullWidth>Enviar enlace</Button>
          </form>
          
          {message && (
            <Typography color="blue-gray" className="mt-4 text-center font-normal">{message}</Typography>
          )}

          <Typography color={darkMode ? "gray" : "blue-gray"} className="mt-4 text-center text-sm">
            <Link to="/auth/sign-in" className="text-blue-600 font-medium hover:underline">
              Volver al inicio de sesión
            </Link>
          </Typography>
        </div>
      </Card>
    </section>
  );
}

export default RecoverPassword;