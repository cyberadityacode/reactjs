import React from "react";
import "./About.css";
import theme_pattern from "../../assets/theme_pattern.svg";
import profile_img from "../../assets/about_profile.svg";
import adityadubeydc from "../../assets/adityadubeydc.jpg";

export default function About() {
  return (
    <div className="about" id="about">
      <div className="about-title">
        <h1>About me</h1>
        <img src={theme_pattern} alt="" />
      </div>
      <div className="about-section">
        <div className="about-left">
          {/* <img src={profile_img} alt="" /> */}
          <img src={adityadubeydc} alt="" />
        </div>
        <div className="about-right">
          <div className="about-para">
            <p>
              I am an experienced Software Engineer with over 7+ years of
              professional expertise in the field. Throughout my career, I have
              had the privilege of collaborating with prestigious organizations,
              contributing to their success and growth.
            </p>
            <p>
              My passion for development is not only reflected in my extensive
              experience but also in the enthusiasm and dedication I bring to
              each project.
            </p>
          </div>
          <div className="about-skills">
            <div className="about-skill">
              <p>React JS </p> <hr style={{ width: "70%" }} />
            </div>
            <div className="about-skill">
              <p>TailwindCSS </p> <hr style={{ width: "60%" }} />
            </div>
            <div className="about-skill">
              <p>JavaScript (ES6+)</p> <hr style={{ width: "60%" }} />
            </div>
            <div className="about-skill">
              <p>HTML & CSS </p>
              <hr style={{ width: "70%" }} />
            </div>
            <div className="about-skill">
              <p>Advanced Excel </p>
              <hr style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      </div>
      <div className="about-achievements">
        <div className="about-achievement">
          <h1>7+</h1>
          <p>YEARS OF EXPERIENCE</p>
        </div>
        <hr />
        <div className="about-achievement">
          <h1>90+</h1>
          <p>PROJECTS COMPLETED</p>
        </div>
        <hr />
        <div className="about-achievement">
          <h1>15+</h1>
          <p>HAPPY CLIENTS</p>
        </div>
      </div>
    </div>
  );
}
