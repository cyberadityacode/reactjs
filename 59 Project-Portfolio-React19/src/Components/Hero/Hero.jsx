import React from 'react';
import './Hero.css';
import profile_img from '../../assets/profile_img.svg';
import AnchorLink from 'react-anchor-link-smooth-scroll';

export default function Hero() {
  return (
    <div className='hero' id='home'>
        <img src={profile_img} alt="" />
        <h1><span>I'm Aditya,</span> frontend developer based in Jabalpur.</h1>
        <p>Software Engineer with 10+ years of diverse experience in Development, Liasoning and Providing Technical Solutions to Tech & Healthcare.</p>
        <div className='hero-action'>
            <div className="hero-connect"><AnchorLink className="anchor-link" offset={50} href="#contact">Connect with me</AnchorLink></div>
            <div className="hero-resume">My Resume</div>
        </div>
    </div>
  )
}
