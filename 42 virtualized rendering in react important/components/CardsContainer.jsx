import React, { useEffect, useState } from "react";
import Cards from "./Cards";

export default function CardsContainer() {
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const visibleCount = 2;
  const overscanCount = 1;
  const cardHeight = 200;

  const dummyCards = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    label: `Card ${i + 1}`,
  }));

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newIndex = Math.floor(scrollY / cardHeight);

      const safeIndex = Math.max(
        0,
        Math.min(newIndex, dummyCards.length - visibleCount)
      );

      if (safeIndex !== visibleStartIndex) {
        setVisibleStartIndex(safeIndex);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      console.log("card unmounted");
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visibleStartIndex, dummyCards.length]);

  // Apply buffer
  const start = Math.max(0, visibleStartIndex - overscanCount);
  const end = Math.min(
    dummyCards.length,
    visibleStartIndex + visibleCount + overscanCount
  );

  const bufferedCards = dummyCards.slice(start, end);

  return (
    <div className="relative h-[2000px] p-4">
      <div
        style={{
          transform: `translateY(${start * cardHeight}px)`,
          transition: "transform 1.1s ease-out",
        }}
      >
        {bufferedCards.map((card) => (
          <Cards key={card.id} cardNumber={card.label} />
        ))}
      </div>
    </div>
  );
}
