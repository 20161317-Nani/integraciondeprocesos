import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";

export function Profile() {
  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt="user-avatar"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  Richard Davis
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  CEO / Co-Founder
                </Typography>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 px-4 lg:grid-cols-2">
            {/* Información Básica del Usuario */}
            <div className="space-y-6">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Información Personal
              </Typography>
              
              <div className="space-y-4">
                <div>
                  <Typography variant="small" className="font-semibold text-blue-gray-500">
                    Nombre Completo
                  </Typography>
                  <Typography variant="paragraph" className="text-blue-gray-800">
                    Richard Davis
                  </Typography>
                </div>

                <div>
                  <Typography variant="small" className="font-semibold text-blue-gray-500">
                    Correo Electrónico
                  </Typography>
                  <Typography variant="paragraph" className="text-blue-gray-800">
                    richard.davis@mail.com
                  </Typography>
                </div>

                <div>
                  <Typography variant="small" className="font-semibold text-blue-gray-500">
                    Teléfono
                  </Typography>
                  <Typography variant="paragraph" className="text-blue-gray-800">
                    (44) 123 1234 123
                  </Typography>
                </div>

                <div>
                  <Typography variant="small" className="font-semibold text-blue-gray-500">
                    Ubicación
                  </Typography>
                  <Typography variant="paragraph" className="text-blue-gray-800">
                    USA
                  </Typography>
                </div>
              </div>

              <Button variant="outlined" className="flex items-center gap-2">
                <PencilIcon className="h-4 w-4" />
                Editar Perfil
              </Button>
            </div>

            {/* Recuperación de Contraseña */}
            <div className="space-y-6">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Seguridad
              </Typography>
              
              <div className="bg-blue-gray-50 rounded-lg p-6 space-y-4">
                <Typography variant="h6" color="blue-gray" className="text-sm">
                  Recuperación de Contraseña
                </Typography>
                
                <Typography variant="small" className="text-blue-gray-600">
                  ¿Olvidaste tu contraseña? Puedes restablecerla haciendo clic en el botón de abajo.
                  Se enviará un enlace de recuperación a tu correo electrónico.
                </Typography>

                <Button 
                  variant="filled" 
                  color="blue"
                  className="w-full"
                  onClick={() => {
                    // Aquí puedes agregar la lógica para recuperar contraseña
                    console.log("Solicitar recuperación de contraseña");
                  }}
                >
                  Recuperar Contraseña
                </Button>

                <Typography variant="small" className="text-blue-gray-500 text-xs">
                  * El enlace de recuperación expirará en 24 horas
                </Typography>
              </div>

              {/* Información Adicional de Seguridad */}
              <div className="space-y-3">
                <Typography variant="small" className="font-semibold text-blue-gray-500">
                  Última actualización de contraseña
                </Typography>
                <Typography variant="small" className="text-blue-gray-600">
                  Hace 30 días
                </Typography>
                
                <Typography variant="small" className="font-semibold text-blue-gray-500">
                  Estado de la cuenta
                </Typography>
                <Typography variant="small" className="text-green-600">
                  Verificada
                </Typography>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
