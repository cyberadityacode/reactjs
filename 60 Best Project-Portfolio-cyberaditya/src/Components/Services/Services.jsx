import React from "react";
import "./Services.css";
import theme_pattern from "../../assets/theme_pattern.svg";
import Services_Data from "../../assets/services_data";
import arrow_icon from "../../assets/arrow_icon.svg";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();
  const handleServiceClick = (serviceElement) => {
    console.log("service clicked - ",serviceElement);
    navigate(serviceElement)  
      
  };
  return (
    <div className="services" id="services">
      <div className="services-title">
        <h1>My Services</h1>
        <img src={theme_pattern} alt="" />
      </div>
      <div className="services-container">
        {Services_Data.map((service, index) => {
          return (
            <div
              key={index}
              onClick={() => handleServiceClick(service.s_element)}
              className="services-format"
            >
              <h3>{service.s_no}</h3>
              <h2>{service.s_name}</h2>
              <p>{service.s_desc}</p>
              <div className="services-readmore">
                <p>Read More</p>
                <img src={arrow_icon} alt="" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
