import React from 'react'

export const HighlightText = ({text}) => {
  return (
    <span className='font-bold bg-gradient-to-r from-[rgba(31,162,255,1)] via-[rgba(18,216,250,1)] to-[rgba(166,255,203,1)] text-transparent bg-clip-text'>
       {" "} {text}
    </span>
  )
}
