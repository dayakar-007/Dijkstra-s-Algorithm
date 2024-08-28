import { useState } from 'react'

import './App.css'

import CircleDrawing from './Components/CricleCreation/Cricle'
import Header from './Components/Header/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <CircleDrawing/>
    </>
  )
}

export default App
