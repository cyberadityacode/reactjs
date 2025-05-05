Functionality:
useState initializes and manages state variables within a component.
useEffect handles side effects like fetching data, subscriptions, and manual DOM manipulations.

Execution Timing:
useState updates the state and triggers a re-render when the state changes.
useEffect runs after the component renders and can re-run if dependencies change.

Cleanup:
useState does not involve cleanup logic.
useEffect can return a cleanup function to clean up resources (e.g., subscriptions, timers) when the component unmounts or before the effect re-runs.