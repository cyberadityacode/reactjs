import { useState } from "react";

export default function App() {
  const colors = JSON.parse(localStorage.getItem("color"));
  const [red, setRed] = useState(colors?.red ?? 0);
  const [green, setGreen] = useState(colors?.green ?? 0);
  const [blue, setBlue] = useState(colors?.blue ?? 0);

  const save = () => {
    localStorage.setItem("color", JSON.stringify({ red, green, blue }));
  };

  return (
    <div className="flex flex-col justify-center items-center h-dvh gap-4">
      <h1 className="text-xl font-bold"> Color Mixer</h1>

      <div
        style={{ backgroundColor: `rgb(${red},${green},${blue})` }}
        className="size-40 rounded shadow-md border"
      ></div>

      <div className="flex flex-col gap-2">
        <label>
          Red: {red}
          <input
            value={red}
            onChange={(e) => setRed(Number(e.target.value))}
            type="range"
            min={0}
            max={255}
            className="w-64"
          />
        </label>
        <label>
          Green: {green}
          <input
            value={green}
            onChange={(e) => setGreen(Number(e.target.value))}
            type="range"
            min={0}
            max={255}
            className="w-64"
          />
        </label>
        <label>
          Blue: {blue}
          <input
            value={blue}
            onChange={(e) => setBlue(Number(e.target.value))}
            type="range"
            min={0}
            max={255}
            className="w-64"
          />
        </label>
      </div>

      <button
        onClick={save}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Color Combination
      </button>
    </div>
  );
}
