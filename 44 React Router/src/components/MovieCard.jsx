
import { NavLink } from 'react-router'

export default function MovieCard({currentMovie}) {
  const {Poster, imdbID} = currentMovie;
  console.log(currentMovie);
  return (
    <li className='flex gap-2 hover:scale-105 cursor-pointer'>
        <img src={Poster} alt="" />
        <NavLink to={`/movie/${imdbID}`}>
          <button className='p-2 border'>Watch Now</button>
        </NavLink>
    </li>
  )
}
