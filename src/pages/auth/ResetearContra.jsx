// frontend/src/pages/auth/ResetearContra.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Input, Button, Typography, IconButton } from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const { resetToken } = useParams();
  const navigate = useNavigate();

  // Validar contraseña en tiempo real
  const validatePassword = (value) => {
    const newValidations = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };
    setValidations(newValidations);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Bloquear envío si hay errores
    const hasErrors = Object.values(validations).some((v) => v === false);
    if (hasErrors || password === "") {
      setMessage("Por favor corrige los errores antes de continuar.");
      return;
    }

    try {
      const response = await fetch(`/api/auth/ResetearContra/${resetToken}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setTimeout(() => navigate("/auth/sign-in"), 3000);
      }
    } catch (error) {
      setMessage("Error en el servidor. Intenta de nuevo.");
    }
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="p-8 w-96 shadow-xl">
        <Typography variant="h4" color="blue-gray" className="text-center mb-4">
          Establecer Nueva Contraseña
        </Typography>

        <form onSubmit={handleSubmit} className="mt-4 mb-2 relative">
          {/* Campo de contraseña con botón ojito */}
          <div className="relative">
            <Input
              label="Nueva Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handleChange}
            />
            <IconButton
              variant="text"
              color="blue-gray"
              size="sm"
              className="!absolute right-2 top-2 rounded-full"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </IconButton>
          </div>

          {/* Validaciones dinámicas */}
          <div className="mt-4 space-y-1">
            <Typography
              className={`text-sm font-medium ${
                validations.length ? "text-green-600" : "text-red-600"
              }`}
            >
              • Al menos 8 caracteres
            </Typography>
            <Typography
              className={`text-sm font-medium ${
                validations.uppercase ? "text-green-600" : "text-red-600"
              }`}
            >
              • Al menos una letra mayúscula
            </Typography>
            <Typography
              className={`text-sm font-medium ${
                validations.number ? "text-green-600" : "text-red-600"
              }`}
            >
              • Al menos un número
            </Typography>
            <Typography
              className={`text-sm font-medium ${
                validations.special ? "text-green-600" : "text-red-600"
              }`}
            >
              • Al menos un carácter especial
            </Typography>
          </div>

          <Button
            type="submit"
            className="mt-6"
            fullWidth
            disabled={Object.values(validations).some((v) => v === false)}
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
