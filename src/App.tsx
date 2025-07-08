import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/index.scss'
import './styles/app.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav>
        <div className='search'>
          <input></input>
          <button className='searchIcon'></button>
        </div>
      </nav>
    </>
  )
}

export default App
