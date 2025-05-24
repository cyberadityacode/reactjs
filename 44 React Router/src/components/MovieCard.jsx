import React from 'react'

export default function MovieCard({currentMovie}) {
  return (
    <li className='flex gap-2 hover:scale-105 cursor-pointer'>
        <img src={currentMovie.Poster} alt="" />
    </li>
  )
}
