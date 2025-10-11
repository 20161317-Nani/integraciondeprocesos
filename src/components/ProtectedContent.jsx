import React from 'react';
import { Button, Typography } from "@material-tailwind/react";
import { Link } from 'react-router-dom';

const ProtectedContent = ({ children, message }) => {
  // 1. Revisa si hay un token en el localStorage
  const token = localStorage.getItem('token');

  // 2. Si NO hay token, muestra el mensaje y un botón para iniciar sesión
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
        <Typography variant="h6" color="blue-gray" className="mb-4">
          {message || "Este contenido es solo para miembros."}
        </Typography>
        <Typography className="mb-6">
          Inicia sesión para desbloquear esta sección y acceder a todas las funcionalidades.
        </Typography>
        <Link to="/auth/sign-in">
          <Button color="blue">Iniciar Sesión</Button>
        </Link>
      </div>
    );
  }

  // 3. Si hay token, muestra el contenido protegido (los children)
  return children;
};

export default ProtectedContent;