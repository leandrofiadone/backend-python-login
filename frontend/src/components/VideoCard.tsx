import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFilePowerpoint} from "@fortawesome/free-solid-svg-icons"
import './VideoCards.css'

interface VideoCardProps {
  title: string
  description: string
  videoUrl: string
  powerpointUrl: string // Nueva propiedad para el enlace del icono de PowerPoint
}

const VideoCard: React.FC<VideoCardProps> = ({
  title,
  description,
  videoUrl,
  powerpointUrl // Nueva propiedad para el enlace del icono de PowerPoint
}) => {
  return (
    <div className="max-w-sm rounded-xl mt-4 mb-5 overflow-visible shadow-2xl sm:m-1 relative flex flex-col bg-gradient-to-tl from-indigo-700 via-transparent hover:via-red-600  ">
      <div className="px-4 py-2">
        <div className="font-bold sm:text-xl text-sm text-left mb-2 truncate bordered-text-card">
          {title}
        </div>
        <p className="text-gray-200 sm:text-sm text-xs text-left overflow-auto truncate">
          {description}
        </p>
      </div>
      <div className="px-4 pt-4 pb-2 mb-6">
        <iframe
          className="w-full h-40"
          src={videoUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen></iframe>
      </div>
      {/* Ícono de PowerPoint con clases de Tailwind para el color de fondo y hover */}
      <a
        href={powerpointUrl}
        className="absolute top-0 right-0 mt-2 mr-2 text-red-950 hover:text-red-300">
        <FontAwesomeIcon icon={faFilePowerpoint} size="2x" />
      </a>
    </div>
  )
}

export default VideoCard
