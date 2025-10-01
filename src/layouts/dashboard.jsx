import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          {/* SECCIÓN IZQUIERDA: VIDEO + SUGERIDOS */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Video grande */}
            <div className="bg-black w-full aspect-video rounded-lg shadow-lg flex items-center justify-center text-white text-xl">
              Video Principal
            </div>

            {/* Videos sugeridos */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((video) => (
                <div
                  key={video}
                  className="bg-gray-300 w-full aspect-video rounded-lg shadow flex items-center justify-center text-gray-700"
                >
                  Video Sugerido {video}
                </div>
              ))}
            </div>
          </div>

          {/* SECCIÓN DERECHA: COMENTARIOS */}
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-4 h-[600px] overflow-y-auto">
            <h2 className="font-bold mb-4">Comentarios</h2>
            {[1, 2, 3, 4, 5].map((comment) => (
              <div key={comment} className="mb-3 border-b pb-2">
                <p className="font-semibold">Usuario {comment}</p>
                <p>Este es un comentario de ejemplo sobre el video.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-blue-gray-600 mt-8">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
