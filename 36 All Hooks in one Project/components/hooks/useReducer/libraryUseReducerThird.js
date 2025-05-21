export const reducerDelegation = (count, action) => {
  switch (action.type) {
    case "INCREMENT":
      return count + 1;
      break;

    case "DECREMENT":
      return count - 1;
      break;

    case "RESET":
      return (count = 0);
      break;

    default:
      return count;
  }
};
