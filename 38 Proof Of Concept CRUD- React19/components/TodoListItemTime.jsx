export default function TodoListItemTime({ dateTime, isCompleted }) {
  const addedDate = new Date(dateTime);
  const addedTimeStr = addedDate.toLocaleString();

  if (!isCompleted) {
    return (
      <div className="text-right text-sm italic">
        Added on {addedTimeStr}
      </div>
    );
  }

  const completedDate = new Date();
  const completedTimeStr = completedDate.toLocaleString();
  const minutesTaken = Math.round((completedDate - addedDate) / 60000);

  return (
    <div className="text-right text-sm">
      <div className="italic">Completed on {completedTimeStr}</div>
      <div className="underline">Took {minutesTaken} minutes</div>
    </div>
  );
}
