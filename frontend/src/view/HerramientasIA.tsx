import React, {useState} from "react"
import "../App.css"
import toolsData from "../data/data.json"
import ToolCard from "../components/ToolCard"

interface HerramientasIAProps {}

interface Tool {
  name: string
  image: string
  description: string
  tags: string[]
  link: string
}

export const HerramientasIA: React.FC<HerramientasIAProps> = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const filterTools = (tool: Tool) => {
    // Filtra por etiquetas seleccionadas
    const tagFilterPassed =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => tool.tags.includes(tag))
    // Filtra por término de búsqueda
    const searchFilterPassed = tool.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    return tagFilterPassed && searchFilterPassed
  }

  return (
    <div className="container mx-auto p-4 mt-10">
      {/* Sección de filtros por etiqueta */}


      <div className="sm:flex grid grid-cols-3 flex-wrap justify-center mb-4 sm:mt-16 sm:text-base text-xs ">
        {["Video", "Imagenes", "Prompt", "Texto", "Código", "Juegos"].map(
          (tag) => (
            <button
              key={tag}
              className={` m-1 sm:m-2 px-2 sm:px-4 py-1 rounded-full ${
                selectedTags.includes(tag)
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-gray-200"
              }`}
              onClick={() => toggleTag(tag)}>
              {tag}
            </button>
          )
        )}
      </div>
      <input
        className="border-1 sm:text-base text-xs sm:mt-2 sm:mb-4 sm:h-12 h-8 inline-block w-[95%] sm:w-[80%]  sm:rounded-md rounded-xl border border-double border-slate-800 border-transparent bg-[linear-gradient(#000,#000),linear-gradient(to_right,#334454,#334454)]	bg-origin-border px-3 py-2 text-slate-200 transition-all duration-500 [background-clip:padding-box,_border-box] placeholder:text-slate-500 focus:bg-[linear-gradient(#000,#000),linear-gradient(to_right,#c7d2fe,#8678f9)] focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar herramienta..."
      />

      {/* Barra de búsqueda */}
      <div className="mb-4"></div>

      {/* Grid de herramientas */}
      <div className=" grid grid-cols-1 sm:mx-0 mx-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-8 text-white">
        {toolsData.courses.filter(filterTools).map((tool) => (
          <ToolCard key={tool.name} tool={tool} />
        ))}
      </div>
    </div>
  )
}
