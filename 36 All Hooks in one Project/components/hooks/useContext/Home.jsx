import { useBioContext } from "./ContextAPIComponent";

export default function Home() {
  const value = useBioContext(); //pulling from customHook
  return (
    <div>
      Home {value.secretData} -{value.personalInfo}
    </div>
  );
}
