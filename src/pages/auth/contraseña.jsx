import { useState } from "react"; 
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";


export function RecoverPassword() {
   // --- INICIO: LÓGICA DEL FORMULARIO ---
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // Estado para el mensaje de respuesta

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setMessage(''); // Limpia el mensaje anterior

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email }), // Envía el email al backend
      });
      const data = await response.json();
      setMessage(data.message); // Muestra el mensaje del backend
    } catch (error) {
      setMessage('Error en el servidor. Por favor, intenta de nuevo más tarde.');
    }
  };
  // --- FIN: LÓGICA DEL FORMULARIO ---
  return (
    <section className="flex items-center justify-center min-h-screen bg-blue-100">
      <Card shadow={true} className="flex flex-col lg:flex-row w-full max-w-5xl p-6 bg-white rounded-2xl">

        {/* Imagen lado izquierdo */}
        <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center">
          <img
            src="/img/pattern.png" // Cambia por tu imagen si quieres
            alt="Recuperar contraseña"
            className="rounded-2xl object-cover w-full h-full"
          />
        </div>

        {/* Formulario lado derecho */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6">
          <div className="text-center mb-6">
            <Typography variant="h3" className="font-bold">Recuperar contraseña</Typography>
            <Typography color="gray" className="mt-1 text-sm">
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

            <Button type="submit" className="mt-4" fullWidth>
              Enviar enlace
            </Button>
          </form>
          
            {/* Muestra el mensaje de respuesta del servidor */}
          {message && (
            <Typography color="blue-gray" className="mt-4 text-center font-normal">
              {message}
            </Typography>
          )}

          <Typography color="gray" className="mt-4 text-center text-sm">
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
