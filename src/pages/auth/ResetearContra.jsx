// frontend/src/pages/auth/ResetearContra.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography } from "@material-tailwind/react";

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const { resetToken } = useParams();
  const navigate = useNavigate();

  // Validar contraseña en tiempo real
  const validatePassword = (value) => {
    const newErrors = {};
    if (value.length < 8)
      newErrors.length = 'Debe tener al menos 8 caracteres.';
    if (!/[A-Z]/.test(value))
      newErrors.uppercase = 'Debe incluir al menos una letra mayúscula.';
    if (!/[0-9]/.test(value))
      newErrors.number = 'Debe incluir al menos un número.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
      newErrors.special = 'Debe incluir al menos un carácter especial.';

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Bloquear envío si hay errores
    if (Object.keys(errors).length > 0 || password === '') {
      setMessage('Por favor corrige los errores antes de continuar.');
      return;
    }

    try {
      const response = await fetch(`/api/auth/ResetearContra/${resetToken}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setTimeout(() => navigate('/auth/sign-in'), 3000);
      }
    } catch (error) {
      setMessage('Error en el servidor. Intenta de nuevo.');
    }
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <Card className="p-8">
        <Typography variant="h4" color="blue-gray">
          Establecer Nueva Contraseña
        </Typography>

        <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80">
          <Input
            label="Nueva Contraseña"
            type="password"
            value={password}
            onChange={handleChange}
            error={Object.keys(errors).length > 0}
          />

          {/* Mensajes dinámicos de error */}
          <div className="mt-2">
            {Object.values(errors).map((err, index) => (
              <Typography
                key={index}
                color="red"
                className="text-sm font-medium"
              >
                • {err}
              </Typography>
            ))}
          </div>

          <Button
            type="submit"
            className="mt-6"
            fullWidth
            disabled={Object.keys(errors).length > 0 || password === ''}
          >
            Actualizar Contraseña
          </Button>

          {message && (
            <Typography color="blue-gray" className="mt-4 text-center">
              {message}
            </Typography>
          )}
        </form>
      </Card>
    </section>
  );
}
