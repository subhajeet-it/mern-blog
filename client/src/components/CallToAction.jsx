import { Button } from 'flowbite-react'
import React from 'react'

export const CallToAction = () => {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className='flex-1 justify-center flex flex-col'>
            <h2>
                want to learn more about javascript?
            </h2>
            <p>
            Checkout these resources with 100 JavaScript Projects
            </p>
            <Button gradientDuoTone='purpleToPink'>Learn More</Button>
        </div>
        <div className='p-7 flex-1'>
            <img src='https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg'/>
        </div>
    </div>
  )
}
