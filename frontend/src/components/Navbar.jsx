import React from 'react'
import { Outlet } from 'react-router-dom'

function Navbar() {
  return (
    <div className='flex flex-col justify-center items-center overflow-x-hidden'>
        <div className='flex-none w-full bg-gray-300 h-15'>Blog App</div>
        <Outlet/>
    </div>
    
  )
}

export default Navbar