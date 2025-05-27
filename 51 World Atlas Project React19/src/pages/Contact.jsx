import { RiContactsFill } from "react-icons/ri";
export default function Contact() {

  const handleFormSubmit = (formData)=>{
    console.log(formData.entries()); //return form iterator
    const keyValuePair = Object.fromEntries(formData.entries()); //return object with key value pair for form iterator
    console.log(keyValuePair);
  }
  return (
    <section className="section-contact">
      <h2 className="container-title">Contact Us</h2>

      <form action={handleFormSubmit} className="form" >
        <input className="form-control" type="text" required autoComplete="off" name="username" placeholder="Enter your Name..." />
        <input className="form-control" type="email" required autoComplete="off" name="email" placeholder="Enter your Email..." />
        <textarea className="form-control-ta" name="message" rows="10" placeholder="Enter your message..." ></textarea>

        <button type="submit">Send <RiContactsFill /></button>

      </form>
    </section>
  );
}
