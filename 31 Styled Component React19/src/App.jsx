import { useState } from "react";
import styled from "styled-components";
const ButtonClick = styled.button`
  font-size: 30px;
  padding: 30px;
  background-color: teal;
  color: white;

  &:hover {
    background-color: #2980b9;
  }
  &:active {
    transform: scale(1.2);
  }
`;

const Card = styled.div`
  padding: 20px;
  margin: 10px 0;
  width: 100px;
  font-weight: bold;
`;

const CardContainer = styled.div`
  margin-top: 20px;
`
export default function App() {
  const [showCards, setShowCards] = useState(false);

  const displayCard = () => {
    setShowCards((prev) => !prev);
  };

  const cards = [...Array(5)].map((_, index) => {
    return <Card key={index}>{index}</Card>;
  });
  return (
    <div>
      <h1>Styled Components in React19</h1>
      <ButtonClick onClick={displayCard}>
        {showCards ? "Hide Cards": "Show Cards"}
      </ButtonClick>
      <CardContainer>{showCards && cards}</CardContainer>
    </div>
  );
}
