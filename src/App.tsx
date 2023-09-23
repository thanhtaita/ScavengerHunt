import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Welcome to Geo Scavenger Hunt - Your Ultimate Adventure Awaits!🌍🔍🏞️
      </h1>
      {/* <div className="bg-blue-500 text-white p-4">
        <p className="text-xl font-semibold">Get ready to embark on an exciting journey of discovery and exploration. Whether you're a seasoned adventurer or new to the world of scavenger hunts, our app is your passport to a world of fun, challenges, and hidden treasures. Grab your smartphone, gather your friends, and let the adventure begin! Navigate through intriguing clues, explore fascinating locations, and uncover the secrets of the world around you.</p>
        <p className="mt-2">This is a sample product description.</p>
      </div>

      <div className="bg-gray-200 p-4">
        <p className="text-lg font-semibold">Product B</p>
        <p className="mt-2">Another product with a description.</p>
      </div> */}
    </>
  )
}

export default App
