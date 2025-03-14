import React from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <div className='flex '>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
          <Link>
            <img src={logo} height={42} width={160} loading='lazy' alt="alt" />
          </Link>
        </div>
    </div>
 )
}
