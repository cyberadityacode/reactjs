import react,{useState} from 'react'
import ButtonComponent from "./ButtonComponent";
import HeadingCounterComponent from "./HeadingCounterComponent";


export default function App() {
    const [countValue,setCountValue] = useState(0)
    const [message, setMessage] = useState('');
    
    const handleClick= ()=>{
        console.log('Button Clicked ');

        if(countValue >=10){
          setMessage('Max count reached')
          return; //Stops further increment
        }
        setCountValue(prev => prev+1)
    }
  return (
    <div>
      <HeadingCounterComponent countValue = {countValue} />
      <ButtonComponent onClick = {handleClick}/>

       {/* Show message only when countValue >= 10 */}
       {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}
