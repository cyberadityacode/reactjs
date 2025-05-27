# World Atlas Project React 19 

## Dependencies
```json
 "dependencies": {
    "axios": "^1.9.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.6.1"
  },

```

Step 1 - Create pages dir inside src and create Home,Country,About , Contact jsx pages respectively.

Step 2 - Write Custom CSS 

Step 3 - Create Browser Router inside App.jsx (outside component)

Step 4 - define path and elements inside createBrowserRouter

Step 5 - return RouterProvider component from App Component and pass router prop with the same.

Step 6 - create a parent app layout to sandwitch pages between constant header and footer.

Step 7 - create layout folder and inside the same create AppLayout.jsx which will return Header, Outlet and Footer component.

Step 8 - Header and Footer component shall be created in UI sub directory of components.

Step 9 - create error handling element in your app layout declaration on App.jsx, i.e ErrorPage and create within Page Directory within the src.

Step 10- useRouteError Hook, use inside Error page to customize error handling.

Step 11 - Start working on your Header, One everything aligns perfectly switch to hero section (header's responsiveness will later be dealt)

Step 12 - Start working on your Hero Section Home Page.

Step 13 - Start Working on your About Page

Step 14 - Start Working on your Contact Page - Dont Forget to link with google sheet

React 19 form is easy -> add action attribute to your form link to a function handleFormSubmit, in the parameter pass formData and clg ( formData.entries()) it will return key value pair form iterator
Object.formEntries(formData.entries()) - converts iterable to key value pairs

Step 15 - Complete Footer


