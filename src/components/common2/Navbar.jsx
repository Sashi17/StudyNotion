import React from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link, matchPath } from 'react-router-dom'
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'



export const Navbar = () => {

  const location = useLocation();
  const RouteMatch = (route) => {
    return matchPath({path:route}, location.pathname);
  }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
          {/* Image */}
          <Link>
            <img src={logo} height={42} width={160} loading='lazy' alt="alt" />
          </Link>

          {/* Nav Links */}
          <nav>
            <ul className='flex gap-x-6 text-richblack-25'>
              {
                NavbarLinks.map((link, index) => (
                  <li key={index}>
                    {
                      //If element is null or undefined, it prevents errors and returns undefined instead of throwing an error(?.)
                      link.title === "Catalog" ? (<div></div>) : (
                        <Link to={link?.path}>
                          <p className={` ${ RouteMatch(link?.path) ? "text-yellow-25" : "text-richblack-25"} `}>
                            {link.title}
                          </p>
                        </Link>
                      )
                    }
                  </li>
                ))
              }

            </ul>
          </nav>
          
          {/* Login/Signup/Dashboard */}
          
          

        </div>
    </div>
 )
}
