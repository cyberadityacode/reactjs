# React Router

1. createBrowserRouter in App.jsx
2. Define Path, Elements and Children.
3. Return

```jsx
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

# Error Page Redirection

add property to createBrowserRouter;

```jsx
errorElement: <ErrorPage />;
```

within your error Page leverage this code accordingly!

```jsx
const error = useRouteError();
```

# useNavigate in React Router

To customize redirection of page to particular step.

```jsx
const navigate = useNavigate();
```

apply onClick handler to button, custom arrow function with operation navigate(-1);

# Fetch API Data with React Router Loaders (without useEffect)

To fetch data from an API by using loader and useLoaderData hook.

## Added ShimmerEffect on Loading with useNavigation Hook

## Added env file to conceal API KEY

This will unexpectedly expose API Key in your network tab (intiator subtab) despite concealing .env file.
Because you're using fetch inside a React component (frontend). Even though you’re hiding the key in .env, during the build time, it's bundled into your frontend JavaScript, and therefore visible to anyone inspecting the source. (using initiator subtab of the Network Tab)

To truly protect your API key, you need to proxy the request through a backend.
Assuming you're using Vite or Parcel, you can use an Express.js backend (or any backend framework of your choice).

Step 1 - Create a backend server
Step 2 - On your frontend, fetch from your backend

If deploying (e.g. on Vercel, Netlify, etc.), make sure your backend is deployed separately or integrated using serverless functions or API routes (Next.js is great for this).

## Dynamic Routing in React Router

add property to createBrowserRouter

```jsx
{
          path: "/movie/:movieId",
          element: <MovieDetails />,
          loader: getMovieDetails,
}
```

# Form Component for contact form.