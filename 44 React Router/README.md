# React Router

1. createBrowserRouter in App.jsx
2. Define Path, Elements and Children.
3. Return  
``` jsx 
        <RouterProvider router={router} />
```


> RouterProvider is a component in React Router that provides routing context to its children. 

> It's used to connect the defined routes with the application's UI. It takes a router object, typically created using createBrowserRouter, as a prop and makes the routing information available throughout the component tree.


4. Declare Header, Outlet and Footer Component in AppLayout.jsx

> The Outlet component allows nested routes to render their element content out and anything else the layout route is rendering.

5. Since you've already declared children property in your createBrowserRouter function, The Pages (Home, About, Contact, Movie) will be considered Children of the AppLayout Component.

6. The AppLayout Component has fixed the Header and Footer. However, the Outlet acts as a catalyst to allow nested children to be addressed within the bun of the Header and Footer.

---

# Declare Active Class

Easy Way -> define active class in index.css, because navlink automatically generates active class.

Moderate way -> use conditional navlink classname by using isActive property.

Smart Way -> use named custom arrow function to declare className dynamically.
