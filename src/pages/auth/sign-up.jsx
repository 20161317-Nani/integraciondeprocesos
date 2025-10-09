import { useState, useEffect } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useMaterialTailwindController } from "@/context";

export function SignUp() {
  const [controller] = useMaterialTailwindController();
  const { darkMode } = controller;

  // Conjuntos de imágenes de Unsplash
  const lightImages = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520975918318-3bb2c3c1f259?auto=format&fit=crop&w=1200&q=80",
  ];

  const darkImages = [
    "https://images.unsplash.com/photo-1517816428104-797678c7cf8b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505685296765-3a2736de412f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505245208761-ba872912fac0?auto=format&fit=crop&w=1200&q=80",
  ];

  // Estado para imagen actual
  const [image, setImage] = useState(() => {
    const images = darkMode ? darkImages : lightImages;
    return images[Math.floor(Math.random() * images.length)];
  });

  // Cada vez que entra al componente o cambia el modo, selecciona aleatoriamente una imagen
  useEffect(() => {
    const images = darkMode ? darkImages : lightImages;
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setImage(randomImage);
  }, [darkMode]);

  // --- Lógica del formulario ---
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
  });

  // Estados y validaciones de contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
    noRepeatNumbers: false,
  });

  // ✅ Validación de contraseña
  const validatePassword = (password) => {
    setPasswordValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noRepeatNumbers: !/(?:([0-9]).*?\1)/.test(password),
    });
  };

  // ✅ Validación de correo (debe contener @)
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚨 Validar correo antes de enviar
    if (!validateEmail(formData.correo)) {
      alert("Por favor ingresa un correo electrónico válido que contenga '@'.");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error en el registro");

      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      window.location.href = "/auth/sign-in";
    } catch (error) {
      alert(error.message);
    }
  };

  // --- Fin lógica formulario ---

  // Aplica modo oscuro global
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  return (
    <section
      className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-blue-100"
      }`}
    >
      <Card
        shadow={true}
        className={`flex flex-col lg:flex-row w-full max-w-5xl p-6 rounded-2xl transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
        }`}
      >
        {/* Imagen aleatoria */}
        <div className="w-full lg:w-1/2 hidden lg:flex items-center justify-center">
          <img
            src={image}
            alt="Registro"
            className={`rounded-2xl object-cover w-full h-full transition-all duration-700 ${
              darkMode ? "filter brightness-75" : ""
            }`}
          />
        </div>

        {/* Formulario */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6">
          <div className="text-center mb-6">
            <Typography variant="h3" className="font-bold">
              Registro
            </Typography>
            <Typography
              color={darkMode ? "white" : "gray"}
              className="mt-1 text-sm"
            >
              Completa los siguientes campos para crear tu cuenta
            </Typography>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <Input
              size="lg"
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            <Input
              size="lg"
              label="Apellidos"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
            />
            <Input
              size="lg"
              label="Correo Electrónico"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              error={formData.correo && !formData.correo.includes("@")}
            />

            {/* Campo de contraseña con ojito y validaciones */}
            <div className="relative">
              <Input
                size="lg"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {/* Botón del ojito */}
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4.03 3.97a.75.75 0 011.06 0l10.94 10.94a.75.75 0 11-1.06 1.06l-1.518-1.518A8.457 8.457 0 0110 15.5c-3.637 0-6.716-2.293-8.341-5.5a9.964 9.964 0 012.882-3.49L4.03 5.03a.75.75 0 010-1.06zm8.432 9.492l-1.59-1.59a3 3 0 01-3.28-3.28l-1.59-1.59A7.965 7.965 0 002 10c1.407 2.805 4.486 5 8 5a7.967 7.967 0 002.462-.538zM10 5a4.978 4.978 0 012.086.453L10.43 7.11a3 3 0 00-3.32 3.32L5.453 10.086A4.978 4.978 0 0110 5z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 3c-3.637 0-6.716 2.293-8.341 5.5a9.964 9.964 0 008.341 5.5c3.637 0 6.716-2.293 8.341-5.5A9.964 9.964 0 0010 3zm0 9a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Validaciones dinámicas */}
            {formData.password && (
              <ul className="text-sm mt-2 space-y-1">
                <li
                  className={
                    passwordValidations.length ? "text-green-600" : "text-red-600"
                  }
                >
                  Mínimo 8 caracteres
                </li>
                <li
                  className={
                    passwordValidations.uppercase
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  Al menos una mayúscula
                </li>
                <li
                  className={
                    passwordValidations.lowercase
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  Al menos una minúscula
                </li>
                <li
                  className={
                    passwordValidations.number ? "text-green-600" : "text-red-600"
                  }
                >
                  Al menos un número
                </li>
                <li
                  className={
                    passwordValidations.symbol ? "text-green-600" : "text-red-600"
                  }
                >
                  Al menos un símbolo
                </li>
                <li
                  className={
                    passwordValidations.noRepeatNumbers
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  No repetir números consecutivos
                </li>
              </ul>
            )}

            <Button type="submit" className="mt-4" fullWidth>
              Registrarse
            </Button>
          </form>

          <Typography
            color={darkMode ? "white" : "gray"}
            className="mt-4 text-center text-sm"
          >
            ¿Ya tienes una cuenta?
            <Link
              to="/auth/sign-in"
              className="text-blue-600 ml-1 font-medium hover:underline cursor-pointer"
            >
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
                <g clipPath="url(#clip0)">
                  <path
                    d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <span>Registrarse con Google</span>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}

export default SignUp;
