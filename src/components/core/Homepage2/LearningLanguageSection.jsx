import React from 'react'
import { HighlightText } from './HighlightText'
import knowyourprogress from "../../../assets/Images/Know_your_progress.png"
import comparewithothers from "../../../assets/Images/Compare_with_others.png"
import planyourlessons from "../../../assets/Images/Plan_your_lessons.png"
import { CTAButton } from './CTAButton'

export const LearningLanguageSection = () => {
  return (
    <div className='flex flex-col gap-5 mt-[130px] items-center mb-32'>
        <div className='font-semibold text-4xl text-center'>
            Your swiss knife for 
            <HighlightText text={"learning any language"}></HighlightText>
        </div>
        <div className='font-medium w-[70%] text-center text-richblack-300 mx-auto text-base mt-3'>
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className='flex flex-row items-center justify-center mt-5'>
            <img
                src={knowyourprogress}
                alt='KnowYourProgress'
                className='object-contain -mr-32'
            />
            <img
                src={comparewithothers}
                alt='CompareWithOthers'
                className='object-contain'
            />
            <img
                src={planyourlessons}
                alt='PlanYourLessons'
                className='object-contain -ml-36'
            />
        </div>
        
        <div className='w-fit'>
            <CTAButton active={true} linkto={"/signup"}>
                Learn More
            </CTAButton>
        </div>


    </div>
  )
}
