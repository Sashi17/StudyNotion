import React from 'react'
// import { HighlightText } from './Homepage2/HighlightText'
import { CTAButton } from './CTAButton'
import {FaArrowRight} from "react-icons/fa"
import { TypeAnimation} from 'react-type-animation'

const CodeBlocks = ({
    position, heading, subheading, ctabtn1, ctabtn2, codeblock, bgGradient, codeColor
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>

        {/* Section 1 */}
        <div className='w-[50%] flex flex-col gap-8'>
            {heading}
            <div className='mt-4 text-center text-base font-medium text-richblack-500 w-[90%]'>
                {subheading}
            </div>
            <div className='flex gap-7 mt-8'>
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className='flex items-center gap-2'>
                        {ctabtn1.text}
                        <FaArrowRight/>
                    </div>                    
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                    {ctabtn2.text}
                </CTAButton>
            </div>
        </div>

        {/* Section 2 */}
        <div className='relative h-fit  flex flex-row text-10[px] w-[100%] py-4 lg:w-[500px]'>

            {/* HW--> Gradient color */}


            <div className='flex text-center flex-col w-[10%] text-richblack-400 font-inter font-bold bg-richblue-800 bg-opacity-30 pt-2'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>
            
            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2 bg-richblue-800
            bg-opacity-30 pt-2`}>
                <TypeAnimation
                    sequence={[codeblock, 2000, ""]}
                    repeat={Infinity}
                    cursor={true}
                    style = {
                        {
                            whiteSpace: "pre-line",
                            display:"block",
                        }
                    }
                    omitDeletionAnimation={true}
                />
            </div>
        </div>

    </div>
  )
}
export default CodeBlocks;