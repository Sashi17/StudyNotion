import React from 'react'
import { Link } from 'react-router-dom'
import {FaArrowRight} from "react-icons/fa"
import {HighlightText} from '../components/core/Homepage2/HighlightText'
import {CTAButton} from '../components/core/Homepage2/CTAButton'
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/Homepage2/CodeBlocks'
import {TimeLineSection} from "../components/core/Homepage2/TimeLineSection"
import {LearningLanguageSection} from "../components/core/Homepage2/LearningLanguageSection"
import { InstructorSection } from '../components/core/Homepage2/InstructorSection'
import {Footer} from '../components/common/Footer'
import { ExploreMore } from '../components/core/Homepage2/ExploreMore'


export const Home = ({ hovering }) => {
  return (
    <div>
        {/*SECTION 1*/}
        <div className='relative mx-auto flex flex-col w-11/12 items-center justify-between max-w-[913px] text-white '>
            
            <Link to={"/signup"}>
                <div className= {`group mt-16 p-1 mx-auto rounded-full bg-richblack-800 text-richblack-200 font-bold
                transition-all duration-200 hover-scale-95 w-fit shadow-sm shadow-richblack-600 
                ${ hovering ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                    <div className={`flex flex-row items-center gap-2 rounded-full px-10 py-[5px] 
                    transition-all duration-200 group-hover:bg-richblack-900`}>
                        <p>Become an Instructor</p>
                        <FaArrowRight/>
                    </div>
                </div>
            </Link>
        
            <div className='text-center font-semibold text-4xl mt-9'>
                Empower Your Future with
                <HighlightText text={"Coding Skills"}></HighlightText>
            </div>
            <div className='mt-4 text-center text-base font-medium text-richblack-500 w-[90%]'>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>

            <div className='flex flex-row gap-7 mt-8'>
                <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                </CTAButton>
                <CTAButton active={false} linkto={"/login"}>
                    Book a Demo
                </CTAButton>
            </div>

            <div className='mx-3 my-12  shadow-[20px_20px_white]'>
                <video muted loop autoPlay>
                    <source src={Banner} type='video/mp4'/>
                </video>
            </div>
            
            {/* Code section 1 */}
            <div>
                <CodeBlocks
                    position={"lg:flex-row"}
                    heading={
                        <div className='text-center font-semibold text-4xl'>
                            Unlock your 
                            <HighlightText text={"coding potential"}/> 
                            with our online courses.
                        </div>
                    }
                    subheading={
                        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    }
                    ctabtn1={
                        {
                            text: "Try it Yourself", 
                            linkto: "/signup",
                            active: true, 
                        }
                    }
                    ctabtn2={
                        {
                            text: "Learn More", 
                            linkto: "/login",
                            active: false, 
                        }
                    }
                    codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</title><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>\n`}
                    codeColor={"text-yellow-25"}
                />
            </div>

            {/* Code section 2 */}
            <div>
                <CodeBlocks
                    position={"lg:flex-row-reverse"}
                    heading={
                        <div className='text-center font-semibold text-4xl'>
                            Unlock your 
                            <HighlightText text={"coding potential"}/> 
                            with our online courses.
                        </div>
                    }
                    subheading={
                        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    }
                    ctabtn1={
                        {
                            text: "Try it Yourself", 
                            linkto: "/signup",
                            active: true, 
                        }
                    }
                    ctabtn2={
                        {
                            text: "Learn More", 
                            linkto: "/login",
                            active: false, 
                        }
                    }
                    codeblock={`<!DOCTYPE html>\n<html>\nhead><title>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>`}
                    codeColor={"text-yellow-25"}
                />
            </div>

            <ExploreMore/>

        </div>

        {/*SECTION 2*/}
        <div className='bg-pure-greys-5 text-richblack-700 '>
            <div className='homepage_bg h-[310px]'>
                <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
                    <div className='h-[150px]'></div>
                    <div className='flex flex-row gap-7 text-white'>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-3'>
                                Explore Full Catalog
                                <FaArrowRight/>
                            </div>
                        </CTAButton>
                        <CTAButton active={false} linkto={"/login"}>
                            <div className='flex items-center  gap-3'>
                                Learn More
                            </div>
                        </CTAButton>

                    </div>
                </div>
            </div>

            <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>

                <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                    
                    <div className='font-semibold text-4xl w-[45%]'>
                        Get the skills you need for a 
                        <HighlightText text={"job that is in demand."}></HighlightText>
                    </div>
                    
                    <div className='flex flex-col gap-10 w-[40%] items-start'>
                        <div className='text-[16px] mb-7'>
                            The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>
                        <CTAButton active={true} linkto={"/login"}>
                            <div className='flex items-center text-richblack-900  gap-3'>
                                Learn More
                            </div>
                        </CTAButton>

                    </div>
                </div>
                
                <TimeLineSection/>

                <LearningLanguageSection/>
            </div>
        </div>
        
        

        {/*SECTION 3*/}
        <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8 
        bg-richblack-900 text-white '>
            
            <InstructorSection/>

            <h2 className='text-center font-semibold mt-10 text-4xl'>Review from other Learners</h2>

            {/* Review slider here */}

        </div>

        {/*FOOTER*/}
        <Footer/>

    </div>
  )
}
