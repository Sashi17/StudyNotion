import React from 'react'
import logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"


const timeline = [
    {
        logo: logo1,
        heading: "Leadership",
        Description: "Fully Committed to the success company"
    },
    {
        logo:logo2,
        heading: "Responsibility",
        Description: "Students will always be our top priority"
    },
    {
        logo:logo3,
        heading: "Flexibility",
        Description: "The ability to switch is an important skill"
    },
    {
        logo:logo4,
        heading: "Solve the problem",
        Description: "Code your way to a solution"
    }
]

export const TimeLineSection = () => {
  return (
    <div className='flex flex-row items-center gap-16'>
        
        <div className='w-[45%] flex flex-col items-center gap-4'>
            { timeline.map((element, index) => {
                    return(
                        <div className='flex flex-row gap-6' key={index}>
                            <div className='w-[50px] h-[50px] bg-white flex items-center'>
                                <img src={element.logo} alt=''/>
                            </div>
                            <div>
                                <h2 className='text-[18px] font-semibold'>{element.heading}</h2>
                                <p className='test-base'>{element.Description}</p>
                            </div>

                        </div>
                    )
                })
            }
        </div>

        <div className='relative shadow-blue-200'>
            <img src={timelineImage} alt='timelineImage' className='shadow-white object-cover h-fit'/>

            <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-7
            left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-200 px-7'>
                    <p className='text-3xl font-bold'>10</p>
                    <p className='text-caribbeangreen-200 text-sm'>Years Experience</p>
                </div>
                <div className='flex flex-row gap-5 items-center px-7'>
                    <p className='text-3xl font-bold'>250</p>
                    <p className='text-caribbeangreen-200 text-sm' >Types of Courses</p>
                </div>
            </div>
        </div>
        
    </div>
  )
}
