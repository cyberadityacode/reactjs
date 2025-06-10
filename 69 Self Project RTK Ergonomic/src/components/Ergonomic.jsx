import React from "react";

export default function Ergonomic() {
  return (
    <section>
      <div className="user-details">
        <label>
          Name:
          <input type="text" placeholder="Enter your name..." />
        </label>
        <label>
          DOB:
          <input type="date" />
        </label>
        <label>
          Monthly Income:
          <input type="number" placeholder="Enter your Monthly Income in INR" />
        </label>
        <label>
          Working Hrs Per Day:
          <input type="number" placeholder="Enter Working Hours Per Day" />
        </label>
        <button>Calculate Ergonomics</button>
      </div>
      <div className="outcome">
        <p>Hello Mr. Aditya,</p>
        <p>Per Day Earning: ₹ 2000</p>
        <p>Per Week Earning: ₹ 14000</p>
        <p>Per Month Earning: ₹ 60000</p>
        <p>Working Hours (Per Day): 8</p>
        <p>Working Hours (Per Week): {8*7}</p>
        <p>Working Hours (Per Month): {8*30}</p>
        <p>Non Working Hours (Per Day): 16</p>
        <p>Non Working Hours (Per Week): {16*7}</p>
        <p>Non Working Hours (Per Month): {16*30}</p>
      </div>
    </section>
  );
}
