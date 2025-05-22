import React, { memo, useMemo } from "react";

function ExpensiveComponent() {
  const expensiveFunction = () => {
    console.log("Calculating Sum");
    let i = 0;

    for (i = 0; i <= 100000; i++) {
      i += 1;
    }
    return i;
  };
  const total = useMemo(()=> expensiveFunction() ,[]) //useMemo enable memoization on function
//   const total = expensiveFunction();
  return <div>ExpensiveComponent {total}</div>;
}

// export default memo(ExpensiveComponent); //mark full component as React.memo
export default ExpensiveComponent;
