import { useEffect, useState } from "react";

export default function DateComponent() {
  const [dateTime, setDateTime] = useState("");
  const dateTimeFunction = () => {
    const dateToday = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    setDateTime(currentTime);
  };

  useEffect(() => {
    const interval = setInterval(() => dateTimeFunction(), 1000);
    return ()=> clearInterval(interval)
  }, []);

  return (
    <>
      <div>
        <h1>Date Component</h1>
        <span>{dateTime}</span>
      </div>
    </>
  );
}
