import './Contact.css';
import theme_pattern from '../../assets/theme_pattern.svg';
import mail_icon from '../../assets/mail_icon.svg';
import location_icon from '../../assets/location_icon.svg';
import call_icon from '../../assets/call_icon.svg';
import { useState } from 'react';


export default function Contact() {
    const [result, setResult] = useState("");
    const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", import.meta.env.VITE_API_KEY);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };
  return (
    <div className='contact' id='contact'>
        <div className='contact-title'>
            <h1>Get in touch</h1>
            <img src={theme_pattern} alt="" />
        </div>
        <div className="contact-section">
            <div className="contact-left">
                <h2>Let's talk</h2>
                <p>I'm currently available to take on new projects, so feel free to send me a message about anything that you want me to work on. You can contact anytime.</p>
                <div className="contact-details">
                    <div className="contact-detail">
                        <img src={mail_icon} alt="" />
                        <p>adityadubey793@gmail.com</p>
                    </div> 
                    <div className="contact-detail">
                        <img src={call_icon} alt="" />
                        <p>+91-6264599267</p>
                    </div>
                    <div className="contact-detail">
                        <img src={location_icon} alt="" />
                        <p>Jabalpur,M.P., India</p>
                    </div>
                </div>
            </div>
            <form onSubmit={onSubmit} className="contact-right">
                <label htmlFor="">Your Name</label>
                <input type="text" placeholder='Enter your name' name='name'/>

                <label htmlFor="">Your Email</label>
                <input type="email" placeholder='Enter your email' name='email' />

                <label htmlFor="">Write your message here</label>
                <textarea name="message" rows="8" placeholder='Enter your message'></textarea>

                <button type='submit' className='contact-submit'>Submit Now</button>
            </form>
              <span>{result}</span>
        </div>
    </div>
  )
}
