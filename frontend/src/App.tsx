import "./App.css"

import {VideoCardsPage} from "./view/VideoCardsPage"

function App() {
  return (
    <div className="container mx-auto p-0 relative">
      <VideoCardsPage />
      <img
        src={"./S_Header_Final-crop-768x852.png"}
        alt="Descripción de la imagen"
        className="absolute h-[30rem] top-0 right-0 -z-20 opacity-30"
      />
    </div>
  )
}

export default App
