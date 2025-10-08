// frontend/src/pages/auth/ResetearContra.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography } from "@material-tailwind/react";

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { resetToken } = useParams(); // Obtiene el token de la URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/ResetearContra/${resetToken}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      setMessage(data.message);
      if(response.ok) {
        setTimeout(() => navigate('/auth/sign-in'), 3000); // Redirige al login tras 3 seg
      }
    } catch (error) {
      setMessage('Error en el servidor. Intenta de nuevo.');
    }
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <Card className="p-8">
        <Typography variant="h4">Establecer Nueva Contraseña</Typography>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80">
          <Input 
            label="Nueva Contraseña" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="mt-6" fullWidth>
            Actualizar Contraseña
          </Button>
          {message && <Typography color="blue-gray" className="mt-4 text-center">{message}</Typography>}
        </form>
      </Card>
    </section>
  );
}