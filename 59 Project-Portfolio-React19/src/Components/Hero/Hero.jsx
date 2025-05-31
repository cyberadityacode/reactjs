import React from 'react';
import './Hero.css';
import profile_img from '../../assets/profile_img.svg';
import cyberadityapic from '../../assets/adi.jpg';
import AnchorLink from 'react-anchor-link-smooth-scroll';
export default function Hero() {
  return (
    <div className='hero' id='home'>
        {/* <img src={profile_img} alt="" /> */}
        <img src={cyberadityapic} alt="" />
        <h1><span>I'm Aditya,</span> Software Engineer based in Jabalpur.</h1>
        <p>Software Engineer with over 7 years of diverse experience in software development, client liaison, and delivering technical solutions across government healthcare initiatives and startup environments.</p>
        <div className='hero-action'>
            <div className="hero-connect"><AnchorLink className="anchor-link" offset={50} href="#contact">Connect with me</AnchorLink></div>
            <div className="hero-resume">My Resume</div>
        </div>
    </div>
  )
}
