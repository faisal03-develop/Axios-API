import React from 'react'
import LogoDevIcon from '@mui/icons-material/LogoDev';

const Header = () => {
  return (
    <>
      <div id="header" className='text-4xl bg-blue-200 backdrop-blur-2xl rounded-2xl h-[6rem] my-10 flex items-center
      justify-center font-bold text-gray-800 shadow-lg '>
        <LogoDevIcon fontSize='large' className='mr-2 text-gray-600'/>
        <span>CRUD Operations</span>
      </div>
    </>
  )
}

export default Header