import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Uplode from './component/uplodeInvoice/uplode'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Uplode />
    </>
  )
}

export default App
