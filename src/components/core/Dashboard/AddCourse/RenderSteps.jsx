import React from 'react'

export const RenderSteps = () => {
    const { step } = useSelector((state) => state.course)

    const steps = [
      {
        id: 1,
        title: "Course Information",
      },
      {
        id: 2,
        title: "Course Builder",
      },
      {
        id: 3,
        title: "Publish",
      },
    ]
    
    return (
    <div>
        thank you
    </div>
  )
}
