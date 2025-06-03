export const fetchTasks = async () => {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos?_limit=3"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const data = await response.json();
    console.log(data);
    return data.map((currentTask) => currentTask.title);
  } catch (error) {
    console.error(error);
  }
};
