# JSON  Custom Tree Viewer of Repository - Fun Project

1. Index.html loads
2. it loads the stylesheet and script.js
3. script.js createRoot of React and calls the root render function and pass App React Component to load on screen
4. App.js Loads
5. App.js is a React Functional Component. It first fetches data from GitHub API from useFetch functional component
   and destructure that response into 3 {} JSX variables - data, loading, error.
6. useFetch is another default exporting function, it initializes data using useState (with null), loading with useState(true), error with useState(null)
7. Inside the useFetch function, useEffect react function comes into play.
8. useEffect creates async fetchData obj and within try catch finally; it calls fetch API, once the JSON is received it setData to the useState data which was initially null.
9. Here is a caveat, if any mishaps happen during the fetch API call, the catch block will setError(err.message) to error useState which was null initially.
10. finally is called, which setLoading back to false, because data is loaded successfully and loading useState needs to be updated from true to false.
11. after finally block fetchData() function is called.
12. and within the useEffect's array dependency [url] is passed, which represents, whenever the page renders the first time it will be called and whenever the developer tries to alter url it will be called.
13. Comming back to App.js, where useFetch JSX returned data is destructured into JSX 3 obj - data, loading, error.
14. if condition to check whether loading is true or false ( remember, in finally we set it to false) but in case it is true - then return JSX <p> loading...</p>
15. if condition to check error by returning <p> Error message</p>
16. Now, the actual App Component JSX snippet will be returned with the map function, which traverses all repo inside data and maps into another react component called TreeNodeComponent by passing key and node element(entire data obj) to use accordingly.
17. TreeNodeComponent receives node and returns the JSX data according to custom need.