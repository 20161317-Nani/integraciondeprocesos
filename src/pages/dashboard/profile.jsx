import {
  Card,  CardBody,  CardHeader,  CardFooter,  Avatar,  Typography,  Tabs,  TabsHeader,
  Tab,  Switch,  Tooltip,  Spinner,  Button, Input, IconButton, Dialog,   DialogHeader,  DialogBody,  DialogFooter,} from "@material-tailwind/react";
import {
  HomeIcon,  ChatBubbleLeftEllipsisIcon,  Cog6ToothIcon,  PencilIcon, CameraIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, useRef } from 'react';
import ProtectedContent from '@/components/ProtectedContent'; // Importa el contenido protegido


export function Profile() {

  const [userProfile, setUserProfile] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [newProfilePicUrl, setNewProfilePicUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
   
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/users/profile', { headers: { 'x-auth-token': token } });
        if (!response.ok) throw new Error('Error al obtener perfil');
        const data = await response.json();
        setUserProfile(data);
        // Inicializa el formulario de edición con los datos cargados
        setEditFormData({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          telefono: data.telefono || '', // Asume que 'telefono' puede no estar
        });
      } catch (error) {
        console.error("Error en fetchProfile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsUploading(true);
    setUpdateMessage('');
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const response = await fetch('/api/users/profile-picture/upload', {
        method: 'PUT',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      if (!response.ok) throw new Error('Error al subir la foto');
      
      const data = await response.json();
      const newImageUrl = `${data.profilePictureUrl}?t=${new Date().getTime()}`; // Truco de caché

      setUserProfile(prev => ({ ...prev, profilePictureUrl: newImageUrl }));
      setUpdateMessage('Foto actualizada!');
    } catch (error) {
      console.error(error);
      setUpdateMessage(`Error al subir la foto.`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUpdateMessage(''), 3000);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // --- NUEVA LÓGICA PARA EL MODAL ---
  const handleModalOpen = () => {
    // Reinicia el formulario con los datos actuales cada vez que se abre
    if (userProfile) {
      setEditFormData({
        nombre: userProfile.nombre || '',
        apellido: userProfile.apellido || '',
        telefono: userProfile.telefono || '', // Asume que 'telefono' está en tu Schema
      });
    }
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => setIsEditModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) throw new Error('Error al actualizar');
      
      const data = await response.json();
      // Actualiza el perfil principal con los nuevos datos
      setUserProfile(prev => ({ ...prev, ...data }));
      handleModalClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/sign-in';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  const handleRequestRecovery = async () => {
    // 1. Asegúrate de que tengamos los datos del perfil
    if (!userProfile || !userProfile.correo) {
      setUpdateMessage('Error: No se pudo encontrar tu correo.');
      setTimeout(() => setUpdateMessage(''), 3000);
      return;
    }

    setUpdateMessage('Enviando correo de recuperación...'); // Mensaje de carga

    try {
      // 2. Llama a la MISMA ruta de backend que usa la página pública
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: userProfile.correo }), // Envía el correo del perfil
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el correo');
      }

      // 3. Muestra el mensaje de éxito
      setUpdateMessage('¡Se ha enviado un enlace a tu correo!');

    } catch (error) {
      console.error("Error al solicitar recuperación:", error);
      setUpdateMessage(`Error: ${error.message}`);
    } finally {
      // Limpia el mensaje después de 4 segundos
      setTimeout(() => setUpdateMessage(''), 4000);
    }
  };

  return (
      // Todo se envuelve en protectedcontent para saber si el usuaio esta logeado o no
    <ProtectedContent message="Para configurar tu perfil personal, debes iniciar sesión.">
      {/* Todo lo que está aquí adentro solo se mostrará si el usuario ha iniciado sesión */}
      
      {!userProfile ? (
        // Muestra un estado de carga mientras se obtienen los datos
        <Typography>Cargando perfil...</Typography>
      ) : (
        // Una vez que los datos llegan, muestra el perfil
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center gx-6 px-5">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              {/* CAMBIOS DE TAMAÑO Y POSICIÓN DEL AVATAR */}
              <div className="relative group w-fit"> 
                    <Avatar
                      src={userProfile.profilePictureUrl || '/img/default-avatar.png'}
                      alt="user-avatar"
                      size="xxl"
                      variant="rounded"
                      className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                    />
                    {/* Botón flotante para cambiar foto */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*" // Acepta solo imágenes
                      className="hidden" // Oculta el input real
                    />
                    <IconButton
                      size="sm"
                      color="white"
                      className="!absolute bottom-1 right-1 rounded-full border border-blue-gray-200 group-hover:opacity-100 opacity-0 transition-opacity" 
                      onClick={triggerFileInput}
                      disabled={isUploading}
                    >
                      {isUploading ? <Spinner className="h-4 w-4"/> : <CameraIcon className="h-4 w-4 text-blue-gray-700"/>}
                    </IconButton>
                  </div>
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {userProfile.nombre} {userProfile.apellido}
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  {userProfile.correo}
                </Typography>
              </div>
            
            </div>
            {updateMessage && <Typography color="blue-gray" className="text-sm mb-4 px-4">{updateMessage}</Typography>}
          </div>

          <div className="grid grid-cols-1 gap-8 px-4 lg:grid-cols-2">
            <div className="space-y-6">
              <Typography variant="h6">Información Personal</Typography>
              <div className="space-y-4">
                <div>
                  <Typography variant="small" className="font-semibold text-blue-gray-500">Nombre Completo</Typography>
                  <Typography variant="paragraph" className="text-blue-gray-800">{userProfile.nombre} {userProfile.apellido}</Typography>
                </div>
                <div>
                  <Typography variant="small" className="font-semibold text-blue-gray-500">Correo Electrónico</Typography>
                  <Typography variant="paragraph" className="text-blue-gray-800">{userProfile.correo}</Typography>
                </div>

                <div>
                  <Typography variant="small" className="font-semibold text-blue-gray-500">
                    Teléfono
                  </Typography>
                  <Typography variant="paragraph" className="text-blue-gray-800">
                    {userProfile.telefono || 'No especificado'}
                  </Typography>
                </div>

                <div>
                  <Typography variant="small" className="font-semibold text-blue-gray-500">
                    Ubicación
                  </Typography>
                  <Typography variant="paragraph" className="text-blue-gray-800">
                    {userProfile.country || 'No especificada'}
                  </Typography>
                </div>
              </div>

              <Button variant="outlined" className="flex items-center gap-2" onClick={handleModalOpen}>
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
                  onClick={() => { handleRequestRecovery(); }}
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
                <Button color="red" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* --- 7. MODAL PARA EDITAR PERFIL --- */}
          <Dialog open={isEditModalOpen} handler={handleModalClose}>
            <DialogHeader>Editar Información Personal</DialogHeader>
            <DialogBody divider className="flex flex-col gap-4">
              <Input 
                label="Nombre"
                name="nombre"
                value={editFormData.nombre}
                onChange={handleFormChange}
              />
              <Input 
                label="Apellido" 
                name="apellido"
                value={editFormData.apellido}
                onChange={handleFormChange}
              />
              <Input 
                label="Teléfono" 
                name="telefono"
                value={editFormData.telefono}
                onChange={handleFormChange}
              />
            </DialogBody>
            <DialogFooter>
              <Button variant="text" color="red" onClick={handleModalClose} className="mr-1">
                <span>Cancelar</span>
              </Button>
              <Button variant="gradient" color="green" onClick={handleProfileUpdate}>
                <span>Guardar Cambios</span>
              </Button>
            </DialogFooter>
          </Dialog>            

    </>
      )} </ProtectedContent>

  );
}

export default Profile;
