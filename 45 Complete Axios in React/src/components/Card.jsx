import React from 'react'

export default function Card({data}) {
  return (
    <li className='flex flex-col flex-wrap mx-auto '>
      <div className='flex justify-center items-center w-50 h-60 bg-gray-200  flex-wrap ' >
        <div className='flex justify-center items-center '>
          <img className='flex  size-40 hover:scale-105' src={data.Poster} alt={data.Title} />
        </div>
        <h1 className='font-semibold text-center text-wrap'>{data.Title}</h1>
      </div>
    </li>
  )
}
