import footerContact from "../../api/footerAPI.json";
import { MdPlace } from "react-icons/md";
import { IoCallSharp } from "react-icons/io5";
import { TbMailPlus } from "react-icons/tb";
import {NavLink} from "react-router-dom";

export default function Footer() {
  const footerIcon = {
    MdPlace: <MdPlace />,
    IoCallSharp: <IoCallSharp />,
    TbMailPlus: <TbMailPlus />,
  };
 
  return (
    <footer className="footer-section">
      <div className="container grid grid-three-cols">
       
        {footerContact.map((currentElement, index) => {
          return (
            <div className="footer-contact" key={index}>
              <div className="icon"> {footerIcon[currentElement.icon] ?? <span>⚠️</span>}
               
              </div>
              <div className="footer-contact-text">
                <p>{currentElement.title}</p>
                <p>{currentElement.details}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="copyright-area">
        <div className="container">
          <div className="grid grid-two-cols">
            <div className="copyright-text">
              <p>
                Copyright &copy; 2025 
                <NavLink to="https://www.x.com/cyberaditya" target="_blank">Aditya Dubey</NavLink>
              </p>

            </div>
            <div className="footer-menu">
              <ul>
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>
                <li>
                  <NavLink to="https://www.github.com/cyberadityacode" target="_blank">Github</NavLink>
                </li>
                <li>
                  <NavLink to="https://x.com/cyberaditya" target="_blank">Social</NavLink>
                </li>
                <li>
                  <NavLink to="contact">Contact</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
