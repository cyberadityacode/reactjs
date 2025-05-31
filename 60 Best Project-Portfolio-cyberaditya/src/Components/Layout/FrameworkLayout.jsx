import React from "react";
import ReactJS from "./ReactJS";
import VanillaJS from "./VanillaJS";

export default function FrameworkLayout() {
  const { framework } = useParams();
  if (framework === "reactjs") return console.log("reacttttt");
  if (framework === "vanillajs") return <VanillaJS />;

  return <div>Framework not found</div>;
}
