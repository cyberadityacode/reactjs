# Dynamic Routing in React with Parcel Bundler and Tailwind CSS Integration

Dynamic routing in React refers to setting up routes that adapt based on parameters or user interactions, usually using a library like React Router.

> Instead of hardcoding every route (like /user1, /user2), dynamic routing allows you to define a route with a parameter, like 
```
 /user/:id.
```
Useful for user profiles, product pages, etc.


#  useParam 

useParams is a React Router hook that lets you access URL parameters from the current route.

When you define a dynamic route like /user/:id, useParams allows you to get the id part from the URL inside your component.

> In simple words, a hook in React is a special function that lets you use React features like state, lifecycle, or routing inside functional components.