import React, { useEffect, useState } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link, matchPath } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import {NavbarLinks} from "../../data/navbar-links"
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from "react-icons/ai";
import { ProfileDropDown } from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnectors'
import { categories } from '../../services/apis'
import { IoIosArrowDown } from "react-icons/io";

// const subLinks = [
//   {
//       title: "Python",
//       link:"/catalog/python"
//   },
//   {
//       title: "Web Dev",
//       link:"/catalog/web-development"
//   },
// ];


export const Navbar = ({ setHovering }) => {
  // console.log("Printing base url: ", process.env.REACT_APP_BASE_URL);

  //useSelector is a Redux hook that allows components to access the state from the Redux store.
  const {token} = useSelector( (state) => state.auth);
  // console.log(token)
  const {user} = useSelector( (state) => state.profile);
  // console.log(user)
  const {totalItems} = useSelector( (state) => state.cart); 
  const location = useLocation();

  const [ssubLinks, setSsubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchSubLinks = async() => {
    setLoading(true)
    try{
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      // console.log("Printing Sublinks data", result.data);
      // const data = result.data.allCategories;
      // const names = data.map(item => item.name);
      // console.log(names);
      setSsubLinks(result.data.data);
    }catch (err){
      console.log(err);
      console.log("Could not fetch the category list api");
    }
    setLoading(false)
  }

  useEffect( () => {
    // console.log("PRINTING TOKEN", token)
    fetchSubLinks();
  }, [token])

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
                        <div className='relative flex items-center gap-2 group hover:text-yellow-50'
                            onMouseEnter={() => setHovering(true)}
                            onMouseLeave={() => setHovering(false)}>
                          <p>{link.title}</p>
                          <IoIosArrowDown />

                          <div className='invisible flex flex-col absolute left-[50%] 
                          translate-x-[-50%] translate-y-[30%] top-[50%] rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px] font-medium text-lg leading-relaxed gap-2'
                            onMouseEnter={() => setHovering(true)}
                            onMouseLeave={() => setHovering(false)}>

                            <div className='absolute left-[51%] top-0
                            translate-x-[80%] translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'>
                            </div>

                            {loading ? (
                              <p className="text-center">Loading...</p>
                            ) : ssubLinks.length ? (
                                <>
                                  {ssubLinks
                                  ?.filter(
                                      (subLink) => subLink?.courses?.length > 0
                                    )
                                    ?.map((subLink, i) => (
                                      <Link
                                        to={`/catalog/${subLink.name
                                          .split(" ")
                                          .join("-")
                                          .toLowerCase()}`}
                                        className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                        key={i}
                                      > <p> {subLink.name} </p>
                                      </Link>
                                    ))}
                                </>
                              ) : (
                                <p className="text-center">No Courses Found</p>
                              ) }
                          </div>
                        </div>
                      ) : (
                        <Link to={link?.path}>
                          <p className={` ${ RouteMatch(link?.path) ? "text-yellow-25" :  "text-richblack-25"}  hover:text-yellow-50`}>
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
                user && user?.accountType !== "Instructor" && (
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
                    <button className='font-medium text-richblack-300 border border-richblack-700 px-[5px] py-[8px] rounded-md hover:scale-105 hover:border-richblack-600'>
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
