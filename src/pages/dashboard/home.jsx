import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

export function Home() {
  return (
    <div className="mt-12 flex flex-col md:flex-row gap-4">
      {/* Contenedor principal de video + sugeridos */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Video principal */}
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

      {/* Contenedor de comentarios */}
      <Card className="w-full md:w-1/3 shadow-lg rounded-lg h-[600px] overflow-y-auto border border-blue-gray-100">
        <CardBody className="p-4">
          <Typography variant="h6" className="mb-4 font-bold">
            Comentarios
          </Typography>
          {[1, 2, 3, 4, 5].map((comment) => (
            <div key={comment} className="mb-3 border-b pb-2">
              <Typography variant="small" className="font-semibold">
                Usuario {comment}
              </Typography>
              <Typography variant="paragraph" className="text-blue-gray-700 text-sm">
                Este es un comentario de ejemplo sobre el video.
              </Typography>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}


export default Home;
