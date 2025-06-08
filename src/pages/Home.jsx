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

import { ReviewSlider } from '../components/common/ReviewSlider'

export const Home = () => {
  return (
    <div>
        {/*SECTION 1*/}
        <div className='relative mx-auto flex flex-col w-11/12 items-center justify-between max-w-[913px] text-white '>
            
            <Link to={"/signup"}>
                <div className= {`group mt-16 p-1 mx-auto rounded-full bg-richblack-800 text-richblack-200 font-bold
                    transition-all duration-200 hover-scale-95 w-fit shadow-sm shadow-richblack-600`}>
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

            <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
                <video muted loop autoPlay
                    className='shadow-[20px_20px_rgba(255,255,255)]'>
                    <source src={Banner} type='video/mp4'/>
                </video>
            </div>
            
            {/* Code section 1 */}
            <div>
                <CodeBlocks
                    position={"lg:flex-row"}
                    heading={
                        <div className='font-semibold text-4xl'>
                            Unlock your 
                            <HighlightText text={"coding potential "}/> 
                            with our online courses.
                        </div>
                    }
                    subheading={ "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you." }
                    ctabtn1={ {
                            text: "Try it Yourself", 
                            linkto: "/signup",
                            active: true, 
                        }
                    }
                    ctabtn2={ {
                            text: "Learn More", 
                            linkto: "/login",
                            active: false, 
                        }
                    }
                    codeColor={"text-yellow-25"}
                    codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                    bgGradient={<div className="codeblock1 absolute"></div>}
                />
            </div>

            {/* Code section 2 */}
            <div>
                <CodeBlocks
                    position={"lg:flex-row-reverse"}
                    heading={
                        <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                            Start <HighlightText text={"coding in seconds"}/>
                        </div>
                    }
                    subheading={
                        "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                    }
                    ctabtn1={ {
                            text: "Continue Lesson",
                            link: "/signup",
                            active: true,
                        } }
                    ctabtn2={ {
                            text: "Learn More",
                            link: "/signup",
                            active: false, 
                        } }
                    codeColor={"text-white"}
                    codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                    bgGradient={<div className="codeblock2 absolute"></div>}
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
        <div className='relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
            
            <InstructorSection/>

            <h2 className='text-center text-4xl font-semibold mt-8'>Review from other Learners</h2>

            {/* Review slider here */}
            <ReviewSlider/>

        </div>
        {/*FOOTER*/}
        <Footer/>

    </div>
  )
}
