import React, { useEffect, useState } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link, matchPath } from 'react-router-dom'
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from "react-icons/ai";
import { ProfileDropDown } from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnectors'
import { categories } from '../../services/api'
import { IoIosArrowDown } from "react-icons/io";


export const Navbar = () => {

  //useSelector is a Redux hook that allows components to access the state from the Redux store.
  const {token} = useSelector( (state) => state.auth);
  const {user} = useSelector( (state) => state.profile);
  const {totalItems} = useSelector( (state) => state.cart); 

  const [subLinks, setSubLinks] = useState([])

  const fetchSubLinks = async() => {
    try{
      const result = await apiConnector("GET", categories.CATEGORIES_API)
      console.log("Printing sublinks data", result)
      setSubLinks(result.data.data)
    }catch (err){
      console.log(err);
      console.log("Could not fetch the category list api")
    }
  }

  useEffect( () => {
    fetchSubLinks();
  }, [])

  const location = useLocation();
  const RouteMatch = (route) => {
    return matchPath({path:route}, location.pathname);
  }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 bg-richblack-800'>
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
                      link.title === "Catalog" ? (
                        <div className='relative flex items-center gap-2 group'>
                          <p>{link.title}</p>
                          <IoIosArrowDown />

                          <div className='invisible flex flex-col absolute left-[50%] 
                          translate-x-[-50%] translate-y-[80%] top-[50%] rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]'>

                            <div className='absolute left-[51%] top-0 translate-x-[80%] translate-y-[-45%]
                            h-6 w-6 rotate-45 rounded bg-richblack-5'> </div>

                          </div>
                        </div>
                      ) : (
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
          <div className='flex gap-x-4 items-center'>
              {//Cart
                user && user?.accountType != "Instructor" && (
                  <Link to="/dashboard/cart" className='relative'>
                    <AiOutlineShoppingCart className='h-[20px] w-[20px]'/>
                    {
                      totalItems > 0 && (
                        <span className='absolute rounded-full bg-pink-600 flex items-center justify-center'>
                          {totalItems}
                        </span>
                      ) 
                    }
                  </Link>
                )
              }
              {//Login
                token === null && (
                  <Link to="/login">
                    <button className='font-medium text-richblack-300 border border-richblack-700 px-[4px] py-[8px] rounded-md hover:bg-richblack-700 hover:scale-105 hover:border-richblack-600'>
                      Log In
                    </button>
                  </Link>
                )
              }
              {//Signup
                token === null && (
                  <Link to="/signup">
                    <button className='font-medium text-richblack-300 border border-richblack-700 px-[5px] py-[7px] rounded-md hover:bg-richblack-700 hover:scale-105 hover:border-richblack-600'>
                      Sign Up
                    </button>
                  </Link>
                )
              }
              {//User Icon
                token != null && <ProfileDropDown/>
              }
          </div>
          
        </div>
    </div>
 )
}
