import React, { useState } from 'react'
import {HomePageExplore} from '../../../data/homepage-explore'
import { HighlightText } from './HighlightText';
import { CourseCard } from './CourseCard';


const tabs = [
    "Free",
    "New to Coding",
    "Most Popular",
    "Skill Paths",
    "Career Paths"
]

export const ExploreMore = () => {
    const [currentTab, setCurrentTab] = useState(tabs[0]);
    // eslint-disable-next-line
    const [courses, setCourses] = useState(HomePageExplore[0].courses)
    // eslint-disable-next-line
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)


    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value)
        setCourses(result[0].courses)
        setCurrentCard(result[0].courses[0].heading)
    }

  return (

    <div>
        <div className='font-semibold text-4xl text-center'>
            Unlock the
            <HighlightText text={"Power of Code"}/> 
        </div>

        <p className='text-[16px] text-center text-richblack-300 mt-3'>
            Learn to Build Anything You Can Imagine
        </p>


        {/* Tab component */}
        <div className='mt-5 flex flex-row rounded-full bg-richblack-800 mb-5 border-richblack-100 
        px-1 py-1'>
            {
                tabs.map((element, index) => {
                    return (
                        <div
                            className={`text-[16px] flex items-center gap-2 
                                ${currentTab === element ?
                                "bg-richblack-900 text-richblack-5 font-medium" : 
                                "text-richblack-200" } rounded-full transition-all duration-200 cursor-pointer
                                hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`}
                            key={index}
                            onClick={() => setMyCards(element)}
                        >
                            {element}
                        </div>
                    )
                })
            }
        </div>

        <div className='lg:h-[150px]'></div>

        {/* Cards component */}
        <div  className='flex flex-row absolute w-full gap-10 justify-between'>
            {
                courses.map((element, index) => {
                    return (
                        <CourseCard
                            key={index}
                            cardData = {element}
                            currentCard = {currentCard}
                            setCurrentCard = {setCurrentCard}
                        />
                    )
                })
            }
        </div>

        <div>

        </div>

    </div>
  )
}
