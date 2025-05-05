import React from "react"
import './VideoCards.css'
interface Tool {
  name: string
  image: string
  description: string
  tags: string[]
  link: string
}

interface ToolCardProps {
  tool: Tool
}

const ToolCard: React.FC<ToolCardProps> = ({tool}) => {
  return (
    <div className="max-w-sm m-4 sm:mb-0 mb-6 rounded-2xl overflow-hidden shadow-2xl sm:m-1 bg-gradient-to-tl from-indigo-700 via-transparent hover:via-red-600 ">
      <div className="image-container relative w-auto sm:h-48 h-32">
        <img
          src={tool.image}
          alt={tool.name}
          className="absolute inset-0 w-full h-full object-cover rounded-t"
        />
      </div>
      <div className="px-4 py-4">
        <div className=" font-bold text-left sm:text-xl text:sm mb-1 bordered">{tool.name}</div>
        <p className="text-gray-200 text-left sm:text-sm text-xs">{tool.description}</p>
        {tool.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex  items-center justify-center rounded-full border border-gray-800 bg-gray-950 px-3 py-1 text-xs font-medium text-gray-300 backdrop-blur-3xl mr-1 sm:mt-4 mt-1">
            <span className="bg-gradient-to-t from-[#ce5656] to-[#f1eeee] bg-clip-text text-transparent">
              {tag}
            </span>
          </span>
        ))}
      </div>
      <div className="px-4 pb-4">
        <a href={tool.link} target="_blank" rel="noopener noreferrer">
          <button className="relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-950 transition-colors hover:bg-neutral-800">
            <div>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-200">
                <path
                  d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                  fill="currentColor"
                  fill-rule="evenodd"
                  clip-rule="evenodd"></path>
              </svg>
            </div>
          </button>
        </a>
      </div>
    </div>
  )
}

export default ToolCard
