import { useEffect, useState } from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useMaterialTailwindController } from "@/context";
import { useNavigate } from "react-router-dom";

const imageSets = {
  light: [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1486308510493-aa64833634ef?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&q=80",
  ],
  dark: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1533025784049-38f3f9f2b2f8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
  ],
};

export function SignIn() {
  const [controller] = useMaterialTailwindController();
  const { darkMode } = controller;

  const selectedImages = darkMode ? imageSets.dark : imageSets.light;
  const [image] = useState(() => {
    const randomIndex = Math.floor(Math.random() * selectedImages.length);
    return selectedImages[randomIndex];
  });

  const [showPassword, setShowPassword] = useState(false);

  // --- INICIO: LÓGICA DEL FORMULARIO 
  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      localStorage.setItem('token', data.token);
      alert('¡Inicio de sesión exitoso!');
      window.location.href = '/dashboard/home';

    } catch (error) {
      alert(error.message);
    }
  };
  // --- FIN: LÓGICA DEL FORMULARIO ---

  const navigate = useNavigate();

  const handleGuestLogin = () => {
    // Nos aseguramos de que no haya un token de una sesión anterior
    localStorage.removeItem('token');
    // Navega a la página principal del dashboard
    navigate('/dashboard/home');
  };


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
        {/* Imagen lado izquierdo (siempre visible) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center mb-6 lg:mb-0">
          <img
            src={image}
            alt="Login"
            className={`rounded-2xl object-cover w-full h-64 lg:h-full transition-all duration-500 ${
              darkMode ? "filter brightness-75" : ""
            }`}
          />
        </div>

        {/* Formulario lado derecho */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6">
          <div className="text-center mb-6">
            <Typography variant="h3" className="font-bold">
              ¡Bienvenido de nuevo!
            </Typography>
            <Typography
              color={darkMode ? "white" : "gray"}
              className="mt-1 text-sm"
            >
              Te extrañamos
            </Typography>

            <br />
            <Typography color="blue-600" className="text-sm text-right">
              ¿No estás registrado?
              <Link
                to="/auth/sign-up"
                className="text-blue-600 ml-1 font-medium hover:underline cursor-pointer"
              >
                Crea una cuenta
              </Link>
            </Typography>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
             <Input 
              size="lg" 
              label="Correo Electrónico" 
              type="email" 
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <Input
                size="lg"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <Typography color="blue-600" className="text-sm text-right">
              ¿Olvidaste tu contraseña?
              <Link
                to="/auth/contraseña"
                className="text-blue-600 ml-1 font-medium hover:underline cursor-pointer"
              >
                Recupérala
              </Link>
            </Typography>

            <Button type="submit" className="mt-4" fullWidth>
              Iniciar sesión
            </Button>
          </form>

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
              <span>Iniciar sesión con Google</span>
            </Button>

            <Button
              type="button" // MUY IMPORTANTE: para no enviar el formulario de login
              className="mt-4"
              fullWidth
              color="blue-gray"
              onClick={handleGuestLogin}
            >
              Iniciar sesión como invitado
            </Button>   
          </div>
        </div>
      </Card>
    </section>
  );
}

export default SignIn;

