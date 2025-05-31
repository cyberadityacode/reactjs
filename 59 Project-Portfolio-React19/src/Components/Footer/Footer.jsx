import "./Footer.css";
import footer_logo from "../../assets/footer_logo.svg";
import user_icon from "../../assets/user_icon.svg";
import theme_pattern from "../../assets/theme_pattern.svg";
export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-top">
        <div className="footer-top-left">
          {/* <img src={footer_logo} alt="" /> */}
          <div className="logo">
            <h1>CyberAditya</h1>
            <img src={theme_pattern} alt="" />
          </div>
          <p>
            Absolute Learner evolving in consciousness — from concept to clean delivery.
          </p>
        </div>
        <div className="footer-top-right">
          <div className="footer-email-input">
            <img src={user_icon} alt="" />
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="footer-subscribe">Subscribe</div>
        </div>
      </div>
      <hr />
      <div className="footer-bottom">
        <p className="footer-bottom-left">
          &copy; 2025 Aditya Dubey. All rights reserved
        </p>
        <div className="footer-bottom-right">
          <p>Term of Services</p>
          <p>Privacy Policy</p>
          <p>Connect with me</p>
        </div>
      </div>
    </div>
  );
}
