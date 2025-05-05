import VideoCard from "../components/VideoCard"
import "./VicdeoCardsPage.css"
// Importa el tipo de dato para los videos
// Define el tipo de dato para los videos
interface Video {
  title: string
  description: string
  videoUrl: string
  powerpointUrl: string
}

// Importa el arreglo de videos desde el archivo JSON
import videosData from "../data/videos.json"

export const VideoCardsPage = () => {
  return (
    <div>
      {/* Agrega el título "Lecciones de herramientas IA dictadas en SuperLab" */}
      <h1 className="inline-block  md:px-16 px-6 text-lg sm:text-xl  md:text-xl font-bold sm:mt-8 md:mt-16  sm:mb-16 bordered-text sm:bg-gray-800 rounded-full py-1">
        Lecciones de herramientas IA dictadas en <span>SuperLab</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-white mb-10">
        {/* Usa el tipo explícito para video */}
        {videosData.map((video: Video, index: number) => (
          <VideoCard
            key={index}
            title={video.title}
            description={video.description}
            videoUrl={video.videoUrl}
            powerpointUrl={video.powerpointUrl}
          />
        ))}
      </div>
    </div>
  )
}
