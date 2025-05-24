import { Form } from "react-router-dom";

export const contactData = async ({request})=>{
  try{
    const res = await request.formData();
    console.log(res);
    const data = Object.fromEntries(res)
    console.log(data);
    return null;
  }catch(error){
    console.error(error);
  }
}

export default function Contact() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Form method="POST" action="/contact">
        <div className="flex ">
          <label htmlFor="username">Name:</label>
          <input
            type="text"
            name="username"
            id="username"
            required
            autoComplete="off"
            placeholder="Enter Name..."
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            autoComplete="off"
            placeholder="Enter Email..."
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="10"
            required
            autoComplete="off"
            placeholder="Your Message..."
          />
        </div>
        <button className="m-2 p-2 border active:scale-105">Submit</button>
      </Form>
    </div>
  );
}
