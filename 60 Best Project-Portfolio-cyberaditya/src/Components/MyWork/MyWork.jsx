import './MyWork.css';
import theme_pattern from '../../assets/theme_pattern.svg';
import mywork_data from '../../assets/mywork_data';
import arrow_icon from '../../assets/arrow_icon.svg'
import project1 from '../../assets/project1.png';
import { NavLink } from 'react-router-dom';
export default function MyWork() {
  return (
    <div className="my-work" id='work'>
        <div className="mywork-title">
            <h1>My Latest Work</h1>
            <img src={theme_pattern} alt="" />
        </div>
        <div className='mywork-container'>
            {mywork_data.map((work,index)=>{
                 return <NavLink to={work.link} target='_blank'> <img key={index} src={work.w_img} alt="" />  </NavLink> 
                //  return <img key={index} src={project1} alt="" />   
            })}
        </div>
        <div className="mywork-showmore">
            <p>Show More</p>
            <img src={arrow_icon} alt="" />
        </div>
    </div>
  )
}
